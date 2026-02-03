import { useState } from "react";
import { Link } from "react-router-dom";
import { BackButton } from "@/components/ui/back-button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Building2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const topics = [
  "All Topics",
  "Arrays",
  "Strings",
  "Hashing",
  "Recursion",
  "Linked List",
  "Stack",
  "Queue",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Sliding Window",
  "Two Pointer",
  "Bit Manipulation",
];

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    company: "Amazon",
    frequency: "high",
    solved: true,
    pattern: "Hashing",
  },
  {
    id: 2,
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    company: "Microsoft",
    frequency: "high",
    solved: true,
    pattern: "Two Pointer",
  },
  {
    id: 3,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    company: "Google",
    frequency: "high",
    solved: false,
    pattern: "Stack",
  },
  {
    id: 4,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Strings",
    company: "Zoho",
    frequency: "high",
    solved: false,
    pattern: "Sliding Window",
  },
  {
    id: 5,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked List",
    company: "TCS",
    frequency: "medium",
    solved: false,
    pattern: "Two Pointer",
  },
  {
    id: 6,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topic: "Trees",
    company: "Flipkart",
    frequency: "medium",
    solved: false,
    pattern: "BFS",
  },
  {
    id: 7,
    title: "Coin Change",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    company: "Amazon",
    frequency: "high",
    solved: false,
    pattern: "DP",
  },
  {
    id: 8,
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graphs",
    company: "Google",
    frequency: "high",
    solved: false,
    pattern: "DFS/BFS",
  },
  {
    id: 9,
    title: "LRU Cache",
    difficulty: "Hard",
    topic: "Hashing",
    company: "Microsoft",
    frequency: "high",
    solved: false,
    pattern: "Design",
  },
  {
    id: 10,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topic: "Arrays",
    company: "Amazon",
    frequency: "high",
    solved: false,
    pattern: "Two Pointer",
  },
];

const difficultyColors = {
  Easy: "text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/30",
  Medium: "text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/30",
  Hard: "text-destructive bg-destructive/10 border-destructive/30",
};

const frequencyIndicator = {
  high: { icon: "🔴", label: "Frequently asked" },
  medium: { icon: "🟡", label: "Occasionally asked" },
  low: { icon: "🟢", label: "Rarely asked" },
};

export default function Problems() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === "All Topics" || problem.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

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
            <h1 className="text-3xl font-bold mb-2">Problem Library</h1>
            <p className="text-muted-foreground">
              Practice interview-style coding problems from top companies
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
              <span className="text-sm">
                <span className="font-semibold">{problems.filter(p => p.solved).length}</span>
                <span className="text-muted-foreground"> / {problems.length} Solved</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-3 w-3 rounded-full bg-[hsl(var(--success))]" />
              Easy: {problems.filter(p => p.difficulty === "Easy").length}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-3 w-3 rounded-full bg-[hsl(var(--warning))]" />
              Medium: {problems.filter(p => p.difficulty === "Medium").length}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-3 w-3 rounded-full bg-destructive" />
              Hard: {problems.filter(p => p.difficulty === "Hard").length}
            </div>
          </div>

          {/* Problems Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-card border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-12">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Problem</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Pattern</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden sm:table-cell w-12">Freq</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProblems.map((problem) => (
                  <tr
                    key={problem.id}
                    className="hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      {problem.solved ? (
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/problems/${problem.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {problem.title}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1 md:hidden">
                        {problem.pattern}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <Badge variant="secondary" className="font-normal">
                        {problem.pattern}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {problem.company}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={cn("font-medium", difficultyColors[problem.difficulty as keyof typeof difficultyColors])}
                      >
                        {problem.difficulty}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span title={frequencyIndicator[problem.frequency as keyof typeof frequencyIndicator].label}>
                        {frequencyIndicator[problem.frequency as keyof typeof frequencyIndicator].icon}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProblems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No problems found matching your filters.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
