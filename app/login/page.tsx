'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, Bot, Sparkles } from "lucide-react";

const VALID_USERNAME = "demo";
const VALID_PASSWORD = "12345678";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Removed auto-redirect - always show login page

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        localStorage.setItem(
          "onboardAIUser",
          JSON.stringify({
            username,
          })
        );
        router.replace("/dashboard");
      } else {
        setError("Invalid credentials. Use demo / 12345678.");
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#3b82f6_0%,_transparent_50%),radial-gradient(circle_at_bottom,_#9333ea_0%,_transparent_50%)] opacity-20 animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className={`w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-sm p-8 shadow-2xl transition-all duration-700 ${mounted ? 'animate-in fade-in zoom-in-95 slide-in-from-bottom-4' : 'opacity-0'}`}>
        <div className="mb-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Bot className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              OnboardAI
            </p>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-sm text-slate-400">
            Log in with the demo credentials to continue the journey.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: '100ms' }}>
            <label className="text-sm font-medium text-slate-200">
              Username
            </label>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="demo"
              className="bg-slate-900/50 border-slate-800 text-white focus:border-primary transition-colors hover:border-slate-700"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: '200ms' }}>
            <label className="text-sm font-medium text-slate-200">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="12345678"
              className="bg-slate-900/50 border-slate-800 text-white focus:border-primary transition-colors hover:border-slate-700"
              disabled={isSubmitting}
            />
          </div>
          {error && (
            <div className="flex items-center rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200 animate-in fade-in zoom-in-95">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full hover:scale-[1.02] transition-transform shadow-lg hover:shadow-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Log In
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}


