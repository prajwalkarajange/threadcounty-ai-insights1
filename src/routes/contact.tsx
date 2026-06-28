import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";

import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ThreadCounty" },
      { name: "description", content: "Get in touch with the ThreadCounty team." },
      { property: "og:title", content: "Contact — ThreadCounty" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name too short").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1 hero-radial">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-thread">Get in touch</p>
              <h1 className="mt-3 font-display text-5xl sm:text-6xl">Let's talk fabric.</h1>
              <p className="mt-4 text-muted-foreground">
                Custom integrations, on-prem deployment, or just a question — we usually reply within
                one business day.
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-thread" /> hello@threadcounty.ai
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-thread" /> +1 (555) 010-2024
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-thread" /> San Francisco · Tokyo · Mumbai
                </li>
              </ul>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const parsed = schema.safeParse({
                  name: fd.get("name"),
                  email: fd.get("email"),
                  message: fd.get("message"),
                });
                if (!parsed.success) return toast.error(parsed.error.issues[0]?.message);
                setLoading(true);
                await new Promise((r) => setTimeout(r, 800));
                setLoading(false);
                toast.success("Thanks — we'll be in touch shortly.");
                (e.currentTarget as HTMLFormElement).reset();
              }}
              className="rounded-2xl glass-strong p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Message</Label>
                <Textarea id="message" name="message" rows={6} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-thread text-[color:var(--accent-foreground)] border-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send message"}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
