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

    console.log('Checking pending jobs for user:', user.id);

    // Get Captions.ai API configuration
    const captionsApiKey = Deno.env.get('Captions_ai');
    const captionsBase = Deno.env.get('CAPTIONS_API_BASE') || 'https://api.captions.ai/v1';
    const workspaceId = Deno.env.get('CAPTIONS_WORKSPACE_ID');

    if (!captionsApiKey) {
      throw new Error('Captions.ai API key not configured');
    }

    // Get pending jobs from last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const { data: pendingJobs, error: fetchError } = await supabase
      .from('video_jobs')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'processing')
      .gte('created_at', oneDayAgo.toISOString());

    if (fetchError) {
      console.error('Error fetching pending jobs:', fetchError);
      throw new Error('Failed to fetch pending jobs');
    }

    console.log(`Found ${pendingJobs?.length || 0} pending jobs`);

    let checkedCount = 0;
    let updatedCount = 0;

    // Build headers for Captions.ai requests
    const headers: Record<string, string> = {
      'x-api-key': captionsApiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (workspaceId) {
      headers['x-workspace-id'] = workspaceId;
    }

    // Check status for each pending job
    for (const job of pendingJobs || []) {
      try {
        checkedCount++;
        console.log(`Checking status for job: ${job.job_id}`);

        // Call Captions.ai status endpoint
        const statusResponse = await fetch(`${captionsBase}/creator/videos/${job.job_id}/status`, {
          method: 'GET',
          headers,
        });

        if (!statusResponse.ok) {
          console.error(`Status check failed for job ${job.job_id}:`, statusResponse.status);
          continue;
        }

        const statusData = await statusResponse.json();
        console.log(`Status for job ${job.job_id}:`, statusData);

        // Map status and update if completed or failed
        let shouldUpdate = false;
        const updateData: any = {};

        if (statusData.status === 'completed' || statusData.status === 'ready') {
          shouldUpdate = true;
          updateData.status = 'ready';
          updateData.video_url = statusData.video_url || statusData.url;
          updateData.thumbnail_url = statusData.thumbnail_url || statusData.thumbnail;
          updateData.duration = statusData.duration;
        } else if (statusData.status === 'failed' || statusData.status === 'error') {
          shouldUpdate = true;
          updateData.status = 'failed';
          updateData.error_message = statusData.error || statusData.message || 'Video generation failed';
        }

        if (shouldUpdate) {
          const { error: updateError } = await supabase
            .from('video_jobs')
            .update(updateData)
            .eq('id', job.id);

          if (updateError) {
            console.error(`Failed to update job ${job.job_id}:`, updateError);
          } else {
            updatedCount++;
            console.log(`Updated job ${job.job_id} to status: ${updateData.status}`);
          }
        }

      } catch (error) {
        console.error(`Error checking job ${job.job_id}:`, error);
      }
    }

    return new Response(JSON.stringify({ 
      checked: checkedCount,
      updated: updatedCount
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in check-pending-jobs function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});