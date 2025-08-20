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
    console.log('Webhook received from Captions.ai');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const webhookData = await req.json();
    console.log('Webhook payload:', JSON.stringify(webhookData, null, 2));

    const jobId = webhookData.job_id || webhookData.id;
    if (!jobId) {
      throw new Error('No job_id in webhook payload');
    }

    // Map Captions.ai status to our status
    let ourStatus = 'processing';
    let videoUrl = null;
    let thumbnailUrl = null;
    let duration = null;
    let errorMessage = null;

    if (webhookData.status === 'completed' || webhookData.status === 'ready') {
      ourStatus = 'ready';
      videoUrl = webhookData.video_url || webhookData.url;
      thumbnailUrl = webhookData.thumbnail_url || webhookData.thumbnail;
      duration = webhookData.duration;
    } else if (webhookData.status === 'failed' || webhookData.status === 'error') {
      ourStatus = 'failed';
      errorMessage = webhookData.error || webhookData.message || 'Video generation failed';
    } else if (webhookData.status === 'processing' || webhookData.status === 'pending') {
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
      console.error('Error updating job status from webhook:', updateError);
      throw updateError;
    }

    console.log(`Updated job ${jobId} to status: ${ourStatus}`);

    return new Response(JSON.stringify({ 
      success: true,
      message: `Job ${jobId} updated to ${ourStatus}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in captions-webhook function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});