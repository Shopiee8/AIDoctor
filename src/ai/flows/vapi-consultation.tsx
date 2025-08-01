'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Mic, PhoneOff, Bot } from 'lucide-react';

interface TranscriptEvent {
  role: 'user' | 'assistant' | 'system';
  transcript: string;
  timestamp: string;
}

export default function VapiConsultationPage() {
  const vapi = useRef<Vapi | null>(null);
  const [transcript, setTranscript] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string, timestamp?: string }>>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const { toast } = useToast();

  // Initialize Vapi client on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    vapi.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
    const currentVapi = vapi.current;

    // Event handlers
    const handleTranscript = (event: any) => {
      console.log('Transcript event:', event);
      // Vapi might send different event structures, so we need to handle them safely
      const transcriptText = event.transcript || event.text || '';
      const role = event.role || 'assistant'; // Default to assistant if role not provided
      
      setTranscript(prev => [...prev, { 
        role,
        content: transcriptText,
        timestamp: new Date().toISOString()
      }]);
    };

    const handleCallEnd = () => {
      console.log('📞 Call ended.');
      setIsCallActive(false);
      toast({ 
        title: 'Call ended',
        description: 'The consultation has ended.'
      });
    };

    const handleError = (error: any) => {
      console.error('❌ Error:', error);
      const errorMessage = error?.message || 'An unknown error occurred';
      toast({ 
        title: 'Error occurred', 
        description: errorMessage,
        variant: 'destructive'
      });
      setIsCallActive(false);
    };

    // Add event listeners with correct event names and types
    currentVapi.on('speech-start', () => handleTranscript({}));
    currentVapi.on('call-end', () => handleCallEnd());
    currentVapi.on('error', (e) => handleError(e));

    // Cleanup function
    return () => {
      if (currentVapi) {
        currentVapi.stop();
        // Remove event listeners with the same function references
        currentVapi.off('speech-start', () => handleTranscript({}));
        currentVapi.off('call-end', () => handleCallEnd());
        currentVapi.off('error', (e) => handleError(e));
      }
    };
  }, [toast]);

  const startCall = useCallback(async () => {
    if (!vapi.current) return;
    
    setIsLoading(true);
    try {
      await vapi.current.start({
        model: {
          provider: 'openai',
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a kind and helpful AI doctor. You should ask relevant medical questions, provide general health advice, and recommend seeing a human doctor for serious conditions.'
            }
          ],
          temperature: 0.7,
        },
        voice: {
          provider: '11labs',
          voiceId: '21m00Tcm4TlvDq8ikWAM', // 11labs voice ID for a professional voice
        },
        firstMessage: 'Hello, I\'m your AI doctor. How can I assist you today?',
      });
      
      setIsCallActive(true);
    } catch (error) {
      console.error('Failed to start call:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error',
        description: `Failed to start the call: ${errorMessage}`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const stopCall = () => {
    if (vapi.current) {
      vapi.current.stop();
      setIsCallActive(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" /> AI Doctor Consultation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button onClick={startCall} disabled={isCallActive || isLoading}>
              <Mic className="w-4 h-4 mr-2" /> Start Call
            </Button>
            <Button variant="destructive" onClick={stopCall} disabled={!isCallActive}>
              <PhoneOff className="w-4 h-4 mr-2" /> End Call
            </Button>
          </div>
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-2">
              {transcript.map((msg, idx) => (
                <div key={idx} className={`flex items-start gap-2 ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <Avatar>
                    <AvatarFallback>{msg.role === 'assistant' ? 'AI' : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl max-w-xs">
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
