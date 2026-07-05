import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Download, Save, Sparkles, Loader2, GripVertical, History, FileText, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import jsPDF from "jspdf";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface ResumeContent {
  personal: { name: string; email: string; phone: string; location: string; linkedin: string; github: string; portfolio: string };
  summary: string;
  education: { school: string; degree: string; dates: string; details: string }[];
  skills: string;
  experience: { company: string; role: string; dates: string; bullets: string }[];
  projects: { name: string; tech: string; bullets: string; link?: string }[];
  certifications: string;
  leadership: string;
  achievements: string;
  languages: string;
  interests: string;
  sectionOrder?: string[];
}

const DEFAULT_ORDER = ["summary", "skills", "experience", "projects", "education", "certifications", "leadership", "achievements", "languages", "interests"];

const SECTION_LABELS: Record<string, string> = {
  summary: "Summary",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  certifications: "Certifications",
  leadership: "Leadership",
  achievements: "Achievements",
  languages: "Languages",
  interests: "Interests",
};

const emptyResume: ResumeContent = {
  personal: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" },
  summary: "",
  education: [{ school: "", degree: "", dates: "", details: "" }],
  skills: "",
  experience: [{ company: "", role: "", dates: "", bullets: "" }],
  projects: [{ name: "", tech: "", bullets: "", link: "" }],
  certifications: "",
  leadership: "",
  achievements: "",
  languages: "",
  interests: "",
  sectionOrder: DEFAULT_ORDER,
};

type Template = "classic" | "modern" | "compact" | "minimal" | "executive";

const TEMPLATES: { id: Template; name: string; desc: string }[] = [
  { id: "classic", name: "Classic ATS", desc: "Traditional, safe for all ATS" },
  { id: "modern", name: "Modern", desc: "Purple accents, clean layout" },
  { id: "compact", name: "Compact", desc: "Fits more on one page" },
  { id: "minimal", name: "Minimal", desc: "Ultra-clean, sans-serif" },
  { id: "executive", name: "Executive", desc: "Bold headers, senior roles" },
];

interface Version {
  id: string;
  title: string;
  template: string;
  content: ResumeContent;
  updated_at: string;
  created_at: string;
}

export function ResumeBuilder() {
  const { user } = useAuth();
  const [content, setContent] = useState<ResumeContent>(emptyResume);
  const [title, setTitle] = useState("My Resume");
  const [template, setTemplate] = useState<Template>("classic");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [versionId, setVersionId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const sectionOrder = content.sectionOrder && content.sectionOrder.length ? content.sectionOrder : DEFAULT_ORDER;

  useEffect(() => {
    const t = setTimeout(() => { save(true); }, 3000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title, template]);

  async function loadVersions() {
    if (!user) return;
    const { data } = await supabase
      .from("resume_versions")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(20);
    setVersions((data || []) as any);
  }

  useEffect(() => { loadVersions(); }, [user, lastSaved]);

  async function save(silent = false) {
    if (!user) return;
    setSaving(true);
    try {
      if (versionId) {
        await supabase.from("resume_versions").update({ title, template, content: content as any }).eq("id", versionId);
      } else {
        const { data, error } = await supabase.from("resume_versions").insert({ user_id: user.id, title, template, content: content as any }).select().single();
        if (error) throw error;
        setVersionId(data.id);
      }
      setLastSaved(new Date());
      if (!silent) toast.success("Saved");
    } catch (e: any) {
      if (!silent) toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveAsNew() {
    if (!user) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.from("resume_versions").insert({
        user_id: user.id,
        title: `${title} (copy)`,
        template,
        content: content as any,
      }).select().single();
      if (error) throw error;
      setVersionId(data.id);
      setTitle(`${title} (copy)`);
      setLastSaved(new Date());
      toast.success("Saved as new version");
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function loadVersion(v: Version) {
    setVersionId(v.id);
    setTitle(v.title);
    setTemplate((v.template as Template) || "classic");
    setContent({ ...emptyResume, ...(v.content as any), sectionOrder: (v.content as any)?.sectionOrder || DEFAULT_ORDER });
    setHistoryOpen(false);
    toast.success(`Loaded "${v.title}"`);
  }

  async function deleteVersion(id: string) {
    await supabase.from("resume_versions").delete().eq("id", id);
    if (id === versionId) { setVersionId(null); }
    loadVersions();
    toast.success("Deleted");
  }

  async function aiHelp(field: string) {
    setAiLoading(field);
    try {
      const prompt = ({
        summary: `Write a strong, ATS-friendly 3-line professional summary for this resume:\n${JSON.stringify(content)}`,
        skills: `Suggest 15 relevant technical skills for this profile as a comma-separated list only:\n${JSON.stringify(content)}`,
        achievements: `Generate 4 measurable achievement bullet points (with metrics) based on this resume:\n${JSON.stringify(content)}`,
      } as any)[field];
      if (!prompt) return;
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resume-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ userMessage: prompt, resumeText: JSON.stringify(content) }),
      });
      if (!res.body) throw new Error("No response");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const payload = t.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const j = JSON.parse(payload);
            const d = j?.choices?.[0]?.delta?.content;
            if (d) acc += d;
          } catch {}
        }
      }
      const clean = acc.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();
      setContent((c) => ({ ...c, [field]: clean } as any));
      toast.success("AI suggestion applied");
    } catch (e: any) {
      toast.error(e.message || "AI failed");
    } finally {
      setAiLoading(null);
    }
  }

  function exportPdf() {
    const el = document.getElementById("resume-preview-print");
    if (!el) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.html(el, {
      x: 24, y: 24,
      width: 547,
      windowWidth: el.scrollWidth,
      callback: (d) => d.save(`${title || "resume"}.pdf`),
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionOrder.indexOf(active.id as string);
    const newIndex = sectionOrder.indexOf(over.id as string);
    if (oldIndex < 0 || newIndex < 0) return;
    setContent((c) => ({ ...c, sectionOrder: arrayMove(sectionOrder, oldIndex, newIndex) }));
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Editor */}
      <Card className="p-5 space-y-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-[220px]" placeholder="Resume title" />
          <Select value={template} onValueChange={(v: any) => setTemplate(v)}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-[10px] text-muted-foreground">{t.desc}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={() => save(false)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save
          </Button>
          <Button size="sm" variant="outline" onClick={saveAsNew} disabled={saving}>
            <Plus className="w-4 h-4 mr-1" /> Save as new
          </Button>
          <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline"><History className="w-4 h-4 mr-1" /> History ({versions.length})</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader><SheetTitle>Version History</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-2">
                {versions.length === 0 && <p className="text-sm text-muted-foreground">No saved versions yet.</p>}
                {versions.map((v) => (
                  <Card key={v.id} className={`p-3 ${v.id === versionId ? "border-primary" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 shrink-0" />
                          <span className="font-medium truncate">{v.title}</span>
                          {v.id === versionId && <Badge variant="secondary" className="text-[9px]">current</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {v.template} • {new Date(v.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="secondary" onClick={() => loadVersion(v)}>Load</Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteVersion(v.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Button size="sm" onClick={exportPdf}><Download className="w-4 h-4 mr-1" /> PDF</Button>
        </div>

        {lastSaved && (
          <p className="text-xs text-muted-foreground">Auto-saved {lastSaved.toLocaleTimeString()}</p>
        )}

        <Tabs defaultValue="personal">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="order">Section Order</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-3">
            {(["name","email","phone","location","linkedin","github","portfolio"] as const).map((k) => (
              <div key={k}>
                <Label className="capitalize">{k}</Label>
                <Input value={content.personal[k]} onChange={(e) => setContent((c) => ({ ...c, personal: { ...c.personal, [k]: e.target.value } }))} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Professional Summary</Label>
                <Button size="sm" variant="ghost" onClick={() => aiHelp("summary")} disabled={aiLoading === "summary"}>
                  {aiLoading === "summary" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI
                </Button>
              </div>
              <Textarea rows={4} value={content.summary} onChange={(e) => setContent((c) => ({ ...c, summary: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Skills (comma separated)</Label>
                <Button size="sm" variant="ghost" onClick={() => aiHelp("skills")} disabled={aiLoading === "skills"}>
                  {aiLoading === "skills" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI
                </Button>
              </div>
              <Textarea rows={3} value={content.skills} onChange={(e) => setContent({ ...content, skills: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Experience</Label>
              {content.experience.map((ex, i) => (
                <Card key={i} className="p-3 space-y-2">
                  <Input placeholder="Company" value={ex.company} onChange={(e) => { const a = [...content.experience]; a[i] = { ...a[i], company: e.target.value }; setContent({ ...content, experience: a }); }} />
                  <Input placeholder="Role" value={ex.role} onChange={(e) => { const a = [...content.experience]; a[i] = { ...a[i], role: e.target.value }; setContent({ ...content, experience: a }); }} />
                  <Input placeholder="Dates" value={ex.dates} onChange={(e) => { const a = [...content.experience]; a[i] = { ...a[i], dates: e.target.value }; setContent({ ...content, experience: a }); }} />
                  <Textarea placeholder="• Bullet points (one per line)" value={ex.bullets} onChange={(e) => { const a = [...content.experience]; a[i] = { ...a[i], bullets: e.target.value }; setContent({ ...content, experience: a }); }} />
                </Card>
              ))}
              <Button size="sm" variant="outline" onClick={() => setContent({ ...content, experience: [...content.experience, { company: "", role: "", dates: "", bullets: "" }] })}>+ Add Experience</Button>
            </div>

            <div className="space-y-2">
              <Label>Projects</Label>
              {content.projects.map((p, i) => (
                <Card key={i} className="p-3 space-y-2">
                  <Input placeholder="Project name" value={p.name} onChange={(e) => { const a = [...content.projects]; a[i] = { ...a[i], name: e.target.value }; setContent({ ...content, projects: a }); }} />
                  <Input placeholder="Tech stack" value={p.tech} onChange={(e) => { const a = [...content.projects]; a[i] = { ...a[i], tech: e.target.value }; setContent({ ...content, projects: a }); }} />
                  <Input placeholder="Link (optional)" value={p.link} onChange={(e) => { const a = [...content.projects]; a[i] = { ...a[i], link: e.target.value }; setContent({ ...content, projects: a }); }} />
                  <Textarea placeholder="• Description bullets" value={p.bullets} onChange={(e) => { const a = [...content.projects]; a[i] = { ...a[i], bullets: e.target.value }; setContent({ ...content, projects: a }); }} />
                </Card>
              ))}
              <Button size="sm" variant="outline" onClick={() => setContent({ ...content, projects: [...content.projects, { name: "", tech: "", bullets: "", link: "" }] })}>+ Add Project</Button>
            </div>

            <div className="space-y-2">
              <Label>Education</Label>
              {content.education.map((ed, i) => (
                <Card key={i} className="p-3 space-y-2">
                  <Input placeholder="School" value={ed.school} onChange={(e) => { const a = [...content.education]; a[i] = { ...a[i], school: e.target.value }; setContent({ ...content, education: a }); }} />
                  <Input placeholder="Degree" value={ed.degree} onChange={(e) => { const a = [...content.education]; a[i] = { ...a[i], degree: e.target.value }; setContent({ ...content, education: a }); }} />
                  <Input placeholder="Dates" value={ed.dates} onChange={(e) => { const a = [...content.education]; a[i] = { ...a[i], dates: e.target.value }; setContent({ ...content, education: a }); }} />
                  <Textarea placeholder="Details" value={ed.details} onChange={(e) => { const a = [...content.education]; a[i] = { ...a[i], details: e.target.value }; setContent({ ...content, education: a }); }} />
                </Card>
              ))}
              <Button size="sm" variant="outline" onClick={() => setContent({ ...content, education: [...content.education, { school: "", degree: "", dates: "", details: "" }] })}>+ Add Education</Button>
            </div>

            <div>
              <div className="flex justify-between items-center"><Label>Achievements</Label>
                <Button size="sm" variant="ghost" onClick={() => aiHelp("achievements")} disabled={aiLoading === "achievements"}>
                  {aiLoading === "achievements" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI
                </Button>
              </div>
              <Textarea rows={3} value={content.achievements} onChange={(e) => setContent({ ...content, achievements: e.target.value })} />
            </div>
            <div><Label>Certifications</Label><Textarea rows={2} value={content.certifications} onChange={(e) => setContent({ ...content, certifications: e.target.value })} /></div>
            <div><Label>Leadership</Label><Textarea rows={2} value={content.leadership} onChange={(e) => setContent({ ...content, leadership: e.target.value })} /></div>
            <div><Label>Languages</Label><Input value={content.languages} onChange={(e) => setContent({ ...content, languages: e.target.value })} /></div>
            <div><Label>Interests</Label><Input value={content.interests} onChange={(e) => setContent({ ...content, interests: e.target.value })} /></div>
          </TabsContent>

          <TabsContent value="order" className="space-y-2">
            <p className="text-xs text-muted-foreground">Drag sections to reorder them in the preview and PDF.</p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                  {sectionOrder.map((id) => <SortableItem key={id} id={id} label={SECTION_LABELS[id] || id} />)}
                </div>
              </SortableContext>
            </DndContext>
            <Button size="sm" variant="ghost" onClick={() => setContent((c) => ({ ...c, sectionOrder: DEFAULT_ORDER }))}>Reset order</Button>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Preview */}
      <Card className="p-0 overflow-hidden bg-white text-black max-h-[85vh] overflow-y-auto">
        <ResumePreview content={content} template={template} order={sectionOrder} />
      </Card>
    </div>
  );
}

function SortableItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 p-2 rounded-md border bg-card hover:bg-accent cursor-grab active:cursor-grabbing"
    >
      <GripVertical className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function ResumePreview({ content, template, order }: { content: ResumeContent; template: string; order: string[] }) {
  const p = content.personal;
  const bullets = (s: string) => s.split("\n").map((l) => l.replace(/^[-•*]\s*/, "")).filter(Boolean);
  const isModern = template === "modern";
  const isCompact = template === "compact";
  const isMinimal = template === "minimal";
  const isExecutive = template === "executive";

  const fontFamily = isMinimal
    ? "'Helvetica Neue', Arial, sans-serif"
    : isModern
    ? "'Segoe UI', Arial, sans-serif"
    : "Georgia, 'Times New Roman', serif";

  const accent = isModern ? "#6b21a8" : isExecutive ? "#0f172a" : "#111";

  const sectionRenderers: Record<string, () => JSX.Element | null> = {
    summary: () => content.summary ? <Section title="Summary" template={template}><p>{content.summary}</p></Section> : null,
    skills: () => content.skills ? <Section title="Skills" template={template}><p>{content.skills}</p></Section> : null,
    experience: () => content.experience.some((e) => e.company || e.role) ? (
      <Section title="Experience" template={template}>
        {content.experience.map((e, i) => (e.company || e.role) && (
          <div key={i} className={isCompact ? "mb-1.5" : "mb-3"}>
            <div className="flex justify-between font-semibold"><span>{e.role}{e.company && `, ${e.company}`}</span><span className="text-xs">{e.dates}</span></div>
            <ul className="list-disc pl-5">{bullets(e.bullets).map((b, j) => <li key={j}>{b}</li>)}</ul>
          </div>
        ))}
      </Section>
    ) : null,
    projects: () => content.projects.some((pr) => pr.name) ? (
      <Section title="Projects" template={template}>
        {content.projects.map((pr, i) => pr.name && (
          <div key={i} className={isCompact ? "mb-1.5" : "mb-3"}>
            <div className="flex justify-between font-semibold"><span>{pr.name}{pr.tech && ` — ${pr.tech}`}</span>{pr.link && <span className="text-xs">{pr.link}</span>}</div>
            <ul className="list-disc pl-5">{bullets(pr.bullets).map((b, j) => <li key={j}>{b}</li>)}</ul>
          </div>
        ))}
      </Section>
    ) : null,
    education: () => content.education.some((e) => e.school) ? (
      <Section title="Education" template={template}>
        {content.education.map((e, i) => e.school && (
          <div key={i} className={isCompact ? "mb-1" : "mb-2"}>
            <div className="flex justify-between font-semibold"><span>{e.school}</span><span className="text-xs">{e.dates}</span></div>
            <div>{e.degree}</div>
            {e.details && <div className="text-xs text-gray-700">{e.details}</div>}
          </div>
        ))}
      </Section>
    ) : null,
    certifications: () => content.certifications ? <Section title="Certifications" template={template}><p>{content.certifications}</p></Section> : null,
    leadership: () => content.leadership ? <Section title="Leadership" template={template}><p>{content.leadership}</p></Section> : null,
    achievements: () => content.achievements ? (
      <Section title="Achievements" template={template}>
        <ul className="list-disc pl-5">{bullets(content.achievements).map((b, i) => <li key={i}>{b}</li>)}</ul>
      </Section>
    ) : null,
    languages: () => content.languages ? <Section title="Languages" template={template}><p>{content.languages}</p></Section> : null,
    interests: () => content.interests ? <Section title="Interests" template={template}><p>{content.interests}</p></Section> : null,
  };

  const headerCls = isModern
    ? "border-b-2 border-purple-700 pb-3 mb-4"
    : isExecutive
    ? "bg-slate-900 text-white p-4 mb-4 -mx-8 -mt-8 px-8 pt-8"
    : isMinimal
    ? "pb-2 mb-4"
    : "text-center border-b border-gray-400 pb-3 mb-4";

  return (
    <div id="resume-preview-print" className={`p-8 ${isCompact ? "text-[12px]" : "text-[13px]"} leading-relaxed`} style={{ fontFamily }}>
      <div className={headerCls}>
        <h1 className={`${isExecutive ? "text-3xl" : "text-2xl"} font-bold`} style={{ color: isExecutive ? "#fff" : accent }}>{p.name || "Your Name"}</h1>
        <p className={`text-xs ${isExecutive ? "text-slate-200" : "text-gray-700"}`}>
          {[p.email, p.phone, p.location].filter(Boolean).join(" • ")}
        </p>
        <p className={`text-xs ${isExecutive ? "text-slate-200" : "text-gray-700"}`}>
          {[p.linkedin, p.github, p.portfolio].filter(Boolean).join(" • ")}
        </p>
      </div>

      {order.map((id) => <div key={id}>{sectionRenderers[id]?.()}</div>)}
    </div>
  );
}

function Section({ title, template, children }: { title: string; template: string; children: React.ReactNode }) {
  const cls = template === "modern"
    ? "text-sm font-bold uppercase tracking-wider text-purple-700 mb-1"
    : template === "minimal"
    ? "text-xs font-bold uppercase tracking-[0.2em] text-gray-600 mb-1"
    : template === "executive"
    ? "text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 mb-1 pb-0.5"
    : "text-sm font-bold uppercase tracking-wider border-b border-gray-400 mb-1";
  return (
    <div className="mb-3">
      <h2 className={cls}>{title}</h2>
      {children}
    </div>
  );
}
