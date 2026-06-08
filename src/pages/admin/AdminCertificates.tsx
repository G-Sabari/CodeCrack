import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2, ExternalLink, Check, X, Clock } from "lucide-react";
import { Link } from "react-router-dom";

type PendingCert = {
  id: string; code: string; recipient_name: string; contest_title: string;
  rank: number; score: number; total_points: number; percentage: number;
  certificate_type: string; citation: string | null; status: string;
  issued_at: string;
};

type Contest = { id: string; title: string; slug: string; status: string; end_time: string; total_points: number };
type Rule = {
  contest_id: string; enabled: boolean; participation_enabled: boolean;
  min_score: number; top_n: number; citation_prompt: string | null;
  auto_generate: boolean; pass_percentage: number;
};


export default function AdminCertificates() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [rules, setRules] = useState<Record<string, Rule>>({});
  const [generating, setGenerating] = useState<string | null>(null);
  const [issuedCounts, setIssuedCounts] = useState<Record<string, number>>({});

  const load = async () => {
    const { data: c } = await supabase.from("contests").select("id,title,slug,status,end_time,total_points").order("end_time", { ascending: false });
    setContests((c as Contest[]) ?? []);
    const { data: r } = await supabase.from("certificate_rules").select("*");
    const map: Record<string, Rule> = {};
    (r ?? []).forEach((row: any) => { map[row.contest_id] = row; });
    setRules(map);
    const { data: certs } = await supabase.from("certificates").select("contest_id");
    const cnt: Record<string, number> = {};
    (certs ?? []).forEach((x: any) => { cnt[x.contest_id] = (cnt[x.contest_id] ?? 0) + 1; });
    setIssuedCounts(cnt);
  };
  useEffect(() => { load(); }, []);

  const saveRule = async (contest_id: string, patch: Partial<Rule>) => {
    const existing = rules[contest_id];
    const payload: any = {
      contest_id,
      enabled: existing?.enabled ?? false,
      participation_enabled: existing?.participation_enabled ?? true,
      min_score: existing?.min_score ?? 1,
      top_n: existing?.top_n ?? 3,
      citation_prompt: existing?.citation_prompt ?? null,
      auto_generate: existing?.auto_generate ?? true,
      pass_percentage: existing?.pass_percentage ?? 50,
      ...patch,
    };
    const { error } = await supabase.from("certificate_rules").upsert(payload, { onConflict: "contest_id" });

    if (error) toast.error(error.message);
    else setRules((r) => ({ ...r, [contest_id]: payload }));
  };

  const generate = async (contest_id: string) => {
    setGenerating(contest_id);
    try {
      const { data, error } = await supabase.functions.invoke("generate-certificates", { body: { contest_id } });
      if (error) throw error;
      toast.success(`Issued ${data?.issued ?? 0} certificates`);
      load();
    } catch (e: any) {
      toast.error(e.message || "Generation failed");
    } finally {
      setGenerating(null);
    }
  };

  return (
    <AdminShell title="Certificate System">
      <div className="space-y-4">
        {contests.map((c) => {
          const r = rules[c.id];
          const ended = new Date(c.end_time).getTime() < Date.now();
          return (
            <Card key={c.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    {c.title}
                    <Badge variant="outline" className="text-xs">{c.status}</Badge>
                    {issuedCounts[c.id] ? <Badge className="text-xs">{issuedCounts[c.id]} issued</Badge> : null}
                  </CardTitle>
                  <Link to={`/contest/${c.slug}`} className="text-xs text-primary inline-flex items-center gap-1">
                    View <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div><Label className="cursor-pointer">Certificates enabled</Label>
                      <p className="text-xs text-muted-foreground">Allow generation for this contest</p></div>
                    <Switch checked={r?.enabled ?? false} onCheckedChange={(v) => saveRule(c.id, { enabled: v })} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div><Label className="cursor-pointer">Auto-generate when contest ends</Label>
                      <p className="text-xs text-muted-foreground">Runs automatically every 5 minutes after end time</p></div>
                    <Switch checked={r?.auto_generate ?? true} onCheckedChange={(v) => saveRule(c.id, { auto_generate: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Pass percentage (%)</Label>
                      <Input type="number" min={0} max={100} value={r?.pass_percentage ?? 50} onChange={(e) => saveRule(c.id, { pass_percentage: +e.target.value })} />
                      <p className="text-[10px] text-muted-foreground mt-1">Only users scoring more than this % get certificates</p></div>
                    <div><Label className="text-xs">Top N (winners + top performers)</Label>
                      <Input type="number" value={r?.top_n ?? 3} onChange={(e) => saveRule(c.id, { top_n: +e.target.value })} /></div>
                  </div>

                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">AI citation guidance (optional)</Label>
                    <Textarea
                      rows={4}
                      placeholder="e.g. Emphasize dynamic programming mastery and clean code."
                      value={r?.citation_prompt ?? ""}
                      onChange={(e) => saveRule(c.id, { citation_prompt: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={() => generate(c.id)}
                    disabled={!r?.enabled || generating === c.id || !ended}
                    className="w-full"
                  >
                    {generating === c.id
                      ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Generating…</>
                      : <><Sparkles className="h-4 w-4 mr-1.5" /> Auto-generate certificates</>}
                  </Button>
                  {!ended && <p className="text-xs text-muted-foreground">Available after the contest ends.</p>}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {contests.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No contests.</p>}
      </div>
    </AdminShell>
  );
}
