import { useState } from "react";
import { Link } from "react-router-dom";
import { BackButton } from "@/components/ui/back-button";
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
    topics: ["Arrays Basics", "Strings Basics", "Pattern Printing", "Basic Math & Number Theory", "Time & Space Complexity"],
    problems: 28,
    completed: 12,
    status: "in-progress",
    dailyPlan: [
      { day: 1, title: "Arrays Introduction", description: "Learn array fundamentals + 4 easy problems", problems: 4, completed: 4 },
      { day: 2, title: "Array Operations", description: "Insertion, deletion, traversal + 4 problems", problems: 4, completed: 4 },
      { day: 3, title: "Strings Basics", description: "String manipulation & operations + 4 problems", problems: 4, completed: 4 },
      { day: 4, title: "Pattern Printing", description: "Star patterns & number patterns + 4 problems", problems: 4, completed: 0 },
      { day: 5, title: "Math Basics", description: "Prime, GCD, LCM, factorials + 4 problems", problems: 4, completed: 0 },
      { day: 6, title: "Mixed Revision", description: "Practice problems from all topics + 4 problems", problems: 4, completed: 0 },
      { day: 7, title: "Weekly Revision", description: "Mock test + weak topic revision", problems: 4, completed: 0 },
    ],
  },
  {
    week: 2,
    title: "Core DSA",
    topics: ["Searching & Sorting", "Recursion", "Linked List Basics", "Stack & Queue Basics"],
    problems: 28,
    completed: 0,
    status: "locked",
    dailyPlan: [
      { day: 8, title: "Linear & Binary Search", description: "Search algorithms + 4 problems", problems: 4, completed: 0 },
      { day: 9, title: "Sorting Algorithms", description: "Bubble, Selection, Insertion sort + 4 problems", problems: 4, completed: 0 },
      { day: 10, title: "Recursion Basics", description: "Understanding recursion + 4 problems", problems: 4, completed: 0 },
      { day: 11, title: "Linked List Operations", description: "Singly linked list basics + 4 problems", problems: 4, completed: 0 },
      { day: 12, title: "Stack Problems", description: "Stack implementation & problems + 4 problems", problems: 4, completed: 0 },
      { day: 13, title: "Queue Problems", description: "Queue implementation & problems + 4 problems", problems: 4, completed: 0 },
      { day: 14, title: "Weekly Revision", description: "Mock test + comprehensive revision", problems: 4, completed: 0 },
    ],
  },
  {
    week: 3,
    title: "Intermediate",
    topics: ["Hashing", "Sliding Window", "Two Pointer", "Trees Basics", "Binary Search Trees"],
    problems: 28,
    completed: 0,
    status: "locked",
    dailyPlan: [
      { day: 15, title: "Hashing Fundamentals", description: "HashMaps & frequency counting + 4 problems", problems: 4, completed: 0 },
      { day: 16, title: "Sliding Window", description: "Fixed & variable window + 4 problems", problems: 4, completed: 0 },
      { day: 17, title: "Two Pointer", description: "Two pointer techniques + 4 problems", problems: 4, completed: 0 },
      { day: 18, title: "Trees Basics", description: "Binary tree traversals + 4 problems", problems: 4, completed: 0 },
      { day: 19, title: "BST Operations", description: "BST insert, search, delete + 4 problems", problems: 4, completed: 0 },
      { day: 20, title: "Tree Problems", description: "Mixed tree problems + 4 problems", problems: 4, completed: 0 },
      { day: 21, title: "Weekly Revision", description: "Mock test + topic-wise revision", problems: 4, completed: 0 },
    ],
  },
  {
    week: 4,
    title: "Interview Level",
    topics: ["Graph Basics", "Dynamic Programming Basics", "Backtracking", "Greedy Algorithms", "Mock Interviews"],
    problems: 28,
    completed: 0,
    status: "locked",
    dailyPlan: [
      { day: 22, title: "Graph Basics", description: "Graph representation & BFS/DFS + 4 problems", problems: 4, completed: 0 },
      { day: 23, title: "DP Introduction", description: "Understanding DP patterns + 4 problems", problems: 4, completed: 0 },
      { day: 24, title: "DP Practice", description: "Classic DP problems + 4 problems", problems: 4, completed: 0 },
      { day: 25, title: "Backtracking", description: "Backtracking fundamentals + 4 problems", problems: 4, completed: 0 },
      { day: 26, title: "Greedy Algorithms", description: "Greedy approach + 4 problems", problems: 4, completed: 0 },
      { day: 27, title: "Mock Interview 1", description: "Full mock interview simulation", problems: 4, completed: 0 },
      { day: 28, title: "Mock Interview 2", description: "Final mock + HR preparation", problems: 4, completed: 0 },
      { day: 29, title: "Revision Day 1", description: "Weak topics revision + practice", problems: 0, completed: 0 },
      { day: 30, title: "Revision Day 2", description: "Final revision + confidence building", problems: 0, completed: 0 },
    ],
  },
];

const productPath = [
  {
    week: 1,
    title: "Arrays & Strings Mastery",
    topics: ["Two Pointer", "Sliding Window", "Prefix Sum", "Matrix", "Kadane's Algorithm"],
    problems: 28,
    completed: 8,
    status: "in-progress",
    dailyPlan: [
      { day: 1, title: "Two Pointer Basics", description: "Two pointer fundamentals + 4 problems", problems: 4, completed: 4 },
      { day: 2, title: "Two Pointer Advanced", description: "Advanced two pointer + 4 problems", problems: 4, completed: 4 },
      { day: 3, title: "Sliding Window Fixed", description: "Fixed size window + 4 problems", problems: 4, completed: 0 },
      { day: 4, title: "Sliding Window Variable", description: "Variable size window + 4 problems", problems: 4, completed: 0 },
      { day: 5, title: "Prefix Sum", description: "Prefix sum techniques + 4 problems", problems: 4, completed: 0 },
      { day: 6, title: "Matrix Problems", description: "Matrix traversal & rotation + 4 problems", problems: 4, completed: 0 },
      { day: 7, title: "Weekly Contest", description: "Timed mock contest + revision", problems: 4, completed: 0 },
    ],
  },
  {
    week: 2,
    title: "Linked Lists & Trees",
    topics: ["Linked List Advanced", "Binary Trees", "BST", "Tree Traversals", "Level Order"],
    problems: 28,
    completed: 0,
    status: "locked",
    dailyPlan: [
      { day: 8, title: "Linked List Advanced", description: "Cycle detection, reversal + 4 problems", problems: 4, completed: 0 },
      { day: 9, title: "Doubly & Circular LL", description: "Advanced linked lists + 4 problems", problems: 4, completed: 0 },
      { day: 10, title: "Binary Tree Basics", description: "Tree traversals (DFS) + 4 problems", problems: 4, completed: 0 },
      { day: 11, title: "Tree Level Order", description: "BFS on trees + 4 problems", problems: 4, completed: 0 },
      { day: 12, title: "BST Operations", description: "Insert, delete, search + 4 problems", problems: 4, completed: 0 },
      { day: 13, title: "Tree Properties", description: "Height, diameter, balanced + 4 problems", problems: 4, completed: 0 },
      { day: 14, title: "Weekly Contest", description: "Timed mock contest + revision", problems: 4, completed: 0 },
    ],
  },
  {
    week: 3,
    title: "Graphs & Advanced Trees",
    topics: ["Graph Traversals", "Shortest Paths", "Union Find", "Tries", "Topological Sort"],
    problems: 28,
    completed: 0,
    status: "locked",
    dailyPlan: [
      { day: 15, title: "Graph Representation", description: "BFS & DFS basics + 4 problems", problems: 4, completed: 0 },
      { day: 16, title: "Graph Applications", description: "Connected components, cycles + 4 problems", problems: 4, completed: 0 },
      { day: 17, title: "Shortest Paths", description: "Dijkstra, Bellman-Ford + 4 problems", problems: 4, completed: 0 },
      { day: 18, title: "Union Find", description: "DSU basics & applications + 4 problems", problems: 4, completed: 0 },
      { day: 19, title: "Topological Sort", description: "DAG ordering + 4 problems", problems: 4, completed: 0 },
      { day: 20, title: "Tries", description: "Trie implementation + 4 problems", problems: 4, completed: 0 },
      { day: 21, title: "Weekly Contest", description: "Timed mock contest + revision", problems: 4, completed: 0 },
    ],
  },
  {
    week: 4,
    title: "Dynamic Programming & Mock",
    topics: ["1D DP", "2D DP", "DP on Strings", "Backtracking", "Mock Interviews"],
    problems: 28,
    completed: 0,
    status: "locked",
    dailyPlan: [
      { day: 22, title: "1D DP Basics", description: "Fibonacci, climbing stairs + 4 problems", problems: 4, completed: 0 },
      { day: 23, title: "1D DP Advanced", description: "LIS, house robber + 4 problems", problems: 4, completed: 0 },
      { day: 24, title: "2D DP", description: "Grid problems, LCS + 4 problems", problems: 4, completed: 0 },
      { day: 25, title: "DP on Strings", description: "Edit distance, palindromes + 4 problems", problems: 4, completed: 0 },
      { day: 26, title: "Backtracking", description: "N-Queens, subsets + 4 problems", problems: 4, completed: 0 },
      { day: 27, title: "Mock Interview 1", description: "Full 2-hour mock interview", problems: 4, completed: 0 },
      { day: 28, title: "Mock Interview 2", description: "System design + behavioral", problems: 4, completed: 0 },
      { day: 29, title: "Revision Day 1", description: "Weak topics revision", problems: 0, completed: 0 },
      { day: 30, title: "Final Revision", description: "Complete revision + tips", problems: 0, completed: 0 },
    ],
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

interface DailyPlan {
  day: number;
  title: string;
  description: string;
  problems: number;
  completed: number;
}

interface WeekData {
  week: number;
  title: string;
  topics: string[];
  problems: number;
  completed: number;
  status: string;
  dailyPlan: DailyPlan[];
}

function DayCard({ day }: { day: DailyPlan }) {
  const isCompleted = day.completed === day.problems && day.problems > 0;
  const inProgress = day.completed > 0 && day.completed < day.problems;
  
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border transition-all",
      isCompleted 
        ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5" 
        : inProgress
        ? "border-primary/30 bg-primary/5"
        : "border-border bg-card/50"
    )}>
      <div className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
        isCompleted 
          ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
          : inProgress
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      )}>
        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : day.day}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{day.title}</p>
        <p className="text-xs text-muted-foreground truncate">{day.description}</p>
      </div>
      {day.problems > 0 && (
        <div className="text-xs text-muted-foreground shrink-0">
          {day.completed}/{day.problems}
        </div>
      )}
    </div>
  );
}

function WeekCard({ week, data, expanded, onToggle }: { 
  week: number; 
  data: WeekData; 
  expanded: boolean;
  onToggle: () => void;
}) {
  const isLocked = data.status === "locked";
  const isCompleted = data.completed === data.problems;
  const progress = (data.completed / data.problems) * 100;

  return (
    <div
      className={cn(
        "rounded-xl border transition-all",
        isLocked
          ? "border-border bg-card/50 opacity-60"
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      <div className="p-6">
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

        <div className="flex gap-2">
          {!isLocked && (
            <Button
              variant={data.status === "in-progress" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              asChild
            >
              <Link to="/problems">
                {data.status === "in-progress" ? "Continue" : "Start"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
          {!isLocked && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="shrink-0"
            >
              {expanded ? "Hide Plan" : "View Daily Plan"}
            </Button>
          )}
        </div>
      </div>

      {/* Daily Plan Expansion */}
      {expanded && !isLocked && (
        <div className="border-t border-border p-4 bg-muted/30">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Daily Plan (Days {data.dailyPlan[0]?.day}-{data.dailyPlan[data.dailyPlan.length - 1]?.day})
          </h4>
          <div className="space-y-2">
            {data.dailyPlan.map((day) => (
              <DayCard key={day.day} day={day} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LearningPath() {
  const [activeTrack, setActiveTrack] = useState("service");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const currentPath = activeTrack === "service" ? servicePath : productPath;

  const totalProblems = currentPath.reduce((acc, w) => acc + w.problems, 0);
  const completedProblems = currentPath.reduce((acc, w) => acc + w.completed, 0);
  const overallProgress = Math.round((completedProblems / totalProblems) * 100);

  const handleToggleWeek = (weekNum: number) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum);
  };

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
            <Tabs value={activeTrack} onValueChange={(v) => { setActiveTrack(v); setExpandedWeek(null); }}>
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
          <div className="grid md:grid-cols-2 gap-6">
            {currentPath.map((weekData, idx) => (
              <WeekCard 
                key={idx} 
                week={idx + 1} 
                data={weekData} 
                expanded={expandedWeek === idx + 1}
                onToggle={() => handleToggleWeek(idx + 1)}
              />
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
