import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  checks: {
    database: "ok" | "error";
    functions: "ok" | "error";
  };
  uptime: number;
  environment: string;
}

const startTime = Date.now();

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    let databaseStatus: "ok" | "error" = "ok";

    // Check database connectivity
    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        });
        databaseStatus = response.ok ? "ok" : "error";
      } catch {
        databaseStatus = "error";
      }
    }

    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

    const healthStatus: HealthStatus = {
      status: databaseStatus === "ok" ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      checks: {
        database: databaseStatus,
        functions: "ok", // If we're here, functions are working
      },
      uptime: uptimeSeconds,
      environment: Deno.env.get("ENVIRONMENT") || "production",
    };

    return new Response(JSON.stringify(healthStatus), {
      status: healthStatus.status === "healthy" ? 200 : 503,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return new Response(
      JSON.stringify({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Internal health check failure",
      }),
      {
        status: 503,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
