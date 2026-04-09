import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  Easy: `You are a friendly, encouraging technical interviewer conducting a placement interview at Easy difficulty. 
You ask one question at a time, wait for the user's answer, then provide brief feedback before asking a follow-up or new question.
Topics: Basic DSA (arrays, strings, sorting), simple JavaScript/React concepts, and standard HR questions.
Keep questions straightforward. Be supportive. If the candidate struggles, give hints.
Start by introducing yourself and asking the first question. Never list multiple questions at once.`,

  Medium: `You are a professional technical interviewer conducting a placement interview at Medium difficulty.
You ask one question at a time, evaluate the answer critically, then ask follow-up questions that dig deeper.
Topics: Intermediate DSA (trees, graphs, dynamic programming), React hooks/state management, system design basics, and behavioral questions using STAR method.
Be fair but challenging. Point out gaps in answers. Ask follow-ups based on what the candidate said.
Start by introducing yourself and asking the first question. Never list multiple questions at once.`,

  Hard: `You are a senior technical interviewer at a top tech company conducting a Hard difficulty placement interview.
You ask one question at a time, rigorously evaluate answers, and ask probing follow-ups.
Topics: Advanced DSA (graph algorithms, DP optimization, complex trees), system design, advanced React patterns, backend architecture, and tough behavioral scenarios.
Be professional but demanding. Expect optimal solutions. Challenge assumptions. Ask "why" frequently.
Start by introducing yourself and asking the first question. Never list multiple questions at once.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, difficulty, mode } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!difficulty || !["Easy", "Medium", "Hard"].includes(difficulty)) {
      return new Response(JSON.stringify({ error: "Invalid difficulty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For feedback mode, use a different system prompt
    const systemPrompt = mode === "feedback"
      ? `You are an interview performance analyst. Based on the interview conversation provided, generate a JSON object with this exact structure:
{
  "overallScore": <number 0-100>,
  "strengths": ["<strength1>", "<strength2>", ...],
  "weaknesses": ["<weakness1>", "<weakness2>", ...],
  "topicsToImprove": ["<topic1>", "<topic2>", ...],
  "questionScores": [{"question": "<q>", "score": <0-10>, "feedback": "<feedback>"}],
  "summary": "<2-3 sentence overall summary>"
}
Return ONLY the JSON object, no markdown or extra text.`
      : SYSTEM_PROMPTS[difficulty];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-20), // Keep last 20 messages for context
        ],
        stream: mode !== "feedback",
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please wait a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", status);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mode === "feedback") {
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Interview error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
