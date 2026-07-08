import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Award, Download, Loader2, ExternalLink, Trophy, Clock, XCircle,
  CheckCircle2, Sparkles, Share2, Copy, Send,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { buildCertificatePdf, downloadBlob, generateCode } from "@/lib/certificate";
import { FloatingParticles } from "@/components/contest/FloatingParticles";
import {
  computeAllEligibility, CERT_DEFINITIONS, CERT_LABEL,
  type EligibilityResult, type CertType,
} from "@/lib/certificateEligibility";
import { toast } from "sonner";

type Row = {
  id: string; code: string; recipient_name: string; contest_title: string;
  rank: number; score: number; total_points: number; issued_at: string; percentage: number; accuracy: number;
  certificate_type: string; citation: string | null; status: string; rejected_reason: string | null;
  admin_comment: string | null; download_count: number; shared_count: number;
};

export default function UserCertificates() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState<EligibilityResult[]>([]);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = async () => {
    if (!user) return;
    const [certsRes, prof, elig] = await Promise.all([
      supabase
        .from("certificates")
        .select("id, code, recipient_name, contest_title, rank, score, total_points, issued_at, certificate_type, citation, percentage, accuracy, status, rejected_reason, admin_comment, download_count, shared_count")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false }),
      supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
      computeAllEligibility(user.id),
    ]);
    setRows((certsRes.data as any as Row[]) ?? []);
    setProfile(prof.data as any);
    setEligibility(elig);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    refresh();
    const ch = supabase
      .channel(`certs-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "certificates", filter: `user_id=eq.${user.id}` },
        () => refresh(),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const stats = useMemo(() => {
    const approved = rows.filter((r) => r.status === "approved").length;
    const pending = rows.filter((r) => r.status === "pending").length;
    const rejected = rows.filter((r) => r.status === "rejected").length;
    const requestedTypes = new Set(rows.map((r) => r.certificate_type));
    const eligibleNotRequested = eligibility.filter((e) => e.eligible && !requestedTypes.has(e.type)).length;
    const downloads = rows.reduce((n, r) => n + (r.download_count ?? 0), 0);
    return { total: rows.length, approved, pending, rejected, eligible: eligibleNotRequested, downloads };
  }, [rows, eligibility]);

  const requestCertificate = async (e: EligibilityResult) => {
    if (!user) return;
    const def = CERT_DEFINITIONS.find((d) => d.type === e.type)!;
    setBusy(e.type);
    try {
      const { error } = await supabase.from("certificates").insert({
        code: generateCode(),
        user_id: user.id,
        contest_id: null,
        recipient_name: profile?.full_name || user.email?.split("@")[0] || "Student",
        contest_title: def.title,
        rank: 1,
        score: Math.round(e.progress),
        total_points: 100,
        percentage: e.progress,
        accuracy: e.progress,
        certificate_type: e.type,
        status: "pending",
        eligibility: e.snapshot,
      } as any);
      if (error) throw error;
      toast.success("Request submitted — pending admin approval");
      await refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to request certificate");
    } finally {
      setBusy(null);
    }
  };

  const download = async (r: Row) => {
    setBusy(r.id);
    try {
      const verifyUrl = `${window.location.origin}/certificates/verify/${r.code}`;
      const blob = await buildCertificatePdf({
        code: r.code, recipientName: r.recipient_name, contestTitle: r.contest_title,
        rank: r.rank, score: r.score, totalPoints: r.total_points, issuedAt: r.issued_at,
        percentage: r.percentage, accuracy: r.accuracy,
        citation: r.citation ?? undefined, certificateType: r.certificate_type,
      }, verifyUrl);
      downloadBlob(blob, `${r.code}.pdf`);
      await (supabase.rpc as any)("increment_certificate_download", { _code: r.code });
    } finally { setBusy(null); }
  };

  const share = async (r: Row) => {
    const url = `${window.location.origin}/certificates/verify/${r.code}`;
    try { await navigator.clipboard.writeText(url); toast.success("Verification link copied"); }
    catch { toast.error("Could not copy link"); }
    await (supabase.rpc as any)("increment_certificate_share", { _code: r.code });
  };

  const requestedTypes = new Set(rows.map((r) => r.certificate_type));
  const eligibleToRequest = eligibility.filter((e) => e.eligible && !requestedTypes.has(e.type));
  const inProgress = eligibility.filter((e) => !e.eligible);
  const pending = rows.filter((r) => r.status === "pending");
  const rejected = rows.filter((r) => r.status === "rejected");
  const approved = rows.filter((r) => r.status === "approved");

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingParticles count={14} color="hsl(45 95% 60% / 0.2)" />
      <Navbar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-4"><BackButton /></div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Award className="h-7 w-7 text-primary" /> My Certificates
            </h1>
            <p className="text-sm text-muted-foreground">Earn, request, and share your CodeCrack achievements.</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : (
            <>
              {/* Overview */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                <OverviewStat label="Total" value={stats.total} icon={<Award className="h-4 w-4" />} />
                <OverviewStat label="Approved" value={stats.approved} tone="success" icon={<CheckCircle2 className="h-4 w-4" />} />
                <OverviewStat label="Pending" value={stats.pending} tone="warning" icon={<Clock className="h-4 w-4" />} />
                <OverviewStat label="Rejected" value={stats.rejected} tone="destructive" icon={<XCircle className="h-4 w-4" />} />
                <OverviewStat label="Eligible" value={stats.eligible} tone="primary" icon={<Sparkles className="h-4 w-4" />} />
                <OverviewStat label="Downloads" value={stats.downloads} icon={<Download className="h-4 w-4" />} />
              </div>

              <Tabs defaultValue="eligible">
                <TabsList>
                  <TabsTrigger value="eligible">Eligible ({eligibleToRequest.length})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                </TabsList>

                {/* Eligible */}
                <TabsContent value="eligible" className="mt-4 grid gap-3">
                  {eligibleToRequest.length === 0 ? (
                    <EmptyState text="Nothing to claim yet — keep practicing to unlock more certificates." />
                  ) : eligibleToRequest.map((e) => {
                    const def = CERT_DEFINITIONS.find((d) => d.type === e.type)!;
                    return (
                      <Card key={e.type} className="border-primary/30">
                        <CardContent className="p-5 flex flex-wrap gap-4 items-center">
                          <div className="flex-1 min-w-[240px]">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold">{def.title}</p>
                              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Eligible</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{def.description}</p>
                            <ul className="text-xs text-muted-foreground mt-2 list-disc pl-4">
                              {def.requirements.map((r) => <li key={r}>{r}</li>)}
                            </ul>
                            <p className="text-xs text-primary mt-2">{e.detail}</p>
                          </div>
                          <Button size="sm" onClick={() => requestCertificate(e)} disabled={busy === e.type}>
                            {busy === e.type ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                            Request Certificate
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>

                {/* Pending & rejected together */}
                <TabsContent value="pending" className="mt-4 grid gap-3">
                  {[...pending, ...rejected].length === 0 ? (
                    <EmptyState text="No requests awaiting review." />
                  ) : [...pending, ...rejected].map((r) => (
                    <Card key={r.id} className={r.status === "pending" ? "border-yellow-500/30" : "border-destructive/30"}>
                      <CardContent className="p-5">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold">{r.contest_title}</p>
                          <Badge variant="outline" className="text-xs">{CERT_LABEL[r.certificate_type] ?? r.certificate_type}</Badge>
                          {r.status === "pending" ? (
                            <Badge className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">Pending Approval</Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">Rejected</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Requested {new Date(r.issued_at).toLocaleString()}</p>
                        {r.admin_comment && <p className="text-xs mt-2"><span className="font-medium">Admin note:</span> {r.admin_comment}</p>}
                        {r.status === "rejected" && r.rejected_reason && <p className="text-xs text-destructive mt-2">Reason: {r.rejected_reason}</p>}
                        <p className="text-xs text-muted-foreground font-mono mt-1">{r.code}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Approved */}
                <TabsContent value="approved" className="mt-4 grid gap-3 md:grid-cols-2">
                  {approved.length === 0 ? (
                    <div className="md:col-span-2"><EmptyState text="No approved certificates yet." /></div>
                  ) : approved.map((r) => (
                    <Card key={r.id} className="overflow-hidden border-primary/30">
                      <div className="relative p-6 text-center bg-gradient-to-br from-[hsl(260,40%,10%)] via-[hsl(265,45%,14%)] to-[hsl(280,50%,12%)]">
                        <Trophy className="h-8 w-8 mx-auto mb-2 text-[hsl(45,95%,60%)]" />
                        <p className="text-[10px] tracking-[0.3em] text-muted-foreground">CERTIFICATE OF ACHIEVEMENT</p>
                        <p className="text-lg font-bold text-white mt-2">{r.recipient_name}</p>
                        <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent my-2" />
                        <p className="text-sm text-white/90">{r.contest_title}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-2">{r.code}</p>
                      </div>
                      <CardContent className="p-4 flex flex-wrap items-center gap-2">
                        <div className="flex-1 min-w-[140px]">
                          <p className="text-xs text-muted-foreground">
                            Issued {new Date(r.issued_at).toLocaleDateString()} · {r.download_count ?? 0} downloads
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/certificates/verify/${r.code}`}><ExternalLink className="h-3.5 w-3.5 mr-1" />Preview</Link>
                        </Button>
                        <Button size="sm" onClick={() => download(r)} disabled={busy === r.id}>
                          {busy === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1" />}PDF
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => share(r)}>
                          <Share2 className="h-3.5 w-3.5 mr-1" />Share
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* In-progress */}
                <TabsContent value="progress" className="mt-4 grid gap-3">
                  {inProgress.map((e) => {
                    const def = CERT_DEFINITIONS.find((d) => d.type === e.type)!;
                    return (
                      <Card key={e.type}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span>{def.title}</span>
                            <Badge variant="outline" className="text-xs">{e.progress}%</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Progress value={e.progress} className="h-2 mb-2" />
                          <p className="text-xs text-muted-foreground">{e.detail}</p>
                          <p className="text-xs text-muted-foreground mt-1">{def.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {inProgress.length === 0 && <EmptyState text="You've unlocked all certificate tracks. Amazing!" />}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function OverviewStat({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone?: "success" | "warning" | "destructive" | "primary" }) {
  const toneClass =
    tone === "success" ? "text-emerald-500" :
    tone === "warning" ? "text-yellow-500" :
    tone === "destructive" ? "text-destructive" :
    tone === "primary" ? "text-primary" : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <div className={`flex items-center gap-1.5 text-xs ${toneClass}`}>{icon}<span>{label}</span></div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">{text}</CardContent></Card>
  );
}
