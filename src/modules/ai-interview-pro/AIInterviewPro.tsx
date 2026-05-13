import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LeftPanel from "./components/LeftPanel";
import CenterPanel, { ChatMsg } from "./components/CenterPanel";
import RightPanel, { Category, Difficulty } from "./components/RightPanel";
import {
  useNetwork, useTabFocus, useTimer, useWebcam, useSpeechInput, speak,
} from "./hooks/useMonitoring";
import styles from "./AIInterviewPro.module.scss";

const TOTAL_QUESTIONS = 8;

const AIInterviewPro: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [category, setCategory] = useState<Category>("DSA");
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [answersGiven, setAnswersGiven] = useState(0);

  const { videoRef, camOn, micOn, error: camError } = useWebcam(started && !ended);
  const { warnings, focused } = useTabFocus();
  const online = useNetwork();
  const { fmt: timer } = useTimer(started && !ended);

  const speechCb = useCallback((t: string) => setInput(t), []);
  const { listening, supported: micSupported, toggle: toggleMic } = useSpeechInput(speechCb);

  const callAI = useCallback(async (allMessages: ChatMsg[]) => {
    setStreaming(true);
    let assistantText = "";
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const seeded: ChatMsg[] = allMessages.length === 0
        ? [{ role: "user", content: `Begin a ${difficulty} ${category} placement interview. Introduce yourself briefly and ask the first question.` }]
        : allMessages;

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-interview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ messages: seeded, difficulty }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "AI service error");
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Insert placeholder assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages((prev) => prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantText } : m
              ));
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (assistantText) {
        setQuestionsAsked((c) => c + 1);
        speak(assistantText);
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to reach AI");
      setMessages((prev) => prev.filter((m) => m.content));
    } finally {
      setStreaming(false);
    }
  }, [difficulty, category]);

  // Kick off first question when started
  useEffect(() => {
    if (started && messages.length === 0 && !streaming) {
      callAI([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const handleSubmit = useCallback(() => {
    const text = input.trim();
    if (!text || streaming) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setAnswersGiven((c) => c + 1);
    callAI(next);
  }, [input, messages, streaming, callAI]);

  const handleStart = () => {
    setStarted(true);
    setEnded(false);
    setMessages([]);
    setQuestionsAsked(0);
    setAnswersGiven(0);
  };

  const handleEnd = () => {
    setEnded(true);
    setStarted(false);
    window.speechSynthesis?.cancel();
  };

  const handleReset = () => {
    setEnded(false);
    setMessages([]);
    setQuestionsAsked(0);
    setAnswersGiven(0);
  };

  if (ended) {
    return (
      <div className={styles.shell}>
        <div className={styles.summary}>
          <div className={styles.summaryTitle}>Interview Complete</div>
          <div className={styles.summaryText}>
            Great job! Here's a quick snapshot of your session.
          </div>
          <div className={styles.summaryStats}>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{answersGiven}</div>
              <div className={styles.statLabel}>Answers given</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{questionsAsked}</div>
              <div className={styles.statLabel}>Questions asked</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{timer}</div>
              <div className={styles.statLabel}>Duration</div>
            </div>
          </div>
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => (window.location.href = "/dashboard")}>
              Back to Dashboard
            </button>
            <button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleReset}>
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          AI Interview Pro
        </div>
        <div className={styles.subtitle}>
          {started ? `${category} · ${difficulty}` : "Configure and click Start"}
        </div>
        {!started && (
          <button
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={handleStart}
            type="button"
          >
            Start Interview
          </button>
        )}
      </div>

      <div className={styles.grid}>
        <LeftPanel
          videoRef={videoRef}
          camOn={camOn}
          micOn={micOn}
          online={online}
          focused={focused}
          tabWarnings={warnings}
          camError={camError}
        />
        <CenterPanel
          messages={messages}
          streaming={streaming}
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          listening={listening}
          onToggleMic={toggleMic}
          micSupported={micSupported}
          disabled={!started || streaming}
        />
        <RightPanel
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          category={category}
          setCategory={setCategory}
          timer={timer}
          questionsAsked={questionsAsked}
          totalQuestions={TOTAL_QUESTIONS}
          answersGiven={answersGiven}
          tabWarnings={warnings}
          started={started}
          onEnd={handleEnd}
        />
      </div>
    </div>
  );
};

export default AIInterviewPro;
