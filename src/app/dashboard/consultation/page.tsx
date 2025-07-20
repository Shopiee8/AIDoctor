
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Send, Loader2, Mic, AlertTriangle, BookCheck, Stethoscope, FileText, Download, Sparkles, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { consultationFlow, ConsultationTurn } from '@/ai/flows/consultation-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from 'next/link';

export default function ConsultationPage() {
  const [conversation, setConversation] = useState<ConsultationTurn[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [consultationStarted, setConsultationStarted] = useState(false);
  const [isConsultationFinished, setIsConsultationFinished] = useState(false);
  const [summaryData, setSummaryData] = useState<ConsultationTurn | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);
  
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const startConsultation = async () => {
    setIsLoading(true);
    setConsultationStarted(true);
    setConversation([]); 
    try {
      const initialResponse = await consultationFlow([]);
      setConversation(initialResponse);
    } catch (error)
      {
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
      const latestTurn = response[response.length - 1];
      
      if (latestTurn.isReferral) {
        setSummaryData(latestTurn);
        setIsConsultationFinished(true);
      } else {
        setConversation(response);
      }

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

  const downloadSoapNote = () => {
      if (summaryData?.soapNote) {
          const blob = new Blob([summaryData.soapNote], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'SOAP-Note.txt';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      }
  };

  const renderPreConsultation = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Stethoscope className="w-12 h-12 text-primary mb-2" />
        <h2 className="text-2xl font-bold font-headline">Doctronic Consult</h2>
        <p className="text-sm text-muted-foreground">Consult started: Today, {currentTime}</p>
        
        <Card className="mt-6 w-full max-w-lg text-left p-4 bg-muted/50">
            <CardContent className="p-2 space-y-4">
                <div className="flex items-start gap-3">
                     <Avatar className="w-8 h-8 border">
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="bg-background p-3 rounded-lg">
                        <p className="text-sm">i have running nose and i feel not ok and i feel that i have almost inside my body that i will catch fever, i dont have fever but i feel it</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                     <Avatar className="w-8 h-8 border">
                        <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                    <div className="bg-background p-3 rounded-lg">
                        <p className="text-sm">Absolutely, I can help with that. Quick question - what's your age and biological sex? It helps me give you more relevant and personalized information.</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="mt-6 w-full max-w-lg space-y-4">
            <div className="flex items-start space-x-2">
                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(!!checked)} />
                <Label htmlFor="terms" className="text-xs text-muted-foreground text-left">
                    I agree to the Doctronic Terms of Service and will discuss all Doctronic output with a doctor.
                </Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Age (18+)" type="number" />
                <Button onClick={startConsultation} disabled={!agreedToTerms || isLoading}>
                    {isLoading ? <Loader2 className="animate-spin mr-2"/> : null}
                    Start Consultation
                </Button>
            </div>
        </div>

        <div className="mt-4 p-3 bg-destructive/10 text-destructive text-xs rounded-lg w-full max-w-lg text-center">
            <AlertTriangle className="inline-block w-4 h-4 mr-2" />
            If this is an emergency, call 911 or your local emergency number.
        </div>
    </div>
  );

  const renderSummaryScreen = () => (
    <div className="flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="h-12 w-12 text-primary mb-2" />
        <h2 className="text-2xl font-bold font-headline">AI Consult Summary</h2>
        <p className="text-sm text-muted-foreground">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

        <p className="mt-4 max-w-2xl text-muted-foreground">
            {summaryData?.consultationSummary || "No summary available."}
        </p>

        <Card className="mt-6 w-full max-w-md bg-primary/10 border-primary">
            <CardHeader>
                <CardTitle className="text-primary">We Recommend You See a Doctor Now</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
                <p>Video visits with our licensed doctors cost $39.</p>
                <p>We also accept all major insurance.</p>
                <p>Get your prescriptions and more in as little as 30 minutes.</p>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button className="w-full" asChild>
                    <Link href="/search"><Video className="mr-2 h-4 w-4" /> See a Doctor</Link>
                </Button>
                <p className="text-xs text-primary/80">⚡ Video appointments available immediately.</p>
            </CardFooter>
        </Card>

        <Accordion type="single" collapsible className="w-full max-w-md mt-6 text-left">
            <AccordionItem value="assessment">
                <AccordionTrigger>Assessment & Plan</AccordionTrigger>
                <AccordionContent>
                    A clinical overview of possible causes considered. This section will be expanded with more details in a future update.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="soap">
                <AccordionTrigger>SOAP Note (for Physicians)</AccordionTrigger>
                <AccordionContent className="space-y-4">
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{summaryData?.soapNote || "No SOAP note generated."}</p>
                    <Button variant="outline" size="sm" onClick={downloadSoapNote}>
                        <Download className="mr-2 h-4 w-4" /> Download SOAP Note (TXT)
                    </Button>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-muted/20">
      <Card className="w-full max-w-3xl min-h-[80vh] flex flex-col shadow-xl">
        {!consultationStarted ? (
            renderPreConsultation()
        ) : isConsultationFinished ? (
            renderSummaryScreen()
        ) : (
            <>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-headline">AI Doctor Consultation</CardTitle>
                  <Button variant="destructive" size="sm">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Emergency
                  </Button>
                </CardHeader>
                <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                  {conversation.map((turn, index) => (
                    <div key={index} className={cn("flex items-start gap-4", turn.role === 'user' ? "justify-end" : "justify-start")}>
                      {turn.role === 'model' && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Bot className="h-6 w-6" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <div className={cn(
                          "max-w-md p-4 rounded-xl", 
                          turn.role === 'user' ? "bg-secondary text-secondary-foreground" : "bg-primary/10"
                        )}>
                          <p className="text-sm">{turn.content}</p>
                        </div>
                        {turn.retrievalSource && (
                            <div className="flex items-center gap-1.5 mt-1.5 px-2">
                                <BookCheck className="w-3 h-3 text-muted-foreground"/>
                                <p className="text-xs text-muted-foreground">Sourced from: {turn.retrievalSource}</p>
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
            </>
        )}
      </Card>
    </div>
  );
}
