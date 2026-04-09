import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mic, MicOff, Volume2, VolumeX, StopCircle,
  Clock, AlertTriangle, MessageSquare, Bot, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Global timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Per-question timer
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

  // Stream AI response
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

  // Start interview on mount
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

  const diffColor =
    difficulty === "Easy"
      ? "text-green-400"
      : difficulty === "Medium"
      ? "text-primary"
      : "text-red-400";

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">AI Interview</span>
          </div>
          <span className={`text-sm font-medium ${diffColor}`}>{difficulty}</span>
          <span className="text-sm text-muted-foreground">Q{questionCount}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {formatTime(elapsedTime)}
          </div>
          <div className="text-xs text-muted-foreground/70">
            Q: {formatTime(questionTimer)}
          </div>
          {antiCheat.tabSwitchCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-warning">
              <AlertTriangle className="w-3.5 h-3.5" />
              {antiCheat.tabSwitchCount}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => voice.setVoiceEnabled(!voice.voiceEnabled)}
            className="p-2"
          >
            {voice.voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleEnd} className="gap-1.5">
            <StopCircle className="w-4 h-4" /> End
          </Button>
        </div>
      </div>

      {/* Anti-cheat warning */}
      <AnimatePresence>
        {antiCheat.showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-2 p-3 rounded-lg bg-warning/10 border border-warning/30 text-warning text-sm flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {antiCheat.warningMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages
              .filter((m) => !(m.role === "user" && m.content === "Start the interview. Ask me your first question."))
              .map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary/20 border border-primary/30 text-foreground"
                        : "bg-card/80 border border-border/30 text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="bg-card/80 border border-border/30 rounded-2xl p-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50 bg-card/40 backdrop-blur-sm">
            {voice.isListening && voice.transcript && (
              <div className="mb-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-sm text-foreground">
                <span className="text-xs text-primary mr-2">🎤 Listening:</span>
                {voice.transcript}
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                value={voice.isListening ? voice.transcript : input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer or use the microphone..."
                className="min-h-[48px] max-h-[120px] resize-none bg-background/60 border-border/50"
                disabled={isLoading || voice.isListening}
              />
              <div className="flex flex-col gap-1.5">
                <Button
                  size="sm"
                  onClick={voice.isListening ? () => { voice.stopListening(); } : voice.startListening}
                  variant={voice.isListening ? "destructive" : "outline"}
                  className="p-2"
                >
                  {voice.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={isLoading || (!(voice.transcript || input).trim())}
                  className="p-2 bg-primary hover:bg-primary/80"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Webcam + Info */}
        <div className="hidden lg:flex flex-col w-72 border-l border-border/50 bg-card/30 p-4 gap-4">
          <WebcamMonitor isActive={true} onWarning={(msg) => antiCheat.addEvent("no_face", msg)} />

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-card/60 border border-border/30">
              <div className="text-xs text-muted-foreground mb-1">Interview Stats</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <div className="font-medium text-foreground">{formatTime(elapsedTime)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Questions:</span>
                  <div className="font-medium text-foreground">{questionCount}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Tab Switches:</span>
                  <div className={`font-medium ${antiCheat.tabSwitchCount > 0 ? "text-warning" : "text-green-400"}`}>
                    {antiCheat.tabSwitchCount}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Voice:</span>
                  <div className="font-medium text-foreground">
                    {voice.isSpeaking ? "🔊" : voice.voiceEnabled ? "On" : "Off"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-card/60 border border-border/30">
              <div className="text-xs text-muted-foreground mb-1">Tips</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Think aloud before answering</li>
                <li>• Ask clarifying questions</li>
                <li>• Use STAR method for behavioral Q's</li>
                <li>• Don't switch tabs during interview</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
