import { Link } from "react-router-dom";
import { BackButton } from "@/components/ui/back-button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  Trophy,
  ArrowRight,
  BookOpen,
  Building2,
  Code,
  Calculator,
  FileText,
  Award,
  Zap,
  Sparkles,
} from "lucide-react";
import { GlobalSearch } from "@/components/dashboard/GlobalSearch";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { stats, loading } = useDashboardStats();
  const { user } = useAuth();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  const dailyPct = Math.min(100, Math.round((stats.dailyGoal.completed / stats.dailyGoal.target) * 100));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <BackButton />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{greeting}, {name} 👋</h1>
                <p className="text-muted-foreground">
                  Your live interview-prep dashboard.
                </p>
              </div>
              <GlobalSearch />
            </div>
          </div>

          {/* Quick Access */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link to="/problems"><Code className="h-4 w-4 mr-2" />Practice Problems</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/aptitude"><Calculator className="h-4 w-4 mr-2" />Aptitude</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/pyq-database"><FileText className="h-4 w-4 mr-2" />PYQ Database</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/companies"><Building2 className="h-4 w-4 mr-2" />Companies</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/learning-path"><BookOpen className="h-4 w-4 mr-2" />Roadmaps</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/certificates"><Award className="h-4 w-4 mr-2" />Certificates</Link>
            </Button>
          </div>

          {/* Top stat grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              loading={loading}
              icon={CheckCircle2}
              iconClass="text-primary bg-primary/10"
              label="Problems Solved"
              value={stats.problemsSolved}
              hint={`${stats.problemsAttempted} attempted`}
            />
            <StatCard
              loading={loading}
              icon={Calculator}
              iconClass="text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10"
              label="Quizzes Taken"
              value={stats.quizzesTaken}
              hint={`${stats.quizAccuracy}% accuracy`}
            />
            <StatCard
              loading={loading}
              icon={Award}
              iconClass="text-emerald-500 bg-emerald-500/10"
              label="Certificates"
              value={stats.certificatesEarned}
              hint={stats.certificatesPending ? `${stats.certificatesPending} pending` : "approved"}
            />
            <StatCard
              loading={loading}
              icon={FileText}
              iconClass="text-purple-500 bg-purple-500/10"
              label="Resume Analyses"
              value={stats.resumeAnalyses}
              hint="ATS reports run"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              loading={loading}
              icon={Flame}
              iconClass="text-orange-500 bg-orange-500/10"
              label="Day Streak"
              value={stats.streak}
              hint="days active"
            />
            <StatCard
              loading={loading}
              icon={Zap}
              iconClass="text-yellow-500 bg-yellow-500/10"
              label="XP"
              value={stats.xp}
              hint="earned so far"
            />
            <StatCard
              loading={loading}
              icon={TrendingUp}
              iconClass="text-primary bg-primary/10"
              label="This Week"
              value={stats.weeklyActivity}
              hint="activities"
            />
            <StatCard
              loading={loading}
              icon={Trophy}
              iconClass="text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10"
              label="This Month"
              value={stats.monthlyActivity}
              hint="activities"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Goal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Daily Goal
                  </CardTitle>
                  <CardDescription>
                    Complete {stats.dailyGoal.target} activities today to keep your streak alive.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-bold">
                      {stats.dailyGoal.completed}/{stats.dailyGoal.target}
                    </span>
                    <span className="text-sm text-muted-foreground">{dailyPct}%</span>
                  </div>
                  <Progress value={dailyPct} className="h-2" />
                </CardContent>
              </Card>

              {/* Recent activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your live submissions and quiz history.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                      ))}
                    </div>
                  ) : stats.recent.length === 0 ? (
                    <EmptyState
                      title="No activity yet"
                      body="Solve a problem or take a quiz — it'll show up here in real time."
                      cta={{ to: "/problems", label: "Start a problem" }}
                    />
                  ) : (
                    <div className="space-y-2">
                      {stats.recent.map((item) => (
                        <div
                          key={`${item.kind}-${item.id}`}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {item.status === "success" ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                            ) : item.status === "pending" ? (
                              <Clock className="h-5 w-5 text-[hsl(var(--warning))] flex-shrink-0" />
                            ) : (
                              <Sparkles className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium truncate">{item.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="secondary" className="text-xs capitalize">{item.kind}</Badge>
                                <span className="text-xs text-muted-foreground truncate">{item.meta}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0 ml-3">
                            {formatDistanceToNow(new Date(item.at), { addSuffix: true })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Placement Readiness
                  </CardTitle>
                  <CardDescription>
                    Score based on problems solved, quiz accuracy, and certificates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const readiness = Math.min(
                      100,
                      Math.round(
                        stats.problemsSolved * 1.5 +
                          stats.quizAccuracy * 0.3 +
                          stats.certificatesEarned * 5,
                      ),
                    );
                    return (
                      <>
                        <div className="text-4xl font-bold mb-2">{readiness}%</div>
                        <Progress value={readiness} className="h-2 mb-3" />
                        <p className="text-sm text-muted-foreground">
                          {readiness < 30
                            ? "Just getting started — keep going!"
                            : readiness < 60
                            ? "Making solid progress."
                            : readiness < 85
                            ? "You're interview-ready for most companies."
                            : "You're placement-ready. 🎯"}
                        </p>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Continue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ContinueLink to="/problems" label="Solve next problem" icon={Code} />
                  <ContinueLink to="/aptitude" label="Take an aptitude quiz" icon={Calculator} />
                  <ContinueLink to="/resume-analyzer" label="Analyze your resume" icon={FileText} />
                  <ContinueLink to="/certificates" label="View my certificates" icon={Award} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({
  loading, icon: Icon, iconClass, label, value, hint,
}: {
  loading: boolean;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        {loading ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <div className="text-3xl font-bold">{value}</div>
        )}
        <div className="text-sm text-muted-foreground mt-1">{hint}</div>
      </CardContent>
    </Card>
  );
}

function ContinueLink({
  to, label, icon: Icon,
}: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 hover:border-primary/40 transition-colors group"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

function EmptyState({ title, body, cta }: { title: string; body: string; cta?: { to: string; label: string } }) {
  return (
    <div className="py-8 text-center">
      <p className="font-medium mb-1">{title}</p>
      <p className="text-sm text-muted-foreground mb-4">{body}</p>
      {cta && (
        <Button asChild size="sm">
          <Link to={cta.to}>{cta.label}</Link>
        </Button>
      )}
    </div>
  );
}
