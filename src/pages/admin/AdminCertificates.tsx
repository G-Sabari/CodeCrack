import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Check, X, Clock, Award } from "lucide-react";

type Cert = {
  id: string;
  code: string;
  recipient_name: string;
  contest_title: string; // we store problem title here
  status: string;
  issued_at: string;
  approved_at: string | null;
  rejected_reason: string | null;
};

export default function AdminCertificates() {
  const [pending, setPending] = useState<Cert[]>([]);
  const [history, setHistory] = useState<Cert[]>([]);
  const [acting, setActing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("certificates")
      .select("id, code, recipient_name, contest_title, status, issued_at, approved_at, rejected_reason")
      .order("issued_at", { ascending: false })
      .limit(200);
    const all = (data as Cert[]) ?? [];
    setPending(all.filter((c) => c.status === "pending"));
    setHistory(all.filter((c) => c.status !== "pending"));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const decide = async (id: string, approve: boolean) => {
    setActing(id);
    const reason = approve ? null : (prompt("Reason for rejection (optional)") || "Rejected by administrator");
    const patch: any = approve
      ? { status: "approved", approved_at: new Date().toISOString() }
      : { status: "rejected", rejected_reason: reason };
    const { error } = await supabase.from("certificates").update(patch).eq("id", id);
    setActing(null);
    if (error) toast.error(error.message);
    else { toast.success(approve ? "Certificate approved" : "Certificate rejected"); load(); }
  };

  return (
    <AdminShell title="Certificate Requests">
      <Card className="mb-6 border-yellow-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" /> Pending Requests
            <Badge variant="outline" className="text-xs">{pending.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : pending.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No certificate requests awaiting approval.</p>
          ) : pending.map((p) => (
            <div key={p.id} className="rounded-lg border p-3 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[220px]">
                <p className="font-medium text-sm">{p.recipient_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Solved: <span className="text-foreground">{p.contest_title}</span> · <span className="font-mono">{p.code}</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Requested {new Date(p.issued_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => decide(p.id, false)} disabled={acting === p.id}>
                  <X className="h-3.5 w-3.5 mr-1" /> Reject
                </Button>
                <Button size="sm" onClick={() => decide(p.id, true)} disabled={acting === p.id}>
                  {acting === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="h-3.5 w-3.5 mr-1" /> Approve</>}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" /> Recent Decisions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No history yet.</p>
          ) : history.map((h) => (
            <div key={h.id} className="rounded-lg border p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{h.recipient_name} · {h.contest_title}</p>
                <p className="text-[10px] text-muted-foreground font-mono truncate">{h.code}</p>
                {h.rejected_reason && <p className="text-xs text-destructive mt-0.5">Reason: {h.rejected_reason}</p>}
              </div>
              <Badge variant={h.status === "approved" ? "default" : "destructive"} className="text-xs capitalize">{h.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
