import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, ShieldOff } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading, anyAdminExists, claimFirstAdmin } = useUserRole();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <ShieldOff className="h-10 w-10 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">Admin access required</h1>
          <p className="text-sm text-muted-foreground">
            Your account does not have administrator privileges.
          </p>
          {anyAdminExists === false && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
              <p className="text-sm">
                No administrator has been set up yet. You can claim the first admin seat now.
              </p>
              <Button
                onClick={async () => {
                  try { await claimFirstAdmin(); } catch {}
                }}
              >
                Claim first admin
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
