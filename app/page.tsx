'use client';

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "AI Guidance",
    description: "Conversational coaching that adapts to every learner.",
  },
  {
    title: "Progress Intelligence",
    description: "Real-time completion tracking with instant feedback loops.",
  },
  {
    title: "Enterprise Ready",
    description: "Secure architecture designed for modern onboarding teams.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#1d4ed8_0%,_transparent_45%),radial-gradient(circle_at_bottom,_#9333ea_0%,_transparent_45%)] opacity-50" />
      <header className="border-b border-white/10 bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              OnboardAI
            </p>
            <p className="text-lg font-semibold">Intelligent Onboarding</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-indigo-500/20 via-background to-background p-10 shadow-[0_10px_60px_rgba(79,70,229,0.25)]">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,#38bdf8_0,_transparent_55%)]" />
          <div className="relative flex flex-col gap-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs uppercase tracking-[0.4em] text-muted-foreground w-fit">
              <Sparkles className="h-3 w-3" />
              OnboardAI
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Launch onboarding experiences that feel guided, personal, and smart.
            </h1>
            <p className="text-lg text-muted-foreground">
              Blend immersive video learning with a conversational AI mentor. OnboardAI gives every new teammate confidence, clarity, and momentum from day one.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard" className="inline-flex items-center gap-2">
                  Explore Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Real-time progress sync
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                AI-powered validation
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Secure & enterprise-ready
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Platform
            </p>
            <h2 className="text-3xl font-bold tracking-tight">Built for modern onboarding teams</h2>
            <p className="text-muted-foreground max-w-2xl">
              OnboardAI turns your knowledge base into a guided, immersive journey. Launch once, update effortlessly, and keep every user aligned with built-in analytics.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:-translate-y-1 transition-transform"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                Why OnboardAI
              </p>
              <h2 className="text-3xl font-bold tracking-tight">
                Replace static training with a living, conversational experience.
              </h2>
              <p className="text-muted-foreground">
                The dashboard you already have stays untouched. This landing page simply routes users into that immersive coaching space, while giving prospects a polished introduction to OnboardAI.
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-border p-6 space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">
                Quick Access
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3 hover:bg-muted"
                >
                  <div>
                    <p className="text-sm font-semibold">Dashboard</p>
                    <p className="text-xs text-muted-foreground">
                      Continue to the training experience
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


