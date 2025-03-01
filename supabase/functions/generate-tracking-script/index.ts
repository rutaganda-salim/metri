
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const cdnBaseUrl = "https://cdn.example.com/tracking"; // Replace with your actual CDN URL in production

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trackingId, cdn = false } = await req.json();

    if (!trackingId) {
      return new Response(
        JSON.stringify({
          error: "Missing tracking ID",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate the tracking script
    const script = `
      (function() {
        const trackingId = "${trackingId}";
        const apiUrl = "${Deno.env.get("SUPABASE_URL")}/functions/v1/track-pageview";
        
        function trackPageView() {
          const data = {
            trackingId: trackingId,
            url: window.location.href,
            referrer: document.referrer || null,
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            title: document.title
          };
          
          fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          }).catch(err => console.error('Analytics error:', err));
        }
        
        // Track the initial page view
        trackPageView();
        
        // Track page views when the history state changes
        window.addEventListener('popstate', trackPageView);
        
        // Monkey patch pushState and replaceState to track page views
        const originalPushState = history.pushState;
        history.pushState = function() {
          originalPushState.apply(this, arguments);
          trackPageView();
        };
        
        const originalReplaceState = history.replaceState;
        history.replaceState = function() {
          originalReplaceState.apply(this, arguments);
          trackPageView();
        };
      })();
    `;

    // For CDN usage, we would save this script to a CDN and return the URL
    // This is a mock implementation - in a real scenario, you would:
    // 1. Upload the script to an actual CDN or static hosting
    // 2. Return the permanent URL to that script

    const cdnUrl = `${cdnBaseUrl}/${trackingId}.js`;
    
    return new Response(
      JSON.stringify({
        script,
        cdnUrl,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
