import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Supported creators from Captions.ai
const SUPPORTED_CREATORS = [
  "Alan-1", "Cam-1", "Carter-1", "Douglas-1", "Jason", 
  "Leah-1", "Madison-1", "Monica-1", "Violet-1"
];

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

    const { script, avatarName, title } = await req.json();
    const cleanScript = script?.trim() || "";

    console.log('Creating video job for user:', user.id);
    console.log('Script to submit:', cleanScript);
    console.log('Avatar name:', avatarName);

    // Validate script is filled, not a template
    if (!cleanScript) {
      throw new Error('Script is required');
    }

    const looksLikeTemplate = /(\{\{.*\}\}|\{.*\}|<<.*>>|\[.*\])/.test(cleanScript);
    if (looksLikeTemplate) {
      throw new Error('Template detected. Use FILLED script, not placeholders.');
    }

    // Validate creator selection
    if (avatarName && !SUPPORTED_CREATORS.includes(avatarName)) {
      throw new Error(`Invalid creator selection: ${avatarName}. Must be one of: ${SUPPORTED_CREATORS.join(', ')}`);
    }

    // Get Captions.ai API configuration
    const captionsApiKey = Deno.env.get('Captions_ai');
    const captionsBase = Deno.env.get('CAPTIONS_API_BASE') || 'https://api.captions.ai/v1';
    const workspaceId = Deno.env.get('CAPTIONS_WORKSPACE_ID');

    if (!captionsApiKey) {
      throw new Error('Captions.ai API key not configured');
    }

    console.log('API Key exists:', !!captionsApiKey);
    console.log('Script length:', script.length);
    console.log('Base URL:', captionsBase);

    // Build headers with correct format
    const headers: Record<string, string> = {
      'x-api-key': captionsApiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (workspaceId) {
      headers['x-workspace-id'] = workspaceId;
    }

    // Build simplified payload for Captions.ai
    const captionsPayload = {
      script: cleanScript,
      ...(avatarName ? { avatar: { enabled: true, creator: avatarName } } : { avatar: { enabled: false } })
    };

    // Call Captions.ai API with correct endpoint and headers
    const captionsResponse = await fetch(`${captionsBase}/creator/videos`, {
      method: 'POST',
      headers,
      body: JSON.stringify(captionsPayload),
    });

    console.log('Response status:', captionsResponse.status);
    console.log('Response headers:', Object.fromEntries(captionsResponse.headers.entries()));

    if (captionsResponse.status === 403) {
      throw new Error('Forbidden from Captions.ai. Check x-api-key and workspace id.');
    }

    if (!captionsResponse.ok) {
      const errorText = await captionsResponse.text();
      console.error('Captions.ai API error:', errorText);
      console.error('Request headers sent:', headers);
      console.error('Request body sent:', JSON.stringify(captionsPayload));
      throw new Error(`Captions.ai error: ${captionsResponse.status} ${errorText}`);
    }

    const captionsData = await captionsResponse.json();
    console.log('Captions.ai response:', captionsData);

    // Extract job ID from response
    const jobId = captionsData.job_id || captionsData.id || `job_${Date.now()}`;

    // Store job in database with processing status
    const { data: videoJob, error: dbError } = await supabase
      .from('video_jobs')
      .insert({
        user_id: user.id,
        job_id: jobId,
        title: title || 'AI Video',
        status: 'processing',
        wizard_data: captionsPayload,
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
      video_id: videoJob.id,
      status: 'processing'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-video-job function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: error.message?.includes('Template detected') || error.message?.includes('Script is required') ? 400 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});