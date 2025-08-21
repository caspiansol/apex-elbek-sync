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

    if (req.method === 'GET') {
      // List user's templates
      const { data: templates, error } = await supabase
        .from('ad_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching templates:', error);
        throw new Error('Failed to fetch templates');
      }

      return new Response(JSON.stringify({ templates }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const { action, name, payload, id } = await req.json();

      if (action === 'save') {
        // Save or update template
        if (!name || !payload) {
          throw new Error('Name and payload are required');
        }

        const { data: template, error } = await supabase
          .from('ad_templates')
          .upsert({
            user_id: user.id,
            name: name.trim(),
            payload,
          }, {
            onConflict: 'user_id,name'
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving template:', error);
          throw new Error('Failed to save template');
        }

        return new Response(JSON.stringify({ template }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'delete') {
        if (!id) {
          throw new Error('Template ID is required');
        }

        const { error } = await supabase
          .from('ad_templates')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting template:', error);
          throw new Error('Failed to delete template');
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'rename') {
        if (!id || !name) {
          throw new Error('Template ID and new name are required');
        }

        const { data: template, error } = await supabase
          .from('ad_templates')
          .update({ name: name.trim() })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error renaming template:', error);
          throw new Error('Failed to rename template');
        }

        return new Response(JSON.stringify({ template }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error('Invalid action');
    }

    throw new Error('Method not allowed');

  } catch (error) {
    console.error('Error in templates function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: error.message?.includes('Unauthorized') ? 401 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});