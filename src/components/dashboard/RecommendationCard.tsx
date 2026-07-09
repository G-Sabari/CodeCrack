import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function RecommendationCard({ rec }: { rec: { title: string; body: string; to: string; cta: string } | null }) {
  if (!rec) return null;
  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-transparent">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-1">Recommended Next Step</p>
            <h3 className="font-bold text-lg leading-tight">{rec.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{rec.body}</p>
          </div>
        </div>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link to={rec.to}>{rec.cta}<ArrowRight className="h-4 w-4 ml-2" /></Link>
        </Button>
      </CardContent>
    </Card>
  );
}
