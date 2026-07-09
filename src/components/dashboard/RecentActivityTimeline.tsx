import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { ActivityItem } from "@/hooks/usePlacementData";

export function RecentActivityTimeline({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Everything you've done, newest first.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No activity yet.</p>
        ) : (
          <ol className="relative border-l border-border ml-2 space-y-4">
            {items.map((item) => (
              <li key={item.id} className="ml-4">
                <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-primary" />
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{item.kind}</Badge>
                      <span className="text-xs text-muted-foreground">{item.meta}</span>
                      {item.xp ? <span className="text-xs text-yellow-500 font-medium">+{item.xp} XP</span> : null}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(item.at), { addSuffix: true })}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
