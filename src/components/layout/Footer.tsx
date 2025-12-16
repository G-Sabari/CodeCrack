import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">CodeCrack</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Master coding interviews with real-world practice problems and AI-powered mentoring.
            </p>
          </div>

          {/* Practice */}
          <div className="space-y-4">
            <h3 className="font-semibold">Practice</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/problems" className="hover:text-foreground transition-colors">All Problems</Link></li>
              <li><Link to="/companies" className="hover:text-foreground transition-colors">Company Questions</Link></li>
              <li><Link to="/learning-path" className="hover:text-foreground transition-colors">Learning Paths</Link></li>
            </ul>
          </div>

          {/* Companies */}
          <div className="space-y-4">
            <h3 className="font-semibold">Top Companies</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/companies/amazon" className="hover:text-foreground transition-colors">Amazon</Link></li>
              <li><Link to="/companies/google" className="hover:text-foreground transition-colors">Google</Link></li>
              <li><Link to="/companies/microsoft" className="hover:text-foreground transition-colors">Microsoft</Link></li>
              <li><Link to="/companies/zoho" className="hover:text-foreground transition-colors">Zoho</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CodeCrack. Built for Indian developers preparing for tech interviews.</p>
        </div>
      </div>
    </footer>
  );
}
