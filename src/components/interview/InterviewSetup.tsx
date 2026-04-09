import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain, Zap, Flame, Mic, Camera, Shield, ArrowRight,
  Sparkles, Users, Clock, CheckCircle2, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterviewSetupProps {
  onStart: (difficulty: "Easy" | "Medium" | "Hard") => void;
}

const difficulties = [
  {
    level: "Easy" as const,
    icon: Zap,
    gradient: "from-emerald-500 to-green-600",
    bgGlow: "bg-emerald-500/5",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/50",
    shadowColor: "hover:shadow-emerald-500/10",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dotColor: "bg-emerald-400",
    desc: "Warm-up round with foundational questions. Perfect for building confidence before the real thing.",
    topics: ["Arrays & Strings", "Basic JavaScript", "Introduce yourself", "Simple OOP"],
    duration: "15–20 min",
    questionCount: "5–8 questions",
  },
  {
    level: "Medium" as const,
    icon: Brain,
    gradient: "from-primary to-accent",
    bgGlow: "bg-primary/5",
    borderColor: "border-primary/20 hover:border-primary/50",
    shadowColor: "hover:shadow-primary/10",
    tagColor: "bg-primary/10 text-primary border-primary/20",
    dotColor: "bg-primary",
    desc: "Industry-standard difficulty. Covers core CS topics, system design basics, and behavioral questions.",
    topics: ["Trees & Graphs", "React Patterns", "STAR Method", "System Design Basics"],
    duration: "25–35 min",
    questionCount: "8–12 questions",
  },
  {
    level: "Hard" as const,
    icon: Flame,
    gradient: "from-red-500 to-orange-500",
    bgGlow: "bg-red-500/5",
    borderColor: "border-red-500/20 hover:border-red-500/50",
    shadowColor: "hover:shadow-red-500/10",
    tagColor: "bg-red-500/10 text-red-400 border-red-500/20",
    dotColor: "bg-red-400",
    desc: "FAANG-level interview simulation. Expect probing follow-ups, optimal solution demands, and tough behavioral scenarios.",
    topics: ["DP Optimization", "System Architecture", "Leadership Challenges", "Advanced Algorithms"],
    duration: "35–45 min",
    questionCount: "10–15 questions",
  },
];

const features = [
  {
    icon: Brain,
    label: "AI Interviewer",
    desc: "Adaptive follow-up questions based on your responses",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    icon: Mic,
    label: "Voice Interaction",
    desc: "AI reads questions aloud, speak your answers naturally",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Camera,
    label: "Camera Proctoring",
    desc: "Real-time webcam monitoring with face detection status",
    gradient: "from-emerald-500/20 to-green-500/20",
  },
  {
    icon: Shield,
    label: "Anti-Cheat Engine",
    desc: "Tab switching, window blur, and focus tracking enabled",
    gradient: "from-orange-500/20 to-amber-500/20",
  },
];

const stats = [
  { value: "10K+", label: "Interviews Completed", icon: Users },
  { value: "95%", label: "User Satisfaction", icon: Star },
  { value: "200+", label: "Unique Questions", icon: Sparkles },
];

const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStart }) => {
  const [hoveredDiff, setHoveredDiff] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Mock Interview
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
            Practice Like It's{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              The Real Thing
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            An AI interviewer that adapts, challenges, and coaches you through realistic
            placement interviews — with voice, camera proctoring, and detailed feedback.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-6 md:gap-12"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-5 rounded-2xl bg-card/40 border border-border/30 backdrop-blur-md hover:border-border/60 transition-all duration-300 hover:shadow-lg"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10 flex flex-col items-center text-center gap-3">
                <div className="p-2.5 rounded-xl bg-card/80 border border-border/30 group-hover:border-primary/30 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">{f.label}</span>
                <span className="text-xs text-muted-foreground leading-relaxed">{f.desc}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-5"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Choose Your Challenge</h2>
            <p className="text-sm text-muted-foreground">Select a difficulty that matches your preparation level</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
            {difficulties.map((d, i) => (
              <motion.div
                key={d.level}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.12, type: "spring", stiffness: 150 }}
                onMouseEnter={() => setHoveredDiff(d.level)}
                onMouseLeave={() => setHoveredDiff(null)}
                onClick={() => onStart(d.level)}
                className={`
                  group relative cursor-pointer rounded-2xl border transition-all duration-400 overflow-hidden
                  bg-card/50 backdrop-blur-md shadow-xl
                  ${d.borderColor} ${d.shadowColor}
                  hover:shadow-2xl hover:-translate-y-1
                `}
              >
                {/* Glow overlay */}
                <div className={`absolute inset-0 ${d.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10 p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${d.gradient} shadow-lg`}>
                      <d.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${d.tagColor}`}>
                      {d.level}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>

                  {/* Topics */}
                  <div className="space-y-2">
                    {d.topics.map((t) => (
                      <div key={t} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground/70 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {d.duration}
                    </span>
                    <span>{d.questionCount}</span>
                  </div>

                  {/* CTA */}
                  <Button
                    variant="outline"
                    className={`w-full gap-2 border-border/40 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-300`}
                  >
                    Start Interview
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground/50 pb-4"
        >
          Camera and microphone permissions will be requested when the interview starts.
          Your data stays local and is not stored.
        </motion.p>
      </div>
    </div>
  );
};

export default InterviewSetup;
