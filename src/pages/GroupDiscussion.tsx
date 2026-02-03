import { useState } from "react";
import { Link } from "react-router-dom";
import { BackButton } from "@/components/ui/back-button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Newspaper,
  Laptop,
  Users,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Lightbulb,
  MessageCircle,
  ArrowRight,
  Target,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gdCategories, gdTopics, gdTips } from "@/data/gdData";

const iconMap: Record<string, React.ReactNode> = {
  Newspaper: <Newspaper className="h-5 w-5" />,
  Laptop: <Laptop className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
};

export default function GroupDiscussion() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("topics");

  const filteredTopics = gdTopics.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
            <h1 className="text-3xl font-bold mb-2">Group Discussion Preparation</h1>
            <p className="text-muted-foreground">
              Master GD topics with structured arguments, examples, and evaluation criteria
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{gdTopics.length}</div>
                <div className="text-sm text-muted-foreground">GD Topics</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{gdCategories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[hsl(var(--success))]">
                  {gdTips.evaluation.length}
                </div>
                <div className="text-sm text-muted-foreground">Evaluation Criteria</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[hsl(var(--warning))]">15-20</div>
                <div className="text-sm text-muted-foreground">Minutes Duration</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="topics">GD Topics</TabsTrigger>
              <TabsTrigger value="tips">How to Prepare</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation Criteria</TabsTrigger>
            </TabsList>

            <TabsContent value="topics" className="mt-6">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Topics
                </Button>
                {gdCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="gap-2"
                  >
                    {iconMap[category.icon]}
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search GD topics..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Topics Accordion */}
              <Accordion type="single" collapsible className="space-y-4">
                {filteredTopics.map((topic) => (
                  <AccordionItem
                    key={topic.id}
                    value={topic.id}
                    className="border rounded-xl px-6 bg-card"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          {iconMap[gdCategories.find(c => c.id === topic.category)?.icon || "MessageCircle"]}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{topic.title}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {gdCategories.find(c => c.id === topic.category)?.name}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-6 pt-2">
                        {/* Introduction */}
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-3">
                            <MessageCircle className="h-4 w-4 text-primary" />
                            Introduction
                          </h4>
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                            <p className="text-sm leading-relaxed">{topic.introduction}</p>
                          </div>
                        </div>

                        {/* Arguments */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-3">
                              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                              Supporting Points
                            </h4>
                            <ul className="space-y-2">
                              {topic.supportingPoints.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm p-2 rounded-lg bg-[hsl(var(--success))]/5 border border-[hsl(var(--success))]/20">
                                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-3">
                              <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />
                              Opposing Points
                            </h4>
                            <ul className="space-y-2">
                              {topic.opposingPoints.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm p-2 rounded-lg bg-[hsl(var(--warning))]/5 border border-[hsl(var(--warning))]/20">
                                  <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))] shrink-0 mt-0.5" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Real-World Examples */}
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-3">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Real-World Examples
                          </h4>
                          <div className="grid gap-2">
                            {topic.realWorldExamples.map((example, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm p-3 rounded-lg border border-border bg-card">
                                <span className="text-primary font-bold">{idx + 1}.</span>
                                {example}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Conclusion */}
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-3">
                            <Target className="h-4 w-4 text-primary" />
                            Conclusion
                          </h4>
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-sm leading-relaxed">{topic.conclusion}</p>
                          </div>
                        </div>

                        {/* Do's and Don'ts */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-3">
                              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                              Do's for this Topic
                            </h4>
                            <ul className="space-y-2">
                              {topic.doAndDonts.dos.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-3">
                              <XCircle className="h-4 w-4 text-destructive" />
                              Don'ts for this Topic
                            </h4>
                            <ul className="space-y-2">
                              {topic.doAndDonts.donts.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Evaluation Criteria */}
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-3">
                            <Target className="h-4 w-4 text-primary" />
                            Key Evaluation Criteria for this Topic
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {topic.evaluationCriteria.map((criteria, idx) => (
                              <Badge key={idx} variant="secondary" className="text-sm py-1">
                                {criteria}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="tips" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Before the GD
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {gdTips.beforeGD.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      During the GD
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {gdTips.duringGD.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                      Common Mistakes to Avoid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {gdTips.commonMistakes.map((mistake, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                          <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                          {mistake}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="evaluation" className="mt-6">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>How Companies Evaluate GD</CardTitle>
                  <CardDescription>
                    Understanding what evaluators look for helps you focus your preparation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {gdTips.evaluation.map((criteria, idx) => {
                      const [name, percentage] = criteria.split(' (');
                      const percent = parseInt(percentage);
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{name}</span>
                            <span className="text-sm text-primary font-medium">{percentage}</span>
                          </div>
                          <div className="h-3 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-[hsl(var(--warning))]" />
                      Content & Knowledge
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <ul className="space-y-2">
                      <li>• Quality of ideas and arguments</li>
                      <li>• Relevant facts and examples</li>
                      <li>• Understanding of the topic</li>
                      <li>• Original insights</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      Communication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <ul className="space-y-2">
                      <li>• Clarity of expression</li>
                      <li>• Fluency and articulation</li>
                      <li>• Vocabulary usage</li>
                      <li>• Listening skills</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-[hsl(var(--success))]" />
                      Team Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <ul className="space-y-2">
                      <li>• Ability to build on others' ideas</li>
                      <li>• Inclusive behavior</li>
                      <li>• Conflict handling</li>
                      <li>• Initiative without dominance</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
