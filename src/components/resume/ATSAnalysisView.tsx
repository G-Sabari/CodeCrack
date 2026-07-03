import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScoreGauge } from "./ScoreGauge";
import { AlertCircle, CheckCircle2, Sparkles, TrendingUp, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";

export interface Analysis {
  ats_score: number;
  match_score: number;
  skills_match: number;
  resume_strength: number;
  recruiter_score: number;
  hiring_readiness: string;
  summary: string;
  recruiter_feedback: string;
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  missing_skills: string[];
  weak_bullets: string[];
  grammar_issues: string[];
  formatting_issues: string[];
  ats_issues: string[];
  missing_sections: string[];
  priority_improvements: string[];
  sections: Record<string, { score: number; notes: string }>;
}

function readinessColor(r: string) {
  const s = (r || "").toLowerCase();
  if (s.includes("strong")) return "bg-green-500/15 text-green-500 border-green-500/30";
  if (s.includes("ready")) return "bg-primary/15 text-primary border-primary/30";
  if (s.includes("work")) return "bg-amber-500/15 text-amber-500 border-amber-500/30";
  return "bg-red-500/15 text-red-500 border-red-500/30";
}

export function ATSAnalysisView({ analysis, onReanalyze, onDownload }: { analysis: Analysis; onReanalyze: () => void; onDownload: () => void }) {
  const scores = [
    { label: "ATS Score", value: analysis.ats_score, icon: Target },
    { label: "Job Match", value: analysis.match_score, icon: TrendingUp },
    { label: "Skills Match", value: analysis.skills_match, icon: Sparkles },
    { label: "Resume Strength", value: analysis.resume_strength, icon: Award },
    { label: "Recruiter Score", value: analysis.recruiter_score, icon: CheckCircle2 },
  ];

  const listBlocks: [string, string[]][] = [
    ["Missing Keywords", analysis.missing_keywords || []],
    ["Missing Skills", analysis.missing_skills || []],
    ["Weak Bullet Points", analysis.weak_bullets || []],
    ["Grammar Issues", analysis.grammar_issues || []],
    ["Formatting Issues", analysis.formatting_issues || []],
    ["ATS Compatibility Issues", analysis.ats_issues || []],
    ["Missing ATS Sections", analysis.missing_sections || []],
  ];

  return (
    <div className="space-y-6">
      {/* Top summary */}
      <Card className="p-6 glass">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-2xl font-bold">Analysis Results</h3>
            <p className="text-sm text-muted-foreground">AI-driven, recruiter-grade insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={readinessColor(analysis.hiring_readiness)}>{analysis.hiring_readiness}</Badge>
            <Button variant="outline" size="sm" onClick={onDownload}><Download className="w-4 h-4 mr-1" /> Report</Button>
            <Button variant="outline" size="sm" onClick={onReanalyze}><RefreshCcw className="w-4 h-4 mr-1" /> Re-analyze</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {scores.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center p-3 rounded-lg border bg-card">
              <ScoreGauge value={s.value} size={110} />
              <div className="mt-2 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
        {analysis.summary && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{analysis.summary}</p>}
      </Card>

      {/* Priority improvements */}
      {analysis.priority_improvements?.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Top Priority Improvements</h4>
          <ol className="space-y-2">
            {analysis.priority_improvements.slice(0, 10).map((imp, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-xs">{i + 1}</span>
                <span>{imp}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h4 className="font-semibold flex items-center gap-2 mb-3 text-green-500"><CheckCircle2 className="w-5 h-5" /> Strengths</h4>
          <ul className="space-y-2 text-sm">
            {(analysis.strengths || []).map((s, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span>{s}</span></li>)}
            {!analysis.strengths?.length && <li className="text-muted-foreground text-sm">None highlighted.</li>}
          </ul>
        </Card>
        <Card className="p-6">
          <h4 className="font-semibold flex items-center gap-2 mb-3 text-amber-500"><AlertCircle className="w-5 h-5" /> Weaknesses</h4>
          <ul className="space-y-2 text-sm">
            {(analysis.weaknesses || []).map((s, i) => <li key={i} className="flex gap-2"><AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" /><span>{s}</span></li>)}
            {!analysis.weaknesses?.length && <li className="text-muted-foreground text-sm">None highlighted.</li>}
          </ul>
        </Card>
      </div>

      {/* Recruiter feedback */}
      {analysis.recruiter_feedback && (
        <Card className="p-6">
          <h4 className="font-semibold text-lg mb-2">Recruiter Feedback</h4>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{analysis.recruiter_feedback}</p>
        </Card>
      )}

      {/* Section-wise */}
      {analysis.sections && (
        <Card className="p-6">
          <h4 className="font-semibold text-lg mb-3">Section-wise Analysis</h4>
          <div className="space-y-3">
            {Object.entries(analysis.sections).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize font-medium">{key}</span>
                  <span className="text-muted-foreground">{val.score}/100</span>
                </div>
                <Progress value={val.score} className="h-2" />
                {val.notes && <p className="text-xs text-muted-foreground mt-1">{val.notes}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detailed issues */}
      <Card className="p-6">
        <h4 className="font-semibold text-lg mb-3">Detailed Issues</h4>
        <Accordion type="multiple" className="w-full">
          {listBlocks.map(([title, items]) => (
            <AccordionItem key={title} value={title}>
              <AccordionTrigger className="text-sm">
                {title} <Badge variant="secondary" className="ml-2">{items.length}</Badge>
              </AccordionTrigger>
              <AccordionContent>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">None found.</p>
                ) : (
                  <ul className="space-y-1 text-sm list-disc pl-5">
                    {items.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}
