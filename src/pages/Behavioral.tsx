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
  User,
  Scale,
  RotateCcw,
  Users,
  Handshake,
  HeartPulse,
  Target,
  Shield,
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Star,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { behavioralCategories, behavioralQuestions, hrTips } from "@/data/behavioralData";

const iconMap: Record<string, React.ReactNode> = {
  User: <User className="h-5 w-5" />,
  Scale: <Scale className="h-5 w-5" />,
  RotateCcw: <RotateCcw className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Handshake: <Handshake className="h-5 w-5" />,
  HeartPulse: <HeartPulse className="h-5 w-5" />,
  Target: <Target className="h-5 w-5" />,
  Shield: <Shield className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
};

export default function Behavioral() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("questions");

  const filteredQuestions = behavioralQuestions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || q.category === selectedCategory;
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
            <h1 className="text-3xl font-bold mb-2">HR & Behavioral Interview</h1>
            <p className="text-muted-foreground">
              Prepare for behavioral questions using the STAR method with sample answers
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="questions">Questions & Answers</TabsTrigger>
              <TabsTrigger value="tips">Interview Tips</TabsTrigger>
              <TabsTrigger value="star">STAR Method</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="mt-6">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Topics
                </Button>
                {behavioralCategories.map((category) => (
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
                  placeholder="Search questions..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Questions Accordion */}
              <Accordion type="single" collapsible className="space-y-4">
                {filteredQuestions.map((q) => (
                  <AccordionItem
                    key={q.id}
                    value={q.id}
                    className="border rounded-xl px-6 bg-card"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          {iconMap[behavioralCategories.find(c => c.id === q.category)?.icon || "MessageSquare"]}
                        </div>
                        <div>
                          <p className="font-medium">{q.question}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {behavioralCategories.find(c => c.id === q.category)?.name}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-6 pt-2">
                        {/* Sample Answer */}
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-3">
                            <Star className="h-4 w-4 text-[hsl(var(--warning))]" />
                            Sample Answer
                          </h4>
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                            <p className="text-sm leading-relaxed">{q.sampleAnswer}</p>
                          </div>
                        </div>

                        {/* STAR Breakdown */}
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-3">
                            <Target className="h-4 w-4 text-primary" />
                            STAR Method Breakdown
                          </h4>
                          <div className="grid gap-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                              <Badge className="bg-primary/10 text-primary border-primary/30 shrink-0">S</Badge>
                              <div>
                                <p className="font-medium text-sm">Situation</p>
                                <p className="text-sm text-muted-foreground">{q.starAnswer.situation}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                              <Badge className="bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30 shrink-0">T</Badge>
                              <div>
                                <p className="font-medium text-sm">Task</p>
                                <p className="text-sm text-muted-foreground">{q.starAnswer.task}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                              <Badge className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/30 shrink-0">A</Badge>
                              <div>
                                <p className="font-medium text-sm">Action</p>
                                <p className="text-sm text-muted-foreground">{q.starAnswer.action}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                              <Badge className="bg-destructive/10 text-destructive border-destructive/30 shrink-0">R</Badge>
                              <div>
                                <p className="font-medium text-sm">Result</p>
                                <p className="text-sm text-muted-foreground">{q.starAnswer.result}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tips and Mistakes */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-3">
                              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                              Tips
                            </h4>
                            <ul className="space-y-2">
                              {q.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-3">
                              <XCircle className="h-4 w-4 text-destructive" />
                              Common Mistakes
                            </h4>
                            <ul className="space-y-2">
                              {q.commonMistakes.map((mistake, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                                  {mistake}
                                </li>
                              ))}
                            </ul>
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
                      <User className="h-5 w-5 text-primary" />
                      Body Language
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {hrTips.bodyLanguage.map((tip, idx) => (
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
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Communication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {hrTips.communication.map((tip, idx) => (
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
                      <BookOpen className="h-5 w-5 text-primary" />
                      Preparation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {hrTips.preparation.map((tip, idx) => (
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
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Attitude
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {hrTips.attitude.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="star" className="mt-6">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>The STAR Method</CardTitle>
                  <CardDescription>
                    A structured approach to answering behavioral interview questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">S</Badge>
                          <h3 className="font-semibold text-lg">Situation</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Set the scene. Describe the context and background of your example.
                          When and where did this happen? Who was involved?
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] text-lg px-3 py-1">T</Badge>
                          <h3 className="font-semibold text-lg">Task</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Describe your responsibility or goal in that situation.
                          What was required of you? What challenge did you face?
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] text-lg px-3 py-1">A</Badge>
                          <h3 className="font-semibold text-lg">Action</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Explain the specific steps YOU took. Focus on your contribution.
                          Use "I" not "we" to highlight your personal actions.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-destructive text-destructive-foreground text-lg px-3 py-1">R</Badge>
                          <h3 className="font-semibold text-lg">Result</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Share the outcome of your actions. Quantify when possible.
                          What did you learn? How did it benefit the team/company?
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Example: Leadership Question</CardTitle>
                  <CardDescription>
                    "Tell me about a time you showed leadership"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                      <Badge className="bg-primary text-primary-foreground shrink-0">S</Badge>
                      <div>
                        <p className="font-medium">Situation</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          "During a 24-hour hackathon in my third year, our team leader fell sick
                          midway through, and our 4-member team was left without direction."
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                      <Badge className="bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] shrink-0">T</Badge>
                      <div>
                        <p className="font-medium">Task</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          "We had 12 hours left to build a working prototype, and someone needed
                          to step up to coordinate efforts and keep the team motivated."
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                      <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] shrink-0">A</Badge>
                      <div>
                        <p className="font-medium">Action</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          "I volunteered to lead. I quickly assessed each member's strengths,
                          divided the remaining work accordingly, set 2-hour checkpoints, and
                          made sure everyone had what they needed to stay focused."
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                      <Badge className="bg-destructive text-destructive-foreground shrink-0">R</Badge>
                      <div>
                        <p className="font-medium">Result</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          "We completed our prototype on time and won second place. More importantly,
                          I learned that leadership is about enabling others to do their best work,
                          not about having a title."
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
