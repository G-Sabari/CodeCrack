import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Clock, Play, Send, Crown, Medal, Loader2, CheckCircle2, XCircle, Zap, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useContest, useCountdown, useLiveLeaderboard, useRegistrationCount } from "@/hooks/useContests";
import { buildCertificatePdf, downloadBlob, generateCode } from "@/lib/certificate";
import { toast } from "sonner";

const LANG_OPTIONS = [
  { value: "python", label: "Python 3", monaco: "python" },
  { value: "java", label: "Java", monaco: "java" },
  { value: "cpp", label: "C++", monaco: "cpp" },
  { value: "javascript", label: "JavaScript", monaco: "javascript" },
];

const FALLBACK_STARTER: Record<string, string> = {
  python: "def solve():\n    pass\n\nsolve()\n",
  java: "public class Main {\n    public static void main(String[] args) {\n        // your code\n    }\n}\n",
  cpp: "#include <iostream>\nusing namespace std;\nint main(){\n    return 0;\n}\n",
  javascript: "function solve(){\n  // your code\n}\nsolve();\n",
};

export default function ContestArena() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const { contest, problems, loading } = useContest(slug);
  const countdown = useCountdown(contest?.status === "upcoming" ? contest?.start_time : contest?.end_time);
  const { rows: leaderboard } = useLiveLeaderboard(contest?.id);
  const { count: regCount, registered, reload: reloadReg } = useRegistrationCount(contest?.id);

  const [activeIdx, setActiveIdx] = useState(0);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(FALLBACK_STARTER.python);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [issuingCert, setIssuingCert] = useState(false);

  const activeProblem = problems[activeIdx];

  useEffect(() => {
    if (!activeProblem) return;
    const starter = activeProblem.problems?.starter_code as Record<string, string> | null | undefined;
    setCode((starter?.[language]) || FALLBACK_STARTER[language] || "");
    setLastResult(null);
  }, [activeIdx, language, activeProblem]);

  const myRank = useMemo(() => {
    if (!user) return null;
    const idx = leaderboard.findIndex((r) => r.user_id === user.id);
    return idx >= 0 ? idx + 1 : null;
  }, [leaderboard, user]);

  const myScore = useMemo(() => {
    if (!user) return 0;
    return leaderboard.find((r) => r.user_id === user.id)?.total_score ?? 0;
  }, [leaderboard, user]);

  const register = async () => {
    if (!contest || !user) return navigate("/auth");
    const { error } = await supabase
      .from("contest_registrations")
      .insert({ contest_id: contest.id, user_id: user.id });
    if (error) toast.error(error.message);
    else {
      toast.success("Registered for the contest!");
      reloadReg();
    }
  };

  const runOrSubmit = async (mode: "run" | "submit") => {
    if (!user) return navigate("/auth");
    if (!activeProblem?.problems) return;
    if (mode === "submit" && contest?.status !== "live") {
      toast.error("Submissions are only accepted while the contest is live.");
      return;
    }
    mode === "run" ? setRunning(true) : setSubmitting(true);
    setLastResult(null);
    try {
      const testCases = activeProblem.problems.test_cases ?? [];
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            code,
            language,
            mode,
            testCases,
            problemId: activeProblem.problem_id,
          }),
        },
      );
      if (!res.ok) throw new Error("Execution failed");
      const result = await res.json();
      setLastResult(result);

      if (mode === "submit") {
        const passed = Number(result.passedCount ?? result.passed ?? 0);
        const total = Number(result.totalCount ?? testCases.length ?? 0);
        const accepted = result.verdict === "Accepted" || (total > 0 && passed === total);
        const score = total > 0 ? Math.round((passed / total) * activeProblem.points) : 0;
        await supabase.from("contest_submissions").insert({
          contest_id: contest!.id,
          problem_id: activeProblem.problem_id,
          user_id: user.id,
          language,
          code,
          status: accepted ? "accepted" : passed === 0 ? "wrong" : "wrong",
          score,
          passed_count: passed,
          total_count: total,
          runtime_ms: result.runtimeMs ?? null,
        });
        if (accepted) toast.success(`Accepted! +${score} points`);
        else toast.error(`${passed}/${total} test cases passed (+${score} pts)`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to execute code");
    } finally {
      setRunning(false);
      setSubmitting(false);
    }
  };

  const issueCertificate = async () => {
    if (!user || !contest) return;
    if (!myRank) {
      toast.error("Submit at least one solution to earn a certificate.");
      return;
    }
    if (myRank > 10) {
      toast.error("Top 10 only — keep climbing!");
      return;
    }
    setIssuingCert(true);
    try {
      // Try to find existing
      const { data: existing } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .eq("contest_id", contest.id)
        .maybeSingle();

      let cert = existing;
      if (!cert) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("user_id", user.id)
          .maybeSingle();
        const recipientName = profile?.full_name || profile?.email?.split("@")[0] || "CodeCrack User";
        const code = generateCode();
        const { data: inserted, error } = await supabase
          .from("certificates")
          .insert({
            code,
            user_id: user.id,
            contest_id: contest.id,
            recipient_name: recipientName,
            contest_title: contest.title,
            rank: myRank,
            score: myScore,
            total_points: contest.total_points,
          })
          .select()
          .single();
        if (error) throw error;
        cert = inserted as any;
      }
      const verifyUrl = `${window.location.origin}/certificate/${cert!.code}`;
      const blob = await buildCertificatePdf(
        {
          code: cert!.code,
          recipientName: cert!.recipient_name,
          contestTitle: cert!.contest_title,
          rank: cert!.rank,
          score: cert!.score,
          totalPoints: cert!.total_points,
          issuedAt: cert!.issued_at,
        },
        verifyUrl,
      );
      downloadBlob(blob, `${cert!.code}.pdf`);
      toast.success("Certificate downloaded!");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to issue certificate");
    } finally {
      setIssuingCert(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading contest…
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="text-muted-foreground">Contest not found.</p>
          <Link to="/contest" className="text-primary underline">Back to Contests</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-4 flex items-center justify-between">
            <BackButton />
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                contest.status === "live"
                  ? "border-[hsl(var(--success))]/50 text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 animate-pulse"
                  : contest.status === "upcoming"
                  ? "border-primary/50 text-primary bg-primary/10"
                  : "border-muted text-muted-foreground",
              )}
            >
              {contest.status === "live" ? "🔴 LIVE" : contest.status === "upcoming" ? "⏰ Upcoming" : "✅ Ended"}
            </Badge>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-primary/5 backdrop-blur-sm p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-[hsl(280,65%,60%)] bg-clip-text text-transparent">
                  {contest.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">{contest.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {contest.duration_minutes} min</span>
                  <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4" /> {contest.total_points} pts</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {regCount} registered</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {contest.status !== "ended" && (
                  <div className="flex gap-2">
                    {[
                      { label: "D", value: countdown.days },
                      { label: "H", value: countdown.hours },
                      { label: "M", value: countdown.minutes },
                      { label: "S", value: countdown.seconds },
                    ].map((b) => (
                      <div key={b.label} className="px-3 py-2 rounded-lg border border-border/50 bg-background/40 backdrop-blur-sm min-w-[54px] text-center">
                        <div className="text-xl font-bold text-primary">{String(b.value).padStart(2, "0")}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{b.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  {!registered && contest.status !== "ended" && (
                    <Button onClick={register} size="sm">
                      <Zap className="h-4 w-4 mr-1.5" /> Register
                    </Button>
                  )}
                  {contest.status === "ended" && (
                    <Button onClick={issueCertificate} size="sm" disabled={issuingCert}>
                      {issuingCert ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Trophy className="h-4 w-4 mr-1.5" />}
                      Claim Certificate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            {/* Editor + problem */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              {problems.length > 0 ? (
                <>
                  <div className="border-b border-border/50 p-3 flex flex-wrap items-center gap-2">
                    {problems.map((p, idx) => (
                      <button
                        key={p.id}
                        onClick={() => setActiveIdx(idx)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          activeIdx === idx
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/50 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Q{idx + 1} • {p.points}pts
                      </button>
                    ))}
                  </div>

                  {activeProblem?.problems && (
                    <Tabs defaultValue="problem" className="p-0">
                      <TabsList className="rounded-none border-b border-border/50 w-full justify-start bg-transparent">
                        <TabsTrigger value="problem">Problem</TabsTrigger>
                        <TabsTrigger value="editor">Editor</TabsTrigger>
                        <TabsTrigger value="result">Result</TabsTrigger>
                      </TabsList>

                      <TabsContent value="problem" className="p-5 max-h-[60vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-2">{activeProblem.problems.title}</h2>
                        <div className="flex gap-2 mb-3">
                          <Badge variant="outline">{activeProblem.problems.difficulty}</Badge>
                          <Badge variant="secondary">{activeProblem.problems.topic}</Badge>
                        </div>
                        <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap text-muted-foreground">
                          {activeProblem.problems.description}
                        </div>
                      </TabsContent>

                      <TabsContent value="editor" className="p-0">
                        <div className="flex items-center justify-between p-3 border-b border-border/50">
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-44 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {LANG_OPTIONS.map((l) => (
                                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => runOrSubmit("run")} disabled={running || submitting}>
                              {running ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Play className="h-3.5 w-3.5 mr-1.5" />}
                              Run
                            </Button>
                            <Button size="sm" onClick={() => runOrSubmit("submit")} disabled={running || submitting || contest.status !== "live"}>
                              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Send className="h-3.5 w-3.5 mr-1.5" />}
                              Submit
                            </Button>
                          </div>
                        </div>
                        <Editor
                          height="60vh"
                          language={LANG_OPTIONS.find((l) => l.value === language)?.monaco}
                          theme={resolvedTheme === "dark" ? "vs-dark" : "vs-light"}
                          value={code}
                          onChange={(v) => setCode(v ?? "")}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      </TabsContent>

                      <TabsContent value="result" className="p-5 max-h-[60vh] overflow-y-auto">
                        {!lastResult ? (
                          <p className="text-sm text-muted-foreground">Run or submit your code to see results.</p>
                        ) : (
                          <ResultPanel result={lastResult} />
                        )}
                      </TabsContent>
                    </Tabs>
                  )}
                </>
              ) : (
                <CardContent className="p-12 text-center text-muted-foreground">
                  No problems attached to this contest yet.
                </CardContent>
              )}
            </Card>

            {/* Live leaderboard */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-fit sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-[hsl(var(--warning))]" />
                    Live Leaderboard
                  </span>
                  {myRank && (
                    <Badge variant="outline" className="text-xs">
                      You: #{myRank} • {myScore}pts
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[70vh] overflow-y-auto">
                <AnimatePresence initial={false}>
                  {leaderboard.length === 0 && (
                    <p className="text-xs text-muted-foreground py-6 text-center">No submissions yet. Be the first!</p>
                  )}
                  {leaderboard.slice(0, 25).map((r, idx) => (
                    <motion.div
                      key={r.user_id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-background/30",
                        r.user_id === user?.id && "border-primary/40 bg-primary/5",
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <RankBadge rank={idx + 1} />
                        <span className="text-sm font-medium truncate">{r.full_name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-primary">{r.total_score}</div>
                        <div className="text-[10px] text-muted-foreground">{r.solved} solved</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-4 w-4 text-[hsl(45,95%,60%)]" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-[hsl(0,0%,75%)]" />;
  if (rank === 3) return <Medal className="h-4 w-4 text-[hsl(25,75%,55%)]" />;
  return <span className="text-xs font-mono text-muted-foreground w-4 text-center">{rank}</span>;
}

function ResultPanel({ result }: { result: any }) {
  const verdict = result.verdict ?? (result.passedCount === result.totalCount ? "Accepted" : "Wrong Answer");
  const passed = result.passedCount ?? 0;
  const total = result.totalCount ?? (result.results?.length ?? 0);
  return (
    <div className="space-y-3">
      <div className={cn(
        "flex items-center gap-2 p-3 rounded-lg border",
        verdict === "Accepted"
          ? "border-[hsl(var(--success))]/40 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
          : "border-destructive/40 bg-destructive/10 text-destructive",
      )}>
        {verdict === "Accepted" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        <span className="font-semibold">{verdict}</span>
        <span className="text-xs opacity-80 ml-auto">{passed}/{total} test cases</span>
      </div>
      {Array.isArray(result.results) && result.results.slice(0, 5).map((t: any, i: number) => (
        <div key={i} className="text-xs font-mono p-3 rounded-lg bg-secondary/40 border border-border/40">
          <div className={cn("font-semibold mb-1", t.passed ? "text-[hsl(var(--success))]" : "text-destructive")}>
            Test {i + 1}: {t.passed ? "Passed" : "Failed"}
          </div>
          {!t.isHidden && (
            <>
              <div><span className="text-muted-foreground">Input:</span> {t.input}</div>
              <div><span className="text-muted-foreground">Expected:</span> {t.expectedOutput}</div>
              <div><span className="text-muted-foreground">Got:</span> {t.actualOutput || t.error || "—"}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
