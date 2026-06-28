import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset password — ThreadCounty" }],
    links: [{ rel: "canonical", href: "/reset-password" }],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. You're signed in.");
    navigate({ to: "/upload" });
  }

  return (
    <div className="min-h-screen grid place-items-center hero-radial p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl glass-strong p-8">
        <h1 className="font-display text-3xl">Set a new password.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pick something memorable but strong.</p>
        <div className="mt-6 space-y-1.5">
          <Label htmlFor="np" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            New password
          </Label>
          <Input
            id="np"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading} className="mt-6 w-full gradient-thread text-[color:var(--accent-foreground)] border-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
        </Button>
      </form>
    </div>
  );
}
