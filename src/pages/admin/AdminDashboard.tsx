import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Code2, FileText, Award, Users, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    problems: 0, certificates: 0, pending: 0, users: 0,
  });

  useEffect(() => {
    (async () => {
      const [p, ce, pe, u] = await Promise.all([
        supabase.from("problems").select("id", { count: "exact", head: true }),
        supabase.from("certificates").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("certificates").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        problems: p.count ?? 0,
        certificates: ce.count ?? 0,
        pending: pe.count ?? 0,
        users: u.count ?? 0,
      });
    })();
  }, []);

  const tiles = [
    { label: "Total Users", value: stats.users, icon: Users },
    { label: "Total Problems", value: stats.problems, icon: Code2 },
    { label: "Pending Cert Requests", value: stats.pending, icon: Clock },
    { label: "Certificates Issued", value: stats.certificates, icon: Award },
  ];

  return (
    <AdminShell title="Admin Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
