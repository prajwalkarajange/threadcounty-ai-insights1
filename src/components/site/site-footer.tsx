import { Link } from "@tanstack/react-router";
import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative border-t mt-32">
      <div className="absolute inset-0 -z-10 opacity-40 grid-bg" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg gradient-thread">
                <Sparkles className="h-4 w-4 text-[color:var(--accent-foreground)]" strokeWidth={2.5} />
              </div>
              <span className="font-mono text-sm font-semibold">
                Thread<span className="text-thread">County</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              AI-powered textile intelligence. Identify fabric types, detect defects,
              and score quality at industrial scale.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-full border hover:border-thread transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-full border hover:border-thread transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full border hover:border-thread transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#features" className="hover:text-thread transition-colors">Features</a></li>
              <li><a href="/#how" className="hover:text-thread transition-colors">How it works</a></li>
              <li><Link to="/upload" className="hover:text-thread transition-colors">Upload Fabric</Link></li>
              <li><Link to="/dashboard" className="hover:text-thread transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-thread transition-colors">Contact</Link></li>
              <li><a href="/#faq" className="hover:text-thread transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-thread transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-thread transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} ThreadCounty · AI-powered textile intelligence
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Made for manufacturers who care about every thread.
          </p>
        </div>
      </div>
    </footer>
  );
}
