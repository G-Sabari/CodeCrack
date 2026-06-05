import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useUserRole() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [anyAdminExists, setAnyAdminExists] = useState<boolean | null>(null);

  const refresh = async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);

    // best-effort check whether any admin exists at all (RLS allows admins to see all, others see own)
    const { count } = await supabase
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    setAnyAdminExists((count ?? 0) > 0);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading]);

  const claimFirstAdmin = async () => {
    const { data, error } = await supabase.rpc("claim_first_admin");
    if (error) throw error;
    await refresh();
    return !!data;
  };

  return { isAdmin, loading, anyAdminExists, refresh, claimFirstAdmin };
}
