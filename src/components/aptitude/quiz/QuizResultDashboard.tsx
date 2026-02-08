import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Building2,
  ArrowRight,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CelebrationAnimation } from "./CelebrationAnimation";
import type { PremiumAptitudeQuestion } from "@/data/premiumAptitudeQuestions";

interface QuizResultDashboardProps {
  questions: PremiumAptitudeQuestion[];
  userAnswers: (number | null)[];
  timeTaken: number; // in seconds
  onRetry: () => void;
  onHome: () => void;
}

export function QuizResultDashboard({
  questions,
  userAnswers,
  timeTaken,
  onRetry,
  onHome,
}: QuizResultDashboardProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Calculate results
  const correctAnswers = questions.filter(
    (q, i) => userAnswers[i] === q.correctAnswer
  ).length;
  const wrongAnswers = questions.filter(
    (q, i) => userAnswers[i] !== null && userAnswers[i] !== q.correctAnswer
  ).length;
  const unanswered = userAnswers.filter((a) => a === null).length;
  const percentage = Math.round((correctAnswers / questions.length) * 100);

  // Difficulty analysis
  const difficultyStats = {
    Easy: { total: 0, correct: 0 },
    Medium: { total: 0, correct: 0 },
    Hard: { total: 0, correct: 0 },
  };

  questions.forEach((q, i) => {
    difficultyStats[q.difficulty].total++;
    if (userAnswers[i] === q.correctAnswer) {
      difficultyStats[q.difficulty].correct++;
    }
  });

  // Topic-wise analysis
  const topicStats: Record<string, { total: number; correct: number }> = {};
  questions.forEach((q, i) => {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, correct: 0 };
    }
    topicStats[q.topic].total++;
    if (userAnswers[i] === q.correctAnswer) {
      topicStats[q.topic].correct++;
    }
  });

  // Company type analysis
  const companyTypeStats = {
    "Service-Based": { total: 0, correct: 0 },
    "Product-Based": { total: 0, correct: 0 },
    Both: { total: 0, correct: 0 },
  };

  questions.forEach((q, i) => {
    companyTypeStats[q.companyType].total++;
    if (userAnswers[i] === q.correctAnswer) {
      companyTypeStats[q.companyType].correct++;
    }
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowCelebration(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showCelebration && percentage >= 70) {
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration, percentage]);

  return (
    <div className="space-y-6 animate-fade-in">
      <CelebrationAnimation score={percentage} isVisible={showCelebration} />

      {/* Score Card */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
        <div
          className={cn(
            "h-2",
            percentage >= 70
              ? "bg-gradient-to-r from-[hsl(var(--success))] to-primary"
              : percentage >= 40
              ? "bg-gradient-to-r from-[hsl(var(--warning))] to-primary"
              : "bg-gradient-to-r from-destructive to-[hsl(var(--warning))]"
          )}
        />
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <div
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center",
                percentage >= 70
                  ? "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]"
                  : percentage >= 40
                  ? "bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]"
                  : "bg-destructive/20 text-destructive"
              )}
            >
              <Trophy className="w-12 h-12" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold">{percentage}%</CardTitle>
          <p className="text-muted-foreground">
            {percentage >= 70
              ? "Excellent Performance! 🎉"
              : percentage >= 40
              ? "Good Effort! Keep Improving 💪"
              : "Keep Practicing! You'll get there 📚"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />
                <span className="text-2xl font-bold text-[hsl(var(--success))]">
                  {correctAnswers}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-destructive" />
                <span className="text-2xl font-bold text-destructive">{wrongAnswers}</span>
              </div>
              <p className="text-sm text-muted-foreground">Wrong</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{questions.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-[hsl(var(--warning))]" />
                <span className="text-2xl font-bold">{formatTime(timeTaken)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Time Taken</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Analysis */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Difficulty-wise Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(["Easy", "Medium", "Hard"] as const).map((diff) => {
            const stat = difficultyStats[diff];
            const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
            return (
              <div key={diff} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span
                    className={cn({
                      "text-[hsl(var(--success))]": diff === "Easy",
                      "text-[hsl(var(--warning))]": diff === "Medium",
                      "text-destructive": diff === "Hard",
                    })}
                  >
                    {diff}
                  </span>
                  <span className="text-muted-foreground">
                    {stat.correct}/{stat.total} ({pct}%)
                  </span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Topic-wise Performance */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📊 Topic-wise Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(topicStats).map(([topic, stat]) => {
              const pct = Math.round((stat.correct / stat.total) * 100);
              return (
                <div
                  key={topic}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <span className="font-medium">{topic}</span>
                  <Badge
                    variant="secondary"
                    className={cn({
                      "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]": pct >= 70,
                      "bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]":
                        pct >= 40 && pct < 70,
                      "bg-destructive/20 text-destructive": pct < 40,
                    })}
                  >
                    {stat.correct}/{stat.total}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Company Relevance Score */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Company-based Relevance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(companyTypeStats).map(([type, stat]) => {
              if (stat.total === 0) return null;
              const pct = Math.round((stat.correct / stat.total) * 100);
              return (
                <div key={type} className="text-center p-4 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-2">{type}</p>
                  <p className="text-2xl font-bold text-primary">{pct}%</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.correct}/{stat.total} correct
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">📝 Question Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {questions.map((q, i) => {
            const isCorrect = userAnswers[i] === q.correctAnswer;
            const isExpanded = expandedQuestion === i;

            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-lg border transition-all",
                  isCorrect
                    ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5"
                    : "border-destructive/30 bg-destructive/5"
                )}
              >
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    <span className="font-medium">Q{i + 1}</span>
                    <Badge variant="outline" className="text-xs">
                      {q.difficulty}
                    </Badge>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-fade-in">
                    <p className="text-sm">{q.question}</p>
                    <div className="grid gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={cn("p-2 rounded text-sm", {
                            "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]":
                              optIdx === q.correctAnswer,
                            "bg-destructive/20 text-destructive":
                              optIdx === userAnswers[i] && optIdx !== q.correctAnswer,
                          })}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                          {optIdx === q.correctAnswer && " ✓"}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded bg-secondary/50 text-sm">
                      <p className="font-medium text-primary mb-1">Explanation:</p>
                      <p className="text-muted-foreground">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onRetry} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Retry Quiz
        </Button>
        <Button variant="outline" onClick={onHome} className="gap-2">
          <Home className="w-4 h-4" />
          Back to Aptitude
        </Button>
      </div>
    </div>
  );
}
