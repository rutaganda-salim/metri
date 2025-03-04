
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import { UAParser } from "https://esm.sh/ua-parser-js@1.0.35";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://mgsubqvamygnunlzttsr.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nc3VicXZhbXlnbnVubHp0dHNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY2NjE0MSwiZXhwIjoyMDU2MjQyMTQxfQ.uoc6yfWaselEAhxTApyiSQl6p8ytZ7EFo_oxxNGnWAk";
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    console.log("Request received from IP:", clientIP);

    // Parse and validate request body
    let data;
    try {
      const rawBody = await req.text();
      console.log("Raw request body:", rawBody);
      
      if (!rawBody || rawBody.trim() === '') {
        return new Response(
          JSON.stringify({
            error: "Empty request body"
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
      
      data = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid JSON payload",
          details: parseError.message
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Validate required fields
    if (!data.tracking_id || !data.visitor_id || !data.url) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          required: ["tracking_id", "visitor_id", "url"],
          received: data
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Parse user agent
    const userAgent = req.headers.get("user-agent") || "";
    const parser = new UAParser(userAgent);
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    const deviceInfo = parser.getDevice();

    // Determine device type
    let deviceType = "unknown";
    if (deviceInfo.type === "mobile" || deviceInfo.type === "tablet") {
      deviceType = deviceInfo.type;
    } else if (!deviceInfo.type) {
      deviceType = "desktop";
    } else {
      deviceType = deviceInfo.type;
    }

    // Get country information from IP address using ipinfo.io
    let country = null;
    try {
      const ipResponse = await fetch(`https://ipinfo.io/${clientIP}/json`);
      if (ipResponse.ok) {
        const ipInfo = await ipResponse.json();
        country = ipInfo.country ? ipInfo.country_name || ipInfo.country : null;
        console.log("Country detected:", country);
      } else {
        console.warn("Failed to get country information:", await ipResponse.text());
      }
    } catch (ipError) {
      console.warn("Error fetching country information:", ipError);
    }

    // Insert data with simplified fields
    const insertData = {
      tracking_id: data.tracking_id,
      visitor_id: data.visitor_id,
      url: data.url,
      referrer: data.referrer || null,
      browser: browserInfo.name || null,
      operating_system: osInfo.name || null,
      device_type: deviceType,
      ip_address: clientIP,
      user_agent: userAgent,
      country: country
    };
    
    console.log("Data being inserted:", insertData);

    // Insert with better error handling
    const { error: pageViewError } = await supabase
      .from("page_views")
      .insert([insertData]);

    if (pageViewError) {
      console.error("Database insert error:", pageViewError);
      return new Response(
        JSON.stringify({
          error: "Database insert failed",
          details: pageViewError.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Update or insert active visitor
    const { error: activeVisitorError } = await supabase
      .from("active_visitors")
      .upsert(
        {
          tracking_id: data.tracking_id,
          visitor_id: data.visitor_id,
          url: data.url,
          last_active: new Date().toISOString(),
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
          ...corsHeaders
        },
      }
    );
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
