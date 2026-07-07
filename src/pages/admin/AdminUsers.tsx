import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff, RefreshCw, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Profile = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  college_name: string | null;
  department: string | null;
  created_at: string;
};

type Role = "admin" | "moderator" | "user";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [rows, setRows] = useState<Profile[]>([]);
  const [rolesByUser, setRolesByUser] = useState<Record<string, Role[]>>({});
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const { data: profs, error } = await supabase
      .from("profiles")
      .select("user_id, email, full_name, college_name, department, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) { toast.error(error.message); return; }
    setRows(profs ?? []);
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const map: Record<string, Role[]> = {};
    (roles ?? []).forEach((r: any) => {
      map[r.user_id] = [...(map[r.user_id] ?? []), r.role];
    });
    setRolesByUser(map);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          !q ||
          r.email?.toLowerCase().includes(q.toLowerCase()) ||
          r.full_name?.toLowerCase().includes(q.toLowerCase()) ||
          r.college_name?.toLowerCase().includes(q.toLowerCase()),
      ),
    [rows, q],
  );

  const toggleRole = async (userId: string, role: Role) => {
    const has = rolesByUser[userId]?.includes(role);
    if (userId === me?.id && role === "admin" && has) {
      if (!confirm("Remove your own admin access? You will lose the admin panel.")) return;
    }
    setBusy(userId + role);
    if (has) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) toast.error(error.message);
      else toast.success(`Removed ${role}`);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) toast.error(error.message);
      else toast.success(`Granted ${role}`);
    }
    setBusy(null);
    load();
  };

  return (
    <AdminShell title="User Management">
      <div className="mb-4 flex gap-2">
        <Input placeholder="Search name / email / college…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <Button variant="outline" onClick={load}><RefreshCw className="h-4 w-4 mr-1.5" /> Refresh</Button>
        <Badge variant="outline" className="ml-auto self-center">{filtered.length} users</Badge>
      </div>

      <div className="space-y-2">
        {filtered.map((p) => {
          const roles = rolesByUser[p.user_id] ?? [];
          const isAdmin = roles.includes("admin");
          const isMod = roles.includes("moderator");
          return (
            <Card key={p.user_id}>
              <CardContent className="py-3 grid grid-cols-12 gap-3 items-center text-sm">
                <div className="col-span-4 min-w-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.full_name || "—"}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                  </div>
                </div>
                <div className="col-span-3 text-xs truncate">
                  <p className="truncate">{p.college_name || "—"}</p>
                  <p className="text-muted-foreground truncate">{p.department || ""}</p>
                </div>
                <div className="col-span-2 flex flex-wrap gap-1">
                  {isAdmin && <Badge>admin</Badge>}
                  {isMod && <Badge variant="secondary">moderator</Badge>}
                  {!isAdmin && !isMod && <Badge variant="outline">user</Badge>}
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant={isMod ? "secondary" : "outline"}
                    disabled={busy === p.user_id + "moderator"}
                    onClick={() => toggleRole(p.user_id, "moderator")}
                  >
                    {isMod ? "Revoke mod" : "Make mod"}
                  </Button>
                  <Button
                    size="sm"
                    variant={isAdmin ? "destructive" : "default"}
                    disabled={busy === p.user_id + "admin"}
                    onClick={() => toggleRole(p.user_id, "admin")}
                  >
                    {isAdmin ? <><ShieldOff className="h-3.5 w-3.5 mr-1" /> Revoke admin</> : <><ShieldCheck className="h-3.5 w-3.5 mr-1" /> Make admin</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No users.</p>}
      </div>
    </AdminShell>
  );
}
