'use client';

import { useState, useEffect, useRef } from 'react';
import { useAgentConfig } from '@/contexts/AgentConfigContext';
import { useGlobalConversation } from '@/contexts/ConversationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Bot,
  Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MichaelChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { michaelAgentId, loading: agentLoading } = useAgentConfig();
  const {
    conversation,
    conversationId,
    isActive,
    isPaused,
    startConversation,
    messages,
    addMessage,
    currentAgentId,
    endConversation,
  } = useGlobalConversation();

  useEffect(() => {
    setMounted(true);
    // No longer auto-showing welcome popup - only on hover
    
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Initialize conversation when widget opens and agent ID is available
  useEffect(() => {
    if (isOpen && michaelAgentId && !isConnecting) {
      const initializeConversation = async () => {
        // If already connected to Michael, don't reinitialize
        if (isActive && currentAgentId === michaelAgentId) {
          return;
        }

        try {
          setIsConnecting(true);
          // End any existing conversation first if switching agents
          if (currentAgentId && currentAgentId !== michaelAgentId) {
            await endConversation();
            // Small delay to ensure cleanup
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          const convId = await startConversation(michaelAgentId, 'landing-page-user');
          setIsConnecting(false);
          if (convId) {
            console.log('✅ Michael conversation started:', convId);
          }
        } catch (error) {
          console.error('❌ Failed to initialize Michael conversation:', error);
          setIsConnecting(false);
        }
      };

      initializeConversation();
    } else if (!isOpen && isActive && currentAgentId === michaelAgentId && !isConnecting) {
      // When chatbox is closed, end the conversation to stop listening
      // This is a backup in case handleToggle doesn't catch it
      const endMichaelConversation = async () => {
        try {
          await endConversation();
          console.log('🛑 Michael conversation ended - chatbox closed (backup)');
        } catch (error) {
          console.error('❌ Failed to end Michael conversation:', error);
        }
      };
      endMichaelConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, michaelAgentId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isActive || !conversation) return;

    try {
      // Add user message to UI immediately
      addMessage({
        role: 'user',
        content: inputValue,
      });

      // Send message to agent
      conversation.sendUserMessage(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggle = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // If closing the chat, end the conversation immediately
    if (!newIsOpen && isActive && currentAgentId === michaelAgentId) {
      try {
        await endConversation();
        console.log('🛑 Michael conversation ended - chatbox closed');
      } catch (error) {
        console.error('❌ Failed to end Michael conversation:', error);
      }
    }
    
    // Close welcome popup when opening chat
    if (newIsOpen && showWelcomePopup) {
      setShowWelcomePopup(false);
      setIsHoveringAvatar(false);
    }
  };

  const handleCloseWelcome = () => {
    setShowWelcomePopup(false);
    setIsHoveringAvatar(false);
  };

  const handleAvatarMouseEnter = () => {
    if (!isOpen) {
      // Clear any pending hide timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setIsHoveringAvatar(true);
      setShowWelcomePopup(true);
    }
  };

  const handleAvatarMouseLeave = () => {
    // Small delay before hiding to allow moving to popup
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoveringAvatar(false);
      setShowWelcomePopup(false);
    }, 200);
  };

  const handleWelcomeMouseEnter = () => {
    // Clear any pending hide timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHoveringAvatar(true);
    setShowWelcomePopup(true);
  };

  const handleWelcomeMouseLeave = () => {
    setIsHoveringAvatar(false);
    setShowWelcomePopup(false);
  };

  const isMichaelActive = isActive && currentAgentId === michaelAgentId;

  // Filter messages to only show Michael's conversation
  // When Michael is active, show all messages. Otherwise show recent messages.
  const michaelMessages = isMichaelActive 
    ? messages 
    : messages.filter((msg, index) => index >= messages.length - 10);

  return (
    <>
      {/* Floating Chat Button with Avatar */}
      <div className="fixed bottom-6 right-6 z-50">
        <div 
          className="relative"
          onMouseEnter={handleAvatarMouseEnter}
          onMouseLeave={handleAvatarMouseLeave}
        >
          <Button
            onClick={handleToggle}
            size="lg"
            className={cn(
              "h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 p-0 overflow-hidden",
              "bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90",
              "animate-in fade-in zoom-in-95 slide-in-from-bottom-4",
              "border-2 border-background/50 hover:border-primary/50",
              mounted && "duration-700"
            )}
            aria-label={isOpen ? "Close chat with Michael" : "Chat with Michael"}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-primary-foreground" />
            ) : (
              <Avatar className="h-full w-full">
                <AvatarImage 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelBusiness&skinColor=fdbcb4&hairColor=2c1b18&accessories=prescription02&clothes=shirtCrewNeck&clothesColor=262e33&eyes=happy&eyebrow=raised&mouth=smile"
                  alt="Michael"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold text-lg">
                  M
                </AvatarFallback>
              </Avatar>
            )}
          </Button>
          
          {/* Online indicator */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
          )}
        </div>
      </div>

      {/* Welcome Popup - Only on Hover */}
      {showWelcomePopup && !isOpen && (
        <div
          className={cn(
            "fixed bottom-28 right-6 z-40 w-[320px] rounded-2xl border border-border",
            "bg-gradient-to-br from-primary/10 via-background to-background backdrop-blur-lg",
            "shadow-2xl p-5 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          )}
          onMouseEnter={handleWelcomeMouseEnter}
          onMouseLeave={handleWelcomeMouseLeave}
        >
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelBusiness&skinColor=fdbcb4&hairColor=2c1b18&accessories=prescription02&clothes=shirtCrewNeck&clothesColor=262e33&eyes=happy&eyebrow=raised&mouth=smile"
                alt="Michael"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                M
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  Michael
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCloseWelcome}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Hey! I'm Michael. Talk to me if you want to know more about <span className="font-semibold text-primary">OnboardAI</span>.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  handleCloseWelcome();
                  setIsOpen(true);
                }}
                className="w-full mt-2"
              >
                <MessageCircle className="h-3 w-3 mr-2" />
                Start Chat
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50 w-[380px] max-h-[calc(100vh-8rem)] rounded-2xl border border-border",
            "bg-background/95 backdrop-blur-lg shadow-2xl",
            "flex flex-col overflow-hidden",
            "animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300",
            mounted && "duration-500"
          )}
          style={{ height: 'min(600px, calc(100vh - 8rem))' }}
        >
          {/* Header */}
          <div className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelBusiness&skinColor=fdbcb4&hairColor=2c1b18&accessories=prescription02&clothes=shirtCrewNeck&clothesColor=262e33&eyes=happy&eyebrow=raised&mouth=smile"
                    alt="Michael"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                    M
                  </AvatarFallback>
                </Avatar>
                {isMichaelActive && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background animate-pulse" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  Michael
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isMichaelActive ? 'Online' : isConnecting ? 'Connecting...' : 'Offline'}
                </p>
              </div>
            </div>
            <Badge
              variant={isMichaelActive ? 'default' : isConnecting ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {isMichaelActive ? 'Active' : isConnecting ? 'Connecting' : 'Ready'}
            </Badge>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 min-h-0" ref={scrollAreaRef}>
            <div className="space-y-4">
              {isConnecting && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Connecting to Michael...
                  </span>
                </div>
              )}

              {!isConnecting && !isMichaelActive && michaelMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Chat with Michael</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ask me anything about OnboardAI
                    </p>
                  </div>
                </div>
              )}

              {michaelMessages.length === 0 && !isConnecting && isMichaelActive && (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    Start typing to begin the conversation...
                  </p>
                </div>
              )}

              {michaelMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground border border-border'
                    )}
                  >
                    {message.role === 'agent' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Bot className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium text-primary">Michael</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-3 bg-card/50 shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isMichaelActive ? "Ask Michael anything..." : "Connecting..."}
                disabled={!isMichaelActive || isConnecting}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !isMichaelActive || isConnecting}
                size="icon"
                className="shrink-0"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {agentLoading && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Loading agent configuration...
              </p>
            )}
            {!michaelAgentId && !agentLoading && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Michael agent not configured
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
