import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Eye, RefreshCw } from "lucide-react";

type Row = {
  id: string; user_id: string; contest_id: string; problem_id: string;
  language: string; code: string; status: string; score: number;
  passed_count: number; total_count: number; runtime_ms: number | null;
  submitted_at: string;
  contests?: { title: string } | null;
  problems?: { title: string } | null;
  profiles?: { full_name: string | null; email: string } | null;
};

export default function AdminSubmissions() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState<Row | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("contest_submissions")
      .select("*, contests(title), problems(title)")
      .order("submitted_at", { ascending: false })
      .limit(200);
    const subs = (data as any) ?? [];
    const userIds = [...new Set(subs.map((s: any) => s.user_id))];
    const { data: profs } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds);
    const map = new Map((profs ?? []).map((p: any) => [p.user_id, p]));
    setRows(subs.map((s: any) => ({ ...s, profiles: map.get(s.user_id) ?? null })));
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("admin-subs")
      .on("postgres_changes", { event: "*", schema: "public", table: "contest_submissions" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = rows.filter((r) =>
    !q ||
    r.profiles?.email?.toLowerCase().includes(q.toLowerCase()) ||
    r.profiles?.full_name?.toLowerCase().includes(q.toLowerCase()) ||
    r.contests?.title?.toLowerCase().includes(q.toLowerCase()) ||
    r.problems?.title?.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AdminShell title="Submission Monitor">
      <div className="mb-4 flex gap-2">
        <Input placeholder="Search user / contest / problem…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <Button variant="outline" onClick={load}><RefreshCw className="h-4 w-4 mr-1.5" /> Refresh</Button>
        <Badge variant="outline" className="ml-auto self-center">Live updates active</Badge>
      </div>

      <div className="space-y-2">
        {filtered.map((r) => (
          <Card key={r.id}>
            <CardContent className="py-3 grid grid-cols-12 gap-3 items-center text-sm">
              <div className="col-span-3 truncate">
                <p className="font-medium truncate">{r.profiles?.full_name || r.profiles?.email || r.user_id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground truncate">{r.profiles?.email}</p>
              </div>
              <div className="col-span-3 truncate">
                <p className="truncate">{r.contests?.title ?? "—"}</p>
                <p className="text-xs text-muted-foreground truncate">{r.problems?.title ?? "—"}</p>
              </div>
              <div className="col-span-2">
                <Badge variant={r.status === "accepted" ? "default" : "outline"}>{r.status}</Badge>
                <p className="text-xs text-muted-foreground mt-1">{r.passed_count}/{r.total_count}</p>
              </div>
              <div className="col-span-1 text-xs">{r.language}</div>
              <div className="col-span-1 text-xs">{r.runtime_ms ?? "—"} ms</div>
              <div className="col-span-1 font-mono text-xs">{r.score}</div>
              <div className="col-span-1 text-right">
                <Button size="sm" variant="ghost" onClick={() => setViewing(r)}><Eye className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No submissions.</p>}
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Submitted code · {viewing?.language}</DialogTitle></DialogHeader>
          <pre className="text-xs bg-secondary/40 rounded p-3 max-h-[60vh] overflow-auto"><code>{viewing?.code}</code></pre>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
