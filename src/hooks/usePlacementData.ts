import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 18000];

export interface CategoryProgress {
  key: string;
  label: string;
  percent: number;
  completed: number;
  total: number;
  remaining: number;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  description: string;
}

export interface Insight {
  id: string;
  tone: "positive" | "warning" | "info";
  text: string;
}

export interface DailyGoal {
  id: string;
  label: string;
  done: boolean;
  to: string;
}

export interface ContinueItem {
  id: string;
  label: string;
  percent: number;
  to: string;
  meta: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  kind: string;
  at: string;
  xp?: number;
}

export interface PlacementData {
  loading: boolean;
  readiness: number;
  tier: "Beginner" | "Intermediate" | "Advanced" | "Placement Ready";
  xp: number;
  level: number;
  levelXpFloor: number;
  levelXpCeiling: number;
  xpToNext: number;
  levelProgress: number;
  coins: number;
  streak: number;
  categories: CategoryProgress[];
  overallCareer: number;
  dailyGoals: DailyGoal[];
  continueItems: ContinueItem[];
  recommendation: { title: string; body: string; to: string; cta: string } | null;
  badges: Badge[];
  insights: Insight[];
  analytics: {
    problemsSolved: number;
    problemsRemaining: number;
    quizAccuracy: number;
    resumeScore: number;
    certificatesEarned: number;
    xp: number;
    streak: number;
    weekly: number;
    monthly: number;
  };
  recent: ActivityItem[];
}

const EMPTY: PlacementData = {
  loading: true,
  readiness: 0,
  tier: "Beginner",
  xp: 0,
  level: 1,
  levelXpFloor: 0,
  levelXpCeiling: 100,
  xpToNext: 100,
  levelProgress: 0,
  coins: 0,
  streak: 0,
  categories: [],
  overallCareer: 0,
  dailyGoals: [],
  continueItems: [],
  recommendation: null,
  badges: [],
  insights: [],
  analytics: {
    problemsSolved: 0, problemsRemaining: 0, quizAccuracy: 0, resumeScore: 0,
    certificatesEarned: 0, xp: 0, streak: 0, weekly: 0, monthly: 0,
  },
  recent: [],
};

function computeStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const days = new Set(dates.map((d) => d.slice(0, 10)));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

function levelFromXp(xp: number) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  const floor = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const ceiling = LEVEL_THRESHOLDS[level] ?? floor + 1000;
  return { level, floor, ceiling };
}

export function usePlacementData(): PlacementData & { refresh: () => void } {
  const { user } = useAuth();
  const [state, setState] = useState<PlacementData>(EMPTY);

  const load = useCallback(async () => {
    if (!user) { setState({ ...EMPTY, loading: false }); return; }

    const [subsRes, quizRes, certsRes, resumesRes, roadmapRes, problemsRes] = await Promise.all([
      supabase.from("practice_submissions").select("*").eq("user_id", user.id).order("submitted_at", { ascending: false }),
      supabase.from("aptitude_attempts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("certificates").select("id, status, contest_title, issued_at").eq("user_id", user.id).order("issued_at", { ascending: false }),
      supabase.from("resume_analyses").select("id, ats_score, match_score, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("user_roadmap_progress").select("*, preparation_roadmaps(id, title, duration_days, target_track)").eq("user_id", user.id),
      supabase.from("problems").select("id", { count: "exact", head: true }),
    ]);

    const subs = subsRes.data ?? [];
    const quizzes = quizRes.data ?? [];
    const certs = certsRes.data ?? [];
    const resumes = resumesRes.data ?? [];
    const roadmaps = roadmapRes.data ?? [];
    const totalProblems = problemsRes.count ?? 150;

    const solvedSlugs = new Set(subs.filter((s: any) => s.verdict === "Accepted").map((s: any) => s.problem_slug));
    const solvedCount = solvedSlugs.size;

    const totalCorrect = quizzes.reduce((a: number, q: any) => a + (q.correct_count ?? 0), 0);
    const totalAnswered = quizzes.reduce((a: number, q: any) => a + ((q.correct_count ?? 0) + (q.wrong_count ?? 0)), 0);
    const quizAccuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    const bestResume = resumes.reduce((m: number, r: any) => Math.max(m, r.ats_score ?? 0, r.match_score ?? 0), 0);
    const resumeScore = bestResume;

    const approvedCerts = certs.filter((c: any) => c.status === "approved").length;

    // roadmap progress avg
    const roadmapPercents = roadmaps.map((r: any) => {
      const total = r.preparation_roadmaps?.duration_days ?? 30;
      const done = Array.isArray(r.completed_days) ? r.completed_days.length : 0;
      return total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
    });
    const roadmapPercent = roadmapPercents.length
      ? Math.round(roadmapPercents.reduce((a, b) => a + b, 0) / roadmapPercents.length)
      : 0;

    // XP calculation
    const xp =
      solvedCount * 20 +
      quizzes.reduce((a: number, q: any) => a + (q.xp_earned ?? Math.round((q.accuracy ?? 0) / 10)), 0) +
      approvedCerts * 50 +
      (resumeScore >= 70 ? 30 : 0) +
      roadmapPercents.reduce((a, p) => a + Math.round(p / 5), 0);

    const { level, floor, ceiling } = levelFromXp(xp);
    const levelProgress = ceiling > floor ? Math.round(((xp - floor) / (ceiling - floor)) * 100) : 100;
    const xpToNext = Math.max(0, ceiling - xp);

    // coins: cheap derivation
    const coins = solvedCount * 5 + quizzes.length * 3 + approvedCerts * 25;

    // streak
    const streak = computeStreak([
      ...subs.map((s: any) => s.submitted_at),
      ...quizzes.map((q: any) => q.created_at),
    ]);

    // categories
    const dsaTarget = Math.min(totalProblems, 100);
    const aptTarget = 20;
    const mockTarget = 5;
    const dsaPct = dsaTarget > 0 ? Math.min(100, Math.round((solvedCount / dsaTarget) * 100)) : 0;
    const aptPct = Math.min(100, Math.round((quizzes.length / aptTarget) * 100));
    const resumePct = Math.min(100, resumeScore);
    const mockPct = 0; // no mock interview data source yet
    const companyPct = roadmapPercent;

    const categories: CategoryProgress[] = [
      { key: "dsa", label: "DSA Progress", percent: dsaPct, completed: solvedCount, total: dsaTarget, remaining: Math.max(0, dsaTarget - solvedCount) },
      { key: "apt", label: "Aptitude Progress", percent: aptPct, completed: quizzes.length, total: aptTarget, remaining: Math.max(0, aptTarget - quizzes.length) },
      { key: "resume", label: "Resume Strength", percent: resumePct, completed: resumeScore, total: 100, remaining: Math.max(0, 100 - resumeScore) },
      { key: "mock", label: "Mock Interview", percent: mockPct, completed: 0, total: mockTarget, remaining: mockTarget },
      { key: "company", label: "Company Preparation", percent: companyPct, completed: roadmapPercents.filter(p => p >= 100).length, total: Math.max(1, roadmaps.length), remaining: Math.max(0, roadmaps.length - roadmapPercents.filter(p => p >= 100).length) },
    ];

    // readiness = weighted
    const readiness = Math.round(
      dsaPct * 0.30 +
      aptPct * 0.15 +
      resumePct * 0.15 +
      mockPct * 0.10 +
      companyPct * 0.15 +
      Math.min(100, approvedCerts * 20) * 0.15
    );
    const tier: PlacementData["tier"] =
      readiness >= 85 ? "Placement Ready" :
      readiness >= 60 ? "Advanced" :
      readiness >= 30 ? "Intermediate" : "Beginner";

    const overallCareer = Math.round(
      (dsaPct + aptPct + resumePct + mockPct + companyPct) / 5
    );

    // daily goals
    const todayKey = new Date().toISOString().slice(0, 10);
    const todaySolved = new Set(
      subs.filter((s: any) => s.verdict === "Accepted" && s.submitted_at.startsWith(todayKey))
        .map((s: any) => s.problem_slug)
    ).size;
    const todayQuizzes = quizzes.filter((q: any) => q.created_at.startsWith(todayKey)).length;
    const todayResume = resumes.some((r: any) => r.created_at.startsWith(todayKey));

    const dailyGoals: DailyGoal[] = [
      { id: "dsa2", label: "Solve 2 DSA problems", done: todaySolved >= 2, to: "/problems" },
      { id: "apt1", label: "Complete 1 aptitude quiz", done: todayQuizzes >= 1, to: "/aptitude" },
      { id: "resume", label: resumeScore < 80 ? "Improve resume score" : "Refresh resume analysis", done: todayResume, to: "/resume-analyzer" },
    ];
    if (roadmaps.length && roadmapPercent < 100) {
      dailyGoals.push({ id: "rm", label: `Advance ${roadmaps[0].preparation_roadmaps?.title || "your roadmap"}`, done: false, to: "/learning-path" });
    }

    // continue learning
    const continueItems: ContinueItem[] = [];
    if (dsaPct < 100 && dsaPct > 0) continueItems.push({ id: "c-dsa", label: "Continue DSA Practice", percent: dsaPct, to: "/problems", meta: `${solvedCount}/${dsaTarget} solved` });
    if (aptPct < 100 && quizzes.length > 0) continueItems.push({ id: "c-apt", label: "Continue Aptitude", percent: aptPct, to: "/aptitude", meta: `${quizzes.length}/${aptTarget} quizzes` });
    if (resumes.length && resumePct < 90) continueItems.push({ id: "c-resume", label: "Improve Resume", percent: resumePct, to: "/resume-analyzer", meta: `${resumeScore}/100 score` });
    roadmaps.forEach((r: any) => {
      const total = r.preparation_roadmaps?.duration_days ?? 30;
      const done = Array.isArray(r.completed_days) ? r.completed_days.length : 0;
      const pct = total ? Math.round((done / total) * 100) : 0;
      if (pct < 100) continueItems.push({
        id: `c-rm-${r.roadmap_id}`,
        label: `Continue ${r.preparation_roadmaps?.title || "Roadmap"}`,
        percent: pct,
        to: "/learning-path",
        meta: `Day ${r.current_day || done}/${total}`,
      });
    });

    // recommendation (highest priority weak spot)
    let recommendation: PlacementData["recommendation"] = null;
    if (resumeScore > 0 && resumeScore < 80) {
      recommendation = { title: "Improve your resume", body: `Your resume score is ${resumeScore}. Push it above 80 to unlock more opportunities.`, to: "/resume-analyzer", cta: "Open Resume Analyzer" };
    } else if (dsaPct < 50) {
      recommendation = { title: "Strengthen DSA fundamentals", body: `You've solved ${solvedCount}/${dsaTarget} problems. Target Arrays & Strings next.`, to: "/problems", cta: "Solve a problem" };
    } else if (aptPct < 50) {
      recommendation = { title: "Boost aptitude", body: "Aptitude score matters for service companies. Take a Probability or Logical quiz.", to: "/aptitude", cta: "Take a quiz" };
    } else if (resumeScore === 0) {
      recommendation = { title: "Analyze your resume", body: "Upload your resume for an ATS-style analysis and personalized suggestions.", to: "/resume-analyzer", cta: "Analyze resume" };
    } else if (companyPct < 60 && roadmaps.length) {
      recommendation = { title: "Finish your company roadmap", body: "Wrap up the roadmap you started to sharpen company-specific prep.", to: "/learning-path", cta: "Continue roadmap" };
    } else {
      recommendation = { title: "Start a mock interview", body: "You've built strong fundamentals — time to simulate a real interview.", to: "/behavioral", cta: "Start mock interview" };
    }

    // badges
    const badges: Badge[] = [
      { id: "first-login", label: "First Login", icon: "🚪", description: "Welcome aboard", unlocked: true, unlockedAt: user.created_at },
      { id: "first-solve", label: "First Problem Solved", icon: "🎯", description: "Solved your first problem", unlocked: solvedCount >= 1 },
      { id: "solve-10", label: "10 Problems Solved", icon: "💪", description: "Solve 10 problems", unlocked: solvedCount >= 10 },
      { id: "solve-50", label: "50 Problems Solved", icon: "🔥", description: "Solve 50 problems", unlocked: solvedCount >= 50 },
      { id: "streak-7", label: "7-Day Streak", icon: "⚡", description: "Active for 7 days straight", unlocked: streak >= 7 },
      { id: "aptitude-ace", label: "Aptitude Champion", icon: "🧠", description: "80%+ quiz accuracy", unlocked: quizAccuracy >= 80 && quizzes.length >= 3 },
      { id: "resume-master", label: "Resume Master", icon: "📄", description: "Resume score ≥ 85", unlocked: resumeScore >= 85 },
      { id: "certified", label: "Certified", icon: "🏆", description: "Earned a certificate", unlocked: approvedCerts >= 1 },
      { id: "placement-ready", label: "Placement Ready", icon: "🚀", description: "Readiness ≥ 85%", unlocked: readiness >= 85 },
    ];

    // insights
    const insights: Insight[] = [];
    // strongest language
    const langCount: Record<string, number> = {};
    subs.filter((s: any) => s.verdict === "Accepted").forEach((s: any) => {
      if (s.language) langCount[s.language] = (langCount[s.language] || 0) + 1;
    });
    const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0];
    if (topLang) insights.push({ id: "lang", tone: "positive", text: `You are strongest in ${topLang[0]} with ${topLang[1]} accepted solutions.` });

    // weakest quiz topic
    const topicAcc: Record<string, { c: number; a: number }> = {};
    quizzes.forEach((q: any) => {
      const t = q.topic || q.category || "General";
      const rec = topicAcc[t] || { c: 0, a: 0 };
      rec.c += q.correct_count ?? 0;
      rec.a += (q.correct_count ?? 0) + (q.wrong_count ?? 0);
      topicAcc[t] = rec;
    });
    const weakest = Object.entries(topicAcc)
      .filter(([, v]) => v.a >= 3)
      .map(([k, v]) => ({ topic: k, acc: (v.c / v.a) * 100 }))
      .sort((a, b) => a.acc - b.acc)[0];
    if (weakest) insights.push({ id: "weak", tone: "warning", text: `Your weakest aptitude topic is ${weakest.topic} (${Math.round(weakest.acc)}%). Practice it soon.` });

    if (resumeScore > 0 && resumeScore < 80) {
      insights.push({ id: "resume", tone: "warning", text: `Improve your resume by ${80 - resumeScore} points to increase placement readiness.` });
    }
    if (readiness >= 60) insights.push({ id: "ready-accenture", tone: "positive", text: "You are ready for service companies like Accenture, TCS, and Infosys." });
    if (solvedCount < 25) insights.push({ id: "unlock-cert", tone: "info", text: `Solve ${25 - solvedCount} more DSA problems to unlock the DSA Mastery certificate.` });
    if (streak >= 3) insights.push({ id: "streak", tone: "positive", text: `Great consistency — ${streak}-day streak going strong!` });

    // recent activity
    const now = Date.now();
    const weekMs = 7 * 24 * 3600 * 1000;
    const monthMs = 30 * 24 * 3600 * 1000;
    const weekly =
      subs.filter((s: any) => now - new Date(s.submitted_at).getTime() <= weekMs).length +
      quizzes.filter((q: any) => now - new Date(q.created_at).getTime() <= weekMs).length;
    const monthly =
      subs.filter((s: any) => now - new Date(s.submitted_at).getTime() <= monthMs).length +
      quizzes.filter((q: any) => now - new Date(q.created_at).getTime() <= monthMs).length;

    const recent: ActivityItem[] = [
      ...subs.slice(0, 8).map((s: any) => ({
        id: `s-${s.id}`,
        kind: s.verdict === "Accepted" ? "Solved" : "Attempted",
        title: `${s.verdict === "Accepted" ? "Solved" : "Attempted"} ${s.problem_title}`,
        meta: `${s.language} · ${s.passed_count}/${s.total_count}`,
        at: s.submitted_at,
        xp: s.verdict === "Accepted" ? 20 : 0,
      })),
      ...quizzes.slice(0, 5).map((q: any) => ({
        id: `q-${q.id}`,
        kind: "Quiz",
        title: `Completed ${q.topic || q.category} Quiz`,
        meta: `${q.correct_count}/${q.total_questions} · ${q.accuracy}%`,
        at: q.created_at,
        xp: q.xp_earned ?? 0,
      })),
      ...certs.slice(0, 3).map((c: any) => ({
        id: `c-${c.id}`,
        kind: "Certificate",
        title: c.status === "approved" ? `Earned ${c.contest_title || "certificate"}` : `Requested ${c.contest_title || "certificate"}`,
        meta: c.status,
        at: c.issued_at,
        xp: c.status === "approved" ? 50 : 0,
      })),
      ...resumes.slice(0, 3).map((r: any) => ({
        id: `r-${r.id}`,
        kind: "Resume",
        title: "Updated resume analysis",
        meta: `Score ${r.ats_score ?? r.match_score ?? 0}`,
        at: r.created_at,
      })),
    ]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 12);

    setState({
      loading: false,
      readiness,
      tier,
      xp, level, levelXpFloor: floor, levelXpCeiling: ceiling, xpToNext, levelProgress,
      coins, streak,
      categories, overallCareer,
      dailyGoals,
      continueItems: continueItems.slice(0, 5),
      recommendation,
      badges,
      insights: insights.slice(0, 5),
      analytics: {
        problemsSolved: solvedCount,
        problemsRemaining: Math.max(0, dsaTarget - solvedCount),
        quizAccuracy,
        resumeScore,
        certificatesEarned: approvedCerts,
        xp,
        streak,
        weekly,
        monthly,
      },
      recent,
    });
  }, [user]);

  useEffect(() => {
    load();
    if (!user) return;
    const ch = supabase
      .channel(`placement-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "practice_submissions", filter: `user_id=eq.${user.id}` }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "aptitude_attempts", filter: `user_id=eq.${user.id}` }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "certificates", filter: `user_id=eq.${user.id}` }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "resume_analyses", filter: `user_id=eq.${user.id}` }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "user_roadmap_progress", filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, load]);

  return useMemo(() => ({ ...state, refresh: load }), [state, load]);
}
