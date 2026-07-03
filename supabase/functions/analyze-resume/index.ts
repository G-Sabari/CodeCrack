import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_LEN = 60000;

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
    const resumeText = String(body.resumeText || "").slice(0, MAX_LEN);
    const jobDescription = String(body.jobDescription || "").slice(0, MAX_LEN);
    if (!resumeText.trim() || !jobDescription.trim()) {
      return new Response(JSON.stringify({ error: "resumeText and jobDescription are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const system = `You are a senior technical recruiter and ATS expert. Analyze the resume against the job description.
Return ONLY a valid JSON object matching this exact TypeScript type (no markdown, no commentary):
{
  "ats_score": number, // 0-100
  "match_score": number, // 0-100
  "skills_match": number, // 0-100
  "resume_strength": number, // 0-100
  "recruiter_score": number, // 0-100
  "hiring_readiness": "Not Ready" | "Needs Work" | "Interview Ready" | "Strong Hire",
  "summary": string,
  "recruiter_feedback": string,
  "strengths": string[],
  "weaknesses": string[],
  "missing_keywords": string[],
  "missing_skills": string[],
  "weak_bullets": string[],
  "grammar_issues": string[],
  "formatting_issues": string[],
  "ats_issues": string[],
  "missing_sections": string[],
  "priority_improvements": string[], // top 10
  "sections": {
    "contact": { "score": number, "notes": string },
    "summary": { "score": number, "notes": string },
    "education": { "score": number, "notes": string },
    "skills": { "score": number, "notes": string },
    "experience": { "score": number, "notes": string },
    "projects": { "score": number, "notes": string },
    "certifications": { "score": number, "notes": string },
    "leadership": { "score": number, "notes": string },
    "achievements": { "score": number, "notes": string }
  }
}`;

    const userMsg = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMsg },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await resp.text();
      console.error("gateway error", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || "{}";
    let analysis: any;
    try { analysis = JSON.parse(content); } catch { analysis = { raw: content }; }

    return new Response(JSON.stringify({ analysis }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("analyze-resume error", e);
    return new Response(JSON.stringify({ error: "Analyzer unavailable" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
