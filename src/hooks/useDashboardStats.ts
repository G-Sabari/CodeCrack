import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface DashboardStats {
  problemsSolved: number;
  problemsAttempted: number;
  quizzesTaken: number;
  quizAccuracy: number;
  certificatesEarned: number;
  certificatesPending: number;
  resumeAnalyses: number;
  xp: number;
  streak: number;
  weeklyActivity: number;
  monthlyActivity: number;
  recent: RecentActivityItem[];
  dailyGoal: { completed: number; target: number };
}

export interface RecentActivityItem {
  id: string;
  kind: "coding" | "quiz" | "certificate";
  title: string;
  meta: string;
  status: "success" | "attempt" | "pending";
  at: string;
}

const EMPTY: DashboardStats = {
  problemsSolved: 0,
  problemsAttempted: 0,
  quizzesTaken: 0,
  quizAccuracy: 0,
  certificatesEarned: 0,
  certificatesPending: 0,
  resumeAnalyses: 0,
  xp: 0,
  streak: 0,
  weeklyActivity: 0,
  monthlyActivity: 0,
  recent: [],
  dailyGoal: { completed: 0, target: 3 },
};

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const days = new Set(dates.map((d) => d.slice(0, 10)));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) streak++;
    else if (i === 0) continue; // today may not have activity yet
    else break;
  }
  return streak;
}

export function useDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setStats(EMPTY); setLoading(false); return; }

    const [subsRes, quizRes, certsRes, resumesRes] = await Promise.all([
      supabase.from("practice_submissions").select("*").eq("user_id", user.id).order("submitted_at", { ascending: false }),
      supabase.from("aptitude_attempts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("certificates").select("id, status, contest_title, issued_at").eq("user_id", user.id).order("issued_at", { ascending: false }),
      supabase.from("resume_analyses").select("id").eq("user_id", user.id),
    ]);

    const subs = subsRes.data ?? [];
    const quizzes = quizRes.data ?? [];
    const certs = certsRes.data ?? [];
    const resumes = resumesRes.data ?? [];

    const solvedSlugs = new Set(subs.filter((s: any) => s.verdict === "Accepted").map((s: any) => s.problem_slug));
    const attemptedSlugs = new Set(subs.map((s: any) => s.problem_slug));

    const totalCorrect = quizzes.reduce((a: number, q: any) => a + (q.correct_count ?? 0), 0);
    const totalAnswered = quizzes.reduce((a: number, q: any) => a + ((q.correct_count ?? 0) + (q.wrong_count ?? 0)), 0);
    const quizAccuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    const xp =
      solvedSlugs.size * 20 +
      quizzes.reduce((a: number, q: any) => a + (q.xp_earned ?? 0), 0) +
      certs.filter((c: any) => c.status === "approved").length * 50;

    const allDates = [
      ...subs.map((s: any) => s.submitted_at),
      ...quizzes.map((q: any) => q.created_at),
    ];
    const streak = computeStreak(allDates);

    const now = Date.now();
    const weekMs = 7 * 24 * 3600 * 1000;
    const monthMs = 30 * 24 * 3600 * 1000;
    const inWeek = (d: string) => now - new Date(d).getTime() <= weekMs;
    const inMonth = (d: string) => now - new Date(d).getTime() <= monthMs;
    const weeklyActivity =
      subs.filter((s: any) => inWeek(s.submitted_at)).length +
      quizzes.filter((q: any) => inWeek(q.created_at)).length;
    const monthlyActivity =
      subs.filter((s: any) => inMonth(s.submitted_at)).length +
      quizzes.filter((q: any) => inMonth(q.created_at)).length;

    const todayKey = new Date().toISOString().slice(0, 10);
    const todayCount =
      subs.filter((s: any) => s.submitted_at.startsWith(todayKey)).length +
      quizzes.filter((q: any) => q.created_at.startsWith(todayKey)).length;

    const recent: RecentActivityItem[] = [
      ...subs.slice(0, 5).map((s: any) => ({
        id: s.id,
        kind: "coding" as const,
        title: s.problem_title,
        meta: `${s.language} · ${s.passed_count}/${s.total_count}`,
        status: s.verdict === "Accepted" ? ("success" as const) : ("attempt" as const),
        at: s.submitted_at,
      })),
      ...quizzes.slice(0, 5).map((q: any) => ({
        id: q.id,
        kind: "quiz" as const,
        title: `${q.topic || q.category} Quiz`,
        meta: `${q.correct_count}/${q.total_questions} correct · ${q.accuracy}%`,
        status: "success" as const,
        at: q.created_at,
      })),
      ...certs.slice(0, 3).map((c: any) => ({
        id: c.id,
        kind: "certificate" as const,
        title: c.contest_title || "Certificate",
        meta: c.status,
        status: c.status === "approved" ? ("success" as const) : ("pending" as const),
        at: c.issued_at,
      })),
    ]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 8);

    setStats({
      problemsSolved: solvedSlugs.size,
      problemsAttempted: attemptedSlugs.size,
      quizzesTaken: quizzes.length,
      quizAccuracy,
      certificatesEarned: certs.filter((c: any) => c.status === "approved").length,
      certificatesPending: certs.filter((c: any) => c.status === "pending").length,
      resumeAnalyses: resumes.length,
      xp,
      streak,
      weeklyActivity,
      monthlyActivity,
      recent,
      dailyGoal: { completed: todayCount, target: 3 },
    });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
    if (!user) return;
    const ch = supabase
      .channel(`dash-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "practice_submissions", filter: `user_id=eq.${user.id}` }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "aptitude_attempts", filter: `user_id=eq.${user.id}` }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "certificates", filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, load]);

  return { stats, loading, refresh: load };
}
