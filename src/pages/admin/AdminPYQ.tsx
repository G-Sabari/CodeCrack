import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, HelpCircle } from "lucide-react";

type PYQ = {
  id: string;
  company_id: string | null;
  year: number;
  topic: string;
  subtopic: string | null;
  difficulty: string;
  question: string;
  solution: string | null;
  explanation: string | null;
  hints: string[] | null;
  tags: string[] | null;
  question_type: string;
};

type Company = { id: string; name: string };

type Draft = Partial<PYQ> & { hintsStr?: string; tagsStr?: string };

const emptyDraft = (): Draft => ({
  year: new Date().getFullYear(),
  difficulty: "Medium",
  question_type: "coding",
  topic: "",
  question: "",
  hintsStr: "",
  tagsStr: "",
});

export default function AdminPYQ() {
  const [list, setList] = useState<PYQ[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Draft | null>(null);

  const load = async () => {
    const [{ data }, { data: cos }] = await Promise.all([
      supabase.from("pyq_questions").select("*").order("year", { ascending: false }).limit(500),
      supabase.from("companies").select("id, name").order("name"),
    ]);
    setList((data as PYQ[]) ?? []);
    setCompanies((cos as Company[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const companyName = (id: string | null) => companies.find((c) => c.id === id)?.name ?? "—";

  const filtered = useMemo(
    () => list.filter((p) => !q || p.question.toLowerCase().includes(q.toLowerCase()) || p.topic.toLowerCase().includes(q.toLowerCase()) || companyName(p.company_id).toLowerCase().includes(q.toLowerCase())),
    [list, q, companies],
  );

  const openNew = () => { setEditing(emptyDraft()); setOpen(true); };
  const openEdit = (p: PYQ) => {
    setEditing({
      ...p,
      hintsStr: (p.hints ?? []).join("\n"),
      tagsStr: (p.tags ?? []).join(", "),
    });
    setOpen(true);
  };

  const save = async () => {
    if (!editing?.question || !editing.topic || !editing.year) { toast.error("Question, topic and year required"); return; }
    const payload: any = {
      company_id: editing.company_id || null,
      year: editing.year,
      topic: editing.topic.trim(),
      subtopic: editing.subtopic || null,
      difficulty: editing.difficulty || "Medium",
      question: editing.question,
      solution: editing.solution || null,
      explanation: editing.explanation || null,
      hints: (editing.hintsStr || "").split("\n").map((s) => s.trim()).filter(Boolean),
      tags: (editing.tagsStr || "").split(",").map((s) => s.trim()).filter(Boolean),
      question_type: editing.question_type || "coding",
    };
    const q = editing.id
      ? supabase.from("pyq_questions").update(payload).eq("id", editing.id)
      : supabase.from("pyq_questions").insert(payload);
    const { error } = await q;
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Question updated" : "Question created");
    setOpen(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    const { error } = await supabase.from("pyq_questions").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <AdminShell title="PYQ Management">
      <div className="mb-4 flex items-center gap-2">
        <Input placeholder="Search question / topic / company…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <div className="flex-1" />
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-1.5" /> New PYQ</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "Edit PYQ" : "Create PYQ"}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Company</Label>
                    <Select value={editing.company_id ?? "none"} onValueChange={(v) => setEditing({ ...editing, company_id: v === "none" ? null : v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— None —</SelectItem>
                        {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Year *</Label>
                    <Input type="number" value={editing.year ?? ""} onChange={(e) => setEditing({ ...editing, year: parseInt(e.target.value || "0") })} />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={editing.question_type ?? "coding"} onValueChange={(v) => setEditing({ ...editing, question_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coding">Coding</SelectItem>
                        <SelectItem value="aptitude">Aptitude</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Topic *</Label>
                    <Input value={editing.topic ?? ""} onChange={(e) => setEditing({ ...editing, topic: e.target.value })} />
                  </div>
                  <div>
                    <Label>Subtopic</Label>
                    <Input value={editing.subtopic ?? ""} onChange={(e) => setEditing({ ...editing, subtopic: e.target.value })} />
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select value={editing.difficulty ?? "Medium"} onValueChange={(v) => setEditing({ ...editing, difficulty: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Question *</Label>
                  <Textarea rows={4} value={editing.question ?? ""} onChange={(e) => setEditing({ ...editing, question: e.target.value })} />
                </div>
                <div>
                  <Label>Solution</Label>
                  <Textarea rows={4} className="font-mono text-xs" value={editing.solution ?? ""} onChange={(e) => setEditing({ ...editing, solution: e.target.value })} />
                </div>
                <div>
                  <Label>Explanation</Label>
                  <Textarea rows={3} value={editing.explanation ?? ""} onChange={(e) => setEditing({ ...editing, explanation: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Hints <span className="text-xs text-muted-foreground">(one per line)</span></Label>
                    <Textarea rows={3} value={editing.hintsStr} onChange={(e) => setEditing({ ...editing, hintsStr: e.target.value })} />
                  </div>
                  <div>
                    <Label>Tags <span className="text-xs text-muted-foreground">(comma separated)</span></Label>
                    <Textarea rows={3} value={editing.tagsStr} onChange={(e) => setEditing({ ...editing, tagsStr: e.target.value })} />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setOpen(false); setEditing(null); }}>Cancel</Button>
              <Button onClick={save}>Save question</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {filtered.map((p) => (
          <Card key={p.id}>
            <CardContent className="py-3 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm line-clamp-2">{p.question}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs"><HelpCircle className="h-3 w-3 mr-1" />{p.question_type}</Badge>
                  <Badge variant="outline" className="text-xs">{p.year}</Badge>
                  <Badge variant="outline" className="text-xs">{p.topic}</Badge>
                  <Badge variant="secondary" className="text-xs">{p.difficulty}</Badge>
                  <Badge variant="outline" className="text-xs">{companyName(p.company_id)}</Badge>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No PYQ questions.</p>}
      </div>
    </AdminShell>
  );
}
