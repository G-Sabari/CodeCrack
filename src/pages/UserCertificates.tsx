import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Loader2, ExternalLink, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { buildCertificatePdf, downloadBlob } from "@/lib/certificate";
import { FloatingParticles } from "@/components/contest/FloatingParticles";

type Row = {
  id: string; code: string; recipient_name: string; contest_title: string;
  rank: number; score: number; total_points: number; issued_at: string; percentage: number; accuracy: number;
  certificate_type: string; citation: string | null; status: string; rejected_reason: string | null;
};

const typeLabel: Record<string, string> = {
  winner: "Winner",
  top_performer: "Top Performer",
  participation: "Participation",
};

export default function UserCertificates() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("certificates")
        .select("id, code, recipient_name, contest_title, rank, score, total_points, issued_at, certificate_type, citation, percentage, accuracy, status, rejected_reason")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });
      setRows((data as any as Row[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  const download = async (r: Row) => {
    setDownloadingId(r.id);
    try {
      const verifyUrl = `${window.location.origin}/certificate/${r.code}`;
      const blob = await buildCertificatePdf({
        code: r.code, recipientName: r.recipient_name, contestTitle: r.contest_title,
        rank: r.rank, score: r.score, totalPoints: r.total_points, issuedAt: r.issued_at, percentage: r.percentage, accuracy: r.accuracy,
        citation: r.citation ?? undefined, certificateType: r.certificate_type,
      }, verifyUrl);
      downloadBlob(blob, `${r.code}.pdf`);
    } finally { setDownloadingId(null); }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingParticles count={14} color="hsl(45 95% 60% / 0.2)" />
      <Navbar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-4"><BackButton /></div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Award className="h-7 w-7 text-primary" /> My Certificates
            </h1>
            <p className="text-sm text-muted-foreground">Certificates issued for contests you have participated in.</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : rows.length === 0 ? (
            <Card><CardContent className="py-16 text-center text-muted-foreground">
              <Trophy className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No certificates yet. Compete in a contest to earn one.</p>
              <Button asChild className="mt-4" variant="outline"><Link to="/contest">Browse contests</Link></Button>
            </CardContent></Card>
          ) : (
            <div className="grid gap-3">
              {rows.map((r) => {
                const approved = r.status === "approved";
                const pending = r.status === "pending";
                const rejected = r.status === "rejected";
                return (
                <Card key={r.id} className={`overflow-hidden ${approved ? "border-primary/20" : pending ? "border-yellow-500/30" : "border-destructive/30"}`}>
                  <CardContent className="p-5 flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold">{r.contest_title}</p>
                        <Badge variant={r.certificate_type === "winner" ? "default" : "outline"} className="text-xs">
                          {typeLabel[r.certificate_type] ?? r.certificate_type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">Rank #{r.rank}</Badge>
                        {pending && <Badge className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">Pending admin approval</Badge>}
                        {rejected && <Badge variant="destructive" className="text-xs">Rejected</Badge>}
                        {approved && <Badge className="text-xs bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">Approved</Badge>}
                      </div>
                      {r.citation && approved && <p className="text-xs text-muted-foreground italic mt-2 line-clamp-2">"{r.citation}"</p>}
                      {rejected && r.rejected_reason && <p className="text-xs text-destructive mt-2">Reason: {r.rejected_reason}</p>}
                      <p className="text-xs text-muted-foreground font-mono mt-1">{r.code}</p>
                    </div>
                    <div className="flex gap-2">
                      {approved ? (
                        <>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/certificate/${r.code}`}><ExternalLink className="h-3.5 w-3.5 mr-1" /> View</Link>
                          </Button>
                          <Button size="sm" onClick={() => download(r)} disabled={downloadingId === r.id}>
                            {downloadingId === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1" />} PDF
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          {pending ? "Awaiting approval" : "Unavailable"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
