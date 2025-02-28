
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { trackingId } = await req.json();

    if (!trackingId) {
      return new Response(
        JSON.stringify({ error: "Tracking ID is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Generate a script that will send page view data
    const script = `
(function() {
  // Configuration
  const TRACKING_ID = "${trackingId}";
  const TRACKING_API = "${Deno.env.get("SUPABASE_URL")}/functions/v1/track-pageview";

  // Get or create a visitor ID
  function getOrCreateVisitorId() {
    const storageKey = "pulse_analytics_visitor_id";
    let visitorId = localStorage.getItem(storageKey);
    
    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem(storageKey, visitorId);
    }
    
    return visitorId;
  }

  // Generate a UUID
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Send a page view to the API
  async function trackPageView() {
    try {
      const visitorId = getOrCreateVisitorId();
      const data = {
        tracking_id: TRACKING_ID,
        visitor_id: visitorId,
        url: window.location.href,
        referrer: document.referrer || "",
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        language: navigator.language || "",
        title: document.title
      };

      const response = await fetch(TRACKING_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to track page view');
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  // Track page views on load and on navigation changes
  function initializeTracking() {
    // Track the initial page view
    trackPageView();

    // Track page views when the history changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
      originalPushState.apply(this, arguments);
      setTimeout(trackPageView, 100);
    };

    history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      setTimeout(trackPageView, 100);
    };

    // Track page views when the user navigates back/forward
    window.addEventListener('popstate', function() {
      setTimeout(trackPageView, 100);
    });
  }

  // Initialize when the DOM is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeTracking();
  } else {
    document.addEventListener('DOMContentLoaded', initializeTracking);
  }
})();
`.trim();

    return new Response(
      JSON.stringify({ script }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error generating tracking script:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to generate tracking script" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
