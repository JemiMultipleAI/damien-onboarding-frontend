'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useConversation } from '@elevenlabs/react';

interface ConversationContextType {
  conversation: ReturnType<typeof useConversation>;
  conversationId: string | null;
  isActive: boolean;
  isPaused: boolean;
  startConversation: (agentId: string, userId?: string) => Promise<string | null>;
  pauseConversation: () => Promise<void>;
  resumeConversation: () => Promise<void>;
  endConversation: () => Promise<void>;
  currentAgentId: string | null;
  messages: Array<{
    id: string;
    role: 'user' | 'agent' | 'system';
    content: string;
    timestamp: Date;
  }>;
  addMessage: (message: { role: 'user' | 'agent' | 'system'; content: string }) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useGlobalConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useGlobalConversation must be used within ConversationProvider');
  }
  return context;
};

interface ConversationProviderProps {
  children: ReactNode;
  textOnly?: boolean;
}

export const ConversationProvider = ({ children, textOnly = false }: ConversationProviderProps) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'agent' | 'system';
    content: string;
    timestamp: Date;
  }>>([]);

  const conversation = useConversation({
    textOnly,
    onMessage: (message: any) => {
      // Handle incoming messages
      // Check if message has type property (for structured messages) or use source/role
      const messageType = (message as any).type;
      const messageSource = (message as any).source;
      const messageText = (message as any).message || (message as any).text || '';
      
      if (messageType === 'user_message' || messageType === 'agent_message' || 
          messageSource === 'user' || messageSource === 'agent') {
        const role: 'user' | 'agent' | 'system' = 
          (messageType === 'user_message' || messageSource === 'user') ? 'user' : 'agent';
        
        const newMessage: {
          id: string;
          role: 'user' | 'agent' | 'system';
          content: string;
          timestamp: Date;
        } = {
          id: `${Date.now()}-${Math.random()}`,
          role,
          content: messageText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    },
    onConnect: () => {
      setIsActive(true);
      setIsPaused(false);
      console.log('✅ Global conversation connected');
    },
    onDisconnect: () => {
      setIsActive(false);
      console.log('❌ Global conversation disconnected');
    },
    onError: (error) => {
      console.error('❌ Conversation error:', error);
      setIsActive(false);
    },
  });

  const pauseConversation = async (): Promise<void> => {
    if (!isActive || isPaused) return;

    try {
      // Disconnect but keep the conversation state
      await conversation.endSession();
      setIsPaused(true);
      setIsActive(false);
      console.log('⏸️ Conversation paused');
    } catch (error) {
      console.error('❌ Failed to pause conversation:', error);
    }
  };

  const resumeConversation = async (): Promise<void> => {
    if (!isPaused || !currentAgentId) return;

    try {
      // Request microphone permission if not text-only
      if (!textOnly) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (error) {
          console.error('Microphone permission denied:', error);
        }
      }

      // Resume the conversation with the same agent
      const newConversationId = await conversation.startSession({
        agentId: currentAgentId,
        connectionType: 'webrtc',
        userId: 'default', // TODO: Get from auth context
      });

      setConversationId(newConversationId);
      setIsActive(true);
      setIsPaused(false);
      console.log('▶️ Conversation resumed:', newConversationId);
    } catch (error) {
      console.error('❌ Failed to resume conversation:', error);
    }
  };

  const endConversation = async (): Promise<void> => {
    if (!isActive && !isPaused) return;

    try {
      if (isActive) {
        await conversation.endSession();
      }
      setConversationId(null);
      setCurrentAgentId(null);
      setIsActive(false);
      setIsPaused(false);
      setMessages([]); // Clear messages when ending
      console.log('🛑 Conversation ended');
    } catch (error) {
      console.error('❌ Failed to end conversation:', error);
    }
  };

  const startConversation = async (agentId: string, userId: string = 'default'): Promise<string | null> => {
    try {
      // If already connected with same agent, just resume
      if (isPaused && currentAgentId === agentId) {
        await resumeConversation();
        return conversationId;
      }

      // If connected with different agent, end current and start new
      if (isActive && currentAgentId !== agentId) {
        await endConversation();
      }

      // If not connected, start new conversation
      if (!isActive) {
        // Request microphone permission if not text-only
        if (!textOnly) {
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
          } catch (error) {
            console.error('Microphone permission denied:', error);
            // Continue anyway - user can grant permission later
          }
        }

        const newConversationId = await conversation.startSession({
          agentId,
          connectionType: 'webrtc',
          userId,
        });

        setConversationId(newConversationId);
        setCurrentAgentId(agentId);
        setIsActive(true);
        setIsPaused(false);
        console.log('✅ Global conversation started:', newConversationId);
        return newConversationId;
      }

      return conversationId;
    } catch (error) {
      console.error('❌ Failed to start conversation:', error);
      return null;
    }
  };

  const addMessage = (message: { role: 'user' | 'agent' | 'system'; content: string }) => {
    const newMessage = {
      id: `${Date.now()}-${Math.random()}`,
      ...message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <ConversationContext.Provider
      value={{
        conversation,
        conversationId,
        isActive,
        isPaused,
        startConversation,
        pauseConversation,
        resumeConversation,
        endConversation,
        currentAgentId,
        messages,
        addMessage,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

