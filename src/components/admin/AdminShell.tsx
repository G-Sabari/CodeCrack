import { Link } from "react-router-dom";
import { LayoutDashboard, Trophy, Code2, FileText, Award, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/contests", label: "Contests", icon: Trophy },
  { to: "/admin/problems", label: "Problems", icon: Code2 },
  { to: "/admin/submissions", label: "Submissions", icon: FileText },
  { to: "/admin/certificates", label: "Certificates", icon: Award },
];

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 w-60 border-r border-border/30 bg-card/40 backdrop-blur-xl p-4 hidden md:flex flex-col">
        <Link to="/" className="text-lg font-bold gradient-text mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> CodeCrack Admin
        </Link>
        <nav className="space-y-1 flex-1">
          {items.map((it) => {
            const active = it.end ? loc.pathname === it.to : loc.pathname.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                <it.icon className="h-4 w-4" /> {it.label}
              </Link>
            );
          })}
        </nav>
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground mt-4">← Back to site</Link>
      </aside>
      <main className="md:pl-60">
        <div className="border-b border-border/30 px-6 py-4">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
