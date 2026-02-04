import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BackButton } from "@/components/ui/back-button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Calendar,
  Building2,
  Filter,
  BookOpen,
  Code,
  Calculator,
  Brain,
  Lightbulb,
  ChevronRight,
  TrendingUp,
  Target,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PYQQuestion {
  id: string;
  company_id: string;
  year: number;
  topic: string;
  subtopic: string | null;
  difficulty: string;
  question: string;
  solution: string | null;
  explanation: string | null;
  hints: string[] | null;
  tags: string[] | null;
  question_type: string;
  company?: {
    name: string;
    category: string;
  };
}

interface Company {
  id: string;
  name: string;
  category: string;
}

function QuestionCard({ question }: { question: PYQQuestion }) {
  const [showSolution, setShowSolution] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/30";
      case "medium":
        return "text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/30";
      case "hard":
        return "text-destructive bg-destructive/10 border-destructive/30";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "coding":
        return Code;
      case "aptitude":
        return Calculator;
      case "technical":
        return Brain;
      case "system design":
        return Target;
      default:
        return BookOpen;
    }
  };

  const TypeIcon = getTypeIcon(question.question_type);

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TypeIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {question.company?.name || "Unknown"}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {question.year}
                </Badge>
                <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {question.topic} {question.subtopic && `• ${question.subtopic}`}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {question.question_type}
          </Badge>
        </div>

        <p className="text-foreground mb-4 whitespace-pre-line">{question.question}</p>

        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <Lightbulb className="h-4 w-4 mr-2" />
                View Solution
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <TypeIcon className="h-5 w-5 text-primary" />
                  Solution
                </DialogTitle>
                <DialogDescription>
                  {question.topic} • {question.company?.name} • {question.year}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Question:</h4>
                  <p className="text-muted-foreground whitespace-pre-line">{question.question}</p>
                </div>
                {question.hints && question.hints.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Hints:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {question.hints.map((hint, idx) => (
                        <li key={idx}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {question.solution && (
                  <div>
                    <h4 className="font-semibold mb-2">Solution:</h4>
                    <p className="text-foreground whitespace-pre-line bg-secondary/50 p-4 rounded-lg font-mono text-sm">
                      {question.solution}
                    </p>
                  </div>
                )}
                {question.explanation && (
                  <div>
                    <h4 className="font-semibold mb-2">Explanation:</h4>
                    <p className="text-muted-foreground">{question.explanation}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          {question.hints && question.hints.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Hints ({question.hints.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Hints</DialogTitle>
                </DialogHeader>
                <ul className="list-disc list-inside space-y-2">
                  {question.hints.map((hint, idx) => (
                    <li key={idx} className="text-muted-foreground">{hint}</li>
                  ))}
                </ul>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PYQDatabase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch companies for filter dropdown
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, category")
        .order("name");
      if (error) throw error;
      return data as Company[];
    },
  });

  // Fetch PYQ questions
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["pyq-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pyq_questions")
        .select(`
          *,
          company:companies(name, category)
        `)
        .order("year", { ascending: false });
      if (error) throw error;
      return data as PYQQuestion[];
    },
  });

  // Get unique topics
  const topics = [...new Set(questions.map((q) => q.topic))].sort();

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      searchQuery === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.tags && q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesYear = yearFilter === "all" || q.year.toString() === yearFilter;
    const matchesCompany = companyFilter === "all" || q.company_id === companyFilter;
    const matchesDifficulty = difficultyFilter === "all" || q.difficulty.toLowerCase() === difficultyFilter;
    const matchesTopic = topicFilter === "all" || q.topic === topicFilter;
    const matchesType = typeFilter === "all" || q.question_type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesYear && matchesCompany && matchesDifficulty && matchesTopic && matchesType;
  });

  // Stats
  const stats = {
    total: questions.length,
    coding: questions.filter((q) => q.question_type === "Coding").length,
    aptitude: questions.filter((q) => q.question_type === "Aptitude").length,
    systemDesign: questions.filter((q) => q.question_type === "System Design").length,
    technical: questions.filter((q) => q.question_type === "Technical").length,
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
            <h1 className="text-3xl font-bold mb-2">Previous Year Questions</h1>
            <p className="text-muted-foreground">
              Practice real interview questions asked in 2024-2026 placements
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.coding}</div>
                <div className="text-sm text-muted-foreground">Coding</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.aptitude}</div>
                <div className="text-sm text-muted-foreground">Aptitude</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.systemDesign}</div>
                <div className="text-sm text-muted-foreground">System Design</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.technical}</div>
                <div className="text-sm text-muted-foreground">Technical</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search questions, topics, or tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[130px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>

              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-[160px]">
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
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
                <SelectTrigger className="w-[160px]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <Code className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="aptitude">Aptitude</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="system design">System Design</SelectItem>
                </SelectContent>
              </Select>

              {(yearFilter !== "all" ||
                companyFilter !== "all" ||
                difficultyFilter !== "all" ||
                topicFilter !== "all" ||
                typeFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setYearFilter("all");
                    setCompanyFilter("all");
                    setDifficultyFilter("all");
                    setTopicFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredQuestions.length} of {questions.length} questions
          </div>

          {/* Questions List */}
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading questions...
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No questions found matching your filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
