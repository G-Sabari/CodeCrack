import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, Sparkles } from "lucide-react";

type TestCase = { input: string; expected_output: string; is_hidden: boolean };

type Problem = {
  id: string; title: string; description: string; problem_type: string;
  difficulty: string; topic: string; tags: string[] | null;
  starter_code: any; test_cases: any;
  constraints?: string | null;
  input_format?: string | null;
  output_format?: string | null;
  sample_input?: string | null;
  sample_output?: string | null;
};

type Draft = Partial<Problem> & {
  tagsStr?: string;
  starter?: Record<string, string>;
  cases?: TestCase[];
};

const LANGS: { id: string; label: string; placeholder: string }[] = [
  { id: "python", label: "Python", placeholder: "def solve():\n    pass\n\nsolve()\n" },
  { id: "java", label: "Java", placeholder: "public class Main {\n    public static void main(String[] args) {\n        // your code\n    }\n}\n" },
  { id: "javascript", label: "JavaScript", placeholder: "function solve(){\n  // your code\n}\nsolve();\n" },
  { id: "cpp", label: "C++", placeholder: "#include <iostream>\nusing namespace std;\nint main(){\n    return 0;\n}\n" },
];

const emptyDraft = (): Draft => ({
  difficulty: "Medium",
  problem_type: "coding",
  topic: "",
  tagsStr: "",
  starter: {},
  cases: [{ input: "", expected_output: "", is_hidden: false }],
});

export default function AdminProblems() {
  const [list, setList] = useState<Problem[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Draft | null>(null);
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

  const openNew = () => { setEditing(emptyDraft()); setOpen(true); };
  const openEdit = (p: Problem) => {
    const starter = (p.starter_code && typeof p.starter_code === "object") ? p.starter_code as Record<string, string> : {};
    const rawCases = Array.isArray(p.test_cases) ? p.test_cases : [];
    const cases: TestCase[] = rawCases.map((tc: any) => ({
      input: String(tc?.input ?? ""),
      expected_output: String(tc?.expected_output ?? tc?.output ?? ""),
      is_hidden: Boolean(tc?.is_hidden ?? tc?.hidden ?? false),
    }));
    setEditing({
      ...p,
      tagsStr: (p.tags ?? []).join(", "),
      starter,
      cases: cases.length ? cases : [{ input: "", expected_output: "", is_hidden: false }],
    });
    setOpen(true);
  };

  const save = async () => {
    if (!editing?.title || !editing.description || !editing.problem_type || !editing.topic) {
      toast.error("Title, description, type and topic are required");
      return;
    }
    const payload: any = {
      title: editing.title.trim(),
      description: editing.description,
      problem_type: editing.problem_type,
      difficulty: editing.difficulty || "Medium",
      topic: editing.topic.trim(),
      tags: (editing.tagsStr || "").split(",").map(s => s.trim()).filter(Boolean),
      constraints: editing.constraints ?? null,
      input_format: editing.input_format ?? null,
      output_format: editing.output_format ?? null,
      sample_input: editing.sample_input ?? null,
      sample_output: editing.sample_output ?? null,
      starter_code: editing.starter ?? {},
      test_cases: (editing.cases ?? []).filter(tc => tc.input.trim() || tc.expected_output.trim()),
    };
    const q = editing.id
      ? supabase.from("problems").update(payload).eq("id", editing.id)
      : supabase.from("problems").insert(payload);
    const { error } = await q;
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Problem updated" : "Problem created");
    setOpen(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this problem?")) return;
    const { error } = await supabase.from("problems").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  // -- test case helpers
  const addCase = () => setEditing(e => e ? { ...e, cases: [...(e.cases ?? []), { input: "", expected_output: "", is_hidden: false }] } : e);
  const updateCase = (idx: number, patch: Partial<TestCase>) => setEditing(e => {
    if (!e) return e;
    const cases = [...(e.cases ?? [])];
    cases[idx] = { ...cases[idx], ...patch };
    return { ...e, cases };
  });
  const removeCase = (idx: number) => setEditing(e => e ? { ...e, cases: (e.cases ?? []).filter((_, i) => i !== idx) } : e);

  const setStarter = (lang: string, code: string) => setEditing(e => e ? { ...e, starter: { ...(e.starter ?? {}), [lang]: code } } : e);

  return (
    <AdminShell title="Problem Management">
      <div className="mb-4 flex items-center gap-2">
        <Input placeholder="Search title or topic…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <div className="flex-1" />
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-1.5" /> New problem</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {editing?.id ? "Edit problem" : "Create a new problem"}
              </DialogTitle>
            </DialogHeader>

            {editing && (
              <Tabs defaultValue="basics" className="mt-2">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="basics">Basics</TabsTrigger>
                  <TabsTrigger value="format">Format</TabsTrigger>
                  <TabsTrigger value="tests">Test Cases</TabsTrigger>
                  <TabsTrigger value="starter">Starter Code</TabsTrigger>
                </TabsList>

                {/* BASICS */}
                <TabsContent value="basics" className="space-y-3 pt-4">
                  <div>
                    <Label>Title *</Label>
                    <Input value={editing.title ?? ""} placeholder="Two Sum"
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Description *</Label>
                    <Textarea rows={6} placeholder="Describe the problem clearly..."
                      value={editing.description ?? ""}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Type</Label>
                      <Select value={editing.problem_type ?? "coding"} onValueChange={(v) => setEditing({ ...editing, problem_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="coding">Coding</SelectItem>
                          <SelectItem value="aptitude">Aptitude</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <div>
                      <Label>Topic *</Label>
                      <Input value={editing.topic ?? ""} placeholder="Arrays"
                        onChange={(e) => setEditing({ ...editing, topic: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Tags <span className="text-muted-foreground text-xs">(comma separated)</span></Label>
                    <Input value={editing.tagsStr ?? ""} placeholder="hashmap, two-pointers"
                      onChange={(e) => setEditing({ ...editing, tagsStr: e.target.value })} />
                  </div>
                </TabsContent>

                {/* FORMAT */}
                <TabsContent value="format" className="space-y-3 pt-4">
                  <div>
                    <Label>Constraints</Label>
                    <Textarea rows={3} placeholder="1 ≤ n ≤ 10^5&#10;-10^9 ≤ a[i] ≤ 10^9"
                      value={editing.constraints ?? ""}
                      onChange={(e) => setEditing({ ...editing, constraints: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Input format</Label>
                      <Textarea rows={3} placeholder="First line: n&#10;Second line: n space-separated integers"
                        value={editing.input_format ?? ""}
                        onChange={(e) => setEditing({ ...editing, input_format: e.target.value })} />
                    </div>
                    <div>
                      <Label>Output format</Label>
                      <Textarea rows={3} placeholder="A single integer"
                        value={editing.output_format ?? ""}
                        onChange={(e) => setEditing({ ...editing, output_format: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Example input</Label>
                      <Textarea rows={3} className="font-mono text-xs"
                        value={editing.sample_input ?? ""}
                        onChange={(e) => setEditing({ ...editing, sample_input: e.target.value })} />
                    </div>
                    <div>
                      <Label>Example output</Label>
                      <Textarea rows={3} className="font-mono text-xs"
                        value={editing.sample_output ?? ""}
                        onChange={(e) => setEditing({ ...editing, sample_output: e.target.value })} />
                    </div>
                  </div>
                </TabsContent>

                {/* TEST CASES */}
                <TabsContent value="tests" className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Public test cases show to users. Hidden ones are used for grading only.
                    </p>
                    <Button size="sm" onClick={addCase}><Plus className="h-3.5 w-3.5 mr-1" /> Add test case</Button>
                  </div>
                  <div className="space-y-2">
                    {(editing.cases ?? []).map((tc, idx) => (
                      <Card key={idx} className="border-border/50">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              Test case #{idx + 1}
                              {tc.is_hidden
                                ? <Badge variant="outline" className="text-[10px]"><EyeOff className="h-3 w-3 mr-1" />Hidden</Badge>
                                : <Badge variant="secondary" className="text-[10px]"><Eye className="h-3 w-3 mr-1" />Public</Badge>}
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                                Hidden
                                <Switch checked={tc.is_hidden} onCheckedChange={(v) => updateCase(idx, { is_hidden: v })} />
                              </label>
                              <Button size="sm" variant="ghost" onClick={() => removeCase(idx)}>
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Input</Label>
                              <Textarea rows={3} className="font-mono text-xs"
                                value={tc.input} onChange={(e) => updateCase(idx, { input: e.target.value })} />
                            </div>
                            <div>
                              <Label className="text-xs">Expected output</Label>
                              <Textarea rows={3} className="font-mono text-xs"
                                value={tc.expected_output} onChange={(e) => updateCase(idx, { expected_output: e.target.value })} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(editing.cases ?? []).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-6">No test cases yet.</p>
                    )}
                  </div>
                </TabsContent>

                {/* STARTER CODE */}
                <TabsContent value="starter" className="pt-4">
                  <Tabs defaultValue="python">
                    <TabsList>
                      {LANGS.map((l) => <TabsTrigger key={l.id} value={l.id}>{l.label}</TabsTrigger>)}
                    </TabsList>
                    {LANGS.map((l) => (
                      <TabsContent key={l.id} value={l.id} className="pt-3">
                        <Textarea
                          rows={12}
                          className="font-mono text-xs"
                          placeholder={l.placeholder}
                          value={editing.starter?.[l.id] ?? ""}
                          onChange={(e) => setStarter(l.id, e.target.value)}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>
              </Tabs>
            )}

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setOpen(false); setEditing(null); }}>Cancel</Button>
              <Button onClick={save}>Save problem</Button>
            </DialogFooter>
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
                  <Badge variant="outline" className="text-xs">
                    {Array.isArray(p.test_cases) ? `${(p.test_cases as any[]).length} tests` : "0 tests"}
                  </Badge>
                  {(p.tags ?? []).slice(0, 3).map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(p.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No problems.</p>}
      </div>
    </AdminShell>
  );
}
