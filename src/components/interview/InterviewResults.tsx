import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy, TrendingUp, TrendingDown, Target, Clock, AlertTriangle,
  RotateCcw, Home, Loader2, BookOpen, Sparkles, Award, CheckCircle2,
  XCircle, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FeedbackData {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  topicsToImprove: string[];
  questionScores: { question: string; score: number; feedback: string }[];
  summary: string;
}

interface InterviewResultsProps {
  messages: Message[];
  antiCheatEvents: any[];
  elapsedTime: number;
  difficulty: string;
  onRestart: () => void;
}

const InterviewResults: React.FC<InterviewResultsProps> = ({
  messages,
  antiCheatEvents,
  elapsedTime,
  difficulty,
  onRestart,
}) => {
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-interview`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ messages, difficulty, mode: "feedback" }),
          }
        );
        if (!resp.ok) throw new Error("Failed to get feedback");
        const data = await resp.json();
        const content = data.choices?.[0]?.message?.content || "";
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);
        setFeedback(parsed);
      } catch (e) {
        console.error("Feedback error:", e);
        toast.error("Could not generate detailed feedback.");
        setFeedback({
          overallScore: 65,
          strengths: ["Completed the interview", "Engaged with questions"],
          weaknesses: ["Could not generate detailed analysis"],
          topicsToImprove: ["Practice more questions"],
          questionScores: [],
          summary: "Interview completed. Practice regularly to improve.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [messages, difficulty]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
  };

  const scoreColor = (score: number) =>
    score >= 80 ? "text-emerald-400" : score >= 50 ? "text-yellow-400" : "text-red-400";

  const scoreGradient = (score: number) =>
    score >= 80
      ? "from-emerald-500/20 to-green-500/10"
      : score >= 50
      ? "from-yellow-500/20 to-amber-500/10"
      : "from-red-500/20 to-orange-500/10";

  const scoreBorder = (score: number) =>
    score >= 80 ? "border-emerald-500/20" : score >= 50 ? "border-yellow-500/20" : "border-red-500/20";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-[100px] animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center space-y-5"
        >
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-primary/30 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Analyzing Your Interview</h2>
            <p className="text-sm text-muted-foreground mt-1">
              AI is evaluating your responses and generating personalized feedback...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const overallScore = feedback?.overallScore || 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* Hero Score */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-5"
        >
          {/* Score ring */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="relative mx-auto w-32 h-32"
          >
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--border))" strokeWidth="6" opacity="0.2" />
              <motion.circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - overallScore / 100) }}
                transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className={`text-3xl font-extrabold ${scoreColor(overallScore)}`}
              >
                {overallScore}
              </motion.span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </motion.div>

          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Interview Complete</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">{feedback?.summary}</p>
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { icon: Target, label: "Score", value: `${overallScore}%`, color: scoreColor(overallScore) },
            { icon: Clock, label: "Duration", value: formatTime(elapsedTime), color: "text-foreground" },
            { icon: BookOpen, label: "Questions", value: String(messages.filter(m => m.role === "assistant").length), color: "text-foreground" },
            { icon: AlertTriangle, label: "Warnings", value: String(antiCheatEvents.length), color: antiCheatEvents.length > 0 ? "text-warning" : "text-emerald-400" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="p-4 rounded-2xl bg-card/40 border border-border/20 backdrop-blur-md text-center hover:border-border/40 transition-colors"
            >
              <s.icon className="w-5 h-5 mx-auto mb-2 text-primary/70" />
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-card/40 border border-emerald-500/15 backdrop-blur-md overflow-hidden"
          >
            <div className="px-5 py-3.5 bg-emerald-500/5 border-b border-emerald-500/10 flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-400" />
              <h3 className="font-semibold text-foreground text-sm">Strengths</h3>
              <span className="ml-auto text-[10px] text-emerald-400/70 font-medium">{feedback?.strengths.length} found</span>
            </div>
            <div className="p-5 space-y-2.5">
              {feedback?.strengths.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-card/40 border border-red-500/15 backdrop-blur-md overflow-hidden"
          >
            <div className="px-5 py-3.5 bg-red-500/5 border-b border-red-500/10 flex items-center gap-2">
              <TrendingDown className="w-4.5 h-4.5 text-red-400" />
              <h3 className="font-semibold text-foreground text-sm">Areas to Improve</h3>
              <span className="ml-auto text-[10px] text-red-400/70 font-medium">{feedback?.weaknesses.length} found</span>
            </div>
            <div className="p-5 space-y-2.5">
              {feedback?.weaknesses.map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Topics to Improve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl bg-card/40 border border-border/20 backdrop-blur-md overflow-hidden"
        >
          <div className="px-5 py-3.5 bg-primary/3 border-b border-border/15 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Recommended Study Topics</h3>
          </div>
          <div className="p-5 flex flex-wrap gap-2">
            {feedback?.topicsToImprove.map((t, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.06 }}
                className="px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-sm text-primary font-medium hover:bg-primary/12 transition-colors cursor-default"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Question Breakdown */}
        {feedback?.questionScores && feedback.questionScores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-2xl bg-card/40 border border-border/20 backdrop-blur-md overflow-hidden"
          >
            <div className="px-5 py-3.5 bg-card/40 border-b border-border/15 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Question Breakdown</h3>
            </div>
            <div className="p-5 space-y-4">
              {feedback.questionScores.map((qs, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.08 }}
                  className={`p-4 rounded-xl bg-gradient-to-r ${scoreGradient(qs.score * 10)} border ${scoreBorder(qs.score * 10)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-foreground max-w-[80%]">
                      Q{i + 1}: {qs.question}
                    </span>
                    <span className={`text-sm font-bold ${scoreColor(qs.score * 10)}`}>{qs.score}/10</span>
                  </div>
                  <Progress value={qs.score * 10} className="h-1.5 mb-2" />
                  <p className="text-xs text-muted-foreground">{qs.feedback}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-3 justify-center pb-8"
        >
          <Button onClick={onRestart} variant="outline" className="gap-2 rounded-xl px-6">
            <RotateCcw className="w-4 h-4" /> New Interview
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            className="gap-2 rounded-xl px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Home className="w-4 h-4" /> Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewResults;
