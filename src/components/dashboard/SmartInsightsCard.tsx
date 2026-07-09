import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Insight } from "@/hooks/usePlacementData";

const iconFor = (t: Insight["tone"]) =>
  t === "positive" ? CheckCircle2 : t === "warning" ? AlertTriangle : Lightbulb;

const toneClass = (t: Insight["tone"]) =>
  t === "positive" ? "text-emerald-500 bg-emerald-500/10" :
  t === "warning" ? "text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10" :
  "text-primary bg-primary/10";

export function SmartInsightsCard({ insights }: { insights: Insight[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Smart Insights
        </CardTitle>
        <CardDescription>Personalized guidance based on your activity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">Do more activities to unlock insights.</p>
        ) : insights.map((i) => {
          const Icon = iconFor(i.tone);
          return (
            <div key={i.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <div className={`h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0 ${toneClass(i.tone)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm">{i.text}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
