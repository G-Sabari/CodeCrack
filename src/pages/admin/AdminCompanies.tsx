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
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";

type Category = "FAANG" | "Product" | "Service" | "Startup";

type Company = {
  id: string;
  name: string;
  category: Category;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
  difficulty_level: string | null;
  hiring_pattern: string[] | null;
  common_roles: string[] | null;
  online_test_details: string | null;
  technical_rounds_details: string | null;
  hr_round_details: string | null;
  preparation_tips: string[] | null;
  interview_experience_count: number | null;
};

type Draft = Partial<Company> & { hiringStr?: string; rolesStr?: string; tipsStr?: string };

const emptyDraft = (): Draft => ({
  category: "Product",
  difficulty_level: "Medium",
  hiringStr: "",
  rolesStr: "",
  tipsStr: "",
});

export default function AdminCompanies() {
  const [list, setList] = useState<Company[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Draft | null>(null);

  const load = async () => {
    const { data } = await supabase.from("companies").select("*").order("name");
    setList((data as Company[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => list.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.category.toLowerCase().includes(q.toLowerCase())),
    [list, q],
  );

  const openNew = () => { setEditing(emptyDraft()); setOpen(true); };
  const openEdit = (c: Company) => {
    setEditing({
      ...c,
      hiringStr: (c.hiring_pattern ?? []).join(", "),
      rolesStr: (c.common_roles ?? []).join(", "),
      tipsStr: (c.preparation_tips ?? []).join("\n"),
    });
    setOpen(true);
  };

  const save = async () => {
    if (!editing?.name || !editing.category) { toast.error("Name and category required"); return; }
    const payload: any = {
      name: editing.name.trim(),
      category: editing.category,
      logo_url: editing.logo_url || null,
      description: editing.description || null,
      website_url: editing.website_url || null,
      difficulty_level: editing.difficulty_level || null,
      hiring_pattern: (editing.hiringStr || "").split(",").map((s) => s.trim()).filter(Boolean),
      common_roles: (editing.rolesStr || "").split(",").map((s) => s.trim()).filter(Boolean),
      online_test_details: editing.online_test_details || null,
      technical_rounds_details: editing.technical_rounds_details || null,
      hr_round_details: editing.hr_round_details || null,
      preparation_tips: (editing.tipsStr || "").split("\n").map((s) => s.trim()).filter(Boolean),
      interview_experience_count: editing.interview_experience_count ?? 0,
    };
    const q = editing.id
      ? supabase.from("companies").update(payload).eq("id", editing.id)
      : supabase.from("companies").insert(payload);
    const { error } = await q;
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Company updated" : "Company created");
    setOpen(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this company?")) return;
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <AdminShell title="Company Management">
      <div className="mb-4 flex items-center gap-2">
        <Input placeholder="Search name or category…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <div className="flex-1" />
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-1.5" /> New company</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "Edit company" : "Create company"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Name *</Label>
                    <Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v as Category })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FAANG">FAANG</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Startup">Startup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Logo URL</Label>
                    <Input value={editing.logo_url ?? ""} onChange={(e) => setEditing({ ...editing, logo_url: e.target.value })} />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input value={editing.website_url ?? ""} onChange={(e) => setEditing({ ...editing, website_url: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={3} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Difficulty</Label>
                    <Select value={editing.difficulty_level ?? "Medium"} onValueChange={(v) => setEditing({ ...editing, difficulty_level: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Interview experience count</Label>
                    <Input type="number" value={editing.interview_experience_count ?? 0}
                      onChange={(e) => setEditing({ ...editing, interview_experience_count: parseInt(e.target.value || "0") })} />
                  </div>
                </div>
                <div>
                  <Label>Hiring pattern <span className="text-xs text-muted-foreground">(comma separated)</span></Label>
                  <Input value={editing.hiringStr} onChange={(e) => setEditing({ ...editing, hiringStr: e.target.value })} placeholder="On-campus, Off-campus" />
                </div>
                <div>
                  <Label>Common roles <span className="text-xs text-muted-foreground">(comma separated)</span></Label>
                  <Input value={editing.rolesStr} onChange={(e) => setEditing({ ...editing, rolesStr: e.target.value })} placeholder="SDE, SDE-Intern" />
                </div>
                <div>
                  <Label>Online test details</Label>
                  <Textarea rows={2} value={editing.online_test_details ?? ""} onChange={(e) => setEditing({ ...editing, online_test_details: e.target.value })} />
                </div>
                <div>
                  <Label>Technical rounds details</Label>
                  <Textarea rows={2} value={editing.technical_rounds_details ?? ""} onChange={(e) => setEditing({ ...editing, technical_rounds_details: e.target.value })} />
                </div>
                <div>
                  <Label>HR round details</Label>
                  <Textarea rows={2} value={editing.hr_round_details ?? ""} onChange={(e) => setEditing({ ...editing, hr_round_details: e.target.value })} />
                </div>
                <div>
                  <Label>Preparation tips <span className="text-xs text-muted-foreground">(one per line)</span></Label>
                  <Textarea rows={3} value={editing.tipsStr} onChange={(e) => setEditing({ ...editing, tipsStr: e.target.value })} />
                </div>
              </div>
            )}
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setOpen(false); setEditing(null); }}>Cancel</Button>
              <Button onClick={save}>Save company</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{c.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">{c.category}</Badge>
                    {c.difficulty_level && <Badge variant="secondary" className="text-xs">{c.difficulty_level}</Badge>}
                    {c.common_roles?.slice(0, 3).map((r) => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="destructive" onClick={() => remove(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No companies.</p>}
      </div>
    </AdminShell>
  );
}
