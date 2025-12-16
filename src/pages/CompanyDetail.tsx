import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Building2,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Code,
  Users,
  Briefcase,
  Calendar,
  Filter,
  ExternalLink,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample company data
const companyData: Record<string, {
  name: string;
  logo: string;
  type: "Service" | "Product";
  description: string;
  readiness: number;
  totalProblems: number;
  solvedProblems: number;
  avgDifficulty: string;
  focusTopics: string[];
  interviewRounds: { name: string; description: string; icon: React.ElementType }[];
  rejectionReasons: string[];
  recentTrends: string[];
  difficultyBreakdown: { easy: number; medium: number; hard: number };
}> = {
  zoho: {
    name: "Zoho",
    logo: "Z",
    type: "Service",
    description: "Zoho Corporation is an Indian technology company known for its suite of online productivity tools and SaaS applications.",
    readiness: 64,
    totalProblems: 156,
    solvedProblems: 42,
    avgDifficulty: "Medium",
    focusTopics: ["Arrays", "Strings", "Hashing"],
    interviewRounds: [
      { name: "Aptitude", description: "Logical reasoning, quantitative aptitude, verbal ability", icon: BookOpen },
      { name: "Coding Round", description: "2-3 DSA problems, 60-90 minutes", icon: Code },
      { name: "Technical Discussion", description: "Core CS concepts, project discussion", icon: Users },
      { name: "HR/Managerial", description: "Behavioral questions, salary negotiation", icon: Briefcase },
    ],
    rejectionReasons: [
      "Poor time complexity in coding round",
      "Unable to optimize brute force solution",
      "Weak fundamentals in DBMS/OS",
      "Lack of clarity in communication",
    ],
    recentTrends: ["Sliding Window problems", "String manipulation", "Matrix traversal"],
    difficultyBreakdown: { easy: 40, medium: 85, hard: 31 },
  },
  tcs: {
    name: "TCS",
    logo: "T",
    type: "Service",
    description: "Tata Consultancy Services is an Indian IT services and consulting company.",
    readiness: 72,
    totalProblems: 120,
    solvedProblems: 58,
    avgDifficulty: "Easy-Medium",
    focusTopics: ["Arrays", "Strings", "Basic Math"],
    interviewRounds: [
      { name: "TCS NQT", description: "Numerical ability, verbal, reasoning, programming logic", icon: BookOpen },
      { name: "Coding Round", description: "1-2 easy-medium problems", icon: Code },
      { name: "Technical Interview", description: "Resume-based, basic programming concepts", icon: Users },
      { name: "HR Interview", description: "Standard HR questions, location preference", icon: Briefcase },
    ],
    rejectionReasons: [
      "Low NQT score",
      "Incomplete coding solutions",
      "Poor communication skills",
      "Gaps in resume",
    ],
    recentTrends: ["Pattern printing", "Number series", "String operations"],
    difficultyBreakdown: { easy: 65, medium: 45, hard: 10 },
  },
  amazon: {
    name: "Amazon",
    logo: "A",
    type: "Product",
    description: "Amazon is a multinational technology company focusing on e-commerce, cloud computing, and AI.",
    readiness: 45,
    totalProblems: 280,
    solvedProblems: 67,
    avgDifficulty: "Medium-Hard",
    focusTopics: ["Trees", "Graphs", "Dynamic Programming", "System Design"],
    interviewRounds: [
      { name: "Online Assessment", description: "2 coding problems + work simulation", icon: Code },
      { name: "Phone Screen", description: "1 DSA problem with follow-ups", icon: Users },
      { name: "Onsite Loop", description: "4-5 rounds: Coding + System Design + LP", icon: Briefcase },
      { name: "Bar Raiser", description: "Behavioral + Leadership Principles deep dive", icon: Target },
    ],
    rejectionReasons: [
      "Couldn't handle follow-up questions",
      "Weak in Leadership Principles (LP)",
      "Poor system design fundamentals",
      "Time management issues in OA",
    ],
    recentTrends: ["BFS/DFS variations", "Heap problems", "Two pointer techniques"],
    difficultyBreakdown: { easy: 35, medium: 145, hard: 100 },
  },
  infosys: {
    name: "Infosys",
    logo: "I",
    type: "Service",
    description: "Infosys Limited is an Indian multinational IT services and consulting company.",
    readiness: 68,
    totalProblems: 98,
    solvedProblems: 44,
    avgDifficulty: "Easy",
    focusTopics: ["Arrays", "Strings", "Pattern Printing"],
    interviewRounds: [
      { name: "InfyTQ/Online Test", description: "Aptitude, puzzle solving, programming MCQs", icon: BookOpen },
      { name: "Coding Round", description: "3 simple coding problems", icon: Code },
      { name: "Technical Interview", description: "Basic concepts, project explanation", icon: Users },
      { name: "HR Interview", description: "General questions, relocation willingness", icon: Briefcase },
    ],
    rejectionReasons: [
      "Low aptitude scores",
      "Basic syntax errors in code",
      "Unclear project explanation",
      "Negative attitude",
    ],
    recentTrends: ["Basic array operations", "String reversal variants", "Simple recursion"],
    difficultyBreakdown: { easy: 58, medium: 32, hard: 8 },
  },
};

// Sample problems data
const problemsData = [
  { id: 1, title: "Two Sum", difficulty: "Easy", pattern: "Hashing", frequency: "🔴", year: 2024, solved: true },
  { id: 2, title: "Longest Substring Without Repeating", difficulty: "Medium", pattern: "Sliding Window", frequency: "🔴", year: 2024, solved: false },
  { id: 3, title: "Container With Most Water", difficulty: "Medium", pattern: "Two Pointer", frequency: "🟡", year: 2023, solved: true },
  { id: 4, title: "Valid Parentheses", difficulty: "Easy", pattern: "Stack", frequency: "🔴", year: 2024, solved: true },
  { id: 5, title: "Merge Intervals", difficulty: "Medium", pattern: "Sorting", frequency: "🟡", year: 2023, solved: false },
  { id: 6, title: "Binary Tree Level Order", difficulty: "Medium", pattern: "BFS", frequency: "🟡", year: 2024, solved: false },
  { id: 7, title: "Maximum Subarray", difficulty: "Easy", pattern: "DP", frequency: "🔴", year: 2024, solved: true },
  { id: 8, title: "Word Break", difficulty: "Hard", pattern: "DP", frequency: "🟢", year: 2022, solved: false },
  { id: 9, title: "LRU Cache", difficulty: "Hard", pattern: "Design", frequency: "🟡", year: 2023, solved: false },
  { id: 10, title: "Rotate Array", difficulty: "Easy", pattern: "Arrays", frequency: "🔴", year: 2024, solved: true },
];

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const [yearFilter, setYearFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");

  const company = companyData[id || ""] || companyData.zoho;

  const filteredProblems = problemsData.filter((problem) => {
    const matchesYear = yearFilter === "all" || problem.year.toString() === yearFilter;
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty.toLowerCase() === difficultyFilter;
    const matchesTopic = topicFilter === "all" || problem.pattern.toLowerCase().includes(topicFilter);
    return matchesYear && matchesDifficulty && matchesTopic;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-success bg-success/10";
      case "medium":
        return "text-warning bg-warning/10";
      case "hard":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/companies"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Companies
          </Link>

          {/* Company Header */}
          <div className="rounded-xl border border-border bg-card p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                  {company.logo}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold">{company.name}</h1>
                    <Badge variant="secondary">{company.type}</Badge>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">{company.description}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Your Readiness</div>
                  <div className="text-3xl font-bold text-primary">{company.readiness}%</div>
                </div>
                <Progress value={company.readiness} className="w-32 h-2" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold">{company.totalProblems}</div>
                <div className="text-sm text-muted-foreground">Total Problems</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{company.solvedProblems}</div>
                <div className="text-sm text-muted-foreground">Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{company.avgDifficulty}</div>
                <div className="text-sm text-muted-foreground">Avg Difficulty</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{company.interviewRounds.length}</div>
                <div className="text-sm text-muted-foreground">Interview Rounds</div>
              </div>
            </div>
          </div>

          {/* Focus This Week */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Focus This Week</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {company.focusTopics.map((topic) => (
                <Badge key={topic} className="bg-primary text-primary-foreground">
                  {topic}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Based on recent interview trends and your weak areas
            </p>
          </div>

          <Tabs defaultValue="problems" className="space-y-6">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="rounds">Interview Rounds</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            {/* Problems Tab */}
            <TabsContent value="problems" className="space-y-6">
              {/* Difficulty Breakdown */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-success font-medium">Easy</span>
                    <span className="text-2xl font-bold">{company.difficultyBreakdown.easy}</span>
                  </div>
                  <Progress value={75} className="h-2 bg-secondary [&>div]:bg-success" />
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-warning font-medium">Medium</span>
                    <span className="text-2xl font-bold">{company.difficultyBreakdown.medium}</span>
                  </div>
                  <Progress value={45} className="h-2 bg-secondary [&>div]:bg-warning" />
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-destructive font-medium">Hard</span>
                    <span className="text-2xl font-bold">{company.difficultyBreakdown.hard}</span>
                  </div>
                  <Progress value={20} className="h-2 bg-secondary [&>div]:bg-destructive" />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    <SelectItem value="array">Arrays</SelectItem>
                    <SelectItem value="string">Strings</SelectItem>
                    <SelectItem value="hash">Hashing</SelectItem>
                    <SelectItem value="dp">DP</SelectItem>
                    <SelectItem value="stack">Stack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Problems List */}
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Problem</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Difficulty</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Pattern</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden sm:table-cell">Frequency</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProblems.map((problem) => (
                      <tr key={problem.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          {problem.solved ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/problems/${problem.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {problem.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge variant="secondary" className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge variant="outline">{problem.pattern}</Badge>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-lg">
                          {problem.frequency}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                          {problem.year}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Interview Rounds Tab */}
            <TabsContent value="rounds" className="space-y-4">
              <div className="grid gap-4">
                {company.interviewRounds.map((round, index) => (
                  <div
                    key={round.name}
                    className="rounded-xl border border-border bg-card p-6 flex items-start gap-4"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <round.icon className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{round.name}</h3>
                      </div>
                      <p className="text-muted-foreground">{round.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service vs Product Expectation */}
              <div className="rounded-xl border border-border bg-card p-6 mt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {company.type === "Service" ? "Service Company" : "Product Company"} Interview Expectations
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  {company.type === "Service" ? (
                    <>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        Focus on basic DSA and problem-solving ability
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        Aptitude rounds are elimination rounds
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        Communication and teamwork valued highly
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        Be flexible about location preferences
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        Strong DSA fundamentals with optimal solutions expected
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        System design knowledge for experienced roles
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        Behavioral rounds focus on leadership principles
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        Expect follow-up questions on your solutions
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              {/* Recent Trends */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recent Interview Trends (Last 30 Days)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {company.recentTrends.map((trend) => (
                    <Badge key={trend} variant="secondary" className="py-1.5 px-3">
                      {trend}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Common Rejection Reasons */}
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Common Rejection Reasons
                </h3>
                <ul className="space-y-3">
                  {company.rejectionReasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-destructive">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preparation Tips */}
              <div className="rounded-xl border border-success/30 bg-success/5 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  How to Prepare
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-success">1.</span>
                    Complete all frequently asked (🔴) problems first
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">2.</span>
                    Focus on the top 3 topics highlighted above
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">3.</span>
                    Practice explaining your approach out loud
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">4.</span>
                    Review common mistakes before interviews
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
