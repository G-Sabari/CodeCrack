import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Download, Save, Sparkles, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import jsPDF from "jspdf";

export interface ResumeContent {
  personal: { name: string; email: string; phone: string; location: string; linkedin: string; github: string; portfolio: string };
  summary: string;
  education: { school: string; degree: string; dates: string; details: string }[];
  skills: string; // comma or newline separated
  experience: { company: string; role: string; dates: string; bullets: string }[];
  projects: { name: string; tech: string; bullets: string; link?: string }[];
  certifications: string;
  leadership: string;
  achievements: string;
  languages: string;
  interests: string;
}

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
};

export function ResumeBuilder() {
  const { user } = useAuth();
  const [content, setContent] = useState<ResumeContent>(emptyResume);
  const [title, setTitle] = useState("My Resume");
  const [template, setTemplate] = useState<"classic" | "modern" | "compact">("classic");
  const [saving, setSaving] = useState(false);
  const [versionId, setVersionId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  // Auto-save every 4 seconds if changes
  useEffect(() => {
    const t = setTimeout(() => { save(true); }, 4000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title, template]);

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
      if (!silent) toast.success("Saved");
    } catch (e: any) {
      if (!silent) toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Editor */}
      <Card className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-[240px]" placeholder="Resume title" />
          <Select value={template} onValueChange={(v: any) => setTemplate(v)}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Classic ATS</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={() => save(false)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save
          </Button>
          <Button size="sm" onClick={exportPdf}><Download className="w-4 h-4 mr-1" /> PDF</Button>
        </div>

        <Tabs defaultValue="personal">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-3">
            {(["name","email","phone","location","linkedin","github","portfolio"] as const).map((k) => (
              <div key={k}>
                <Label className="capitalize">{k}</Label>
                <Input value={content.personal[k]} onChange={(e) => setContent((c) => ({ ...c, personal: { ...c.personal, [k]: e.target.value } }))} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="summary" className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Professional Summary</Label>
              <Button size="sm" variant="ghost" onClick={() => aiHelp("summary")} disabled={aiLoading === "summary"}>
                {aiLoading === "summary" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI Generate
              </Button>
            </div>
            <Textarea rows={5} value={content.summary} onChange={(e) => setContent((c) => ({ ...c, summary: e.target.value }))} />
          </TabsContent>

          <TabsContent value="education" className="space-y-3">
            {content.education.map((ed, i) => (
              <Card key={i} className="p-3 space-y-2">
                <Input placeholder="School / University" value={ed.school} onChange={(e) => {
                  const arr = [...content.education]; arr[i] = { ...arr[i], school: e.target.value }; setContent({ ...content, education: arr });
                }} />
                <Input placeholder="Degree" value={ed.degree} onChange={(e) => { const a = [...content.education]; a[i] = { ...a[i], degree: e.target.value }; setContent({ ...content, education: a }); }} />
                <Input placeholder="Dates (e.g. 2022 - 2026)" value={ed.dates} onChange={(e) => { const a = [...content.education]; a[i] = { ...a[i], dates: e.target.value }; setContent({ ...content, education: a }); }} />
                <Textarea placeholder="Details (CGPA, coursework)" value={ed.details} onChange={(e) => { const a = [...content.education]; a[i] = { ...a[i], details: e.target.value }; setContent({ ...content, education: a }); }} />
              </Card>
            ))}
            <Button size="sm" variant="outline" onClick={() => setContent({ ...content, education: [...content.education, { school: "", degree: "", dates: "", details: "" }] })}>+ Add Education</Button>
          </TabsContent>

          <TabsContent value="skills" className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Skills (comma separated)</Label>
              <Button size="sm" variant="ghost" onClick={() => aiHelp("skills")} disabled={aiLoading === "skills"}>
                {aiLoading === "skills" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI Suggest
              </Button>
            </div>
            <Textarea rows={3} value={content.skills} onChange={(e) => setContent({ ...content, skills: e.target.value })} />
          </TabsContent>

          <TabsContent value="experience" className="space-y-3">
            {content.experience.map((ex, i) => (
              <Card key={i} className="p-3 space-y-2">
                <Input placeholder="Company" value={ex.company} onChange={(e) => { const a = [...content.experience]; a[i] = { ...a[i], company: e.target.value }; setContent({ ...content, experience: a }); }} />
                <Input placeholder="Role" value={ex.role} onChange={(e) => { const a = [...content.experience]; a[i] = { ...a[i], role: e.target.value }; setContent({ ...content, experience: a }); }} />
                <Input placeholder="Dates" value={ex.dates} onChange={(e) => { const a = [...content.experience]; a[i] = { ...a[i], dates: e.target.value }; setContent({ ...content, experience: a }); }} />
                <Textarea placeholder="• Bullet points (one per line)" value={ex.bullets} onChange={(e) => { const a = [...content.experience]; a[i] = { ...a[i], bullets: e.target.value }; setContent({ ...content, experience: a }); }} />
              </Card>
            ))}
            <Button size="sm" variant="outline" onClick={() => setContent({ ...content, experience: [...content.experience, { company: "", role: "", dates: "", bullets: "" }] })}>+ Add Experience</Button>
          </TabsContent>

          <TabsContent value="projects" className="space-y-3">
            {content.projects.map((p, i) => (
              <Card key={i} className="p-3 space-y-2">
                <Input placeholder="Project name" value={p.name} onChange={(e) => { const a = [...content.projects]; a[i] = { ...a[i], name: e.target.value }; setContent({ ...content, projects: a }); }} />
                <Input placeholder="Tech stack" value={p.tech} onChange={(e) => { const a = [...content.projects]; a[i] = { ...a[i], tech: e.target.value }; setContent({ ...content, projects: a }); }} />
                <Input placeholder="Link (optional)" value={p.link} onChange={(e) => { const a = [...content.projects]; a[i] = { ...a[i], link: e.target.value }; setContent({ ...content, projects: a }); }} />
                <Textarea placeholder="• Description bullets" value={p.bullets} onChange={(e) => { const a = [...content.projects]; a[i] = { ...a[i], bullets: e.target.value }; setContent({ ...content, projects: a }); }} />
              </Card>
            ))}
            <Button size="sm" variant="outline" onClick={() => setContent({ ...content, projects: [...content.projects, { name: "", tech: "", bullets: "", link: "" }] })}>+ Add Project</Button>
          </TabsContent>

          <TabsContent value="other" className="space-y-3">
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
        </Tabs>
      </Card>

      {/* Preview */}
      <Card className="p-0 overflow-hidden bg-white text-black max-h-[80vh] overflow-y-auto">
        <ResumePreview content={content} template={template} />
      </Card>
    </div>
  );
}

function ResumePreview({ content, template }: { content: ResumeContent; template: string }) {
  const p = content.personal;
  const bullets = (s: string) => s.split("\n").map((l) => l.replace(/^[-•*]\s*/, "")).filter(Boolean);
  const isModern = template === "modern";
  const isCompact = template === "compact";

  return (
    <div id="resume-preview-print" className="p-8 text-[13px] leading-relaxed" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div className={isModern ? "border-b-2 border-purple-700 pb-3 mb-4" : "text-center border-b border-gray-400 pb-3 mb-4"}>
        <h1 className="text-2xl font-bold" style={{ color: isModern ? "#6b21a8" : "#111" }}>{p.name || "Your Name"}</h1>
        <p className="text-xs text-gray-700">
          {[p.email, p.phone, p.location].filter(Boolean).join(" • ")}
        </p>
        <p className="text-xs text-gray-700">
          {[p.linkedin, p.github, p.portfolio].filter(Boolean).join(" • ")}
        </p>
      </div>

      {content.summary && <Section title="Summary" isModern={isModern}><p>{content.summary}</p></Section>}

      {content.skills && <Section title="Skills" isModern={isModern}><p>{content.skills}</p></Section>}

      {content.experience.some((e) => e.company || e.role) && (
        <Section title="Experience" isModern={isModern}>
          {content.experience.map((e, i) => (e.company || e.role) && (
            <div key={i} className={isCompact ? "mb-1.5" : "mb-3"}>
              <div className="flex justify-between font-semibold"><span>{e.role}{e.company && `, ${e.company}`}</span><span className="text-xs">{e.dates}</span></div>
              <ul className="list-disc pl-5">{bullets(e.bullets).map((b, j) => <li key={j}>{b}</li>)}</ul>
            </div>
          ))}
        </Section>
      )}

      {content.projects.some((p) => p.name) && (
        <Section title="Projects" isModern={isModern}>
          {content.projects.map((pr, i) => pr.name && (
            <div key={i} className={isCompact ? "mb-1.5" : "mb-3"}>
              <div className="flex justify-between font-semibold"><span>{pr.name}{pr.tech && ` — ${pr.tech}`}</span>{pr.link && <span className="text-xs">{pr.link}</span>}</div>
              <ul className="list-disc pl-5">{bullets(pr.bullets).map((b, j) => <li key={j}>{b}</li>)}</ul>
            </div>
          ))}
        </Section>
      )}

      {content.education.some((e) => e.school) && (
        <Section title="Education" isModern={isModern}>
          {content.education.map((e, i) => e.school && (
            <div key={i} className={isCompact ? "mb-1" : "mb-2"}>
              <div className="flex justify-between font-semibold"><span>{e.school}</span><span className="text-xs">{e.dates}</span></div>
              <div>{e.degree}</div>
              {e.details && <div className="text-xs text-gray-700">{e.details}</div>}
            </div>
          ))}
        </Section>
      )}

      {content.certifications && <Section title="Certifications" isModern={isModern}><p>{content.certifications}</p></Section>}
      {content.leadership && <Section title="Leadership" isModern={isModern}><p>{content.leadership}</p></Section>}
      {content.achievements && <Section title="Achievements" isModern={isModern}>
        <ul className="list-disc pl-5">{bullets(content.achievements).map((b, i) => <li key={i}>{b}</li>)}</ul>
      </Section>}
      {content.languages && <Section title="Languages" isModern={isModern}><p>{content.languages}</p></Section>}
      {content.interests && <Section title="Interests" isModern={isModern}><p>{content.interests}</p></Section>}
    </div>
  );
}

function Section({ title, isModern, children }: { title: string; isModern: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h2 className={isModern ? "text-sm font-bold uppercase tracking-wider text-purple-700 mb-1" : "text-sm font-bold uppercase tracking-wider border-b border-gray-400 mb-1"}>{title}</h2>
      {children}
    </div>
  );
}
