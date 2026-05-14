import React, { useEffect, useRef } from "react";
import { FiMic, FiSend } from "react-icons/fi";
import styles from "./CenterPanel.module.scss";

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  messages: ChatMsg[];
  streaming: boolean;
  input: string;
  setInput: (v: string) => void;
  onSubmit: () => void;
  listening: boolean;
  onToggleMic: () => void;
  micSupported: boolean;
  disabled: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const CenterPanel: React.FC<Props> = ({
  messages, streaming, input, setInput, onSubmit, listening, onToggleMic, micSupported, disabled,
  error, onRetry,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && input.trim()) onSubmit();
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>AI Interviewer</div>
        <div className={styles.aiBadge}>
          <span className={styles.aiPulse} />
          {streaming ? "Speaking…" : "Ready"}
        </div>
      </div>

      <div ref={scrollRef} className={styles.chat}>
        {messages.length === 0 && !streaming && (
          <div className={styles.empty}>The interview will begin shortly…</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`${styles.msg} ${m.role === "user" ? styles.user : styles.assistant}`}>
            {m.content}
          </div>
        ))}
        {streaming && (
          <div className={styles.typing}>
            <span /><span /><span />
          </div>
        )}
      </div>

      <div className={styles.composer}>
        {micSupported && (
          <button
            className={`${styles.iconBtn} ${listening ? styles.active : ""}`}
            onClick={onToggleMic}
            type="button"
            aria-label="Toggle microphone"
            disabled={disabled}
          >
            <FiMic size={18} />
          </button>
        )}
        <textarea
          className={styles.textarea}
          placeholder="Type your answer… (Shift+Enter for new line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          rows={1}
        />
        <button
          className={styles.submitBtn}
          onClick={onSubmit}
          disabled={disabled || !input.trim()}
          type="button"
        >
          <FiSend size={16} /> Send
        </button>
      </div>
    </section>
  );
};

export default CenterPanel;
