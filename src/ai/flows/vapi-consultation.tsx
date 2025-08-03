'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Mic, PhoneOff, Bot, User, Volume2, Loader2, Phone, MessageCircle, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { AIDoctor, aiDoctors } from '@/data/ai-doctors';

interface UserData {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
  email?: string | null;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isActive?: boolean;
  id: string;
  isFinal?: boolean;
}

interface VapiConsultationProps {
  doctorId?: string;
}

export default function VapiConsultationPage({ doctorId }: VapiConsultationProps) {
  const vapi = useRef<Vapi | null>(null);
  const { user } = useAuth() as { user: UserData | null };
  const [messages, setMessages] = useState<Message[]>([]);
  const [doctor, setDoctor] = useState<AIDoctor | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'user' | 'assistant' | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const keepAliveInterval = useRef<NodeJS.Timeout>();
  
  // Load doctor data if doctorId is provided
  useEffect(() => {
    if (doctorId) {
      // Find the doctor in the aiDoctors array
      const foundDoctor = aiDoctors.find(doc => doc.id === doctorId);
      if (foundDoctor) {
        setDoctor(foundDoctor);
      } else {
        toast({
          title: "Doctor not found",
          description: "The selected AI doctor could not be found. You'll be connected with a general practitioner.",
          variant: "destructive",
        });
      }
    }
  }, [doctorId, toast]);

  // Simplified message tracking - each message is separate
  const currentAssistantMessage = useRef<string>('');
  const currentUserMessage = useRef<string>('');
  const lastMessageRole = useRef<'user' | 'assistant' | null>(null);
  const messageUpdateTimeout = useRef<NodeJS.Timeout>();
  
  // Function to keep the call alive
  const keepCallAlive = useCallback(() => {
    if (!vapi.current || !isCallActive) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 0.1;
    gainNode.gain.value = 0;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 100);
  }, [isCallActive]);

  // Start/stop keep-alive when call state changes
  useEffect(() => {
    if (isCallActive) {
      keepAliveInterval.current = setInterval(keepCallAlive, 30000);
    } else if (keepAliveInterval.current) {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      if (keepAliveInterval.current) {
        clearInterval(keepAliveInterval.current);
      }
    };
  }, [isCallActive, keepCallAlive]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Fixed message handler with proper message separation
  const handleMessage = useCallback((...args: any[]) => {
    try {
      const event = args[0];
      
      if (!event) {
        console.warn('Received undefined message event');
        return;
      }

      console.log('Message event:', event);
      
      const messageText = event.transcript || event.text || event.message || '';
      
      if (!messageText || messageText.trim() === '') {
        return;
      }

      // Determine role
      let role: 'user' | 'assistant' = 'assistant';
      if (event.role === 'user' || 
          event.type === 'user' || 
          event.type === 'user-speech' ||
          event.type === 'transcript' && event.role === 'user') {
        role = 'user';
      }

      const isFinal = event.isFinal === true;
      const timestamp = new Date().toISOString();

      console.log(`Processing ${role} message: "${messageText}" (isFinal: ${isFinal})`);

      // Clear any pending timeout
      if (messageUpdateTimeout.current) {
        clearTimeout(messageUpdateTimeout.current);
      }

      // Store the current message content (no accumulation across different messages)
      if (role === 'assistant') {
        currentAssistantMessage.current = messageText;
      } else {
        currentUserMessage.current = messageText;
      }

      // Debounced message update
      const debounceTime = isFinal ? 0 : 300;
      
      messageUpdateTimeout.current = setTimeout(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          
          // Check if we should update the last message or create a new one
          const lastMessage = newMessages[newMessages.length - 1];
          const shouldUpdateLast = lastMessage && 
                                 lastMessage.role === role && 
                                 lastMessageRole.current === role;

          const content = role === 'assistant' ? currentAssistantMessage.current : currentUserMessage.current;

          if (shouldUpdateLast && content) {
            // Update the existing message with ONLY the current content
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              content: content, // Use only the current message content
              timestamp: timestamp,
              isFinal: isFinal
            };
            console.log(`Updated existing ${role} message: "${content}"`);
          } else if (content) {
            // Create a new message with ONLY the current content
            const newMessage: Message = {
              role,
              content: content, // Use only the current message content
              timestamp,
              isActive: false,
              id: generateMessageId(),
              isFinal: isFinal
            };
            newMessages.push(newMessage);
            console.log(`Created new ${role} message: "${content}"`);
          }

          lastMessageRole.current = role;
          return newMessages;
        });

        // Handle typing indicator
        if (role === 'assistant') {
          setIsTyping(!isFinal);
        }
      }, debounceTime);

    } catch (error) {
      console.error('Error in handleMessage:', error);
    }
  }, [generateMessageId]);

  // Speech start handler - ALWAYS clear message buffer when someone starts speaking
  const handleSpeechStart = useCallback((...args: any[]) => {
    try {
      const event = args[0];
      
      if (!event || typeof event !== 'object') {
        console.warn('Received invalid speech-start event:', event);
        return;
      }

      console.log('Speech started:', event);

      // Determine role
      let role: 'user' | 'assistant' = 'assistant';
      if (event.type === 'user' || event.type === 'user-speech' || event.role === 'user') {
        role = 'user';
      }

      setActiveSpeaker(role);
      
      if (role === 'assistant') {
        setIsSpeaking(true);
        setIsTyping(true);
        // ALWAYS clear assistant message when they start speaking (new message)
        currentAssistantMessage.current = '';
        console.log('Assistant started speaking - cleared message buffer');
      } else {
        setIsListening(true);
        // ALWAYS clear user message when they start speaking (new message)
        currentUserMessage.current = '';
        console.log('User started speaking - cleared message buffer');
      }
    } catch (error) {
      console.error('Error in handleSpeechStart:', error);
    }
  }, []);

  // Speech end handler
  const handleSpeechEnd = useCallback((...args: any[]) => {
    try {
      const event = args[0];
      
      if (!event || typeof event !== 'object') {
        console.warn('Received invalid speech-end event:', event);
        return;
      }

      console.log('Speech ended:', event);

      // Determine role
      let role: 'user' | 'assistant' = 'assistant';
      if (event.type === 'user' || event.type === 'user-speech' || event.role === 'user') {
        role = 'user';
      }
      
      if (role === 'assistant') {
        setIsSpeaking(false);
        setIsTyping(false);
      } else {
        setIsListening(false);
      }
      
      setActiveSpeaker(prev => prev === role ? null : prev);
    } catch (error) {
      console.error('Error in handleSpeechEnd:', error);
    }
  }, []);

  const handleCallEnd = useCallback((...args: any[]) => {
    const event = args[0];
    console.log('Call ended:', event);
    
    setIsCallActive(false);
    setIsSpeaking(false);
    setIsListening(false);
    setActiveSpeaker(null);
    setIsTyping(false);
    
    // Clear refs
    currentAssistantMessage.current = '';
    currentUserMessage.current = '';
    lastMessageRole.current = null;
    
    // Show user-friendly message based on the reason
    let title = 'Call ended';
    let description = 'Your consultation has ended.';
    
    if (event?.reason || event?.message) {
      const reason = event.reason || event.message || '';
      if (reason.includes('inactivity') || reason.includes('timeout') || reason.includes('ejection')) {
        title = 'Call ended';
        description = 'The call ended due to inactivity. Feel free to start a new consultation anytime.';
      } else if (reason.includes('network') || reason.includes('connection')) {
        title = 'Connection lost';
        description = 'The call was disconnected. Please check your connection and try again.';
      }
    }
    
    toast({ 
      title, 
      description,
      variant: 'default'
    });
  }, [toast]);

  const handleError = useCallback((...args: any[]) => {
    const error = args[0];
    console.error('VAPI Error:', error);
    
    setIsCallActive(false);
    setIsTyping(false);
    
    // Show user-friendly error messages
    let title = 'Connection issue';
    let description = 'There was a problem with the call. Please try again.';
    
    if (error?.message) {
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes('microphone') || errorMsg.includes('audio')) {
        title = 'Microphone issue';
        description = 'Please check your microphone permissions and try again.';
      } else if (errorMsg.includes('network') || errorMsg.includes('connection')) {
        title = 'Connection problem';
        description = 'Please check your internet connection and try again.';
      } else if (errorMsg.includes('timeout')) {
        title = 'Call timeout';
        description = 'The call timed out. Please start a new consultation.';
      }
    }
    
    toast({ 
      title, 
      description,
      variant: 'default'
    });
  }, [toast]);

  // Initialize Vapi client on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) {
      console.error('VAPI public key is not set');
      return;
    }

    // Only initialize Vapi client if it doesn't exist
    if (!vapi.current) {
      vapi.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
      
      const initVapi = () => {
        if (!vapi.current) return;
        const currentVapi = vapi.current;

        // Remove any existing listeners to prevent duplicates
        currentVapi.removeAllListeners('message');
        currentVapi.removeAllListeners('speech-start');
        currentVapi.removeAllListeners('speech-end');
        currentVapi.removeAllListeners('call-end');
        currentVapi.removeAllListeners('error');

        // Add event listeners
        currentVapi.on('message', handleMessage);
        currentVapi.on('speech-start', handleSpeechStart);
        currentVapi.on('speech-end', handleSpeechEnd);
        currentVapi.on('call-end', handleCallEnd);
        currentVapi.on('error', handleError);
      };
      
      initVapi();
    }

    // Cleanup function
    return () => {
      if (messageUpdateTimeout.current) {
        clearTimeout(messageUpdateTimeout.current);
      }
    };
  }, [handleCallEnd, handleError, handleMessage, handleSpeechEnd, handleSpeechStart, doctor]);

  const startCall = useCallback(async () => {
    if (!vapi.current) {
      console.error('Vapi instance is not initialized');
      return;
    }
    
    setIsLoading(true);
    
    // Clear previous state
    setMessages([]);
    currentAssistantMessage.current = '';
    currentUserMessage.current = '';
    lastMessageRole.current = null;
    
    try {
      // Add a small delay to ensure the UI updates before starting the call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const callResponse = await vapi.current.start({
        model: {
          provider: 'openai',
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a kind and helpful AI doctor. You are speaking with ${user?.displayName || 'the patient'}. Ask relevant medical questions, provide general health advice, and recommend seeing a human doctor for serious conditions. Speak in complete sentences and paragraphs, not fragmented responses.`
            }
          ],
          temperature: 0.7,
        },
        voice: {
          provider: '11labs',
          voiceId: '21m00Tcm4TlvDq8ikWAM',
        },
        firstMessage: `Hello ${user?.displayName || 'there'}, I'm your AI doctor. How can I assist you today?`
      });
      
      if (callResponse) {
        setIsCallActive(true);
        // Start the keep-alive mechanism
        keepAliveInterval.current = setInterval(keepCallAlive, 30000);
      } else {
        throw new Error('Failed to start call: No response from VAPI');
      }
      
    } catch (error) {
      console.error('Failed to start call:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error',
        description: `Failed to start the call: ${errorMessage}`,
        variant: 'destructive'
      });
      // Reset call state on error
      setIsCallActive(false);
      if (vapi.current) {
        vapi.current.stop();
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, user, handleMessage, handleSpeechStart, handleSpeechEnd, handleCallEnd, handleError, keepCallAlive, doctor]);

  const stopCall = useCallback(() => {
    if (vapi.current) {
      vapi.current.stop();
      setIsCallActive(false);
    }
  }, []);

  // Audio wave animation component
  const AudioWave = ({ isActive }: { isActive: boolean }) => (
    <div className="flex items-center gap-1">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-current rounded-full transition-all duration-300",
            isActive ? "animate-pulse" : ""
          )}
          style={{
            height: isActive ? `${Math.random() * 16 + 8}px` : '4px',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-2xl max-w-fit">
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">AI Doctor is thinking...</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={doctor?.avatar || '/assets/doctors/default-avatar.png'} alt={doctor?.name || 'AI Doctor'} />
                <AvatarFallback>{(doctor?.name?.split(' ').map(n => n[0]) || ['A', 'I']).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {doctor?.name || 'AI Doctor'}
                  {doctor?.specialty && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {doctor.specialty}
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isCallActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isCallActive ? 'In Session' : 'Ready'}
                  </span>
                  {!isCallActive && 'Start a consultation'}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={startCall} 
                disabled={isCallActive || isLoading}
                className="gap-2"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Start Consultation
                  </>
                )}
              </Button>
              <Button 
                variant="destructive" 
                onClick={stopCall} 
                disabled={!isCallActive}
                className="gap-2"
                size="lg"
              >
                <PhoneOff className="w-4 h-4" />
                End Call
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready for your consultation</h3>
                  <p className="text-muted-foreground max-w-md">
                    Start the call to begin your conversation with the AI Doctor. 
                    Your conversation will appear here in real-time.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div key={msg.id || idx} className={cn(
                      "flex gap-3 animate-in slide-in-from-bottom-2 duration-300",
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}>
                      {msg.role === 'assistant' && (
                        <Avatar className="h-10 w-10 border-2 border-green-200 dark:border-green-800">
                          <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={cn(
                        "max-w-[75%] space-y-1",
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      )}>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium">
                            {msg.role === 'assistant' ? 'AI Doctor' : user?.displayName || 'You'}
                          </span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                          {!msg.isFinal && (
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                              updating...
                            </span>
                          )}
                        </div>
                        
                        <div className={cn(
                          "p-4 rounded-2xl shadow-sm transition-all duration-200",
                          msg.role === 'user' 
                            ? 'bg-blue-500 text-white rounded-br-md' 
                            : 'bg-muted rounded-bl-md',
                          !msg.isFinal && 'opacity-80'
                        )}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                      
                      {msg.role === 'user' && (
                        <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-800">
                          <AvatarImage src={user?.photoURL || undefined} />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            {(user?.displayName || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
                      <Avatar className="h-10 w-10 border-2 border-green-200 dark:border-green-800">
                        <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <TypingIndicator />
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>This AI doctor provides general health information and should not replace professional medical advice.</p>
      </div>
    </div>
  );
}