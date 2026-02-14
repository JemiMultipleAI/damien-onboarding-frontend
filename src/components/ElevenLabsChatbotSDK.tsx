'use client'

import { useEffect, useState, useRef } from 'react'
import { useGlobalConversation } from '@/contexts/ConversationContext'
import { Loader2, Mic, MicOff, Volume2, VolumeX, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface ElevenLabsChatbotSDKProps {
  agentId: string
  videoId: string
  onConversationStart?: (conversationId: string) => void
  textOnly?: boolean
  autoStart?: boolean
}

export default function ElevenLabsChatbotSDK({
  agentId,
  videoId,
  onConversationStart,
  textOnly = false,
  autoStart = true,
}: ElevenLabsChatbotSDKProps) {
  const [inputValue, setInputValue] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const {
    conversation,
    conversationId,
    isActive,
    isPaused,
    startConversation,
    messages,
    addMessage,
  } = useGlobalConversation()

  // Auto-start or resume conversation when component mounts (only if autoStart is true)
  useEffect(() => {
    if (!agentId || !autoStart) return

    // Validate agent ID format
    if (!agentId.trim() || !agentId.startsWith('agent_')) {
      setConnectionError('Invalid agent ID. Please check backend configuration.')
      return
    }

    const initializeConversation = async () => {
      try {
        setIsConnecting(true)
        setConnectionError(null)
        const convId = await startConversation(agentId, 'default')
        
        if (convId && onConversationStart) {
          onConversationStart(convId)
        } else if (!convId) {
          setConnectionError('Failed to start conversation. Please check your ElevenLabs API key and agent configuration.')
        }
        setIsConnecting(false)
      } catch (error: any) {
        console.error('❌ Failed to initialize conversation:', error)
        const errorMessage = error?.message || error?.toString() || 'Failed to connect to agent. Please check your network connection and API configuration.'
        setConnectionError(errorMessage)
        setIsConnecting(false)
      }
    }

    initializeConversation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId, autoStart]) // Run when agentId or autoStart changes

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isActive) return

    try {
      // Add user message to UI immediately
      addMessage({
        role: 'user',
        content: inputValue,
      })

      // Send message to agent
      conversation.sendUserMessage(inputValue)
      setInputValue('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleMic = () => {
    // TODO: Implement mic mute/unmute
    console.log('Toggle mic - not implemented yet')
  }

  const toggleVolume = () => {
    // TODO: Implement volume mute/unmute
    console.log('Toggle volume - not implemented yet')
  }

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {connectionError && (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-md">
                <p className="text-destructive font-semibold mb-2">Connection Error</p>
                <p className="text-sm text-destructive/80">{connectionError}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  Please ensure:
                  <br />• Agent ID is configured in backend .env file
                  <br />• ElevenLabs API key is set correctly
                  <br />• Backend server is running
                </p>
              </div>
            </div>
          )}
          {isConnecting && !connectionError && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">
                {isPaused ? 'Resuming conversation...' : 'Connecting to agent...'}
              </span>
            </div>
          )}

          {messages.length === 0 && !isConnecting && isActive && (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">
                {textOnly ? 'Start typing to begin the conversation...' : 'Start speaking to begin the conversation...'}
              </p>
            </div>
          )}

          {isPaused && !isConnecting && (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">
                Conversation paused. It will resume when you continue.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Status Bar */}
      <div className="border-t border-border px-4 py-2 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <Badge
            variant={isActive ? 'default' : isPaused ? 'secondary' : 'outline'}
            className="text-xs"
          >
            {isActive ? 'Connected' : isPaused ? 'Paused' : 'Disconnected'}
          </Badge>
          {isActive && conversation.isSpeaking && (
            <Badge variant="outline" className="text-xs">
              Agent is speaking...
            </Badge>
          )}
        </div>
        {!textOnly && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMic}
              className="h-8 w-8"
              title="Toggle microphone"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVolume}
              className="h-8 w-8"
              title="Toggle volume"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Input Area */}
      {textOnly && (
        <div className="border-t border-border p-4 bg-card">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={!isActive}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || !isActive}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

