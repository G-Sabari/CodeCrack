import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreGauge } from "@/components/resume/ScoreGauge";
import { Flame, Zap, Coins, TrendingUp } from "lucide-react";
import type { PlacementData } from "@/hooks/usePlacementData";

const tierClass: Record<string, string> = {
  "Beginner": "bg-muted text-foreground",
  "Intermediate": "bg-primary/10 text-primary border-primary/30",
  "Advanced": "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  "Placement Ready": "bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground border-0",
};

export function PlacementReadinessCard({ data }: { data: PlacementData }) {
  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5">
      <CardContent className="p-6 md:p-8">
        <div className="grid md:grid-cols-[auto,1fr] gap-6 md:gap-10 items-center">
          <div className="flex flex-col items-center">
            <ScoreGauge value={data.readiness} label="Readiness" size={180} />
            <Badge variant="outline" className={`mt-3 ${tierClass[data.tier]}`}>{data.tier}</Badge>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Placement Readiness</h2>
              <p className="text-muted-foreground text-sm">
                Combined score from DSA, aptitude, resume, roadmap and certificates — updated in real time.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MiniStat icon={TrendingUp} label="Level" value={String(data.level)} tint="text-primary bg-primary/10" />
              <MiniStat icon={Zap} label="XP" value={data.xp.toLocaleString()} tint="text-yellow-500 bg-yellow-500/10" />
              <MiniStat icon={Flame} label="Streak" value={`${data.streak}d`} tint="text-orange-500 bg-orange-500/10" />
              <MiniStat icon={Coins} label="Coins" value={data.coins.toLocaleString()} tint="text-amber-500 bg-amber-500/10" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Level {data.level} → {data.level + 1}</span>
                <span>{data.xpToNext} XP to next</span>
              </div>
              <Progress value={data.levelProgress} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ icon: Icon, label, value, tint }: any) {
  return (
    <div className="rounded-lg border border-border p-3 bg-background/60 backdrop-blur">
      <div className={`h-8 w-8 rounded-md flex items-center justify-center mb-2 ${tint}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-lg font-bold leading-none">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
