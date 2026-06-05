import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Problem = {
  id: string; title: string; description: string; problem_type: string;
  difficulty: string; topic: string; tags: string[] | null;
  starter_code: any; test_cases: any;
};

export default function AdminProblems() {
  const [list, setList] = useState<Problem[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<Problem> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("problems").select("*").order("created_at", { ascending: false }).limit(500);
    setList((data as Problem[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => list.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.topic?.toLowerCase().includes(q.toLowerCase())),
    [list, q],
  );

  const save = async () => {
    if (!editing?.title || !editing.description || !editing.problem_type || !editing.topic) {
      toast.error("Title, description, type, topic required"); return;
    }
    const payload: any = {
      title: editing.title,
      description: editing.description,
      problem_type: editing.problem_type,
      difficulty: editing.difficulty || "Medium",
      topic: editing.topic,
      tags: typeof (editing as any).tagsStr === "string"
        ? (editing as any).tagsStr.split(",").map((s: string) => s.trim()).filter(Boolean)
        : editing.tags ?? [],
      starter_code: tryParse(editing.starter_code, {}),
      test_cases: tryParse(editing.test_cases, []),
    };
    const q = editing.id
      ? supabase.from("problems").update(payload).eq("id", editing.id)
      : supabase.from("problems").insert(payload);
    const { error } = await q;
    if (error) { toast.error(error.message); return; }
    toast.success("Saved"); setOpen(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this problem?")) return;
    const { error } = await supabase.from("problems").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <AdminShell title="Problem Management">
      <div className="mb-4 flex items-center gap-2">
        <Input placeholder="Search title or topic…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <div className="flex-1" />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ difficulty: "Medium", problem_type: "coding" })}>
              <Plus className="h-4 w-4 mr-1.5" /> New problem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} problem</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={editing?.title ?? ""} onChange={(e) => setEditing({ ...editing!, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={6} value={editing?.description ?? ""} onChange={(e) => setEditing({ ...editing!, description: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Type</Label><Input value={editing?.problem_type ?? "coding"} onChange={(e) => setEditing({ ...editing!, problem_type: e.target.value })} /></div>
                <div><Label>Difficulty</Label><Input value={editing?.difficulty ?? "Medium"} onChange={(e) => setEditing({ ...editing!, difficulty: e.target.value })} /></div>
                <div><Label>Topic</Label><Input value={editing?.topic ?? ""} onChange={(e) => setEditing({ ...editing!, topic: e.target.value })} /></div>
              </div>
              <div><Label>Tags (comma separated)</Label>
                <Input
                  value={(editing as any)?.tagsStr ?? (editing?.tags ?? []).join(", ")}
                  onChange={(e) => setEditing({ ...editing!, ...(({ tagsStr: e.target.value } as any)) })}
                />
              </div>
              <div><Label>Starter code (JSON: {`{ "python": "..." }`})</Label>
                <Textarea rows={4} value={typeof editing?.starter_code === "string" ? editing!.starter_code as any : JSON.stringify(editing?.starter_code ?? {}, null, 2)} onChange={(e) => setEditing({ ...editing!, starter_code: e.target.value as any })} />
              </div>
              <div><Label>Hidden test cases (JSON array)</Label>
                <Textarea rows={4} value={typeof editing?.test_cases === "string" ? editing!.test_cases as any : JSON.stringify(editing?.test_cases ?? [], null, 2)} onChange={(e) => setEditing({ ...editing!, test_cases: e.target.value as any })} />
              </div>
            </div>
            <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {filtered.map((p) => (
          <Card key={p.id}>
            <CardContent className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{p.title}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">{p.difficulty}</Badge>
                  <Badge variant="outline" className="text-xs">{p.topic}</Badge>
                  {(p.tags ?? []).slice(0, 3).map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => { setEditing({ ...p, starter_code: JSON.stringify(p.starter_code ?? {}, null, 2) as any, test_cases: JSON.stringify(p.test_cases ?? [], null, 2) as any }); setOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No problems.</p>}
      </div>
    </AdminShell>
  );
}

function tryParse(v: any, fallback: any) {
  if (typeof v !== "string") return v ?? fallback;
  try { return JSON.parse(v); } catch { return fallback; }
}
