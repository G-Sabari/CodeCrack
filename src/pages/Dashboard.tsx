import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Trophy,
  ArrowRight,
  BookOpen,
  Building2,
  AlertTriangle,
} from "lucide-react";

const userStats = {
  totalSolved: 47,
  totalProblems: 500,
  streak: 12,
  easySolved: 25,
  easyTotal: 150,
  mediumSolved: 18,
  mediumTotal: 250,
  hardSolved: 4,
  hardTotal: 100,
};

const weakTopics = [
  { name: "Dynamic Programming", solved: 2, total: 45, percentage: 4 },
  { name: "Graphs", solved: 3, total: 40, percentage: 8 },
  { name: "Trees", solved: 5, total: 35, percentage: 14 },
];

const recentProblems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", status: "solved", date: "Today" },
  { id: 2, title: "Reverse Linked List", difficulty: "Easy", status: "solved", date: "Today" },
  { id: 3, title: "Valid Parentheses", difficulty: "Easy", status: "attempted", date: "Yesterday" },
  { id: 4, title: "Merge Two Sorted Lists", difficulty: "Easy", status: "solved", date: "Yesterday" },
  { id: 5, title: "Binary Tree Level Order", difficulty: "Medium", status: "attempted", date: "2 days ago" },
];

const companyReadiness = [
  { name: "TCS", readiness: 72 },
  { name: "Infosys", readiness: 65 },
  { name: "Zoho", readiness: 45 },
  { name: "Amazon", readiness: 35 },
];

const dailyGoal = {
  target: 3,
  completed: 2,
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress and stay on top of your interview preparation
            </p>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Solved</span>
              </div>
              <div className="text-3xl font-bold">{userStats.totalSolved}</div>
              <div className="text-sm text-muted-foreground mt-1">
                of {userStats.totalProblems} problems
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--warning))]/10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-[hsl(var(--warning))]" />
                </div>
                <span className="text-sm text-muted-foreground">Streak</span>
              </div>
              <div className="text-3xl font-bold">{userStats.streak}</div>
              <div className="text-sm text-muted-foreground mt-1">days in a row</div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-[hsl(var(--success))]" />
                </div>
                <span className="text-sm text-muted-foreground">Daily Goal</span>
              </div>
              <div className="text-3xl font-bold">
                {dailyGoal.completed}/{dailyGoal.target}
              </div>
              <div className="text-sm text-muted-foreground mt-1">problems today</div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Progress</span>
              </div>
              <div className="text-3xl font-bold">
                {Math.round((userStats.totalSolved / userStats.totalProblems) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">overall completion</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Difficulty Breakdown */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-semibold text-lg mb-6">Difficulty Breakdown</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[hsl(var(--success))] font-medium">Easy</span>
                      <span className="text-sm text-muted-foreground">
                        {userStats.easySolved} / {userStats.easyTotal}
                      </span>
                    </div>
                    <Progress
                      value={(userStats.easySolved / userStats.easyTotal) * 100}
                      className="h-3 bg-[hsl(var(--success))]/10"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[hsl(var(--warning))] font-medium">Medium</span>
                      <span className="text-sm text-muted-foreground">
                        {userStats.mediumSolved} / {userStats.mediumTotal}
                      </span>
                    </div>
                    <Progress
                      value={(userStats.mediumSolved / userStats.mediumTotal) * 100}
                      className="h-3 bg-[hsl(var(--warning))]/10"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-destructive font-medium">Hard</span>
                      <span className="text-sm text-muted-foreground">
                        {userStats.hardSolved} / {userStats.hardTotal}
                      </span>
                    </div>
                    <Progress
                      value={(userStats.hardSolved / userStats.hardTotal) * 100}
                      className="h-3 bg-destructive/10"
                    />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg">Recent Activity</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/problems">View All</Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentProblems.map((problem) => (
                    <Link
                      key={problem.id}
                      to={`/problems/${problem.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {problem.status === "solved" ? (
                          <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                        ) : (
                          <Clock className="h-5 w-5 text-[hsl(var(--warning))]" />
                        )}
                        <span className="font-medium">{problem.title}</span>
                        <Badge
                          variant="outline"
                          className={
                            problem.difficulty === "Easy"
                              ? "text-[hsl(var(--success))] border-[hsl(var(--success))]/30"
                              : problem.difficulty === "Medium"
                              ? "text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30"
                              : "text-destructive border-destructive/30"
                          }
                        >
                          {problem.difficulty}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{problem.date}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Weak Topics */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />
                  <h2 className="font-semibold text-lg">Weak Topics</h2>
                </div>
                <div className="space-y-4">
                  {weakTopics.map((topic) => (
                    <div key={topic.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{topic.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {topic.solved}/{topic.total}
                        </span>
                      </div>
                      <Progress value={topic.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/problems?topic=dp">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Practice Weak Areas
                  </Link>
                </Button>
              </div>

              {/* Company Readiness */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg">Company Readiness</h2>
                </div>
                <div className="space-y-4">
                  {companyReadiness.map((company) => (
                    <div key={company.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{company.name}</span>
                        <span className="text-xs text-primary font-medium">
                          {company.readiness}%
                        </span>
                      </div>
                      <Progress value={company.readiness} className="h-2" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/companies">
                    View All Companies
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/problems?random=true">
                      <Target className="h-4 w-4 mr-2" />
                      Random Problem
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/learning-path">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Continue Learning Path
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
