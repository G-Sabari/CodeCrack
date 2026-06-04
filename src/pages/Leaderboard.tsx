import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Trophy, Medal, Crown, Clock, Target, TrendingUp, Sparkles, Star, Award, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { rankedParticipants } from "@/data/contestData";
import { FloatingParticles } from "@/components/contest/FloatingParticles";
import { Podium } from "@/components/contest/Podium";

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-6 w-6 text-[hsl(45,100%,50%)]" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-[hsl(0,0%,75%)]" />;
  if (rank === 3) return <Medal className="h-6 w-6 text-[hsl(30,60%,50%)]" />;
  return <span className="text-lg font-bold text-muted-foreground w-6 text-center">#{rank}</span>;
};

const getRankStyles = (rank: number) => {
  if (rank === 1) return "border-[hsl(45,100%,50%)]/30 bg-[hsl(45,100%,50%)]/5 shadow-[0_0_30px_hsl(45,100%,50%,0.1)]";
  if (rank === 2) return "border-[hsl(0,0%,75%)]/30 bg-[hsl(0,0%,75%)]/5";
  if (rank === 3) return "border-[hsl(30,60%,50%)]/30 bg-[hsl(30,60%,50%)]/5";
  return "border-border/50 bg-card/30";
};

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("overall");

  const aptitudeRanked = [...rankedParticipants].sort((a, b) => b.aptitudeScore - a.aptitudeScore);
  const codingRanked = [...rankedParticipants].sort((a, b) => b.codingScore - a.codingScore);

  const getDisplayData = () => {
    if (activeTab === "aptitude") return aptitudeRanked;
    if (activeTab === "coding") return codingRanked;
    return rankedParticipants;
  };

  const getScore = (p: typeof rankedParticipants[0]) => {
    if (activeTab === "aptitude") return p.aptitudeScore;
    if (activeTab === "coding") return p.codingScore;
    return p.totalScore;
  };

  const maxScore = Math.max(...getDisplayData().map(p => getScore(p)));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingParticles count={20} color="hsl(45 100% 55% / 0.25)" />

      <Navbar />

      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <BackButton />
          </div>

          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[hsl(45,100%,50%)]/20 to-primary/20 border border-[hsl(45,100%,50%)]/20 backdrop-blur-sm animate-pulse-glow">
                <Trophy className="h-6 w-6 text-[hsl(45,100%,50%)]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-holo">
                  Leaderboard
                </h1>
                <p className="text-muted-foreground">
                  Weekly contest rankings • {rankedParticipants.length} participants
                </p>
              </div>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <Podium
              entries={[
                rankedParticipants[0] && { name: rankedParticipants[0].name, score: rankedParticipants[0].totalScore },
                rankedParticipants[1] && { name: rankedParticipants[1].name, score: rankedParticipants[1].totalScore },
                rankedParticipants[2] && { name: rankedParticipants[2].name, score: rankedParticipants[2].totalScore },
              ]}
            />
          </div>

          {/* Tab-based Rankings */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-secondary/50">
                    <TabsTrigger value="overall">
                      <Trophy className="h-4 w-4 mr-1.5" />
                      Overall
                    </TabsTrigger>
                    <TabsTrigger value="aptitude">
                      <Target className="h-4 w-4 mr-1.5" />
                      Aptitude
                    </TabsTrigger>
                    <TabsTrigger value="coding">
                      <TrendingUp className="h-4 w-4 mr-1.5" />
                      Coding
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/30 mb-2">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-3">Participant</div>
                  <div className="col-span-2 text-center hidden sm:block">Aptitude</div>
                  <div className="col-span-2 text-center hidden sm:block">Coding</div>
                  <div className="col-span-2 text-center">Score</div>
                  <div className="col-span-2 text-center hidden md:block">Time</div>
                </div>

                {/* Rows */}
                <div className="space-y-1.5">
                  {getDisplayData().map((participant, index) => (
                    <div
                      key={participant.id}
                      className={cn(
                        "grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.01]",
                        getRankStyles(index + 1)
                      )}
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <div className="col-span-1 flex items-center">
                        {getRankIcon(index + 1)}
                      </div>
                      <div className="col-span-3">
                        <p className={cn(
                          "font-medium text-sm",
                          index < 3 && "font-bold"
                        )}>
                          {participant.name}
                        </p>
                      </div>
                      <div className="col-span-2 text-center hidden sm:block">
                        <span className="text-sm font-medium text-[hsl(var(--warning))]">
                          {participant.aptitudeScore}
                        </span>
                      </div>
                      <div className="col-span-2 text-center hidden sm:block">
                        <span className="text-sm font-medium text-primary">
                          {participant.codingScore}
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-sm font-bold">{getScore(participant)}</span>
                        <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700",
                              index === 0 ? "bg-[hsl(45,100%,50%)]" : index < 3 ? "bg-primary" : "bg-muted-foreground/50"
                            )}
                            style={{ width: `${(getScore(participant) / maxScore) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="col-span-2 text-center hidden md:block">
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {participant.timeTaken}m
                        </div>
                      </div>
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
