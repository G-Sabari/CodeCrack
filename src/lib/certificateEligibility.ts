import { supabase } from "@/integrations/supabase/client";

export type CertType =
  | "aptitude_excellence"
  | "dsa_excellence"
  | "java_mastery"
  | "company_preparation"
  | "mock_interview"
  | "placement_readiness";

export type CertDefinition = {
  type: CertType;
  title: string;
  description: string;
  requirements: string[];
};

export const CERT_DEFINITIONS: CertDefinition[] = [
  {
    type: "aptitude_excellence",
    title: "Aptitude Excellence",
    description: "Awarded for consistent excellence in aptitude assessments.",
    requirements: ["Complete at least 1 aptitude quiz", "Best score ≥ 70%"],
  },
  {
    type: "dsa_excellence",
    title: "DSA Excellence",
    description: "Recognizes mastery of data structures & algorithms.",
    requirements: ["Solve 50 problems", "Acceptance rate ≥ 60%"],
  },
  {
    type: "java_mastery",
    title: "Java Mastery",
    description: "Awarded for demonstrating Java problem-solving proficiency.",
    requirements: ["Solve 20 problems using Java"],
  },
  {
    type: "company_preparation",
    title: "Company Preparation",
    description: "Awarded for completing company-focused problem sets.",
    requirements: ["Solve at least 25 tagged company problems"],
  },
  {
    type: "mock_interview",
    title: "Mock Interview",
    description: "Awarded for completing at least one mock interview session.",
    requirements: ["Complete a resume analysis / mock session"],
  },
  {
    type: "placement_readiness",
    title: "Placement Readiness",
    description: "The capstone certificate — awarded when all core tracks are complete.",
    requirements: [
      "Resume Analyzer complete",
      "Mock Interview complete",
      "Aptitude Excellence eligible",
      "DSA Excellence eligible",
    ],
  },
];

export type EligibilityResult = {
  type: CertType;
  eligible: boolean;
  progress: number; // 0-100
  detail: string;
  earnedAt?: string | null;
  snapshot: Record<string, any>;
};

export async function computeAllEligibility(userId: string): Promise<EligibilityResult[]> {
  const [aptRes, solvedRes, resumeRes, problemsRes] = await Promise.all([
    supabase
      .from("aptitude_attempts")
      .select("accuracy, score, total_questions, created_at")
      .eq("user_id", userId),
    supabase
      .from("solved_problems")
      .select("status, solution_language, problem_id, solved_at")
      .eq("user_id", userId),
    supabase
      .from("resume_analyses")
      .select("id, created_at")
      .eq("user_id", userId)
      .limit(1),
    supabase.from("problems").select("id, tags").limit(1000),
  ]);

  const attempts = aptRes.data ?? [];
  const solved = solvedRes.data ?? [];
  const resumeAny = (resumeRes.data ?? []).length > 0;
  const problems = problemsRes.data ?? [];

  const acceptedSolves = solved.filter((s: any) => s.status === "accepted" || s.status === "solved");
  const totalAttempts = solved.length || 1;
  const acceptanceRate = (acceptedSolves.length / totalAttempts) * 100;

  const bestAptitude = attempts.reduce(
    (m: number, a: any) => Math.max(m, Number(a.accuracy ?? 0)),
    0,
  );
  const lastAptitude = attempts.sort((a: any, b: any) =>
    (b.created_at ?? "").localeCompare(a.created_at ?? ""),
  )[0];

  const javaSolves = acceptedSolves.filter(
    (s: any) => (s.solution_language ?? "").toLowerCase() === "java",
  ).length;

  const companyProblemIds = new Set(
    problems.filter((p: any) => Array.isArray(p.tags) && p.tags.length > 0).map((p: any) => p.id),
  );
  const companySolves = acceptedSolves.filter((s: any) => companyProblemIds.has(s.problem_id)).length;

  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

  const aptEligible = bestAptitude >= 70 && attempts.length > 0;
  const dsaEligible = acceptedSolves.length >= 50 && acceptanceRate >= 60;
  const javaEligible = javaSolves >= 20;
  const companyEligible = companySolves >= 25;
  const mockEligible = resumeAny;
  const placementEligible = resumeAny && aptEligible && dsaEligible;

  const results: EligibilityResult[] = [
    {
      type: "aptitude_excellence",
      eligible: aptEligible,
      progress: clamp((bestAptitude / 70) * 100),
      detail: `Best accuracy: ${bestAptitude.toFixed(1)}% (target 70%)`,
      earnedAt: aptEligible ? lastAptitude?.created_at ?? null : null,
      snapshot: { bestAptitude, attempts: attempts.length },
    },
    {
      type: "dsa_excellence",
      eligible: dsaEligible,
      progress: clamp((acceptedSolves.length / 50) * 100),
      detail: `${acceptedSolves.length}/50 solved · ${acceptanceRate.toFixed(0)}% acceptance`,
      earnedAt: dsaEligible ? new Date().toISOString() : null,
      snapshot: { solved: acceptedSolves.length, acceptanceRate },
    },
    {
      type: "java_mastery",
      eligible: javaEligible,
      progress: clamp((javaSolves / 20) * 100),
      detail: `${javaSolves}/20 Java solutions accepted`,
      earnedAt: javaEligible ? new Date().toISOString() : null,
      snapshot: { javaSolves },
    },
    {
      type: "company_preparation",
      eligible: companyEligible,
      progress: clamp((companySolves / 25) * 100),
      detail: `${companySolves}/25 tagged company problems solved`,
      earnedAt: companyEligible ? new Date().toISOString() : null,
      snapshot: { companySolves },
    },
    {
      type: "mock_interview",
      eligible: mockEligible,
      progress: mockEligible ? 100 : 0,
      detail: mockEligible ? "Mock / resume session completed" : "No sessions yet",
      earnedAt: mockEligible ? (resumeRes.data?.[0] as any)?.created_at ?? null : null,
      snapshot: { resumeAny },
    },
    {
      type: "placement_readiness",
      eligible: placementEligible,
      progress: clamp(
        ((aptEligible ? 25 : 0) +
          (dsaEligible ? 25 : 0) +
          (mockEligible ? 25 : 0) +
          (resumeAny ? 25 : 0)),
      ),
      detail: placementEligible
        ? "All core tracks complete — you are placement ready!"
        : "Complete Resume, Mock, Aptitude and DSA to unlock",
      earnedAt: placementEligible ? new Date().toISOString() : null,
      snapshot: { aptEligible, dsaEligible, mockEligible, resumeAny },
    },
  ];

  return results;
}

export const CERT_LABEL: Record<string, string> = Object.fromEntries(
  CERT_DEFINITIONS.map((d) => [d.type, d.title]),
);
