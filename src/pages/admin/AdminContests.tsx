import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Contest = {
  id: string; slug: string; title: string; description: string | null;
  category: string; start_time: string; end_time: string; duration_minutes: number;
  total_points: number; status: string;
};

const toLocal = (iso?: string) => iso ? new Date(iso).toISOString().slice(0, 16) : "";
const fromLocal = (v: string) => new Date(v).toISOString();
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminContests() {
  const [list, setList] = useState<Contest[]>([]);
  const [editing, setEditing] = useState<Partial<Contest> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("contests").select("*").order("start_time", { ascending: false });
    setList((data as Contest[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title || !editing.start_time || !editing.end_time) {
      toast.error("Title, start, end required"); return;
    }
    const payload = {
      title: editing.title,
      slug: editing.slug?.trim() || slugify(editing.title),
      description: editing.description ?? null,
      category: editing.category || "mixed",
      start_time: editing.start_time,
      end_time: editing.end_time,
      duration_minutes: editing.duration_minutes ?? 90,
      total_points: editing.total_points ?? 400,
      status: editing.status || "upcoming",
    };
    const q = editing.id
      ? supabase.from("contests").update(payload).eq("id", editing.id)
      : supabase.from("contests").insert(payload);
    const { error } = await q;
    if (error) { toast.error(error.message); return; }
    toast.success("Saved"); setOpen(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this contest? This cascades to problems, submissions, and certificates.")) return;
    const { error } = await supabase.from("contests").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <AdminShell title="Contest Management">
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ category: "mixed", duration_minutes: 90, total_points: 400, status: "upcoming" })}>
              <Plus className="h-4 w-4 mr-1.5" /> New contest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} contest</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input value={editing?.title ?? ""} onChange={(e) => setEditing({ ...editing!, title: e.target.value })} />
              </div>
              <div>
                <Label>Slug (URL)</Label>
                <Input placeholder="auto from title" value={editing?.slug ?? ""} onChange={(e) => setEditing({ ...editing!, slug: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea rows={3} value={editing?.description ?? ""} onChange={(e) => setEditing({ ...editing!, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start</Label>
                  <Input type="datetime-local" value={toLocal(editing?.start_time)} onChange={(e) => setEditing({ ...editing!, start_time: fromLocal(e.target.value) })} />
                </div>
                <div>
                  <Label>End</Label>
                  <Input type="datetime-local" value={toLocal(editing?.end_time)} onChange={(e) => setEditing({ ...editing!, end_time: fromLocal(e.target.value) })} />
                </div>
                <div>
                  <Label>Duration (min)</Label>
                  <Input type="number" value={editing?.duration_minutes ?? 90} onChange={(e) => setEditing({ ...editing!, duration_minutes: +e.target.value })} />
                </div>
                <div>
                  <Label>Total points</Label>
                  <Input type="number" value={editing?.total_points ?? 400} onChange={(e) => setEditing({ ...editing!, total_points: +e.target.value })} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={editing?.category ?? "mixed"} onChange={(e) => setEditing({ ...editing!, category: e.target.value })} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Input value={editing?.status ?? "upcoming"} onChange={(e) => setEditing({ ...editing!, status: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {list.map((c) => (
          <Card key={c.id}>
            <CardContent className="py-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{c.title}</p>
                  <Badge variant="outline" className="text-xs">{c.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono">/{c.slug}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(c.start_time).toLocaleString()} → {new Date(c.end_time).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditing(c); setOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(c.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {list.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No contests yet.</p>}
      </div>
    </AdminShell>
  );
}
