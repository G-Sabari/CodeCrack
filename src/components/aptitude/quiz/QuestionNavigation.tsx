import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Flag } from "lucide-react";

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: number[];
  flaggedQuestions: number[];
  onNavigate: (index: number) => void;
}

export function QuestionNavigation({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
}: QuestionNavigationProps) {
  return (
    <div className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
        Question Navigator
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isAnswered = answeredQuestions.includes(index);
          const isFlagged = flaggedQuestions.includes(index);
          const isCurrent = index === currentQuestion;

          return (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={cn(
                "relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200",
                "hover:scale-105 hover:shadow-lg",
                {
                  "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.4)]":
                    isCurrent,
                  "bg-[hsl(var(--success))] text-primary-foreground": isAnswered && !isCurrent,
                  "bg-secondary text-secondary-foreground": !isAnswered && !isCurrent,
                  "ring-2 ring-[hsl(var(--warning))]": isFlagged,
                }
              )}
            >
              {index + 1}
              {isFlagged && (
                <Flag className="absolute -top-1 -right-1 h-3 w-3 text-[hsl(var(--warning))]" />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary" />
          <span className="text-muted-foreground">Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[hsl(var(--success))]" />
          <span className="text-muted-foreground">Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-secondary" />
          <span className="text-muted-foreground">Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-secondary ring-2 ring-[hsl(var(--warning))]" />
          <span className="text-muted-foreground">Flagged</span>
        </div>
      </div>
    </div>
  );
}
