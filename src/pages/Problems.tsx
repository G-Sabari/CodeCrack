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
  Sparkles,
  Code2,
  Trophy,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { expandedProblems, expandedTopics } from "@/data/dsaProblemsExpanded";

const topics = expandedTopics;

const originalProblems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", topic: "Arrays", company: "Amazon", frequency: "high", solved: true, pattern: "Hashing" },
  { id: 2, title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List", company: "Microsoft", frequency: "high", solved: true, pattern: "Two Pointer" },
  { id: 3, title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", company: "Google", frequency: "high", solved: false, pattern: "Stack" },
  { id: 4, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Strings", company: "Zoho", frequency: "high", solved: false, pattern: "Sliding Window" },
  { id: 5, title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", company: "TCS", frequency: "medium", solved: false, pattern: "Two Pointer" },
  { id: 6, title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Trees", company: "Flipkart", frequency: "medium", solved: false, pattern: "BFS" },
  { id: 7, title: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming", company: "Amazon", frequency: "high", solved: false, pattern: "DP" },
  { id: 8, title: "Number of Islands", difficulty: "Medium", topic: "Graphs", company: "Google", frequency: "high", solved: false, pattern: "DFS/BFS" },
  { id: 9, title: "LRU Cache", difficulty: "Hard", topic: "Hashing", company: "Microsoft", frequency: "high", solved: false, pattern: "Design" },
  { id: 10, title: "Trapping Rain Water", difficulty: "Hard", topic: "Arrays", company: "Amazon", frequency: "high", solved: false, pattern: "Two Pointer" },
];

// Merge original problems with expanded library
const problems = [
  ...originalProblems,
  ...expandedProblems.map(p => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    topic: p.topic,
    company: p.company,
    frequency: p.frequency,
    solved: p.solved,
    pattern: p.pattern,
  })),
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

  const solvedCount = problems.filter(p => p.solved).length;
  const easyCount = problems.filter(p => p.difficulty === "Easy").length;
  const mediumCount = problems.filter(p => p.difficulty === "Medium").length;
  const hardCount = problems.filter(p => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[hsl(280,65%,60%)]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(200,80%,50%)]/3 rounded-full blur-[150px]" />
      </div>

      <Navbar />

      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-4">
            <BackButton />
          </div>

          {/* Premium Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-[hsl(280,65%,60%)]/20 border border-primary/20 backdrop-blur-sm">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-[hsl(200,80%,60%)] bg-clip-text text-transparent">
                  Problem Library
                </h1>
                <p className="text-muted-foreground">
                  Practice interview-style coding problems from top companies
                </p>
              </div>
            </div>
          </div>

          {/* Premium Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search problems..."
                className="pl-10 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:bg-card transition-all duration-300 hover:border-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-full md:w-48 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-40 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Premium Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Progress Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-[hsl(200,80%,60%)]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--success))]/20 to-[hsl(var(--success))]/10">
                    <Trophy className="h-5 w-5 text-[hsl(var(--success))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{solvedCount}<span className="text-muted-foreground text-sm font-normal">/{problems.length}</span></p>
                    <p className="text-xs text-muted-foreground">Solved</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[hsl(var(--success))] to-primary rounded-full transition-all duration-500"
                    style={{ width: `${(solvedCount / problems.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Easy Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[hsl(var(--success))]/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-[hsl(var(--success))]/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-[hsl(var(--success))] shadow-[0_0_10px_hsl(var(--success))]" />
                  <div>
                    <p className="text-2xl font-bold text-[hsl(var(--success))]">{easyCount}</p>
                    <p className="text-xs text-muted-foreground">Easy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medium Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[hsl(var(--warning))]/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-[hsl(var(--warning))]/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-[hsl(var(--warning))] shadow-[0_0_10px_hsl(var(--warning))]" />
                  <div>
                    <p className="text-2xl font-bold text-[hsl(var(--warning))]">{mediumCount}</p>
                    <p className="text-xs text-muted-foreground">Medium</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hard Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-destructive/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-destructive/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]" />
                  <div>
                    <p className="text-2xl font-bold text-destructive">{hardCount}</p>
                    <p className="text-xs text-muted-foreground">Hard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Problems Table */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-[hsl(280,65%,60%)]/5 rounded-xl blur-xl" />
            
            <div className="relative rounded-xl border border-border/50 overflow-hidden backdrop-blur-sm bg-card/30">
              <table className="w-full">
                <thead className="bg-card/80 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-12">Status</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Problem</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Pattern</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Company</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Difficulty</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell w-12">Freq</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredProblems.map((problem, index) => (
                    <tr
                      key={problem.id}
                      className="group hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="px-4 py-4">
                        <div className="relative">
                          {problem.solved ? (
                            <div className="relative">
                              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                              <div className="absolute inset-0 animate-ping">
                                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]/30" />
                              </div>
                            </div>
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          to={`/problems/${problem.id}`}
                          className="font-medium group-hover:text-primary transition-colors inline-flex items-center gap-2"
                        >
                          <span className="relative">
                            {problem.title}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-[hsl(200,80%,60%)] group-hover:w-full transition-all duration-300" />
                          </span>
                          <Sparkles className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                        </Link>
                        <div className="text-sm text-muted-foreground mt-1 md:hidden">
                          {problem.pattern}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <Badge variant="secondary" className="font-normal bg-secondary/50 hover:bg-secondary transition-colors">
                          {problem.pattern}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          <Building2 className="h-4 w-4" />
                          {problem.company}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-medium transition-all duration-300",
                            difficultyColors[problem.difficulty as keyof typeof difficultyColors],
                            "group-hover:shadow-sm"
                          )}
                        >
                          {problem.difficulty}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span 
                          title={frequencyIndicator[problem.frequency as keyof typeof frequencyIndicator].label}
                          className="cursor-help hover:scale-125 transition-transform inline-block"
                        >
                          {frequencyIndicator[problem.frequency as keyof typeof frequencyIndicator].icon}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredProblems.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No problems found matching your filters.</p>
              <Button 
                variant="ghost" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTopic("All Topics");
                  setSelectedDifficulty("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
