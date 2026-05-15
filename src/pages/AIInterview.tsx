import React, { useState } from "react";
import InterviewSetup from "@/components/interview/InterviewSetup";
import InterviewSession from "@/components/interview/InterviewSession";
import InterviewResults from "@/components/interview/InterviewResults";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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

  // Session phase stays fullscreen for immersive interview UX.
  // Setup & Results use the standard CodeCrack layout (Navbar + Footer).
  if (phase === "session") {
    return <InterviewSession difficulty={difficulty} onEnd={handleEnd} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        {phase === "setup" && <InterviewSetup onStart={handleStart} />}
        {phase === "results" && resultData && (
          <InterviewResults
            messages={resultData.messages}
            antiCheatEvents={resultData.antiCheatEvents}
            elapsedTime={resultData.elapsedTime}
            difficulty={difficulty}
            onRestart={handleRestart}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AIInterview;
