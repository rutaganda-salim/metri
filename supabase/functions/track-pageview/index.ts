import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import { UAParser } from "https://esm.sh/ua-parser-js@1.0.35";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://mgsubqvamygnunlzttsr.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nc3VicXZhbXlnbnVubHp0dHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NjYxNDEsImV4cCI6MjA1NjI0MjE0MX0.0JIyLTB2v5UT1SeIV2JBUsGbbM0jamKq-uQojfD3o6Y";
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
  'Access-Control-Max-Age': '86400',
};

interface PageViewData {
  url: string;
  referrer: string;
  tracking_id: string;
  visitor_id: string;
  screen_width?: number;
  screen_height?: number;
  language?: string;
  title?: string;
  path?: string;
  domain?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

interface GeoIPResponse {
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
}

async function getGeoData(ip: string): Promise<GeoIPResponse> {
  try {
    // Using ipinfo.io for geolocation data
    const response = await fetch(`https://ipinfo.io/${ip}/json`);
    if (!response.ok) {
      console.error("Failed to fetch location data:", response.statusText);
      return {};
    }

    const data = await response.json();
    console.log("GeoIP data:", data);

    // Parse lat,long from loc field
    let latitude, longitude;
    if (data.loc) {
      const [lat, lng] = data.loc.split(',');
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
    }

    return {
      country: data.country,
      city: data.city,
      region: data.region,
      latitude,
      longitude
    };
  } catch (error) {
    console.error("Error fetching geo data:", error);
    return {};
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
      status: 200 // Make sure we return 200 for OPTIONS
    });
  }

  try {
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    console.log("Client IP:", clientIP);

    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    // Parse the JSON
    const data: PageViewData = JSON.parse(rawBody);
    console.log("Parsed data:", data);

    // Validate required fields
    if (!data.tracking_id || !data.visitor_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: tracking_id and visitor_id are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get geolocation data
    const geoData = await getGeoData(clientIP);
    console.log("Geolocation data:", geoData);

    // Parse user agent
    const userAgent = req.headers.get("user-agent") || "";
    const parser = new UAParser(userAgent);
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    const deviceInfo = parser.getDevice();

    console.log("Browser info:", browserInfo);
    console.log("OS info:", osInfo);
    console.log("Device info:", deviceInfo);

    // Determine device type
    let deviceType = "unknown";
    if (deviceInfo.type === "mobile" || deviceInfo.type === "tablet") {
      deviceType = deviceInfo.type;
    } else if (!deviceInfo.type) {
      deviceType = "desktop";
    } else {
      deviceType = deviceInfo.type;
    }

    // Log the final data being inserted
    const insertData = {
      tracking_id: data.tracking_id,
      visitor_id: data.visitor_id,
      page_url: data.url,
      path: data.path || null,
      domain: data.domain || null,
      referrer: data.referrer || null,
      browser: browserInfo.name || null,
      browser_version: browserInfo.version || null,
      operating_system: osInfo.name || null,
      os_version: osInfo.version || null,
      device_type: deviceType,
      device_brand: deviceInfo.vendor || null,
      device_model: deviceInfo.model || null,
      screen_width: data.screen_width || null,
      screen_height: data.screen_height || null,
      language: data.language || null,
      page_title: data.title || null,
      country: geoData.country || null,
      city: geoData.city || null,
      region: geoData.region || null,
      latitude: geoData.latitude || null,
      longitude: geoData.longitude || null,
      ip_address: clientIP,
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      utm_content: data.utm_content || null,
      utm_term: data.utm_term || null,
    };
    console.log("Data being inserted:", insertData);

    const { error: pageViewError } = await supabase
      .from("page_views")
      .insert([insertData]);

    if (pageViewError) {
      console.error("Detailed insert error:", pageViewError);
      return new Response(
        JSON.stringify({
          error: "Failed to store page view",
          details: pageViewError
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update or insert active visitor
    const now = new Date().toISOString();
    const { error: activeVisitorError } = await supabase
      .from("active_visitors")
      .upsert(
        {
          tracking_id: data.tracking_id,
          visitor_id: data.visitor_id,
          last_active: now,
          current_page: data.url,
        },
        { onConflict: "tracking_id,visitor_id" }
      );

    if (activeVisitorError) {
      console.error("Error updating active visitor:", activeVisitorError);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders // Include CORS headers in success response
        },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders // Include CORS headers in error response
        },
      }
    );
  }
});
