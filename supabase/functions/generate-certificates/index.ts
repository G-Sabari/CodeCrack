// Admin-only: evaluates certificate rules for a contest, generates AI citations,
// and inserts certificate rows. Idempotent via UNIQUE (user_id, contest_id).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function code() {
  const y = new Date().getFullYear();
  return `CC-${y}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function aiCitation(opts: {
  name: string; contest: string; rank: number; score: number; type: string; prompt?: string;
}): Promise<string> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return defaultCitation(opts);
  const sys = "Write ONE short, dignified commendation sentence (max 28 words) for a coding contest certificate. No emojis. No quotes. Address the recipient indirectly (third person).";
  const user = `Recipient: ${opts.name}
Contest: ${opts.contest}
Rank: #${opts.rank}
Score: ${opts.score}
Certificate type: ${opts.type}
${opts.prompt ? `Admin guidance: ${opts.prompt}` : ""}`;
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: sys }, { role: "user", content: user }],
      }),
    });
    if (!r.ok) return defaultCitation(opts);
    const j = await r.json();
    const text = j?.choices?.[0]?.message?.content?.toString().trim();
    return text || defaultCitation(opts);
  } catch {
    return defaultCitation(opts);
  }
}

function defaultCitation(o: { name: string; rank: number; type: string }) {
  if (o.type === "winner") return `Awarded for an outstanding first-place performance, demonstrating mastery of algorithmic problem solving under contest conditions.`;
  if (o.type === "top_performer") return `Recognized as a top performer (rank #${o.rank}) for sharp problem decomposition and consistent execution across the contest set.`;
  return `Recognized for active participation and committed effort throughout the contest.`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const auth = req.headers.get("Authorization") || "";

  // Caller client: validates JWT + admin role via RLS
  const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: auth } },
  });
  const { data: userData } = await userClient.auth.getUser();
  if (!userData?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const { data: isAdmin } = await userClient.rpc("is_admin");
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let body: { contest_id?: string };
  try { body = await req.json(); } catch { body = {}; }
  if (!body.contest_id) {
    return new Response(JSON.stringify({ error: "contest_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Service role for inserts (bypass RLS, but we already gated above)
  const admin = createClient(SUPABASE_URL, SERVICE);

  const { data: contest, error: ce } = await admin.from("contests").select("*").eq("id", body.contest_id).maybeSingle();
  if (ce || !contest) {
    return new Response(JSON.stringify({ error: "Contest not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const { data: rules } = await admin.from("certificate_rules").select("*").eq("contest_id", body.contest_id).maybeSingle();
  if (!rules || !rules.enabled) {
    return new Response(JSON.stringify({ error: "Certificate generation not enabled for this contest" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Aggregate best score per user (max per problem, summed)
  const { data: subs } = await admin
    .from("contest_submissions")
    .select("user_id, problem_id, score")
    .eq("contest_id", body.contest_id);

  const bestPerProblem = new Map<string, Map<string, number>>(); // user -> problem -> best
  for (const s of subs ?? []) {
    const u = s.user_id as string, p = s.problem_id as string, sc = s.score as number;
    if (!bestPerProblem.has(u)) bestPerProblem.set(u, new Map());
    const m = bestPerProblem.get(u)!;
    if ((m.get(p) ?? 0) < sc) m.set(p, sc);
  }
  const totals = [...bestPerProblem.entries()]
    .map(([user_id, m]) => ({ user_id, total: [...m.values()].reduce((a, b) => a + b, 0) }))
    .sort((a, b) => b.total - a.total);

  if (totals.length === 0) {
    return new Response(JSON.stringify({ issued: 0, message: "No submissions" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Fetch participant profiles
  const userIds = totals.map((t) => t.user_id);
  const { data: profiles } = await admin.from("profiles").select("user_id, full_name, email").in("user_id", userIds);
  const profileMap = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));

  // Existing certs to skip
  const { data: existing } = await admin.from("certificates").select("user_id").eq("contest_id", body.contest_id);
  const already = new Set((existing ?? []).map((r: any) => r.user_id));

  const rows: any[] = [];
  for (let i = 0; i < totals.length; i++) {
    const t = totals[i];
    if (already.has(t.user_id)) continue;
    const rank = i + 1;
    let type: "winner" | "top_performer" | "participation" | null = null;
    if (rank === 1) type = "winner";
    else if (rank <= rules.top_n) type = "top_performer";
    else if (rules.participation_enabled && t.total >= rules.min_score) type = "participation";
    if (!type) continue;

    const prof = profileMap.get(t.user_id) as any;
    const name = prof?.full_name?.trim() || prof?.email?.split("@")[0] || "Participant";

    const citation = await aiCitation({
      name, contest: contest.title, rank, score: t.total, type, prompt: rules.citation_prompt ?? undefined,
    });

    rows.push({
      code: code(),
      user_id: t.user_id,
      contest_id: body.contest_id,
      recipient_name: name,
      contest_title: contest.title,
      rank,
      score: t.total,
      total_points: contest.total_points,
      certificate_type: type,
      citation,
      generated_by: userData.user.id,
    });
  }

  let inserted = 0;
  if (rows.length) {
    const { error: ie, count } = await admin.from("certificates").insert(rows, { count: "exact" });
    if (ie) {
      return new Response(JSON.stringify({ error: ie.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    inserted = count ?? rows.length;
  }

  return new Response(JSON.stringify({ issued: inserted, evaluated: totals.length }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
