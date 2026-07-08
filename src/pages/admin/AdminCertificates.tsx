import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Check, X, Clock, Award, Eye, Download, Search, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

type Cert = {
  id: string;
  code: string;
  user_id: string;
  recipient_name: string;
  contest_title: string;
  certificate_type: string;
  status: string;
  issued_at: string;
  approved_at: string | null;
  reviewed_at: string | null;
  rejected_reason: string | null;
  admin_comment: string | null;
  download_count: number | null;
  eligibility: any;
};
type Profile = { user_id: string; email: string | null; full_name: string | null; college_name: string | null };

export default function AdminCertificates() {
  const [rows, setRows] = useState<Cert[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [acting, setActing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rejectFor, setRejectFor] = useState<Cert | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("certificates")
      .select("id, code, user_id, recipient_name, contest_title, certificate_type, status, issued_at, approved_at, reviewed_at, rejected_reason, admin_comment, download_count, eligibility")
      .order("issued_at", { ascending: false })
      .limit(500);
    const all = ((data as any) as Cert[]) ?? [];
    setRows(all);
    const userIds = Array.from(new Set(all.map((r) => r.user_id)));
    if (userIds.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, email, full_name, college_name")
        .in("user_id", userIds);
      const map: Record<string, Profile> = {};
      (profs ?? []).forEach((p: any) => { map[p.user_id] = p; });
      setProfiles(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("admin-certs")
      .on("postgres_changes", { event: "*", schema: "public", table: "certificates" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const p = profiles[r.user_id];
      return (
        r.recipient_name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.contest_title.toLowerCase().includes(q) ||
        (p?.email ?? "").toLowerCase().includes(q) ||
        (p?.college_name ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, search, profiles]);

  const pending = filtered.filter((r) => r.status === "pending");
  const approved = filtered.filter((r) => r.status === "approved");
  const rejected = filtered.filter((r) => r.status === "rejected");

  const todayISO = new Date(); todayISO.setHours(0, 0, 0, 0);
  const approvedToday = rows.filter(
    (r) => r.status === "approved" && r.approved_at && new Date(r.approved_at) >= todayISO,
  ).length;

  const approve = async (c: Cert, comment?: string) => {
    setActing(c.id);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from("certificates").update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: auth.user?.id,
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.user?.id,
      admin_comment: comment ?? null,
    } as any).eq("id", c.id);
    setActing(null);
    if (error) return toast.error(error.message);
    toast.success("Certificate approved");
  };

  const submitReject = async () => {
    if (!rejectFor) return;
    setActing(rejectFor.id);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from("certificates").update({
      status: "rejected",
      rejected_reason: rejectReason.trim() || "Rejected by administrator",
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.user?.id,
    } as any).eq("id", rejectFor.id);
    setActing(null);
    setRejectFor(null); setRejectReason("");
    if (error) toast.error(error.message);
    else toast.success("Rejected");
  };

  const StudentCell = ({ userId, fallback }: { userId: string; fallback: string }) => {
    const p = profiles[userId];
    return (
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{p?.full_name || fallback}</p>
        <p className="text-[10px] text-muted-foreground truncate">{p?.email ?? "—"} · {p?.college_name ?? "—"}</p>
      </div>
    );
  };

  return (
    <AdminShell title="Certificate Requests">
      {/* Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Pending" value={pending.length} icon={<Clock className="h-4 w-4 text-yellow-500" />} />
        <StatCard label="Approved Today" value={approvedToday} icon={<Check className="h-4 w-4 text-emerald-500" />} />
        <StatCard label="Total Certificates" value={rows.length} icon={<Award className="h-4 w-4 text-primary" />} />
        <StatCard label="Rejected" value={rejected.length} icon={<X className="h-4 w-4 text-destructive" />} />
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name, email, college, code…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        {/* PENDING */}
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-500" /> Awaiting Review</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
              ) : pending.length === 0 ? (
                <Empty text="No certificate requests awaiting approval." />
              ) : pending.map((p) => (
                <div key={p.id} className="rounded-lg border p-3 flex flex-wrap items-center gap-3">
                  <StudentCell userId={p.user_id} fallback={p.recipient_name} />
                  <div className="flex-1 min-w-[180px]">
                    <p className="text-xs"><Badge variant="outline" className="text-[10px] mr-1">{p.certificate_type.replace(/_/g, " ")}</Badge>
                      <span className="text-muted-foreground">{p.contest_title}</span>
                    </p>
                    {p.eligibility && (
                      <p className="text-[10px] text-muted-foreground mt-1 truncate">
                        Eligibility: {Object.entries(p.eligibility).slice(0, 3).map(([k, v]) => `${k}: ${String(v)}`).join(" · ")}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">Requested {new Date(p.issued_at).toLocaleString()} · <span className="font-mono">{p.code}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" asChild><Link to={`/certificates/verify/${p.code}`} target="_blank"><Eye className="h-3.5 w-3.5" /></Link></Button>
                    <Button size="sm" variant="outline" onClick={() => { setRejectFor(p); setRejectReason(""); }} disabled={acting === p.id}>
                      <X className="h-3.5 w-3.5 mr-1" />Reject
                    </Button>
                    <Button size="sm" onClick={() => approve(p)} disabled={acting === p.id}>
                      {acting === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="h-3.5 w-3.5 mr-1" />Approve</>}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPROVED */}
        <TabsContent value="approved" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              {approved.length === 0 ? <Empty text="No approved certificates yet." /> : approved.map((a) => (
                <div key={a.id} className="rounded-lg border p-3 flex flex-wrap items-center gap-3">
                  <StudentCell userId={a.user_id} fallback={a.recipient_name} />
                  <div className="flex-1 min-w-[160px]">
                    <p className="text-xs font-medium">{a.contest_title}</p>
                    <p className="text-[10px] text-muted-foreground">Approved {a.approved_at ? new Date(a.approved_at).toLocaleDateString() : "—"}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><Download className="h-3 w-3" />{a.download_count ?? 0}</div>
                  <Button size="sm" variant="ghost" asChild><Link to={`/certificates/verify/${a.code}`} target="_blank"><Eye className="h-3.5 w-3.5" /></Link></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* REJECTED */}
        <TabsContent value="rejected" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              {rejected.length === 0 ? <Empty text="No rejected requests." /> : rejected.map((r) => (
                <div key={r.id} className="rounded-lg border p-3 flex flex-wrap items-center gap-3">
                  <StudentCell userId={r.user_id} fallback={r.recipient_name} />
                  <div className="flex-1 min-w-[180px]">
                    <p className="text-xs font-medium">{r.contest_title}</p>
                    <p className="text-[10px] text-muted-foreground">Rejected {r.reviewed_at ? new Date(r.reviewed_at).toLocaleDateString() : "—"}</p>
                    {r.rejected_reason && <p className="text-xs text-destructive mt-1">Reason: {r.rejected_reason}</p>}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => approve(r, "Approved after re-review")} disabled={acting === r.id}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />Approve now
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reject dialog */}
      <Dialog open={!!rejectFor} onOpenChange={(o) => !o && setRejectFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject certificate request</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{rejectFor?.recipient_name} · {rejectFor?.contest_title}</p>
          <Textarea placeholder="Reason (shown to the student)" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectFor(null)}>Cancel</Button>
            <Button variant="destructive" onClick={submitReject} disabled={acting === rejectFor?.id}>
              {acting === rejectFor?.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card><CardContent className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </CardContent></Card>
  );
}
function Empty({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground py-6 text-center">{text}</p>;
}
