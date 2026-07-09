import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Badge as BadgeT } from "@/hooks/usePlacementData";

export function AchievementBadgeGrid({ badges }: { badges: BadgeT[] }) {
  const unlocked = badges.filter((b) => b.unlocked).length;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>{unlocked}/{badges.length} unlocked</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              title={b.description}
              className={cn(
                "relative flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all",
                b.unlocked
                  ? "border-primary/40 bg-primary/5 hover:scale-105"
                  : "border-border bg-muted/30 opacity-60"
              )}
            >
              <div className="text-3xl mb-1">{b.icon}</div>
              <div className="text-xs font-medium leading-tight line-clamp-2">{b.label}</div>
              {!b.unlocked && (
                <Lock className="absolute top-1.5 right-1.5 h-3 w-3 text-muted-foreground" />
              )}
              {b.unlocked && b.unlockedAt && (
                <div className="text-[10px] text-muted-foreground mt-1">
                  {new Date(b.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
