
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Send, Loader2, Mic, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { consultationFlow, ConsultationTurn } from '@/ai/flows/consultation-flow';

export default function ConsultationPage() {
  const [conversation, setConversation] = useState<ConsultationTurn[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);
  
  const startConsultation = async () => {
    setIsLoading(true);
    setConversation([]); 
    try {
      const initialResponse = await consultationFlow([]);
      setConversation(initialResponse);
    } catch (error) {
      console.error("Error starting consultation:", error);
      const errorTurn: ConsultationTurn = {
        role: 'model',
        content: "I'm sorry, I'm having trouble connecting. Please try again later.",
      };
      setConversation([errorTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userTurn: ConsultationTurn = { role: 'user', content: userInput };
    const newConversation = [...conversation, userTurn];
    setConversation(newConversation);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await consultationFlow(newConversation);
      setConversation(response);
    } catch (error) {
      console.error("Error continuing consultation:", error);
      const errorTurn: ConsultationTurn = {
        role: 'model',
        content: "I'm sorry, I encountered an error. Please rephrase your statement or try again.",
      };
      setConversation([...newConversation, errorTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-muted/20">
      <Card className="w-full max-w-3xl h-[70vh] flex flex-col shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">AI Doctor Consultation</CardTitle>
          <Button variant="destructive" size="sm">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Emergency
          </Button>
        </CardHeader>
        <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {conversation.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-16 w-16 text-primary/50 mb-4" />
              <h2 className="text-xl font-semibold text-muted-foreground">Welcome to your AI Consultation</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Click the button below to begin your session.
              </p>
              <Button onClick={startConsultation} className="mt-6">
                Start AI Consultation
              </Button>
            </div>
          )}
          {conversation.map((turn, index) => (
            <div key={index} className={cn("flex items-start gap-4", turn.role === 'user' ? "justify-end" : "justify-start")}>
              {turn.role === 'model' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
              )}
              <div className={cn(
                "max-w-md p-4 rounded-xl", 
                turn.role === 'user' ? "bg-secondary text-secondary-foreground" : "bg-primary/10"
              )}>
                <p className="text-sm">{turn.content}</p>
                 {turn.isReferral && (
                  <div className="mt-3 p-3 bg-destructive/10 border-l-4 border-destructive text-destructive-foreground rounded-r-lg">
                    <p className="font-bold text-sm">Action Required</p>
                    <p className="text-xs">{turn.referralReason}</p>
                  </div>
                )}
              </div>
               {turn.role === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
          {isLoading && conversation.length > 0 && (
             <div className="flex items-start gap-4 justify-start">
               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
               <div className="max-w-md p-4 rounded-xl bg-primary/10 flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
               </div>
            </div>
          )}
           {isLoading && conversation.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Starting your consultation...</p>
             </div>
           )}
        </CardContent>
        <div className="p-4 border-t bg-background">
          <div className="relative">
            <Textarea
              placeholder="Describe your symptoms here..."
              className="pr-24"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading || conversation.length === 0}
            />
            <div className="absolute top-1/2 right-3 -translate-y-1/2 flex gap-2">
               <Button variant="ghost" size="icon" disabled={isLoading}>
                    <Mic className="h-5 w-5" />
               </Button>
              <Button onClick={handleSend} disabled={isLoading || !userInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
