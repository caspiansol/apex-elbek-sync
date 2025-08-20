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

    const { wizardData, captionsPayload, title } = await req.json();

    console.log('Creating video job for user:', user.id);
    console.log('Captions payload:', JSON.stringify(captionsPayload, null, 2));

    // Get Captions.ai API key
    const captionsApiKey = Deno.env.get('Captions_ai');
    if (!captionsApiKey) {
      throw new Error('Captions.ai API key not configured');
    }

    // Call Captions.ai API to create video job
    const captionsResponse = await fetch('https://api.captions.ai/v1/video/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${captionsApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(captionsPayload),
    });

    if (!captionsResponse.ok) {
      const errorText = await captionsResponse.text();
      console.error('Captions.ai API error:', errorText);
      throw new Error(`Captions.ai API error: ${captionsResponse.status} - ${errorText}`);
    }

    const captionsData = await captionsResponse.json();
    console.log('Captions.ai response:', captionsData);

    const jobId = captionsData.job_id || captionsData.id || Date.now().toString();

    // Store job in database
    const { data: videoJob, error: dbError } = await supabase
      .from('video_jobs')
      .insert({
        user_id: user.id,
        job_id: jobId,
        title: title,
        status: 'queued',
        wizard_data: wizardData,
        captions_payload: captionsPayload,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store video job');
    }

    return new Response(JSON.stringify({ 
      job_id: jobId,
      status: 'queued',
      video_job: videoJob
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-video-job function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});