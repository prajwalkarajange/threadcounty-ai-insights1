import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import {
  Upload,
  ScanLine,
  Sparkles,
  ShieldCheck,
  Layers,
  Gauge,
  Zap,
  ArrowRight,
  Check,
  ChevronDown,
  Quote,
} from "lucide-react";
import { useState } from "react";

import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

import heroFabric from "@/assets/hero-fabric.jpg";
import fabricSilk from "@/assets/fabric-silk.jpg";
import fabricLinen from "@/assets/fabric-linen.jpg";
import fabricWool from "@/assets/fabric-wool.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThreadCounty — AI-Powered Textile Intelligence" },
      {
        name: "description",
        content:
          "Upload a fabric photo and get instant AI analysis: fabric type, weave pattern, defects, and quality score. Built for textile manufacturers.",
      },
      { property: "og:title", content: "ThreadCounty — AI-Powered Textile Intelligence" },
      {
        property: "og:description",
        content: "Identify fabric types, detect defects, and score quality with AI.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.6, ease: [0.22, 0.7, 0.3, 1] },
  }),
};

function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <Trust />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 hero-radial" />
      <div className="absolute inset-0 -z-10 grid-bg opacity-40" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-mono uppercase tracking-widest"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-thread animate-thread-pulse" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-thread" />
              </span>
              AI Textile Intelligence · v1.0
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight"
            >
              Every thread,
              <br />
              <span className="gradient-text-thread italic">counted.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              ThreadCounty is the AI quality-control platform built for textile manufacturers.
              Upload a fabric image — identify the type, detect defects, and score quality in
              under five seconds.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gradient-thread text-[color:var(--accent-foreground)] border-0 hover:opacity-90 ring-thread">
                <Link to="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Fabric
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/auth">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.dl variants={fadeUp} custom={4} className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { v: "<5s", l: "analysis time" },
                { v: "98.4%", l: "accuracy" },
                { v: "40+", l: "fabric classes" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-3xl gradient-text-thread">{s.v}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-mono">{s.l}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden ring-thread">
              <img
                src={heroFabric}
                alt="Macro photo of indigo denim with thread-amber rim light, analyzed by ThreadCounty AI"
                width={1600}
                height={1200}
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

              {/* Floating glass cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute top-6 left-6 glass rounded-2xl p-4 max-w-[200px]"
              >
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-thread">
                  <ScanLine className="h-3.5 w-3.5" /> Detecting
                </div>
                <p className="mt-2 font-display text-xl">Cotton Denim</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">conf · 0.984</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-6 right-6 glass rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <CircularGauge value={92} />
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Quality</p>
                    <p className="font-display text-2xl">92<span className="text-base text-muted-foreground">/100</span></p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="absolute bottom-6 left-6 glass rounded-2xl p-3 font-mono text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  <span>weave · twill 3/1</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                  <span>1 minor defect</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function CircularGauge({ value, size = 44 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-muted opacity-30" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="text-thread transition-all duration-700"
      />
    </svg>
  );
}

function Trust() {
  const logos = ["Westwool Mills", "Indigo&Co", "Asahi Textiles", "Kavya Looms", "Bluemoon Denim", "Nordheim Wovens"];
  return (
    <section className="border-y bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Trusted by manufacturing teams at
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-70">
          {logos.map((l) => (
            <span key={l} className="font-display text-xl text-muted-foreground">
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  { icon: ScanLine, title: "Fabric Identification", body: "Distinguish 40+ fabric types — cotton, silk, wool, polyester, blends — from a single macro photo." },
  { icon: ShieldCheck, title: "Defect Detection", body: "Catch pilling, snags, missing picks, color bleed, and weave irregularities before they ship." },
  { icon: Layers, title: "Weave Analysis", body: "Identify plain, twill, satin, herringbone, and dobby patterns with thread-density estimates." },
  { icon: Gauge, title: "Quality Scoring", body: "A 0–100 composite score grounded in texture, defect density, and weave consistency." },
  { icon: Zap, title: "Sub-5s Latency", body: "Built on edge inference. Results land before your QC team takes the next sample." },
  { icon: Sparkles, title: "Actionable Reports", body: "Every analysis includes manufacturing recommendations. Export PDF or share by link." },
];

function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-thread">What you get</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Six tools, one camera.</h2>
          <p className="mt-4 text-muted-foreground">
            From identification to recommendation, every part of the textile QC pipeline collapses into a
            single upload.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              custom={i}
              className="group relative rounded-2xl border bg-card p-6 transition-all hover:border-thread/60 hover:-translate-y-1 hover:glow-thread"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl gradient-thread text-[color:var(--accent-foreground)]">
                <f.icon className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <h3 className="mt-5 font-display text-2xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Capture",
      body: "Shoot a fabric swatch with any phone or microscope camera. PNG, JPEG, WEBP — up to 10MB.",
      img: fabricLinen,
    },
    {
      n: "02",
      title: "Analyze",
      body: "Our vision model runs identification, weave analysis, and defect detection in parallel.",
      img: fabricSilk,
    },
    {
      n: "03",
      title: "Act",
      body: "Get the fabric type, quality score, and recommendations. Export PDF or push to history.",
      img: fabricWool,
    },
  ];
  return (
    <section id="how" className="relative py-24 sm:py-32 border-y bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <p className="font-mono text-xs uppercase tracking-widest text-thread">How the AI works</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Three steps. No lab coat required.</h2>
            <p className="mt-4 text-muted-foreground">
              A single multimodal model trained on millions of fabric macros. No setup, no calibration —
              upload and read the report.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4">
            {steps.map((s, i) => (
              <motion.article
                key={s.n}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={i}
                className="relative rounded-2xl overflow-hidden border bg-card group"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="font-mono text-xs text-thread">{s.n}</p>
                  <h3 className="mt-1 font-display text-2xl">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "2.4M+", l: "fabrics analyzed" },
    { v: "98.4%", l: "classification accuracy" },
    { v: "<5s", l: "median latency" },
    { v: "42", l: "fabric classes" },
  ];
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="text-center"
            >
              <div className="font-display text-6xl sm:text-7xl gradient-text-thread">{s.v}</div>
              <p className="mt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      q: "We replaced two visual inspectors with ThreadCounty in our finishing line — and our defect-escape rate dropped 38%.",
      a: "Priya Menon",
      r: "Head of QC · Kavya Looms",
    },
    {
      q: "The quality-score field plugs straight into our ERP. It's the first AI tool our floor staff actually use.",
      a: "Hiroshi Tanaka",
      r: "Plant Manager · Asahi Textiles",
    },
    {
      q: "Identifying fiber blends used to take a lab. Now it's a phone photo.",
      a: "Sara Lindqvist",
      r: "R&D Lead · Nordheim Wovens",
    },
  ];
  return (
    <section className="py-24 sm:py-32 border-y bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <p className="font-mono text-xs uppercase tracking-widest text-thread">From the floor</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl max-w-2xl">Real teams. Real fabric. Real results.</h2>
        </motion.div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.figure
              key={t.a}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="rounded-2xl border bg-card p-6 flex flex-col"
            >
              <Quote className="h-6 w-6 text-thread" />
              <blockquote className="mt-4 text-base leading-relaxed flex-1">"{t.q}"</blockquote>
              <figcaption className="mt-6 pt-6 border-t">
                <p className="font-medium">{t.a}</p>
                <p className="text-sm text-muted-foreground">{t.r}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "What fabric types can ThreadCounty identify?", a: "We cover 40+ classes — cotton, denim, linen, silk, wool, polyester, nylon, blends, and specialty fabrics like tweed, satin, and chiffon." },
    { q: "How accurate is the AI?", a: "Top-1 classification accuracy is 98.4% on our held-out test set across 42 fabric classes. Defect detection precision averages 94%." },
    { q: "What image formats are supported?", a: "PNG, JPEG, and WEBP up to 10MB. Phone macros work fine — no specialty lens required." },
    { q: "Can I export reports?", a: "Yes. Every analysis can be exported as a PDF report with the fabric image, all metrics, and the AI summary." },
    { q: "Is my data secure?", a: "Uploads are stored in a private user-scoped bucket with row-level security. Only you (and admins on your account) can see them." },
    { q: "Can I integrate this into our ERP?", a: "Yes — every analysis is available via our typed API. Contact us for API access and on-prem deployment options." },
  ];
  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <p className="font-mono text-xs uppercase tracking-widest text-thread text-center">Frequently asked</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl text-center">Questions, answered.</h2>
        </motion.div>
        <Accordion type="single" collapsible className="mt-12 w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium hover:text-thread">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTA() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border ring-thread p-10 sm:p-16 text-center">
          <div className="absolute inset-0 -z-10 hero-radial" />
          <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
          <p className="font-mono text-xs uppercase tracking-widest text-thread">Start free</p>
          <h2 className="mt-3 font-display text-4xl sm:text-6xl">Count every thread.</h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Upload your first fabric image in 60 seconds. No credit card. No setup.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gradient-thread text-[color:var(--accent-foreground)] border-0 hover:opacity-90">
              <Link to="/auth">
                <Sparkles className="mr-2 h-4 w-4" /> Get started free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/upload">Upload a fabric</Link>
            </Button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email || !email.includes("@")) {
                toast.error("Please enter a valid email");
                return;
              }
              toast.success("You're on the list. We'll be in touch.");
              setEmail("");
            }}
            className="mt-10 max-w-md mx-auto"
          >
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Or get product updates
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@manufactory.com"
                className="bg-surface-elevated"
              />
              <Button type="submit" variant="outline">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
