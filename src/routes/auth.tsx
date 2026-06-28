import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const searchSchema = z.object({ next: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — ThreadCounty" },
      { name: "description", content: "Sign in or create your ThreadCounty account." },
      { property: "og:title", content: "Sign in — ThreadCounty" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [tab, setTab] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back.");
    navigate({ to: search.next === "/upload" ? "/upload" : "/upload" });
  }

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email to confirm — or sign in if confirmation is disabled.");
    setTab("signin");
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Reset link sent. Check your email.");
    setTab("signin");
  }

  async function onGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    if (result.error) {
      setLoading(false);
      toast.error(result.error.message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    toast.success("Signed in with Google");
    navigate({ to: "/upload" });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 hero-radial">
      {/* Side panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r relative overflow-hidden">
        <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg gradient-thread">
            <Sparkles className="h-4 w-4 text-[color:var(--accent-foreground)]" strokeWidth={2.5} />
          </div>
          <span className="font-mono text-sm font-semibold">
            Thread<span className="text-thread">County</span>
          </span>
        </Link>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-thread">Built for textile QC</p>
          <h2 className="mt-4 font-display text-5xl leading-tight">
            Every thread,
            <br />
            <span className="gradient-text-thread italic">counted.</span>
          </h2>
          <p className="mt-6 text-sm text-muted-foreground max-w-sm">
            Upload a fabric photo and get instant AI analysis: type, weave, defects, and a 0–100
            quality score.
          </p>
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          © {new Date().getFullYear()} ThreadCounty
        </p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-thread">
              <Sparkles className="h-4 w-4 text-[color:var(--accent-foreground)]" strokeWidth={2.5} />
            </div>
            <span className="font-mono text-sm font-semibold">ThreadCounty</span>
          </Link>

          <h1 className="font-display text-4xl">
            {tab === "signin" ? "Welcome back." : tab === "signup" ? "Create account." : "Forgot password."}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {tab === "signin"
              ? "Sign in to upload fabric and view analysis."
              : tab === "signup"
                ? "Start analyzing fabric in under a minute."
                : "We'll email you a reset link."}
          </p>

          {tab !== "forgot" && (
            <>
              <Button onClick={onGoogle} disabled={loading} variant="outline" className="w-full mt-8">
                <GoogleIcon className="mr-2 h-4 w-4" /> Continue with Google
              </Button>
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </>
          )}

          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={onSignIn} className="space-y-4">
                <Field id="email" label="Email" icon={Mail}>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@manufactory.com" />
                </Field>
                <Field id="password" label="Password" icon={Lock}>
                  <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </Field>
                <button type="button" onClick={() => setTab("forgot")} className="text-xs text-thread hover:underline">
                  Forgot password?
                </button>
                <Button type="submit" disabled={loading} className="w-full gradient-thread text-[color:var(--accent-foreground)] border-0 hover:opacity-90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={onSignUp} className="space-y-4">
                <Field id="name" label="Name">
                  <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </Field>
                <Field id="email-s" label="Email" icon={Mail}>
                  <Input id="email-s" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@manufactory.com" />
                </Field>
                <Field id="password-s" label="Password" icon={Lock}>
                  <Input id="password-s" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
                </Field>
                <Button type="submit" disabled={loading} className="w-full gradient-thread text-[color:var(--accent-foreground)] border-0 hover:opacity-90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {tab === "forgot" && (
            <form onSubmit={onForgot} className="space-y-4 mt-8">
              <Field id="email-f" label="Email" icon={Mail}>
                <Input id="email-f" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@manufactory.com" />
              </Field>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setTab("signin")} className="flex-1">Back</Button>
                <Button type="submit" disabled={loading} className="flex-1 gradient-thread text-[color:var(--accent-foreground)] border-0">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />}
        <div className={Icon ? "[&_input]:pl-9" : undefined}>{children}</div>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#EA4335" d="M12 11v3.2h4.5c-.2 1.1-1.4 3.2-4.5 3.2-2.7 0-4.9-2.2-4.9-5s2.2-5 4.9-5c1.5 0 2.6.6 3.2 1.2L17.6 6c-1.4-1.3-3.3-2-5.6-2C7.6 4 4 7.6 4 12s3.6 8 8 8c4.6 0 7.7-3.2 7.7-7.8 0-.5-.1-.9-.2-1.2H12z" />
    </svg>
  );
}
