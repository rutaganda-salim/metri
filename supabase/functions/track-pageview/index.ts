
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { trackingId, url, referrer, userAgent, browser, os, deviceType, visitorId } = await req.json()
    
    if (!trackingId || !url || !visitorId) {
      return new Response(
        JSON.stringify({ error: 'Required fields missing' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get client IP address
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    
    // Get country from IP using a geolocation service
    let country = 'Unknown'
    try {
      const geoResponse = await fetch(`https://ipapi.co/${clientIp}/json/`)
      const geoData = await geoResponse.json()
      if (geoData && geoData.country_name) {
        country = geoData.country_name
      }
    } catch (error) {
      console.error('Error fetching location data:', error)
    }
    
    // Create supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Insert page view with country information
    const { data, error } = await supabase
      .from('page_views')
      .insert({
        tracking_id: trackingId,
        url: url,
        referrer: referrer || 'direct',
        user_agent: userAgent,
        ip_address: clientIp,
        country: country,
        browser: browser,
        operating_system: os,
        device_type: deviceType,
        visitor_id: visitorId
      })
    
    if (error) throw error
    
    // Update active visitors
    const { error: activeError } = await supabase
      .from('active_visitors')
      .upsert({
        tracking_id: trackingId,
        visitor_id: visitorId,
        url: url,
        last_active: new Date().toISOString()
      })
    
    if (activeError) throw activeError
    
    return new Response(
      JSON.stringify({ success: true, country }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error tracking page view:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
