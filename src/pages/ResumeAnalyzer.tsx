import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSearch, FilePlus2, Bot, Loader2, History } from "lucide-react";
import { ResumeUploadCard } from "@/components/resume/ResumeUploadCard";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { ATSAnalysisView, type Analysis } from "@/components/resume/ATSAnalysisView";
import { ResumeBuilder } from "@/components/resume/ResumeBuilder";
import { AIResumeAssistant } from "@/components/resume/AIResumeAssistant";
import { extractTextFromFile } from "@/lib/resumeParsers";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function ResumeAnalyzer() {
  const { user } = useAuth();
  const [tab, setTab] = useState("analyzer");

  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [jd, setJd] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const canAnalyze = useMemo(() => resumeText.trim().length > 100 && jd.trim().length > 50 && !analyzing, [resumeText, jd, analyzing]);

  useEffect(() => {
    (async () => {
      if (!file) { setResumeText(""); return; }
      setExtracting(true);
      try {
        const t = await extractTextFromFile(file);
        setResumeText(t);
        if (t.length < 100) toast.warning("Very little text found — is this a scanned PDF?");
        else toast.success("Resume text extracted");
      } catch (e: any) {
        toast.error(e.message || "Failed to read file");
      } finally {
        setExtracting(false);
      }
    })();
  }, [file]);

  useEffect(() => { loadHistory(); }, [user]);

  async function loadHistory() {
    if (!user) return;
    const { data } = await supabase.from("resume_analyses").select("id,file_name,ats_score,match_score,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);
    setHistory(data || []);
  }

  async function analyze() {
    if (!user) { toast.error("Please sign in"); return; }
    setAnalyzing(true);
    try {
      let filePath: string | null = null;
      if (file) {
        const path = `${user.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("resumes").upload(path, file, { upsert: false });
        if (!upErr) filePath = path;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ resumeText, jobDescription: jd }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analysis failed");
      const a: Analysis = json.analysis;
      setAnalysis(a);

      await supabase.from("resume_analyses").insert({
        user_id: user.id,
        file_name: file?.name || null,
        file_path: filePath,
        resume_text: resumeText.slice(0, 60000),
        job_description: jd.slice(0, 60000),
        ats_score: a.ats_score ?? null,
        match_score: a.match_score ?? null,
        analysis: a as any,
      });
      loadHistory();
      toast.success("Analysis complete");
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally {
      setAnalyzing(false);
    }
  }

  function downloadReport() {
    if (!analysis) return;
    const md = buildReportMarkdown(analysis);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `resume-analysis-${Date.now()}.md`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Resume Analyzer</h1>
          <p className="text-muted-foreground mt-1">ATS scoring, AI-powered resume builder, and a resume-aware assistant — all in one place.</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-3 max-w-2xl mx-auto mb-6 h-auto p-1">
            <TabsTrigger value="analyzer" className="gap-2 py-2"><FileSearch className="w-4 h-4" /> Analyzer</TabsTrigger>
            <TabsTrigger value="builder" className="gap-2 py-2"><FilePlus2 className="w-4 h-4" /> Builder</TabsTrigger>
            <TabsTrigger value="assistant" className="gap-2 py-2"><Bot className="w-4 h-4" /> AI Assistant</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <TabsContent value="analyzer" className="space-y-6 mt-0">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">1. Upload your resume</h3>
                    <ResumeUploadCard file={file} onFileChange={setFile} accept=".pdf,.docx" extracting={extracting} />
                    {resumeText && (
                      <Badge variant="secondary">{resumeText.length.toLocaleString()} chars extracted</Badge>
                    )}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">2. Add the job description</h3>
                    <JobDescriptionInput value={jd} onChange={setJd} />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button size="lg" variant="hero" onClick={analyze} disabled={!canAnalyze}>
                    {analyzing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing your resume…</> : "Analyze Resume"}
                  </Button>
                </div>

                {analysis && <ATSAnalysisView analysis={analysis} onReanalyze={analyze} onDownload={downloadReport} />}

                {history.length > 0 && (
                  <Card className="p-5">
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><History className="w-4 h-4" /> Recent Analyses</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {history.map((h) => (
                        <div key={h.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{h.file_name || "Analysis"}</p>
                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(h.created_at), { addSuffix: true })}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">ATS {h.ats_score ?? "—"}</Badge>
                            <Badge variant="outline">Match {h.match_score ?? "—"}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="builder" className="mt-0">
                <ResumeBuilder />
              </TabsContent>

              <TabsContent value="assistant" className="mt-0">
                <AIResumeAssistant resumeText={resumeText} jobDescription={jd} analysis={analysis} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

function buildReportMarkdown(a: Analysis) {
  const list = (arr: string[]) => (arr?.length ? arr.map((x) => `- ${x}`).join("\n") : "_None_");
  return `# Resume Analysis Report

## Scores
- ATS Score: **${a.ats_score}/100**
- Job Match: **${a.match_score}/100**
- Skills Match: **${a.skills_match}/100**
- Resume Strength: **${a.resume_strength}/100**
- Recruiter Score: **${a.recruiter_score}/100**
- Hiring Readiness: **${a.hiring_readiness}**

## Summary
${a.summary || ""}

## Recruiter Feedback
${a.recruiter_feedback || ""}

## Top Priority Improvements
${list(a.priority_improvements)}

## Strengths
${list(a.strengths)}

## Weaknesses
${list(a.weaknesses)}

## Missing Keywords
${list(a.missing_keywords)}

## Missing Skills
${list(a.missing_skills)}

## Grammar Issues
${list(a.grammar_issues)}

## Formatting Issues
${list(a.formatting_issues)}

## ATS Compatibility Issues
${list(a.ats_issues)}

## Missing Sections
${list(a.missing_sections)}
`;
}
