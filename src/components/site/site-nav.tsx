import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Upload, History, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";

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
  const { user, loading } = useAuth();
  const profile = useProfile();

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="
hidden lg:flex
items-center
gap-3
h-12
px-3
rounded-full

border-border
bg-card
text-foreground
transition-colors
hover:bg-muted
dark:bg-card
dark:hover:bg-muted
"
                  >
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-orange-500">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-orange-500 text-white font-bold text-lg">
                          {(profile?.full_name || user.user_metadata?.full_name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="text-left leading-tight text-foreground">
                     <p className="font-semibold text-sm text-foreground">
                        {profile?.full_name || user.user_metadata?.full_name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {profile?.email || user.email}
                      </p>
                    </div>

                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

              <DropdownMenuContent
  align="end"
  className="
    w-72
    rounded-2xl
    p-2
    border
    bg-background
    text-foreground
    shadow-xl
    dark:border-slate-700
  "
>
                  <div className="flex items-center gap-3 px-3 py-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-orange-500">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-orange-500 text-white font-bold">
                          {(profile?.full_name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {profile?.full_name || user.user_metadata?.full_name}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {profile?.email || user.email}
                      </p>
                      <p className="text-xs text-orange-500 mt-1">Welcome back 👋</p>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/upload">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Fabric
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/history">
                      <History className="mr-2 h-4 w-4" />
                      History
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => supabase.auth.signOut()}
                    className="text-red-500 focus:text-white focus:bg-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex gradient-thread text-[color:var(--accent-foreground)] hover:opacity-90 border-0"
            >
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
                <Link
                  to="/upload"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm rounded-md hover:bg-muted"
                >
                  📤 Upload Fabric
                </Link>

                <Link
                  to="/history"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm rounded-md hover:bg-muted"
                >
                  📜 History
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm rounded-md hover:bg-muted"
                >
                  📊 Dashboard
                </Link>

                <button
                  onClick={() => {
                    setOpen(false);
                    supabase.auth.signOut();
                  }}
                  className="text-left px-3 py-2 text-red-500 rounded-md hover:bg-muted"
                >
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm rounded-md gradient-thread text-[color:var(--accent-foreground)]"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
