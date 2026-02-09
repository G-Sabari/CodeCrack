import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Trophy, Clock, Users, Calendar, Zap, Target, Code2,
  Calculator, ArrowRight, Timer, Star, TrendingUp, ChevronRight, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  currentWeekContest,
  pastContests,
  getCountdownToContest,
  companyContestProfiles,
} from "@/data/contestData";

export default function WeeklyContest() {
  const [countdown, setCountdown] = useState(getCountdownToContest());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownToContest());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[hsl(280,65%,60%)]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar />

      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <BackButton />
          </div>

          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-[hsl(280,65%,60%)]/20 border border-primary/20 backdrop-blur-sm">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-[hsl(200,80%,60%)] bg-clip-text text-transparent">
                  Weekly Contest
                </h1>
                <p className="text-muted-foreground">
                  Compete every weekend in aptitude & coding challenges
                </p>
              </div>
            </div>
          </div>

          {/* Countdown / Live Banner */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-primary/5 backdrop-blur-sm p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className={cn(
                    "text-sm font-medium",
                    currentWeekContest.status === "live" 
                      ? "border-[hsl(var(--success))]/50 text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 animate-pulse" 
                      : "border-primary/50 text-primary bg-primary/10"
                  )}>
                    {currentWeekContest.status === "live" ? "🔴 LIVE NOW" : "⏰ Upcoming"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Week {currentWeekContest.week} • {currentWeekContest.year}
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  CodeCrack Weekly Challenge #{currentWeekContest.week}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {currentWeekContest.aptitudeQuestions} Aptitude MCQs + {currentWeekContest.codingProblems} Coding Problems • {currentWeekContest.duration} minutes
                </p>

                {currentWeekContest.status !== "live" ? (
                  <div className="flex flex-wrap gap-4 mb-6">
                    {[
                      { label: "Days", value: countdown.days },
                      { label: "Hours", value: countdown.hours },
                      { label: "Minutes", value: countdown.minutes },
                      { label: "Seconds", value: countdown.seconds },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col items-center p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm min-w-[80px]">
                        <span className="text-3xl font-bold text-primary">{String(item.value).padStart(2, "0")}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{currentWeekContest.participants} participants registered</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{currentWeekContest.duration} min duration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Every Saturday & Sunday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contest Modules */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {/* Aptitude Contest Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--warning))]/10 to-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative border-border/50 bg-card/50 backdrop-blur-sm hover:border-[hsl(var(--warning))]/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-xl bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20">
                      <Calculator className="h-6 w-6 text-[hsl(var(--warning))]" />
                    </div>
                    <div>
                      <CardTitle>Aptitude Contest</CardTitle>
                      <p className="text-sm text-muted-foreground">50 MCQ Questions • 60 minutes</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-lg font-bold text-[hsl(var(--success))]">20</p>
                        <p className="text-xs text-muted-foreground">Easy</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-lg font-bold text-[hsl(var(--warning))]">20</p>
                        <p className="text-xs text-muted-foreground">Medium</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-lg font-bold text-destructive">10</p>
                        <p className="text-xs text-muted-foreground">Hard</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Quantitative", "Logical", "Verbal"].map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                      ))}
                    </div>
                    <Button className="w-full group/btn" disabled={!isWeekend()}>
                      {isWeekend() ? "Start Aptitude Contest" : "Available on Weekends"}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coding Contest Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-[hsl(280,65%,60%)]/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                      <Code2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Coding Contest</CardTitle>
                      <p className="text-sm text-muted-foreground">4 Problems • 90 minutes</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-lg font-bold text-[hsl(var(--success))]">1</p>
                        <p className="text-xs text-muted-foreground">Easy</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-lg font-bold text-[hsl(var(--warning))]">2</p>
                        <p className="text-xs text-muted-foreground">Medium</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-lg font-bold text-destructive">1</p>
                        <p className="text-xs text-muted-foreground">Hard</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["C++", "Java", "Python", "JavaScript"].map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                      ))}
                    </div>
                    <Button className="w-full group/btn" variant="outline" disabled={!isWeekend()}>
                      {isWeekend() ? "Start Coding Contest" : "Available on Weekends"}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Company Simulation */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Company Simulation Mode
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Practice with question patterns that match specific company hiring tests
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {Object.entries(companyContestProfiles).map(([company, profile]) => (
                    <button
                      key={company}
                      className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 text-left"
                    >
                      <p className="font-medium text-sm mb-2 group-hover:text-primary transition-colors">{company}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[hsl(var(--warning))] rounded-full transition-all duration-500"
                              style={{ width: `${profile.aptitudeWeight * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground w-8">{Math.round(profile.aptitudeWeight * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${profile.codingWeight * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground w-8">{Math.round(profile.codingWeight * 100)}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--warning))]" />Apt
                        </span>
                        <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />Code
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Past Contests */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Past Contests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pastContests.map((contest) => (
                    <div
                      key={contest.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-secondary/50">
                          <Trophy className="h-5 w-5 text-[hsl(var(--warning))]" />
                        </div>
                        <div>
                          <p className="font-medium">Weekly Challenge #{contest.week}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> {contest.participants}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {contest.duration}min
                            </span>
                            <span>{new Date(contest.startTime).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Link to="/leaderboard">
                        <Button variant="ghost" size="sm">
                          View Results
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
