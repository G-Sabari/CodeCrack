import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Download, Loader2, ShieldX, Share2, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { buildCertificatePdf, downloadBlob } from "@/lib/certificate";
import { toast } from "sonner";

type Cert = {
  id: string;
  code: string;
  recipient_name: string;
  contest_title: string;
  rank: number;
  score: number;
  total_points: number;
  issued_at: string;
};

export default function CertificateView() {
  const { code } = useParams<{ code: string }>();
  const [cert, setCert] = useState<Cert | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!code) return;
    (async () => {
      const { data } = await supabase
        .from("certificates")
        .select("id, code, recipient_name, contest_title, rank, score, total_points, issued_at")
        .eq("code", code)
        .maybeSingle();
      setCert(data);
      setLoading(false);
    })();
  }, [code]);

  const download = async () => {
    if (!cert) return;
    setDownloading(true);
    try {
      const verifyUrl = `${window.location.origin}/certificate/${cert.code}`;
      const blob = await buildCertificatePdf(
        {
          code: cert.code,
          recipientName: cert.recipient_name,
          contestTitle: cert.contest_title,
          rank: cert.rank,
          score: cert.score,
          totalPoints: cert.total_points,
          issuedAt: cert.issued_at,
        },
        verifyUrl,
      );
      downloadBlob(blob, `${cert.code}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const shareLinkedIn = () => {
    if (!cert) return;
    const url = encodeURIComponent(`${window.location.origin}/certificate/${cert.code}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const copyLink = async () => {
    if (!cert) return;
    await navigator.clipboard.writeText(`${window.location.origin}/certificate/${cert.code}`);
    toast.success("Verification link copied");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-4"><BackButton /></div>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Verifying certificate…
            </div>
          ) : !cert ? (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="py-16 text-center">
                <ShieldX className="h-12 w-12 text-destructive mx-auto mb-3" />
                <h2 className="text-xl font-bold mb-1">Invalid certificate</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  No certificate with code <span className="font-mono">{code}</span> was found.
                </p>
                <Link to="/contest"><Button variant="outline">Back to Contests</Button></Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5 p-4 mb-6 flex items-center gap-3"
              >
                <ShieldCheck className="h-5 w-5 text-[hsl(var(--success))]" />
                <div>
                  <p className="font-semibold text-sm">Verified Certificate</p>
                  <p className="text-xs text-muted-foreground">Code <span className="font-mono">{cert.code}</span></p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden border-2 border-primary/30 p-10 text-center bg-gradient-to-br from-[hsl(260,40%,8%)] via-[hsl(265,45%,12%)] to-[hsl(280,50%,10%)]"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 right-4 bottom-4 border border-primary/30 rounded-xl" />
                </div>
                <div className="relative">
                  <Trophy className="h-10 w-10 mx-auto mb-3 text-[hsl(45,95%,60%)]" />
                  <p className="text-xs tracking-[0.3em] text-muted-foreground mb-2">CERTIFICATE OF ACHIEVEMENT</p>
                  <p className="text-sm text-muted-foreground mb-4">This certifies that</p>
                  <h1 className="text-4xl font-bold mb-2 text-white">{cert.recipient_name}</h1>
                  <div className="h-px w-40 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mb-6" />
                  <p className="text-muted-foreground text-sm mb-1">has successfully completed</p>
                  <p className="text-xl font-semibold text-white mb-6">{cert.contest_title}</p>

                  <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                    <Stat label="Rank" value={`#${cert.rank}`} />
                    <Stat label="Score" value={`${cert.score}`} />
                    <Stat label="Total" value={`${cert.total_points}`} />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Issued {new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </motion.div>

              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                <Button onClick={download} disabled={downloading}>
                  {downloading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Download className="h-4 w-4 mr-1.5" />}
                  Download PDF
                </Button>
                <Button variant="outline" onClick={shareLinkedIn}>
                  <Share2 className="h-4 w-4 mr-1.5" /> Share on LinkedIn
                </Button>
                <Button variant="ghost" onClick={copyLink}>Copy verification link</Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-2 rounded-lg border border-primary/30 bg-background/30 min-w-[90px]">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-lg font-bold text-primary">{value}</div>
    </div>
  );
}
