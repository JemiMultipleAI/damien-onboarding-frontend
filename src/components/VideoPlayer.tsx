'use client';

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatbotInterface } from "@/components/ChatbotInterface";
import { useGlobalConversation } from "@/contexts/ConversationContext";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  videoUrl?: string;
  onClose: () => void;
  onComplete?: () => void;
}

export const VideoPlayer = ({ videoId, title, videoUrl, onClose, onComplete }: VideoPlayerProps) => {
  const [mode, setMode] = useState<"video" | "chatbot">("video");
  const { pauseConversation } = useGlobalConversation();

  const handleVideoEnd = () => {
    // Switch to chatbot mode instead of closing
    setMode("chatbot");
  };

  const handleChatbotComplete = () => {
    // Only mark video as complete when chatbot is finished
    if (onComplete) {
      onComplete();
    }
    // Pause conversation and close modal
    // Conversation context will persist for next video
    pauseConversation().then(() => {
      onClose();
    });
  };

  // Pause conversation when modal closes (user clicks X)
  const handleClose = () => {
    pauseConversation().then(() => {
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col relative">
        <div className="flex items-center justify-between mb-2 sm:mb-4 gap-2">
          <h2 className="text-lg sm:text-2xl font-bold text-white truncate flex-1">{title}</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            className="text-white hover:bg-white/20 flex-shrink-0"
            aria-label="Close video player"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
        
        {/* Content Area - both video and chatbot are always rendered, visibility controlled */}
        <div className="flex-1 relative min-h-0">
          {/* Video Player - visible when mode is "video" */}
          <div className={`absolute inset-0 ${mode === "video" ? "block" : "hidden"}`}>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden w-full h-full">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                  onEnded={handleVideoEnd}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <div className="w-0 h-0 border-l-[20px] border-l-primary border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                    </div>
                    <p className="text-white text-lg font-medium">Video Player Placeholder</p>
                    <p className="text-white/70 text-sm mt-2">Connect your video source here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chatbot Interface - pre-rendered but hidden when mode is "video", visible when mode is "chatbot" */}
          <div className={`absolute inset-0 ${mode === "chatbot" ? "block" : "hidden"}`}>
            <div className="flex-1 bg-background rounded-lg overflow-hidden h-full">
              <ChatbotInterface
                videoId={videoId}
                videoTitle={title}
                onComplete={handleChatbotComplete}
                onClose={onClose}
                autoStart={mode === "chatbot"} // Only auto-start when chatbot is visible (after video ends)
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
