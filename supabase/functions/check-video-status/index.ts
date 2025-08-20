import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const jobId = url.searchParams.get('job_id');

    if (!jobId) {
      throw new Error('job_id parameter is required');
    }

    console.log('Checking status for job:', jobId);

    // Get job from database to verify user ownership
    const { data: videoJob, error: dbError } = await supabase
      .from('video_jobs')
      .select('*')
      .eq('job_id', jobId)
      .eq('user_id', user.id)
      .single();

    if (dbError || !videoJob) {
      throw new Error('Video job not found');
    }

    // If job is already completed, return stored data
    if (videoJob.status === 'ready' || videoJob.status === 'failed') {
      return new Response(JSON.stringify({
        status: videoJob.status,
        video_url: videoJob.video_url,
        thumbnail_url: videoJob.thumbnail_url,
        duration: videoJob.duration,
        error_message: videoJob.error_message,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Captions.ai API key
    const captionsApiKey = Deno.env.get('Captions_ai');
    if (!captionsApiKey) {
      throw new Error('Captions.ai API key not configured');
    }

    // Check status with Captions.ai API
    const captionsResponse = await fetch(`https://api.captions.ai/api/creator/status/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': captionsApiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!captionsResponse.ok) {
      const errorText = await captionsResponse.text();
      console.error('Captions.ai status API error:', errorText);
      
      // Update job status to failed if API call fails
      await supabase
        .from('video_jobs')
        .update({ 
          status: 'failed',
          error_message: `API Error: ${captionsResponse.status} - ${errorText}`
        })
        .eq('job_id', jobId);

      return new Response(JSON.stringify({
        status: 'failed',
        error_message: `API Error: ${captionsResponse.status}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const statusData = await captionsResponse.json();
    console.log('Captions.ai status response:', statusData);

    // Map Captions.ai status to our status
    let ourStatus = 'processing';
    let videoUrl = null;
    let thumbnailUrl = null;
    let duration = null;
    let errorMessage = null;

    if (statusData.status === 'completed' || statusData.status === 'ready') {
      ourStatus = 'ready';
      videoUrl = statusData.video_url || statusData.url;
      thumbnailUrl = statusData.thumbnail_url || statusData.thumbnail;
      duration = statusData.duration;
    } else if (statusData.status === 'failed' || statusData.status === 'error') {
      ourStatus = 'failed';
      errorMessage = statusData.error || statusData.message || 'Video generation failed';
    } else if (statusData.status === 'processing' || statusData.status === 'pending') {
      ourStatus = 'processing';
    }

    // Update job status in database
    const { error: updateError } = await supabase
      .from('video_jobs')
      .update({
        status: ourStatus,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        duration: duration,
        error_message: errorMessage,
      })
      .eq('job_id', jobId);

    if (updateError) {
      console.error('Error updating job status:', updateError);
    }

    return new Response(JSON.stringify({
      status: ourStatus,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      duration: duration,
      error_message: errorMessage,
      progress: statusData.progress || (ourStatus === 'ready' ? 100 : ourStatus === 'processing' ? 50 : 0),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in check-video-status function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});