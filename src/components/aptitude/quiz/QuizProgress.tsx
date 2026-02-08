import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuizProgressProps {
  current: number;
  total: number;
  answered: number[];
}

export function QuizProgress({ current, total, answered }: QuizProgressProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Question <span className="text-primary font-bold">{current + 1}</span> of{" "}
          <span className="font-bold">{total}</span>
        </span>
        <span className="text-muted-foreground">
          Answered:{" "}
          <span className="text-[hsl(var(--success))] font-bold">{answered.length}</span>
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
