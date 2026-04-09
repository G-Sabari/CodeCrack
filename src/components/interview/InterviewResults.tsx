import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy, TrendingUp, TrendingDown, Target, Clock, AlertTriangle,
  RotateCcw, Home, Loader2, BookOpen,
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
        // The AI model returns choices[0].message.content with JSON
        const content = data.choices?.[0]?.message?.content || "";
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);
        setFeedback(parsed);
      } catch (e) {
        console.error("Feedback error:", e);
        toast.error("Could not generate feedback. Showing basic results.");
        // Fallback
        setFeedback({
          overallScore: 65,
          strengths: ["Completed the interview", "Engaged with questions"],
          weaknesses: ["Could not generate detailed analysis"],
          topicsToImprove: ["Practice more questions"],
          questionScores: [],
          summary: "Interview completed. Practice regularly to improve your performance.",
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
    score >= 80 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Analyzing your interview...</h2>
          <p className="text-sm text-muted-foreground">
            AI is evaluating your answers and generating detailed feedback
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <Trophy className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">Interview Complete</h1>
          <p className="text-muted-foreground">{feedback?.summary}</p>
        </motion.div>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="p-4 rounded-xl bg-card/60 border border-border/30 text-center backdrop-blur-sm">
            <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className={`text-2xl font-bold ${scoreColor(feedback?.overallScore || 0)}`}>
              {feedback?.overallScore}%
            </div>
            <div className="text-xs text-muted-foreground">Overall Score</div>
          </div>
          <div className="p-4 rounded-xl bg-card/60 border border-border/30 text-center backdrop-blur-sm">
            <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{formatTime(elapsedTime)}</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          <div className="p-4 rounded-xl bg-card/60 border border-border/30 text-center backdrop-blur-sm">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">
              {messages.filter((m) => m.role === "assistant").length}
            </div>
            <div className="text-xs text-muted-foreground">Questions Asked</div>
          </div>
          <div className="p-4 rounded-xl bg-card/60 border border-border/30 text-center backdrop-blur-sm">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-warning" />
            <div className={`text-2xl font-bold ${antiCheatEvents.length > 0 ? "text-warning" : "text-green-400"}`}>
              {antiCheatEvents.length}
            </div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </div>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-card/60 border border-green-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-foreground">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {feedback?.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-card/60 border border-red-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-foreground">Areas to Improve</h3>
            </div>
            <ul className="space-y-2">
              {feedback?.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Topics to Improve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-card/60 border border-border/30 backdrop-blur-sm"
        >
          <h3 className="font-semibold text-foreground mb-3">📚 Suggested Topics to Study</h3>
          <div className="flex flex-wrap gap-2">
            {feedback?.topicsToImprove.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Question-level scores */}
        {feedback?.questionScores && feedback.questionScores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-5 rounded-xl bg-card/60 border border-border/30 backdrop-blur-sm space-y-4"
          >
            <h3 className="font-semibold text-foreground">Question-by-Question Breakdown</h3>
            {feedback.questionScores.map((qs, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium truncate max-w-[70%]">
                    Q{i + 1}: {qs.question}
                  </span>
                  <span className={scoreColor(qs.score * 10)}>{qs.score}/10</span>
                </div>
                <Progress value={qs.score * 10} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{qs.feedback}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 justify-center"
        >
          <Button onClick={onRestart} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" /> New Interview
          </Button>
          <Button onClick={() => navigate("/dashboard")} className="gap-2 bg-primary">
            <Home className="w-4 h-4" /> Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewResults;
