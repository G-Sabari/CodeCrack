import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mic, MicOff, Volume2, VolumeX, StopCircle,
  Clock, AlertTriangle, Bot, User, Eye, EyeOff,
  Radio, BarChart3, MessageCircle, Zap, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import WebcamMonitor from "./WebcamMonitor";
import { useAntiCheat } from "./useAntiCheat";
import { useVoice } from "./useVoice";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface InterviewSessionProps {
  difficulty: "Easy" | "Medium" | "Hard";
  onEnd: (messages: Message[], antiCheatEvents: any[], elapsedTime: number) => void;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ difficulty, onEnd }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const qTimerRef = useRef<ReturnType<typeof setInterval>>();

  const antiCheat = useAntiCheat(true);
  const voice = useVoice();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      setQuestionTimer(0);
      clearInterval(qTimerRef.current);
      qTimerRef.current = setInterval(() => setQuestionTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(qTimerRef.current);
  }, [messages.length]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
  };

  const streamAI = useCallback(
    async (allMessages: Message[]) => {
      setIsLoading(true);
      let assistantText = "";

      try {
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-interview`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ messages: allMessages, difficulty }),
          }
        );

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.error || "AI service error");
        }

        const reader = resp.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIdx);
            buffer = buffer.slice(newlineIdx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantText += content;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant") {
                    return prev.map((m, i) =>
                      i === prev.length - 1 ? { ...m, content: assistantText } : m
                    );
                  }
                  return [...prev, { role: "assistant", content: assistantText }];
                });
              }
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }

        if (assistantText) {
          setQuestionCount((c) => c + 1);
          voice.speak(assistantText);
        }
      } catch (e: any) {
        toast.error(e.message || "Failed to get AI response");
      } finally {
        setIsLoading(false);
      }
    },
    [difficulty, voice]
  );

  useEffect(() => {
    const startMsg: Message = { role: "user", content: "Start the interview. Ask me your first question." };
    setMessages([startMsg]);
    streamAI([startMsg]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = () => {
    const text = (voice.transcript || input).trim();
    if (!text || isLoading) return;

    voice.stopSpeaking();
    voice.stopListening();
    voice.clearTranscript();

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    streamAI(updated);
  };

  const handleEnd = () => {
    clearInterval(timerRef.current);
    clearInterval(qTimerRef.current);
    voice.stopSpeaking();
    voice.stopListening();
    onEnd(messages, antiCheat.events, elapsedTime);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const diffConfig = {
    Easy: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Easy" },
    Medium: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Medium" },
    Hard: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Hard" },
  }[difficulty];

  const visibleMessages = messages.filter(
    (m) => !(m.role === "user" && m.content === "Start the interview. Ask me your first question.")
  );

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* ═══ TOP BAR ═══ */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-border/30 bg-card/40 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground hidden sm:inline">AI Interview</span>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${diffConfig.bg} ${diffConfig.border} border ${diffConfig.color}`}>
            {diffConfig.label}
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/60 border border-border/20 text-xs text-muted-foreground">
            <MessageCircle className="w-3 h-3" />
            <span>Q{questionCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timers */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/60 border border-border/20">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-mono font-medium text-foreground">{formatTime(elapsedTime)}</span>
            <span className="text-[10px] text-muted-foreground/50 ml-1">|</span>
            <span className="text-xs font-mono text-muted-foreground">Q: {formatTime(questionTimer)}</span>
          </div>

          {/* Tab switch indicator */}
          {antiCheat.tabSwitchCount > 0 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-warning/10 border border-warning/20 text-xs font-medium text-warning"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{antiCheat.tabSwitchCount}</span>
            </motion.div>
          )}

          {/* Voice toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => voice.setVoiceEnabled(!voice.voiceEnabled)}
            className="p-2 rounded-full hover:bg-card/60"
          >
            {voice.voiceEnabled ? (
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            ) : (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>

          {/* End button */}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEnd}
            className="gap-1.5 rounded-full px-4"
          >
            <StopCircle className="w-4 h-4" />
            <span className="hidden sm:inline">End Interview</span>
          </Button>
        </div>
      </div>

      {/* ═══ ANTI-CHEAT WARNING BANNER ═══ */}
      <AnimatePresence>
        {antiCheat.showWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-warning/20 bg-warning/5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 px-4 lg:px-6 py-2.5 text-sm text-warning">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{antiCheat.warningMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAIN 3-PANEL LAYOUT ═══ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── LEFT PANEL: Camera + Status (Desktop) ─── */}
        <div className="hidden lg:flex flex-col w-[280px] xl:w-[300px] border-r border-border/20 bg-card/20 backdrop-blur-sm p-4 gap-4 overflow-y-auto">
          {/* Webcam */}
          <WebcamMonitor isActive={true} onWarning={(msg) => antiCheat.addEvent("no_face", msg)} />

          {/* Proctoring Status */}
          <div className="rounded-2xl bg-card/40 border border-border/20 backdrop-blur-md p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Proctoring</span>
            </div>

            <div className="space-y-2">
              <StatusRow icon={<Eye className="w-3.5 h-3.5" />} label="Face Detection" status="active" value="Detected" />
              <StatusRow
                icon={<Radio className="w-3.5 h-3.5" />}
                label="Tab Focus"
                status={antiCheat.tabSwitchCount > 0 ? "warning" : "active"}
                value={antiCheat.tabSwitchCount > 0 ? `${antiCheat.tabSwitchCount} switches` : "Focused"}
              />
              <StatusRow
                icon={voice.isSpeaking ? <Volume2 className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                label="Audio"
                status={voice.isSpeaking ? "speaking" : voice.voiceEnabled ? "active" : "inactive"}
                value={voice.isSpeaking ? "AI Speaking" : voice.voiceEnabled ? "Enabled" : "Muted"}
              />
            </div>
          </div>

          {/* Anti-cheat log */}
          {antiCheat.events.length > 0 && (
            <div className="rounded-2xl bg-card/40 border border-border/20 backdrop-blur-md p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Event Log</span>
                <span className="text-[10px] text-muted-foreground">{antiCheat.events.length} events</span>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1.5 scrollbar-thin">
                {antiCheat.events.slice(-5).reverse().map((ev, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                    <AlertTriangle className="w-3 h-3 text-warning shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{ev.type.replace(/_/g, " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── CENTER PANEL: Chat Area ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-5">
              {visibleMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4.5 h-4.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary/15 border border-primary/20 text-foreground px-5 py-3.5 rounded-br-md"
                        : "bg-card/60 border border-border/20 text-foreground px-5 py-3.5 rounded-bl-md backdrop-blur-sm"
                    }`}
                  >
                    {msg.content}

                    {/* AI speaking indicator */}
                    {msg.role === "assistant" && i === visibleMessages.length - 1 && voice.isSpeaking && (
                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/20">
                        <div className="flex gap-0.5">
                          {[0, 1, 2, 3].map((j) => (
                            <motion.div
                              key={j}
                              className="w-1 rounded-full bg-primary"
                              animate={{ height: [4, 12, 4] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.1 }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-primary/70">AI is speaking...</span>
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-9 h-9 rounded-xl bg-secondary/80 border border-border/20 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4.5 h-4.5 text-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center">
                    <Bot className="w-4.5 h-4.5 text-primary animate-pulse" />
                  </div>
                  <div className="bg-card/60 border border-border/20 rounded-2xl rounded-bl-md px-5 py-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((j) => (
                          <motion.div
                            key={j}
                            className="w-2 h-2 rounded-full bg-primary/50"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: j * 0.15 }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* ─── INPUT AREA ─── */}
          <div className="border-t border-border/20 bg-card/30 backdrop-blur-xl p-4">
            <div className="max-w-3xl mx-auto">
              {/* Voice transcript preview */}
              <AnimatePresence>
                {voice.isListening && voice.transcript && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/15 text-sm text-foreground"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-red-500"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-xs text-primary font-medium">Recording</span>
                    </div>
                    {voice.transcript}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input row */}
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={voice.isListening ? voice.transcript : input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={voice.isListening ? "Listening to your response..." : "Type your answer here... (Enter to send)"}
                    className="min-h-[52px] max-h-[140px] resize-none rounded-xl bg-background/70 border-border/30 focus:border-primary/40 pr-12 text-sm transition-colors"
                    disabled={isLoading || voice.isListening}
                  />
                </div>

                {/* Mic button */}
                <motion.div whileTap={{ scale: 0.92 }}>
                  <Button
                    size="sm"
                    onClick={voice.isListening ? voice.stopListening : voice.startListening}
                    variant={voice.isListening ? "destructive" : "outline"}
                    className={`h-[52px] w-[52px] rounded-xl shrink-0 ${
                      voice.isListening
                        ? "shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                        : "hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    {voice.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                </motion.div>

                {/* Send button */}
                <motion.div whileTap={{ scale: 0.92 }}>
                  <Button
                    size="sm"
                    onClick={handleSend}
                    disabled={isLoading || !(voice.transcript || input).trim()}
                    className="h-[52px] w-[52px] rounded-xl bg-primary hover:bg-primary/90 shrink-0 shadow-lg shadow-primary/20 disabled:shadow-none transition-shadow"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>

              <p className="text-[11px] text-muted-foreground/50 mt-2 text-center">
                Press Enter to send • Shift+Enter for new line • Click 🎤 for voice input
              </p>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL: Controls & Info (Desktop) ─── */}
        <div className="hidden lg:flex flex-col w-[260px] xl:w-[280px] border-l border-border/20 bg-card/20 backdrop-blur-sm p-4 gap-4 overflow-y-auto">
          {/* Difficulty badge */}
          <div className={`rounded-2xl p-4 ${diffConfig.bg} border ${diffConfig.border} backdrop-blur-md`}>
            <div className="flex items-center gap-2 mb-2">
              <Zap className={`w-4 h-4 ${diffConfig.color}`} />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Difficulty</span>
            </div>
            <p className={`text-lg font-bold ${diffConfig.color}`}>{difficulty}</p>
          </div>

          {/* Interview Progress */}
          <div className="rounded-2xl bg-card/40 border border-border/20 backdrop-blur-md p-4 space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Progress</span>
            </div>

            <div className="space-y-3">
              <ProgressRow label="Duration" value={formatTime(elapsedTime)} icon={<Clock className="w-3.5 h-3.5" />} />
              <ProgressRow label="Questions" value={String(questionCount)} icon={<MessageCircle className="w-3.5 h-3.5" />} />
              <ProgressRow label="Question Time" value={formatTime(questionTimer)} icon={<Clock className="w-3.5 h-3.5" />} />

              {/* Visual progress bar */}
              <div className="pt-1">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Interview Progress</span>
                  <span>{Math.min(questionCount * 10, 100)}%</span>
                </div>
                <Progress value={Math.min(questionCount * 10, 100)} className="h-1.5" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl bg-card/40 border border-border/20 backdrop-blur-md p-4 space-y-3">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Quick Stats</span>
            <div className="grid grid-cols-2 gap-2">
              <MiniStat label="Responses" value={String(visibleMessages.filter(m => m.role === "user").length)} color="text-primary" />
              <MiniStat label="AI Msgs" value={String(visibleMessages.filter(m => m.role === "assistant").length)} color="text-accent" />
              <MiniStat
                label="Warnings"
                value={String(antiCheat.events.length)}
                color={antiCheat.events.length > 0 ? "text-warning" : "text-emerald-400"}
              />
              <MiniStat label="Voice" value={voice.voiceEnabled ? "On" : "Off"} color="text-muted-foreground" />
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-2xl bg-card/40 border border-border/20 backdrop-blur-md p-4 space-y-2">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Interview Tips</span>
            <ul className="space-y-1.5">
              {[
                "Think before you answer",
                "Ask clarifying questions",
                "Use STAR for behavioral Q's",
                "Stay on this tab",
                "Speak clearly if using voice",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed">
                  <div className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Sub-components ─── */

const StatusRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  status: "active" | "warning" | "inactive" | "speaking";
  value: string;
}> = ({ icon, label, status, value }) => {
  const colors = {
    active: { dot: "bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]", text: "text-emerald-400" },
    warning: { dot: "bg-warning shadow-[0_0_6px_rgba(251,191,36,0.5)]", text: "text-warning" },
    inactive: { dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
    speaking: { dot: "bg-primary shadow-[0_0_6px_rgba(var(--primary),0.5)] animate-pulse", text: "text-primary" },
  }[status];

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`text-xs font-medium ${colors.text}`}>{value}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      </div>
    </div>
  );
};

const ProgressRow: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
    <span className="text-sm font-mono font-medium text-foreground">{value}</span>
  </div>
);

const MiniStat: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="p-2.5 rounded-xl bg-background/40 border border-border/10 text-center">
    <div className={`text-lg font-bold ${color}`}>{value}</div>
    <div className="text-[10px] text-muted-foreground">{label}</div>
  </div>
);

export default InterviewSession;
