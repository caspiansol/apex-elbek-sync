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

    const { wizardData, script, title } = await req.json();

    console.log('Creating video job for user:', user.id);
    console.log('Script to submit:', script);

    // Get Captions.ai API key
    const captionsApiKey = Deno.env.get('Captions_ai');
    if (!captionsApiKey) {
      throw new Error('Captions.ai API key not configured');
    }

    // Call Captions.ai API with the new simplified endpoint
    const captionsResponse = await fetch('https://api.captions.ai/api/creator/submit', {
      method: 'POST',
      headers: {
        'Authorization': captionsApiKey, // API key as authorization header
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script }), // Send script as body
    });

    if (!captionsResponse.ok) {
      const errorText = await captionsResponse.text();
      console.error('Captions.ai API error:', errorText);
      throw new Error(`Captions.ai API error: ${captionsResponse.status} - ${errorText}`);
    }

    const captionsData = await captionsResponse.json();
    console.log('Captions.ai response:', captionsData);

    // Extract job ID from response (adjust based on actual API response structure)
    const jobId = captionsData.job_id || captionsData.id || `job_${Date.now()}`;

    // Store job in database
    const { data: videoJob, error: dbError } = await supabase
      .from('video_jobs')
      .insert({
        user_id: user.id,
        job_id: jobId,
        title: title,
        status: captionsData.status || 'queued',
        wizard_data: wizardData,
        captions_payload: { script }, // Store the script that was sent
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store video job');
    }

    return new Response(JSON.stringify({ 
      job_id: jobId,
      status: captionsData.status || 'queued',
      video_job: videoJob,
      captions_response: captionsData
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