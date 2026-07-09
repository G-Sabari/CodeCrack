import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle } from "lucide-react";
import type { ContinueItem } from "@/hooks/usePlacementData";

export function ContinueLearningCard({ items }: { items: ContinueItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Learning</CardTitle>
        <CardDescription>Pick up where you left off.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Nothing in progress yet — start a module to see it here.</p>
        ) : items.map((it) => (
          <div key={it.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium truncate">{it.label}</span>
              <span className="text-xs text-muted-foreground">{it.percent}%</span>
            </div>
            <Progress value={it.percent} className="h-1.5 mb-2" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{it.meta}</span>
              <Button asChild size="sm" variant="ghost">
                <Link to={it.to}><PlayCircle className="h-4 w-4 mr-1" />Continue</Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
