import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

type NavLink = { to: string; label: string; hash?: boolean; auth?: boolean };
const navLinks: NavLink[] = [
  { to: "/", label: "Home" },
  { to: "/#features", label: "Features", hash: true },
  { to: "/#how", label: "AI Analysis", hash: true },
  { to: "/history", label: "History", auth: true },
  { to: "/dashboard", label: "Dashboard", auth: true },
  { to: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 -z-10 glass-strong border-b" />
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative grid h-8 w-8 place-items-center rounded-lg gradient-thread glow-thread">
            <Sparkles className="h-4 w-4 text-[color:var(--accent-foreground)]" strokeWidth={2.5} />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">
            Thread<span className="text-thread">County</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks
            .filter((l) => !l.auth || user)
            .map((link) => (
              <a
                key={link.label}
                href={link.to}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
              >
                {link.label}
              </a>
            ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
                <Link to="/upload">Upload</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="hidden sm:inline-flex"
                onClick={() => supabase.auth.signOut()}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex gradient-thread text-[color:var(--accent-foreground)] hover:opacity-90 border-0">
              <Link to="/auth">Get Started</Link>
            </Button>
          )}
          <button
            className="md:hidden p-2"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t glass-strong">
          <div className="flex flex-col p-4 gap-1">
            {navLinks
              .filter((l) => !l.auth || user)
              .map((link) => (
                <a
                  key={link.label}
                  href={link.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm rounded-md hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
            {user ? (
              <>
                <Link to="/upload" onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-md hover:bg-muted">Upload</Link>
                <button onClick={() => supabase.auth.signOut()} className="text-left px-3 py-2 text-sm rounded-md hover:bg-muted">Sign out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-md gradient-thread text-[color:var(--accent-foreground)]">Get Started</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
