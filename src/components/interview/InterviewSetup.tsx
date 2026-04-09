import React from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Flame, Mic, Camera, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterviewSetupProps {
  onStart: (difficulty: "Easy" | "Medium" | "Hard") => void;
}

const difficulties = [
  {
    level: "Easy" as const,
    icon: Zap,
    color: "from-green-500 to-emerald-600",
    border: "border-green-500/30 hover:border-green-500/60",
    glow: "shadow-green-500/10 hover:shadow-green-500/20",
    desc: "Basic DSA, simple JS/React, standard HR questions. Great for beginners.",
    topics: ["Arrays & Strings", "Basic JS", "Tell me about yourself"],
  },
  {
    level: "Medium" as const,
    icon: Brain,
    color: "from-primary to-accent",
    border: "border-primary/30 hover:border-primary/60",
    glow: "shadow-primary/10 hover:shadow-primary/20",
    desc: "Trees, graphs, DP, React hooks, system design basics, STAR method.",
    topics: ["Trees & Graphs", "React Patterns", "Behavioral STAR"],
  },
  {
    level: "Hard" as const,
    icon: Flame,
    color: "from-red-500 to-orange-600",
    border: "border-red-500/30 hover:border-red-500/60",
    glow: "shadow-red-500/10 hover:shadow-red-500/20",
    desc: "Advanced algorithms, system design, architecture, tough scenarios.",
    topics: ["DP Optimization", "System Design", "Leadership Challenges"],
  },
];

const features = [
  { icon: Mic, label: "Voice Interaction", desc: "AI reads questions aloud" },
  { icon: Camera, label: "Camera Proctoring", desc: "Webcam monitoring active" },
  { icon: Shield, label: "Anti-Cheat", desc: "Tab switch detection enabled" },
  { icon: Brain, label: "AI Follow-ups", desc: "Dynamic conversation flow" },
];

const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Brain className="w-4 h-4" />
            AI Interview Practice
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Mock Interview Simulator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Practice with an AI interviewer that adapts to your answers, asks follow-ups,
            and provides detailed feedback — just like a real placement interview.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/60 border border-border/30 backdrop-blur-sm"
            >
              <f.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">{f.label}</span>
              <span className="text-xs text-muted-foreground text-center">{f.desc}</span>
            </div>
          ))}
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-foreground text-center">
            Select Difficulty Level
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {difficulties.map((d, i) => (
              <motion.div
                key={d.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                onClick={() => onStart(d.level)}
                className={`
                  cursor-pointer rounded-2xl p-6 border transition-all duration-300
                  bg-card/60 backdrop-blur-sm shadow-lg
                  ${d.border} ${d.glow}
                `}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${d.color} mb-4`}>
                  <d.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{d.level}</h3>
                <p className="text-sm text-muted-foreground mb-4">{d.desc}</p>
                <div className="space-y-1.5 mb-4">
                  {d.topics.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-primary/30 hover:bg-primary/10"
                >
                  Start Interview <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewSetup;
