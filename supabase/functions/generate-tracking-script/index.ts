
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
    const { trackingId } = await req.json()
    
    if (!trackingId) {
      return new Response(
        JSON.stringify({ error: 'Tracking ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Generate tracking script with the tracking ID
    const script = `
    (function() {
      const TRACKING_ID = "${trackingId}";
      const SUPABASE_URL = "https://mgsubqvamygnunlzttsr.supabase.co";
      const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nc3VicXZhbXlnbnVubHp0dHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NjYxNDEsImV4cCI6MjA1NjI0MjE0MX0.0JIyLTB2v5UT1SeIV2JBUsGbbM0jamKq-uQojfD3o6Y";
      
      // Create a visitor ID
      function generateVisitorId() {
        const existingId = localStorage.getItem('analytics_visitor_id');
        if (existingId) return existingId;
        
        const newId = 'v_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('analytics_visitor_id', newId);
        return newId;
      }
      
      // Get browser and OS info
      function getDeviceInfo() {
        const userAgent = navigator.userAgent;
        let browser = 'Unknown';
        let os = 'Unknown';
        let deviceType = 'desktop';
        
        // Browser detection
        if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
        else if (userAgent.indexOf('SamsungBrowser') > -1) browser = 'Samsung Browser';
        else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) browser = 'Opera';
        else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
        else if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
        else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
        else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) browser = 'Internet Explorer';
        
        // OS detection
        if (userAgent.indexOf('Windows') > -1) os = 'Windows';
        else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
        else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
        else if (userAgent.indexOf('Android') > -1) os = 'Android';
        else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) os = 'iOS';
        
        // Device type
        if (userAgent.indexOf('Mobi') > -1) deviceType = 'mobile';
        else if (userAgent.indexOf('Tablet') > -1 || userAgent.indexOf('iPad') > -1) deviceType = 'tablet';
        
        return { browser, os, deviceType };
      }
      
      // Track page view
      async function trackPageView() {
        const visitorId = generateVisitorId();
        const { browser, os, deviceType } = getDeviceInfo();
        const currentUrl = window.location.href;
        const referrer = document.referrer || 'direct';
        
        try {
          const response = await fetch(\`\${SUPABASE_URL}/rest/v1/page_views\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              tracking_id: TRACKING_ID,
              url: currentUrl,
              referrer: referrer,
              user_agent: navigator.userAgent,
              browser: browser,
              operating_system: os,
              device_type: deviceType,
              visitor_id: visitorId
            })
          });
          
          // Update active visitors
          updateActiveVisitor(visitorId, currentUrl);
          
        } catch (error) {
          console.error('Analytics tracking error:', error);
        }
      }
      
      // Update active visitor status
      async function updateActiveVisitor(visitorId, url) {
        try {
          const response = await fetch(\`\${SUPABASE_URL}/rest/v1/active_visitors\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY,
              'Prefer': 'upsert'
            },
            body: JSON.stringify({
              tracking_id: TRACKING_ID,
              visitor_id: visitorId,
              url: url,
              last_active: new Date().toISOString()
            })
          });
        } catch (error) {
          console.error('Active visitor tracking error:', error);
        }
      }
      
      // Track page view when the page loads
      if (document.readyState === 'complete') {
        trackPageView();
      } else {
        window.addEventListener('load', trackPageView);
      }
      
      // Update active status periodically
      setInterval(() => {
        const visitorId = localStorage.getItem('analytics_visitor_id');
        if (visitorId) {
          updateActiveVisitor(visitorId, window.location.href);
        }
      }, 60000); // Update every minute
      
    })();
    `;

    return new Response(
      JSON.stringify({ script }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error generating tracking script:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
