import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: claims, error: cErr } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (cErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const body = await req.json();
    const resumeText: string = String(body.resumeText || "").slice(0, 30000);
    const jobDescription: string = String(body.jobDescription || "").slice(0, 15000);
    const analysisSummary: string = String(body.analysisSummary || "").slice(0, 8000);
    const history = Array.isArray(body.history) ? body.history.slice(-15) : [];
    const userMessage: string = String(body.userMessage || "").slice(0, 3000);
    if (!userMessage.trim()) {
      return new Response(JSON.stringify({ error: "userMessage required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const system = `You are CodeCrack Resume Assistant — an expert career coach for Indian college students preparing for placements.
You help with resume improvement, ATS optimization, career guidance, skill gaps, project & certification suggestions, and interview prep.
Rules:
- Give concrete, actionable, resume-aware answers.
- If the user asks something unrelated to resumes / careers / placements, politely redirect.
- Use markdown: bold headings, bullets, and short paragraphs.
- Reference the user's resume and JD when relevant.`;

    const context = `USER RESUME:\n${resumeText || "(no resume uploaded)"}\n\nJOB DESCRIPTION:\n${jobDescription || "(none)"}\n\nATS ANALYSIS SUMMARY:\n${analysisSummary || "(none)"}`;

    const messages = [
      { role: "system", content: system },
      { role: "user", content: context },
      ...history,
      { role: "user", content: userMessage },
    ];

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages, stream: true }),
    });

    if (!resp.ok) {
      if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      console.error("gateway", resp.status);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(resp.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("resume-chat error", e);
    return new Response(JSON.stringify({ error: "Assistant unavailable" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
