import { Link } from "react-router-dom";
import { BackButton } from "@/components/ui/back-button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Code,
  Calculator,
  Users,
  MessageSquare,
  Brain,
  Zap,
  BarChart3,
} from "lucide-react";

// Overall user stats
const userStats = {
  totalSolved: 127,
  totalProblems: 870,
  streak: 12,
  codingSolved: 47,
  codingTotal: 500,
  aptitudeSolved: 45,
  aptitudeTotal: 270,
  behavioralPrepared: 25,
  behavioralTotal: 50,
  gdPrepared: 10,
  gdTotal: 50,
};

// Section-wise progress
const sectionProgress = [
  {
    name: "Coding",
    icon: Code,
    solved: 47,
    total: 500,
    color: "text-primary",
    bgColor: "bg-primary/10",
    path: "/problems",
    breakdown: {
      easy: { solved: 25, total: 150 },
      medium: { solved: 18, total: 250 },
      hard: { solved: 4, total: 100 },
    },
  },
  {
    name: "Aptitude",
    icon: Calculator,
    solved: 45,
    total: 270,
    color: "text-[hsl(var(--warning))]",
    bgColor: "bg-[hsl(var(--warning))]/10",
    path: "/aptitude",
    breakdown: {
      quantitative: { solved: 20, total: 150 },
      logical: { solved: 15, total: 80 },
      verbal: { solved: 10, total: 40 },
    },
  },
  {
    name: "HR Interview",
    icon: Users,
    solved: 25,
    total: 50,
    color: "text-[hsl(var(--success))]",
    bgColor: "bg-[hsl(var(--success))]/10",
    path: "/behavioral",
    breakdown: {
      prepared: 25,
      practiced: 15,
      mastered: 8,
    },
  },
  {
    name: "Group Discussion",
    icon: MessageSquare,
    solved: 10,
    total: 50,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    path: "/group-discussion",
    breakdown: {
      currentAffairs: { solved: 3, total: 15 },
      technology: { solved: 3, total: 15 },
      social: { solved: 2, total: 10 },
      abstract: { solved: 2, total: 10 },
    },
  },
];

const weakTopics = [
  { name: "Dynamic Programming", type: "Coding", solved: 2, total: 45, percentage: 4 },
  { name: "Graphs", type: "Coding", solved: 3, total: 40, percentage: 8 },
  { name: "Probability", type: "Aptitude", solved: 2, total: 15, percentage: 13 },
  { name: "Time & Work", type: "Aptitude", solved: 3, total: 18, percentage: 17 },
];

const recentActivity = [
  { id: 1, title: "Two Sum", type: "Coding", difficulty: "Easy", status: "solved", date: "Today" },
  { id: 2, title: "Percentages Quiz", type: "Aptitude", difficulty: "Medium", status: "solved", date: "Today" },
  { id: 3, title: "Tell me about yourself", type: "Behavioral", difficulty: "Easy", status: "practiced", date: "Yesterday" },
  { id: 4, title: "AI Replacing Jobs", type: "GD", difficulty: "Medium", status: "prepared", date: "Yesterday" },
  { id: 5, title: "Binary Tree Level Order", type: "Coding", difficulty: "Medium", status: "attempted", date: "2 days ago" },
];

const companyReadiness = [
  { name: "TCS", readiness: 78, category: "Service" },
  { name: "Infosys", readiness: 72, category: "Service" },
  { name: "Wipro", readiness: 80, category: "Service" },
  { name: "Zoho", readiness: 55, category: "Service" },
  { name: "Amazon", readiness: 35, category: "Product" },
  { name: "Microsoft", readiness: 40, category: "Product" },
];

const dailyGoal = {
  coding: { target: 2, completed: 1 },
  aptitude: { target: 5, completed: 3 },
  behavioral: { target: 1, completed: 1 },
};

const weeklyInsights = [
  { label: "Most Active Day", value: "Tuesday", icon: Calendar },
  { label: "Avg. Time/Problem", value: "12 mins", icon: Clock },
  { label: "Accuracy Rate", value: "76%", icon: Target },
  { label: "Problems This Week", value: "23", icon: TrendingUp },
];

export default function Dashboard() {
  const overallProgress = Math.round((userStats.totalSolved / userStats.totalProblems) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-4">
            <BackButton />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Your complete interview preparation progress at a glance
            </p>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total Progress</span>
                </div>
                <div className="text-3xl font-bold">{userStats.totalSolved}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  of {userStats.totalProblems} items completed
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-[hsl(var(--warning))]/10 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-[hsl(var(--warning))]" />
                  </div>
                  <span className="text-sm text-muted-foreground">Streak</span>
                </div>
                <div className="text-3xl font-bold">{userStats.streak}</div>
                <div className="text-sm text-muted-foreground mt-1">days in a row</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-[hsl(var(--success))]" />
                  </div>
                  <span className="text-sm text-muted-foreground">Daily Goal</span>
                </div>
                <div className="text-3xl font-bold">
                  {dailyGoal.coding.completed + dailyGoal.aptitude.completed + dailyGoal.behavioral.completed}/
                  {dailyGoal.coding.target + dailyGoal.aptitude.target + dailyGoal.behavioral.target}
                </div>
                <div className="text-sm text-muted-foreground mt-1">tasks today</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Readiness</span>
                </div>
                <div className="text-3xl font-bold">{overallProgress}%</div>
                <div className="text-sm text-muted-foreground mt-1">placement ready</div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Insights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {weeklyInsights.map((insight) => (
              <Card key={insight.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <insight.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{insight.value}</p>
                    <p className="text-xs text-muted-foreground">{insight.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Progress */}
            <div className="lg:col-span-2 space-y-8">
              {/* Section-wise Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Section-wise Progress
                  </CardTitle>
                  <CardDescription>
                    Your preparation progress across all interview areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {sectionProgress.map((section) => (
                      <div key={section.name} className="p-4 rounded-xl border border-border bg-card">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-lg ${section.bgColor} flex items-center justify-center`}>
                              <section.icon className={`h-5 w-5 ${section.color}`} />
                            </div>
                            <div>
                              <p className="font-semibold">{section.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {section.solved}/{section.total}
                              </p>
                            </div>
                          </div>
                          <span className={`text-lg font-bold ${section.color}`}>
                            {Math.round((section.solved / section.total) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={(section.solved / section.total) * 100}
                          className="h-2 mb-3"
                        />
                        <Button variant="ghost" size="sm" className="w-full" asChild>
                          <Link to={section.path}>
                            Continue Practice
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/problems">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {item.status === "solved" || item.status === "practiced" || item.status === "prepared" ? (
                            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                          ) : (
                            <Clock className="h-5 w-5 text-[hsl(var(--warning))]" />
                          )}
                          <div>
                            <span className="font-medium">{item.title}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  item.difficulty === "Easy"
                                    ? "text-[hsl(var(--success))] border-[hsl(var(--success))]/30"
                                    : item.difficulty === "Medium"
                                    ? "text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30"
                                    : "text-destructive border-destructive/30"
                                }
                              >
                                {item.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Company Readiness */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Company Readiness Score
                      </CardTitle>
                      <CardDescription>
                        Your preparation level for different companies
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/companies">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="service">
                    <TabsList className="mb-4">
                      <TabsTrigger value="service">Service Companies</TabsTrigger>
                      <TabsTrigger value="product">Product Companies</TabsTrigger>
                    </TabsList>
                    <TabsContent value="service">
                      <div className="grid md:grid-cols-2 gap-4">
                        {companyReadiness
                          .filter((c) => c.category === "Service")
                          .map((company) => (
                            <div key={company.name} className="p-4 rounded-lg border border-border">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{company.name}</span>
                                <span className="text-primary font-bold">{company.readiness}%</span>
                              </div>
                              <Progress value={company.readiness} className="h-2" />
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="product">
                      <div className="grid md:grid-cols-2 gap-4">
                        {companyReadiness
                          .filter((c) => c.category === "Product")
                          .map((company) => (
                            <div key={company.name} className="p-4 rounded-lg border border-border">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{company.name}</span>
                                <span className="text-primary font-bold">{company.readiness}%</span>
                              </div>
                              <Progress value={company.readiness} className="h-2" />
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Daily Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[hsl(var(--warning))]" />
                    Today's Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        <span className="text-sm">Coding Problems</span>
                      </div>
                      <span className="text-sm font-medium">
                        {dailyGoal.coding.completed}/{dailyGoal.coding.target}
                      </span>
                    </div>
                    <Progress
                      value={(dailyGoal.coding.completed / dailyGoal.coding.target) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-[hsl(var(--warning))]" />
                        <span className="text-sm">Aptitude Questions</span>
                      </div>
                      <span className="text-sm font-medium">
                        {dailyGoal.aptitude.completed}/{dailyGoal.aptitude.target}
                      </span>
                    </div>
                    <Progress
                      value={(dailyGoal.aptitude.completed / dailyGoal.aptitude.target) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[hsl(var(--success))]" />
                        <span className="text-sm">HR Practice</span>
                      </div>
                      <span className="text-sm font-medium">
                        {dailyGoal.behavioral.completed}/{dailyGoal.behavioral.target}
                      </span>
                    </div>
                    <Progress
                      value={(dailyGoal.behavioral.completed / dailyGoal.behavioral.target) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Weak Topics */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />
                    <CardTitle>Weak Topics</CardTitle>
                  </div>
                  <CardDescription>Focus on these areas to improve</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weakTopics.map((topic) => (
                      <div key={topic.name}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-sm font-medium">{topic.name}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {topic.type}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {topic.solved}/{topic.total}
                          </span>
                        </div>
                        <Progress value={topic.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link to="/problems?difficulty=medium">
                      <Brain className="h-4 w-4 mr-2" />
                      Practice Weak Areas
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/problems?random=true">
                      <Target className="h-4 w-4 mr-2" />
                      Random Coding Problem
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/aptitude">
                      <Calculator className="h-4 w-4 mr-2" />
                      Quick Aptitude Quiz
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/behavioral">
                      <Users className="h-4 w-4 mr-2" />
                      Practice HR Questions
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/group-discussion">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Prepare for GD
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/learning-path">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Continue Learning Path
                    </Link>
                  </Button>
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
