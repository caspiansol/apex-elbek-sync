import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { video_url, filename } = await req.json()
    
    if (!video_url) {
      return new Response(
        JSON.stringify({ error: 'video_url is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Downloading video from: ${video_url}`)

    // Fetch the video from the external URL
    const videoResponse = await fetch(video_url)
    
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.status}`)
    }

    // Get the video as a blob
    const videoBlob = await videoResponse.blob()
    
    // Create filename if not provided
    const downloadFilename = filename || `video_${Date.now()}.mp4`
    
    console.log(`Serving video download: ${downloadFilename}`)

    // Return the video with download headers
    return new Response(videoBlob, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': videoBlob.size.toString(),
      },
    })
    
  } catch (error) {
    console.error('Download error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Download failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})