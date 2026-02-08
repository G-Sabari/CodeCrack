import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isRunning: boolean;
}

export function QuizTimer({ duration, onTimeUp, isRunning }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / duration) * 100;

  const getColorClass = () => {
    if (percentage > 50) return "text-[hsl(var(--success))]";
    if (percentage > 25) return "text-[hsl(var(--warning))]";
    return "text-destructive";
  };

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
      <Clock className={cn("h-5 w-5", getColorClass())} />
      <div className="flex flex-col">
        <span className={cn("text-lg font-mono font-bold", getColorClass())}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        <div className="h-1 w-20 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-1000", {
              "bg-[hsl(var(--success))]": percentage > 50,
              "bg-[hsl(var(--warning))]": percentage <= 50 && percentage > 25,
              "bg-destructive": percentage <= 25,
            })}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
