import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CategoryProgress } from "@/hooks/usePlacementData";

export function CareerProgressGrid({ categories, overall }: { categories: CategoryProgress[]; overall: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Progress</CardTitle>
        <CardDescription>Overall career progress: <span className="font-semibold text-foreground">{overall}%</span></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.key} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{c.label}</span>
                <span className="text-sm font-bold">{c.percent}%</span>
              </div>
              <Progress value={c.percent} className="h-2 mb-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{c.completed} done</span>
                <span>{c.remaining} remaining</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
