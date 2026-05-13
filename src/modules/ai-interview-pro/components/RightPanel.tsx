import React from "react";
import styles from "./RightPanel.module.scss";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Category = "DSA" | "Web Dev" | "HR" | "System Design";

interface Props {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  category: Category;
  setCategory: (c: Category) => void;
  timer: string;
  questionsAsked: number;
  totalQuestions: number;
  answersGiven: number;
  tabWarnings: number;
  started: boolean;
  onEnd: () => void;
}

const DIFFS: Difficulty[] = ["Easy", "Medium", "Hard"];
const CATS: Category[] = ["DSA", "Web Dev", "HR", "System Design"];

const RightPanel: React.FC<Props> = ({
  difficulty, setDifficulty, category, setCategory, timer,
  questionsAsked, totalQuestions, answersGiven, tabWarnings, started, onEnd,
}) => {
  const pct = Math.min(100, Math.round((questionsAsked / totalQuestions) * 100));

  return (
    <aside className={styles.panel}>
      <div className={styles.title}>Session Controls</div>

      <div className={styles.group}>
        <span className={styles.label}>Difficulty</span>
        <div className={styles.options}>
          {DIFFS.map((d) => (
            <button
              key={d}
              type="button"
              disabled={started}
              className={`${styles.opt} ${difficulty === d ? styles.active : ""}`}
              onClick={() => setDifficulty(d)}
            >{d}</button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Category</span>
        <select
          className={styles.select}
          value={category}
          disabled={started}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className={styles.timer}>{timer}</div>

      <div className={styles.group}>
        <div className={styles.progressText}>
          <span>Progress</span>
          <span>{questionsAsked}/{totalQuestions}</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Answered</div>
          <div className={styles.metricValue}>{answersGiven}</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Warnings</div>
          <div className={styles.metricValue}>{tabWarnings}</div>
        </div>
      </div>

      <button className={styles.endBtn} onClick={onEnd} type="button">
        End Interview
      </button>
    </aside>
  );
};

export default RightPanel;
