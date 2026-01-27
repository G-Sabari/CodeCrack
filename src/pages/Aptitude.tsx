import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calculator,
  Brain,
  BookOpen,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Lightbulb,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { aptitudeCategories, sampleAptitudeQuestions } from "@/data/aptitudeData";

const iconMap: Record<string, React.ReactNode> = {
  Calculator: <Calculator className="h-6 w-6" />,
  Brain: <Brain className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
};

const difficultyColors = {
  Easy: "text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/30",
  Medium: "text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/30",
  Hard: "text-destructive bg-destructive/10 border-destructive/30",
};

export default function Aptitude() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("quantitative");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const currentCategory = aptitudeCategories.find((c) => c.id === activeCategory);
  const filteredTopics = currentCategory?.topics.filter((topic) =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalQuestions = aptitudeCategories.reduce((acc, c) => acc + c.totalQuestions, 0);
  const totalSolved = aptitudeCategories.reduce((acc, c) => acc + c.solvedQuestions, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Aptitude Preparation</h1>
            <p className="text-muted-foreground">
              Master quantitative, logical, and verbal reasoning for top company placements
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[hsl(var(--success))]">{totalSolved}</div>
                <div className="text-sm text-muted-foreground">Solved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{aptitudeCategories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[hsl(var(--warning))]">
                  {aptitudeCategories.reduce((acc, c) => acc + c.topics.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Topics</div>
              </CardContent>
            </Card>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-transparent p-0">
              {aptitudeCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
                >
                  {iconMap[category.icon]}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {aptitudeCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={`Search ${category.name} topics...`}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Category Progress */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{category.name} Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {category.solvedQuestions}/{category.totalQuestions} questions
                      </span>
                    </div>
                    <Progress
                      value={(category.solvedQuestions / category.totalQuestions) * 100}
                      className="h-2"
                    />
                  </CardContent>
                </Card>

                {/* Topics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTopics?.map((topic) => (
                    <Card
                      key={topic.id}
                      className="hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTopic(topic.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{topic.name}</CardTitle>
                          <Badge variant="secondary">{topic.questions} Q</Badge>
                        </div>
                        <CardDescription>{topic.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">
                            {topic.solved}/{topic.questions}
                          </span>
                        </div>
                        <Progress
                          value={(topic.solved / topic.questions) * 100}
                          className="h-2 mb-4"
                        />
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to={`/aptitude/${category.id}/${topic.id}`}>
                            Practice Now
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Sample Questions Preview */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              Sample Questions
            </h2>
            <div className="space-y-4">
              {sampleAptitudeQuestions.slice(0, 3).map((question) => (
                <Card key={question.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge
                        variant="outline"
                        className={cn(difficultyColors[question.difficulty])}
                      >
                        {question.difficulty}
                      </Badge>
                      <Badge variant="secondary">{question.topic}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                        <Clock className="h-4 w-4" />
                        {question.timeLimit}s
                      </div>
                    </div>
                    <p className="font-medium mb-4">{question.question}</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {question.options.map((option, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 cursor-pointer transition-colors"
                        >
                          {String.fromCharCode(65 + idx)}. {option}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Asked by:</span>
                      {question.companies.map((company) => (
                        <Badge key={company} variant="outline" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button asChild>
                <Link to="/aptitude/practice">
                  View All Questions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Tips Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Tips for Aptitude Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
                  <div>
                    <p className="font-medium">Learn shortcuts first</p>
                    <p className="text-sm text-muted-foreground">
                      Master Vedic math and calculation shortcuts before practicing
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
                  <div>
                    <p className="font-medium">Practice under time pressure</p>
                    <p className="text-sm text-muted-foreground">
                      Always solve with a timer to simulate exam conditions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
                  <div>
                    <p className="font-medium">Identify patterns</p>
                    <p className="text-sm text-muted-foreground">
                      Most aptitude questions follow predictable patterns
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
                  <div>
                    <p className="font-medium">Review mistakes daily</p>
                    <p className="text-sm text-muted-foreground">
                      Maintain an error log and revise wrong answers regularly
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
