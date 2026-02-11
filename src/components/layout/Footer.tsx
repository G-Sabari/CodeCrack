import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-[hsl(var(--card)/0.5)] backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] shadow-md shadow-[hsl(var(--primary)/0.2)]">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">CodeCrack</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Master coding interviews with real-world practice problems and AI-powered mentoring.
            </p>
          </div>

          {/* Practice */}
          <div className="space-y-4">
            <h3 className="font-semibold">Practice</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/problems" className="hover:text-primary transition-colors">All Problems</Link></li>
              <li><Link to="/companies" className="hover:text-primary transition-colors">Company Questions</Link></li>
              <li><Link to="/learning-path" className="hover:text-primary transition-colors">Learning Paths</Link></li>
            </ul>
          </div>

          {/* Companies */}
          <div className="space-y-4">
            <h3 className="font-semibold">Top Companies</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/companies/amazon" className="hover:text-primary transition-colors">Amazon</Link></li>
              <li><Link to="/companies/google" className="hover:text-primary transition-colors">Google</Link></li>
              <li><Link to="/companies/microsoft" className="hover:text-primary transition-colors">Microsoft</Link></li>
              <li><Link to="/companies/zoho" className="hover:text-primary transition-colors">Zoho</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/contest" className="hover:text-primary transition-colors">Weekly Contest</Link></li>
              <li><Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/30 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CodeCrack. Built for Indian developers preparing for tech interviews.</p>
        </div>
      </div>
    </footer>
  );
}
