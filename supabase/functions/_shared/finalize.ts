// Shared certificate finalization logic (auto or admin-triggered).
// Computes per-user score/percentage/accuracy and issues certificates
// for users above the configured pass_percentage threshold.
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

export function newCode() {
  const y = new Date().getFullYear();
  return `CC-${y}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function aiCitation(opts: {
  name: string; contest: string; rank: number; score: number; type: string; prompt?: string;
}): Promise<string> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  const fallback = () => {
    if (opts.type === "winner") return `Awarded for an outstanding first-place performance, demonstrating mastery of algorithmic problem solving under contest conditions.`;
    if (opts.type === "top_performer") return `Recognized as a top performer (rank #${opts.rank}) for sharp problem decomposition and consistent execution across the contest set.`;
    return `Recognized for successfully completing the contest with strong problem-solving performance.`;
  };
  if (!key) return fallback();
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Write ONE short, dignified commendation sentence (max 28 words) for a coding contest certificate. No emojis. No quotes. Third person." },
          { role: "user", content: `Recipient: ${opts.name}\nContest: ${opts.contest}\nRank: #${opts.rank}\nScore: ${opts.score}\nCertificate type: ${opts.type}\n${opts.prompt ? `Admin guidance: ${opts.prompt}` : ""}` },
        ],
      }),
    });
    if (!r.ok) return fallback();
    const j = await r.json();
    return j?.choices?.[0]?.message?.content?.toString().trim() || fallback();
  } catch {
    return fallback();
  }
}

export type FinalizeResult = {
  contest_id: string;
  evaluated: number;
  issued: number;
  skipped?: string;
};

export async function finalizeContest(
  admin: SupabaseClient,
  contestId: string,
  generatedBy: string | null,
): Promise<FinalizeResult> {
  const { data: contest } = await admin.from("contests").select("*").eq("id", contestId).maybeSingle();
  if (!contest) return { contest_id: contestId, evaluated: 0, issued: 0, skipped: "contest not found" };

  const { data: rules } = await admin.from("certificate_rules").select("*").eq("contest_id", contestId).maybeSingle();
  if (!rules || !rules.enabled) {
    return { contest_id: contestId, evaluated: 0, issued: 0, skipped: "rules not enabled" };
  }

  const { data: cproblems } = await admin
    .from("contest_problems")
    .select("problem_id, points")
    .eq("contest_id", contestId);
  const totalPoints =
    (cproblems ?? []).reduce((a, b) => a + (b.points ?? 0), 0) || contest.total_points || 0;
  const totalProblems = (cproblems ?? []).length;

  const { data: subs } = await admin
    .from("contest_submissions")
    .select("user_id, problem_id, score, passed_count, total_count, status")
    .eq("contest_id", contestId);

  // Best score per user/problem + best accuracy per user/problem
  const bestScore = new Map<string, Map<string, number>>();
  const bestAcc = new Map<string, Map<string, number>>();
  const solved = new Map<string, Set<string>>();
  for (const s of subs ?? []) {
    const u = s.user_id as string, p = s.problem_id as string;
    if (!bestScore.has(u)) { bestScore.set(u, new Map()); bestAcc.set(u, new Map()); solved.set(u, new Set()); }
    const sm = bestScore.get(u)!, am = bestAcc.get(u)!;
    if ((sm.get(p) ?? -1) < (s.score ?? 0)) sm.set(p, s.score ?? 0);
    const acc = s.total_count ? ((s.passed_count ?? 0) / s.total_count) * 100 : 0;
    if ((am.get(p) ?? -1) < acc) am.set(p, acc);
    if (s.status === "accepted" || (s.total_count > 0 && s.passed_count === s.total_count)) solved.get(u)!.add(p);
  }

  const totals = [...bestScore.entries()].map(([user_id, m]) => {
    const score = [...m.values()].reduce((a, b) => a + b, 0);
    const accVals = [...bestAcc.get(user_id)!.values()];
    const accuracy = accVals.length ? accVals.reduce((a, b) => a + b, 0) / accVals.length : 0;
    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    return { user_id, score, accuracy, percentage, solved_count: solved.get(user_id)!.size };
  }).sort((a, b) => b.score - a.score);

  if (totals.length === 0) {
    await admin.from("contests").update({ finalized_at: new Date().toISOString() }).eq("id", contestId);
    return { contest_id: contestId, evaluated: 0, issued: 0, skipped: "no submissions" };
  }

  const userIds = totals.map((t) => t.user_id);
  const { data: profiles } = await admin.from("profiles").select("user_id, full_name, email").in("user_id", userIds);
  const profileMap = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));

  const { data: existing } = await admin.from("certificates").select("user_id").eq("contest_id", contestId);
  const already = new Set((existing ?? []).map((r: any) => r.user_id));

  const passPct = rules.pass_percentage ?? 50;
  const rows: any[] = [];
  for (let i = 0; i < totals.length; i++) {
    const t = totals[i];
    if (already.has(t.user_id)) continue;
    if (t.percentage <= passPct) continue; // strict > threshold
    const rank = i + 1;
    let type: "winner" | "top_performer" | "participation" = "participation";
    if (rank === 1) type = "winner";
    else if (rank <= (rules.top_n ?? 3)) type = "top_performer";

    const prof = profileMap.get(t.user_id) as any;
    const name = prof?.full_name?.trim() || prof?.email?.split("@")[0] || "Participant";

    const citation = await aiCitation({
      name, contest: contest.title, rank, score: t.score, type, prompt: rules.citation_prompt ?? undefined,
    });

    rows.push({
      code: newCode(),
      user_id: t.user_id,
      contest_id: contestId,
      recipient_name: name,
      contest_title: contest.title,
      rank,
      score: t.score,
      total_points: totalPoints,
      percentage: Number(t.percentage.toFixed(2)),
      accuracy: Number(t.accuracy.toFixed(2)),
      certificate_type: type,
      citation,
      generated_by: generatedBy,
    });
  }

  let inserted = 0;
  if (rows.length) {
    const { error: ie, count } = await admin.from("certificates").insert(rows, { count: "exact" });
    if (ie) throw new Error(ie.message);
    inserted = count ?? rows.length;
  }

  await admin.from("contests").update({ finalized_at: new Date().toISOString() }).eq("id", contestId);
  return { contest_id: contestId, evaluated: totals.length, issued: inserted };
}

export function adminClient() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}
