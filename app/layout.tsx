'use client';

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AgentConfigProvider } from "@/contexts/AgentConfigContext";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { loadElevenLabsScript } from "@/utils/loadElevenLabsScript";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load ElevenLabs script globally on app start
  useEffect(() => {
    loadElevenLabsScript().catch((error) => {
      console.error("Failed to preload ElevenLabs script:", error);
    });
  }, []);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AgentConfigProvider>
              <ConversationProvider textOnly={false}>
                <Toaster />
                <Sonner />
                {children}
              </ConversationProvider>
            </AgentConfigProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}


