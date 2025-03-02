
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { trackingId, cdn = false } = await req.json()

    if (!trackingId) {
      return new Response(
        JSON.stringify({ error: 'trackingId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // For now, we'll just return a URL to the script
    // In a production environment, you might want to dynamically generate scripts
    // or provide multiple CDN options
    const scriptUrl = cdn
      ? `/js/script.js`
      : `/js/script.js`

    return new Response(
      JSON.stringify({ 
        cdnUrl: scriptUrl,
        trackingId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
