import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Contest = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  week_number: number | null;
  year: number | null;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_points: number;
  status: "upcoming" | "live" | "ended";
};

export type ContestProblem = {
  id: string;
  contest_id: string;
  problem_id: string;
  problem_order: number;
  points: number;
  problems: {
    id: string;
    title: string;
    difficulty: string;
    topic: string;
    description: string;
    starter_code: Record<string, string> | null;
    test_cases: Array<{ input: string; expectedOutput: string; isHidden?: boolean }> | null;
  } | null;
};

export type LeaderboardRow = {
  user_id: string;
  full_name: string;
  total_score: number;
  solved: number;
  last_submission: string;
};

function computeStatus(c: Pick<Contest, "start_time" | "end_time">) {
  const now = Date.now();
  const s = new Date(c.start_time).getTime();
  const e = new Date(c.end_time).getTime();
  if (now < s) return "upcoming" as const;
  if (now > e) return "ended" as const;
  return "live" as const;
}

export function useContests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("contests")
        .select("*")
        .order("start_time", { ascending: true });
      if (cancelled) return;
      if (!error && data) {
        setContests(data.map((c) => ({ ...c, status: computeStatus(c) })) as Contest[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { contests, loading };
}

export function useContest(slug: string | undefined) {
  const [contest, setContest] = useState<Contest | null>(null);
  const [problems, setProblems] = useState<ContestProblem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: c } = await supabase.from("contests").select("*").eq("slug", slug).maybeSingle();
      if (cancelled) return;
      if (c) {
        setContest({ ...c, status: computeStatus(c) } as Contest);
        const { data: cp } = await supabase
          .from("contest_problems")
          .select("*, problems(id, title, difficulty, topic, description, starter_code, test_cases)")
          .eq("contest_id", c.id)
          .order("problem_order");
        if (!cancelled) setProblems((cp as unknown as ContestProblem[]) ?? []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { contest, problems, loading };
}

export function useCountdown(target: string | undefined) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  const total = Math.max(0, new Date(target).getTime() - now);
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
    totalMs: total,
  };
}

export function useLiveLeaderboard(contestId: string | undefined) {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);

  const load = useCallback(async () => {
    if (!contestId) return;
    // Best submission per (user, problem)
    const { data: subs } = await supabase
      .from("contest_submissions")
      .select("user_id, problem_id, score, submitted_at")
      .eq("contest_id", contestId);
    if (!subs) return;

    const bestPerProblem = new Map<string, number>(); // `${user}_${problem}` -> score
    const lastByUser = new Map<string, string>();
    for (const s of subs) {
      const key = `${s.user_id}_${s.problem_id}`;
      const cur = bestPerProblem.get(key) ?? 0;
      if (s.score > cur) bestPerProblem.set(key, s.score);
      const last = lastByUser.get(s.user_id);
      if (!last || s.submitted_at > last) lastByUser.set(s.user_id, s.submitted_at);
    }
    const totals = new Map<string, { score: number; solved: number }>();
    for (const [key, score] of bestPerProblem) {
      const user = key.split("_")[0];
      const t = totals.get(user) ?? { score: 0, solved: 0 };
      t.score += score;
      if (score > 0) t.solved += 1;
      totals.set(user, t);
    }
    const userIds = Array.from(totals.keys());
    if (userIds.length === 0) {
      setRows([]);
      return;
    }
    const { data: profs } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .in("user_id", userIds);

    const merged: LeaderboardRow[] = userIds.map((u) => {
      const t = totals.get(u)!;
      const p = profs?.find((x) => x.user_id === u);
      return {
        user_id: u,
        full_name: p?.full_name || p?.email?.split("@")[0] || "Anonymous",
        total_score: t.score,
        solved: t.solved,
        last_submission: lastByUser.get(u) ?? "",
      };
    });
    merged.sort((a, b) =>
      b.total_score - a.total_score || (a.last_submission < b.last_submission ? -1 : 1),
    );
    setRows(merged);
  }, [contestId]);

  useEffect(() => {
    load();
    if (!contestId) return;
    const ch = supabase
      .channel(`contest-lb-${contestId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contest_submissions", filter: `contest_id=eq.${contestId}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [contestId, load]);

  return { rows, reload: load };
}

export function useRegistrationCount(contestId: string | undefined) {
  const [count, setCount] = useState(0);
  const [registered, setRegistered] = useState(false);

  const load = useCallback(async () => {
    if (!contestId) return;
    const { count: total } = await supabase
      .from("contest_registrations")
      .select("*", { count: "exact", head: true })
      .eq("contest_id", contestId);
    setCount(total ?? 0);
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      const { data } = await supabase
        .from("contest_registrations")
        .select("id")
        .eq("contest_id", contestId)
        .eq("user_id", user.user.id)
        .maybeSingle();
      setRegistered(!!data);
    }
  }, [contestId]);

  useEffect(() => {
    load();
    if (!contestId) return;
    const ch = supabase
      .channel(`contest-reg-${contestId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contest_registrations", filter: `contest_id=eq.${contestId}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [contestId, load]);

  return { count, registered, reload: load };
}
