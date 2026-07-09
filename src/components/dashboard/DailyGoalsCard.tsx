import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import type { DailyGoal } from "@/hooks/usePlacementData";

export function DailyGoalsCard({ goals }: { goals: DailyGoal[] }) {
  const done = goals.filter((g) => g.done).length;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Goals</CardTitle>
        <CardDescription>{done}/{goals.length} completed today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {goals.map((g) => (
          <Link
            key={g.id}
            to={g.to}
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {g.done ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={`text-sm ${g.done ? "line-through text-muted-foreground" : "font-medium"}`}>{g.label}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
