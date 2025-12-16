import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Circle,
  Lock,
  Clock,
  Target,
  BookOpen,
  ArrowRight,
  Calendar,
  TrendingUp,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const servicePath = [
  {
    week: 1,
    title: "Foundation",
    topics: ["Arrays Basics", "Strings", "Pattern Printing", "Basic Math"],
    problems: 15,
    completed: 12,
    status: "in-progress",
  },
  {
    week: 2,
    title: "Core Data Structures",
    topics: ["Hashing", "Linked Lists", "Stack", "Queue"],
    problems: 20,
    completed: 0,
    status: "locked",
  },
  {
    week: 3,
    title: "Recursion & Sorting",
    topics: ["Recursion Basics", "Sorting Algorithms", "Binary Search"],
    problems: 18,
    completed: 0,
    status: "locked",
  },
  {
    week: 4,
    title: "Interview Prep",
    topics: ["SQL Basics", "OOPs Concepts", "Mock Tests", "HR Prep"],
    problems: 15,
    completed: 0,
    status: "locked",
  },
];

const productPath = [
  {
    week: 1,
    title: "Arrays & Strings Mastery",
    topics: ["Two Pointer", "Sliding Window", "Prefix Sum", "Matrix"],
    problems: 25,
    completed: 8,
    status: "in-progress",
  },
  {
    week: 2,
    title: "Linked Lists & Trees",
    topics: ["Linked List Advanced", "Binary Trees", "BST", "Tree Traversals"],
    problems: 25,
    completed: 0,
    status: "locked",
  },
  {
    week: 3,
    title: "Graphs & Advanced Trees",
    topics: ["Graph Traversals", "Shortest Paths", "Union Find", "Tries"],
    problems: 25,
    completed: 0,
    status: "locked",
  },
  {
    week: 4,
    title: "Dynamic Programming",
    topics: ["1D DP", "2D DP", "DP on Strings", "DP on Trees"],
    problems: 30,
    completed: 0,
    status: "locked",
  },
  {
    week: 5,
    title: "Advanced Topics",
    topics: ["Greedy", "Bit Manipulation", "Heap", "Backtracking"],
    problems: 25,
    completed: 0,
    status: "locked",
  },
  {
    week: 6,
    title: "System Design & Mock",
    topics: ["LLD Basics", "HLD Overview", "Mock Interviews", "Behavioral"],
    problems: 15,
    completed: 0,
    status: "locked",
  },
];

const plans = [
  {
    duration: "30 Days",
    pace: "Intense",
    problemsPerDay: 4,
    target: "Service Companies",
    description: "Fast-paced preparation for upcoming placements",
  },
  {
    duration: "60 Days",
    pace: "Balanced",
    problemsPerDay: 3,
    target: "Service + Product",
    description: "Comprehensive preparation with revision time",
  },
  {
    duration: "90 Days",
    pace: "Thorough",
    problemsPerDay: 2,
    target: "Product Companies",
    description: "Deep preparation with focus on hard problems",
  },
];

function WeekCard({ week, data }: { week: number; data: typeof servicePath[0] }) {
  const isLocked = data.status === "locked";
  const isCompleted = data.completed === data.problems;
  const progress = (data.completed / data.problems) * 100;

  return (
    <div
      className={cn(
        "rounded-xl border p-6 transition-all",
        isLocked
          ? "border-border bg-card/50 opacity-60"
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center font-bold",
              isCompleted
                ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
                : isLocked
                ? "bg-muted text-muted-foreground"
                : "bg-primary/10 text-primary"
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : isLocked ? (
              <Lock className="h-5 w-5" />
            ) : (
              week
            )}
          </div>
          <div>
            <h3 className="font-semibold">Week {week}</h3>
            <p className="text-sm text-muted-foreground">{data.title}</p>
          </div>
        </div>
        {data.status === "in-progress" && (
          <Badge className="bg-primary/10 text-primary border-primary/30">
            In Progress
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {data.topics.map((topic) => (
          <Badge key={topic} variant="secondary" className="text-xs">
            {topic}
          </Badge>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {data.completed}/{data.problems} problems
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {!isLocked && (
        <Button
          variant={data.status === "in-progress" ? "default" : "outline"}
          size="sm"
          className="w-full"
          asChild
        >
          <Link to="/problems">
            {data.status === "in-progress" ? "Continue" : "Start"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
}

export default function LearningPath() {
  const [activeTrack, setActiveTrack] = useState("service");
  const currentPath = activeTrack === "service" ? servicePath : productPath;

  const totalProblems = currentPath.reduce((acc, w) => acc + w.problems, 0);
  const completedProblems = currentPath.reduce((acc, w) => acc + w.completed, 0);
  const overallProgress = Math.round((completedProblems / totalProblems) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Learning Path</h1>
            <p className="text-muted-foreground">
              Follow a structured roadmap to ace your coding interviews
            </p>
          </div>

          {/* Plan Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.duration}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-bold text-lg">{plan.duration}</span>
                  <Badge variant="secondary">{plan.pace}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    <Target className="h-4 w-4 inline mr-1" />
                    {plan.target}
                  </span>
                  <span className="text-primary font-medium">
                    {plan.problemsPerDay}/day
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Track Selection */}
          <div className="mb-8">
            <Tabs value={activeTrack} onValueChange={setActiveTrack}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <TabsList className="bg-card">
                  <TabsTrigger value="service" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    Service Track
                  </TabsTrigger>
                  <TabsTrigger value="product" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Product Track
                  </TabsTrigger>
                </TabsList>

                {/* Overall Progress */}
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Overall: </span>
                    <span className="font-semibold text-primary">{overallProgress}%</span>
                  </div>
                  <div className="w-32">
                    <Progress value={overallProgress} className="h-2" />
                  </div>
                </div>
              </div>
            </Tabs>
          </div>

          {/* Week Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPath.map((weekData, idx) => (
              <WeekCard key={idx} week={idx + 1} data={weekData} />
            ))}
          </div>

          {/* Tips Section */}
          <div className="mt-12 rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Tips for Success
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
                <div>
                  <p className="font-medium">Understand before coding</p>
                  <p className="text-sm text-muted-foreground">
                    Read the explanation first. Focus on the thought process.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
                <div>
                  <p className="font-medium">Practice consistently</p>
                  <p className="text-sm text-muted-foreground">
                    Solve 2-3 problems daily rather than 10 in one day.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
                <div>
                  <p className="font-medium">Review weak topics</p>
                  <p className="text-sm text-muted-foreground">
                    Schedule weekly revision for topics you struggled with.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
                <div>
                  <p className="font-medium">Simulate interviews</p>
                  <p className="text-sm text-muted-foreground">
                    Use the AI mentor to practice explaining your approach.
                  </p>
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
