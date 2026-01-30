'use client';

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Bot, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MichaelChatWidget } from "@/components/MichaelChatWidget";
import { useAgentConfig } from "@/contexts/AgentConfigContext";

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
  const [mounted, setMounted] = useState(false);
  const { michaelAgentId, loading: agentLoading } = useAgentConfig();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#1d4ed8_0%,_transparent_45%),radial-gradient(circle_at_bottom,_#9333ea_0%,_transparent_45%)] opacity-50 animate-pulse" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
      <header className="border-b border-white/10 bg-background/80 backdrop-blur sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  OnboardAI
                </p>
                <p className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Intelligent Onboarding
                </p>
              </div>
            </div>
          </div>
          <Button variant="outline" asChild className="animate-in fade-in slide-in-from-right duration-700 hover:scale-105 transition-transform">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        <section className={`relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-indigo-500/20 via-background to-background p-8 md:p-10 shadow-[0_10px_60px_rgba(79,70,229,0.25)] transition-all duration-700 ${mounted ? 'animate-in fade-in slide-in-from-bottom-8' : 'opacity-0'}`}>
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,#38bdf8_0,_transparent_55%)] animate-pulse" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="relative flex flex-col gap-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs uppercase tracking-[0.4em] text-muted-foreground w-fit hover:bg-primary/10 transition-colors">
              <Sparkles className="h-3 w-3 animate-pulse" />
              OnboardAI
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Launch onboarding experiences that feel guided, personal, and smart.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Blend immersive video learning with a conversational AI mentor. OnboardAI gives every new teammate confidence, clarity, and momentum from day one.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="group hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
                <Link href="/dashboard" className="inline-flex items-center gap-2">
                  Explore Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="hover:scale-105 transition-transform">
                <Link href="/login">Log In</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Real-time progress sync</span>
              </div>
              <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>AI-powered validation</span>
              </div>
              <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Secure & enterprise-ready</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Platform
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Built for modern onboarding teams</h2>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              OnboardAI turns your knowledge base into a guided, immersive journey. Launch once, update effortlessly, and keep every user aligned with built-in analytics.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const icons = [Bot, Zap, TrendingUp];
              const Icon = icons[index] || Sparkles;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-8 md:p-10 hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                Why OnboardAI
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Replace static training with a living, conversational experience.
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                The dashboard you already have stays untouched. This landing page simply routes users into that immersive coaching space, while giving prospects a polished introduction to OnboardAI.
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-border p-6 space-y-4 bg-muted/30 hover:bg-muted/50 transition-colors">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">
                Quick Access
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3 hover:bg-background hover:border-primary/50 transition-all group"
                >
                  <div>
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">Dashboard</p>
                    <p className="text-xs text-muted-foreground">
                      Continue to the training experience
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Michael AI Chat Widget */}
      <MichaelChatWidget />
    </div>
  );
}






