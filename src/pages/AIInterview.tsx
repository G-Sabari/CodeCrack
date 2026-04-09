import React, { useState } from "react";
import InterviewSetup from "@/components/interview/InterviewSetup";
import InterviewSession from "@/components/interview/InterviewSession";
import InterviewResults from "@/components/interview/InterviewResults";
import { BackButton } from "@/components/ui/back-button";

type Phase = "setup" | "session" | "results";

interface ResultData {
  messages: { role: "user" | "assistant"; content: string }[];
  antiCheatEvents: any[];
  elapsedTime: number;
}

const AIInterview: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("setup");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [resultData, setResultData] = useState<ResultData | null>(null);

  const handleStart = (diff: "Easy" | "Medium" | "Hard") => {
    setDifficulty(diff);
    setPhase("session");
  };

  const handleEnd = (
    messages: { role: "user" | "assistant"; content: string }[],
    antiCheatEvents: any[],
    elapsedTime: number
  ) => {
    setResultData({ messages, antiCheatEvents, elapsedTime });
    setPhase("results");
  };

  const handleRestart = () => {
    setResultData(null);
    setPhase("setup");
  };

  return (
    <>
      {phase !== "session" && (
        <div className="fixed top-4 left-4 z-50">
          <BackButton />
        </div>
      )}
      {phase === "setup" && <InterviewSetup onStart={handleStart} />}
      {phase === "session" && (
        <InterviewSession difficulty={difficulty} onEnd={handleEnd} />
      )}
      {phase === "results" && resultData && (
        <InterviewResults
          messages={resultData.messages}
          antiCheatEvents={resultData.antiCheatEvents}
          elapsedTime={resultData.elapsedTime}
          difficulty={difficulty}
          onRestart={handleRestart}
        />
      )}
    </>
  );
};

export default AIInterview;
