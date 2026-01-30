'use client';

import { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ElevenLabsChatbotSDK from "@/components/ElevenLabsChatbotSDK";
// Keep old widget import for fallback if needed
// import ElevenLabsChatbot from "@/components/ElevenLabsChatbot";
import { useAgentConfig } from "@/contexts/AgentConfigContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ChatbotInterfaceProps {
  videoId: string;
  videoTitle: string;
  onComplete: () => void;
  onClose: () => void;
  autoStart?: boolean;
}

export const ChatbotInterface = ({ videoId, videoTitle, onComplete, onClose, autoStart = true }: ChatbotInterfaceProps) => {
  const { getAgentId, loading: loadingAgentConfig, error: agentConfigError } = useAgentConfig();
  const agentId = getAgentId(videoId);
  const [isCompleted, setIsCompleted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for agent ID availability
  useEffect(() => {
    if (!loadingAgentConfig && !agentId) {
      setError(agentConfigError || "Agent ID not configured for this video");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingAgentConfig, agentId]);

  // Poll backend for completion status
  const startPollingForCompletion = (convId: string) => {
    // Clear any existing polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Poll every 3 seconds to check if conversation is complete
    pollingIntervalRef.current = setInterval(async () => {
      try {
        // Check video progress
        const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}/progress?userId=default`);
        if (response.ok) {
          const data = await response.json();
          if (data.completed) {
            // Video is complete!
            setIsCompleted(true);
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            // Auto-complete after showing message
            setTimeout(() => {
              onComplete();
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Error checking completion status:", error);
      }
    }, 3000);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  if (loadingAgentConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background rounded-lg p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading chatbot configuration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background rounded-lg p-8">
        <MessageSquare className="h-8 w-8 text-destructive mb-4" />
        <p className="text-destructive font-semibold mb-2">Error</p>
        <p className="text-muted-foreground text-sm text-center">{error}</p>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background rounded-lg p-8">
        <div className="text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">🎉 Congratulations!</h3>
          <p className="text-muted-foreground mb-4">
            You've successfully completed the questionnaire for "{videoTitle}"
          </p>
          <Badge className="bg-green-500 hover:bg-green-600 text-white text-lg px-4 py-2">
            Module Completed
          </Badge>
          <p className="text-sm text-muted-foreground mt-4">
            You may now proceed to the next module.
          </p>
        </div>
      </div>
    );
  }

  if (!agentId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background rounded-lg p-8">
        <MessageSquare className="h-8 w-8 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Agent not configured</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b border-border bg-card flex-shrink-0 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground text-sm sm:text-base truncate">Quiz: {videoTitle}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete the conversation with the AI assistant
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {conversationId && (
            <Badge variant="outline" className="text-xs">
              Active
            </Badge>
          )}
        </div>
      </div>

      {/* ElevenLabs Chatbot - Using React SDK */}
      <div className="flex-1 min-h-0 bg-card">
        <ElevenLabsChatbotSDK
          agentId={agentId}
          videoId={videoId}
          onConversationStart={(convId) => {
            setConversationId(convId);
            // Start polling for completion status
            startPollingForCompletion(convId);
          }}
          textOnly={false} // Set to true for text-only mode, false for voice
          autoStart={autoStart} // Only start conversation when video has ended
        />
      </div>

      {/* Footer with instructions */}
      <div className="border-t border-border p-2 sm:p-3 bg-card flex-shrink-0">
        <p className="text-xs text-muted-foreground text-center px-2">
          💡 Complete the conversation above. The system will automatically track your progress.
        </p>
      </div>
    </div>
  );
};
