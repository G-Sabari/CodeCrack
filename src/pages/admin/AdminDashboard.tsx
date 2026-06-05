import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Code2, FileText, Award, Users, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    contests: 0, problems: 0, submissions: 0, certificates: 0, users: 0, active: 0,
  });

  useEffect(() => {
    (async () => {
      const nowIso = new Date().toISOString();
      const [c, p, s, ce, u, a] = await Promise.all([
        supabase.from("contests").select("id", { count: "exact", head: true }),
        supabase.from("problems").select("id", { count: "exact", head: true }),
        supabase.from("contest_submissions").select("id", { count: "exact", head: true }),
        supabase.from("certificates").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("contests").select("id", { count: "exact", head: true }).lte("start_time", nowIso).gte("end_time", nowIso),
      ]);
      setStats({
        contests: c.count ?? 0, problems: p.count ?? 0, submissions: s.count ?? 0,
        certificates: ce.count ?? 0, users: u.count ?? 0, active: a.count ?? 0,
      });
    })();
  }, []);

  const tiles = [
    { label: "Total Users", value: stats.users, icon: Users },
    { label: "Total Contests", value: stats.contests, icon: Trophy },
    { label: "Active Contests", value: stats.active, icon: Activity },
    { label: "Total Problems", value: stats.problems, icon: Code2 },
    { label: "Submissions", value: stats.submissions, icon: FileText },
    { label: "Certificates Issued", value: stats.certificates, icon: Award },
  ];

  return (
    <AdminShell title="Admin Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((t) => (
          <Card key={t.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.label}</CardTitle>
              <t.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{t.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
