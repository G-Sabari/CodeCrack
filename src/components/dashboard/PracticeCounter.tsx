import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Code, Calculator, Users, MessageSquare, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ProblemStats {
  type: string;
  total: number;
  solved: number;
}

export function PracticeCounter() {
  const { user } = useAuth();

  // Fetch problems count by type
  const { data: problemCounts = [] } = useQuery({
    queryKey: ["problem-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("problems")
        .select("problem_type");
      if (error) throw error;

      const counts: Record<string, number> = {};
      data.forEach((p) => {
        counts[p.problem_type] = (counts[p.problem_type] || 0) + 1;
      });
      return counts;
    },
  });

  // Fetch solved problems by current user
  const { data: solvedCounts = {} } = useQuery({
    queryKey: ["solved-counts", user?.id],
    queryFn: async () => {
      if (!user?.id) return {};

      const { data, error } = await supabase
        .from("solved_problems")
        .select(`
          problem_id,
          problems!inner(problem_type)
        `)
        .eq("user_id", user.id)
        .eq("status", "Solved");

      if (error) throw error;

      const counts: Record<string, number> = {};
      data.forEach((sp: any) => {
        const type = sp.problems?.problem_type;
        if (type) {
          counts[type] = (counts[type] || 0) + 1;
        }
      });
      return counts;
    },
    enabled: !!user?.id,
  });

  const stats: ProblemStats[] = [
    {
      type: "Coding",
      total: (problemCounts as Record<string, number>)["Coding"] || 150,
      solved: (solvedCounts as Record<string, number>)["Coding"] || 0,
    },
    {
      type: "Aptitude",
      total: (problemCounts as Record<string, number>)["Aptitude"] || 100,
      solved: (solvedCounts as Record<string, number>)["Aptitude"] || 0,
    },
    {
      type: "Behavioral",
      total: (problemCounts as Record<string, number>)["Behavioral"] || 50,
      solved: (solvedCounts as Record<string, number>)["Behavioral"] || 0,
    },
    {
      type: "GD",
      total: (problemCounts as Record<string, number>)["GD"] || 30,
      solved: (solvedCounts as Record<string, number>)["GD"] || 0,
    },
  ];

  const totalSolved = stats.reduce((acc, s) => acc + s.solved, 0);
  const totalProblems = stats.reduce((acc, s) => acc + s.total, 0);
  const overallPercentage = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  const getIcon = (type: string) => {
    switch (type) {
      case "Coding":
        return <Code className="h-4 w-4" />;
      case "Aptitude":
        return <Calculator className="h-4 w-4" />;
      case "Behavioral":
        return <Users className="h-4 w-4" />;
      case "GD":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "Coding":
        return "text-primary";
      case "Aptitude":
        return "text-[hsl(var(--warning))]";
      case "Behavioral":
        return "text-[hsl(var(--success))]";
      case "GD":
        return "text-purple-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Practice Counter
          </CardTitle>
          <Badge variant="secondary" className="text-lg px-3">
            {totalSolved}/{totalProblems}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Progress value={overallPercentage} className="h-2 flex-1" />
          <span className="text-sm text-muted-foreground">{overallPercentage}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.type}
              className="p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={getColor(stat.type)}>{getIcon(stat.type)}</div>
                <span className="font-medium text-sm">{stat.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xl font-bold ${getColor(stat.type)}`}>
                  {stat.solved}
                </span>
                <span className="text-sm text-muted-foreground">/ {stat.total}</span>
              </div>
              <Progress
                value={stat.total > 0 ? (stat.solved / stat.total) * 100 : 0}
                className="h-1.5 mt-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
