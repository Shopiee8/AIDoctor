
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Send, Loader2, Mic, AlertTriangle, BookCheck, Stethoscope, FileText, Download, Sparkles, Video, File, ListChecks, Activity, BrainCircuit, Play, Pause, VideoIcon, MicIcon, PhoneOff, Wand2, Grid, Folder, Calendar, Settings, LogOut, Search, Bell, ChevronDown, Paperclip, DownloadCloud, CopyIcon, StopCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { consultationFlow, ConsultationTurn } from '@/ai/flows/consultation-flow';
import { ttsFlow } from '@/ai/flows/tts-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from 'next/link';
import Image from "next/image";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HumanDoctorPromoModal } from '@/components/human-doctor-promo-modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));


export default function ConsultationPage() {
    const [history, setHistory] = useState<ConsultationTurn[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isReferral, setIsReferral] = useState(false);
    const [referralInfo, setReferralInfo] = useState<ConsultationTurn | null>(null);
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(true); // Assume true initially
    const [isRecording, setIsRecording] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const { toast } = useToast();

    // Initial greeting from the AI
    useEffect(() => {
        const startConsultation = async () => {
            setIsLoading(true);
            try {
                const initialHistory = await consultationFlow([]);
                setHistory(initialHistory);
                const greeting = initialHistory[0].content;
                const { media } = await ttsFlow(greeting);
                setAudioUrl(media);
            } catch (error) {
                console.error("Error starting consultation:", error);
                toast({ title: "Error", description: "Could not start the consultation.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        startConsultation();
    }, [toast]);

    // Webcam Access
    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            setHasCameraPermission(true);
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
          }
        };
        getCameraPermission();
      }, []);
    
    // Speech Recognition Setup
    useEffect(() => {
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setUserInput(prev => prev + event.results[i][0].transcript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
        };
        
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            toast({ title: 'Speech Recognition Error', description: event.error, variant: 'destructive' });
        };
        
        recognitionRef.current = recognition;

    }, [toast]);


    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            if (!SpeechRecognition) {
                toast({ title: 'Feature Not Supported', description: 'Speech recognition is not available in your browser.', variant: 'destructive' });
                return;
            }
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    // Autoplay audio when URL changes
    useEffect(() => {
        if (audioUrl && audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio autoplay failed:", e));
        }
    }, [audioUrl]);

    // Scroll to bottom of chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const newUserTurn: ConsultationTurn = { role: 'user', content: userInput.trim() };
        const newHistory = [...history, newUserTurn];
        setHistory(newHistory);
        setUserInput('');
        setIsLoading(true);
        setAudioUrl(null);
        if (isRecording) {
            toggleRecording();
        }

        try {
            const updatedHistory = await consultationFlow(newHistory);
            const aiResponse = updatedHistory[updatedHistory.length - 1];
            setHistory(updatedHistory);

            if (aiResponse?.isReferral) {
                setIsReferral(true);
                setReferralInfo(aiResponse);
                setShowPromoModal(true);
            }
            
            if (aiResponse?.content) {
                const { media } = await ttsFlow(aiResponse.content);
                setAudioUrl(media);
            }

        } catch (error) {
            console.error("Error with consultation flow:", error);
            toast({ title: "Error", description: "The AI is unable to respond right now.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)]">
            {/* Main Content */}
            <main className="flex-1 p-0 md:p-4 grid grid-cols-12 gap-4 overflow-hidden">
                {/* Left/Center Column - Video and Chat */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                    {/* Video Area */}
                    <Card className="flex-grow flex flex-col">
                        <CardHeader>
                            <CardTitle>AI Consultation Room</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow relative">
                             <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                             {!hasCameraPermission && (
                                <Alert variant="destructive" className="mt-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Camera Access Required</AlertTitle>
                                    <AlertDescription>
                                        Please allow camera access in your browser to use this feature.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                        <CardFooter className="flex-wrap justify-center gap-2 border-t pt-4">
                            <Button size="icon" variant="secondary" className="rounded-full w-12 h-12"><MicIcon className="w-6 h-6"/></Button>
                            <Button size="icon" variant="secondary" className="rounded-full w-12 h-12"><VideoIcon className="w-6 h-6"/></Button>
                            <Button size="icon" variant="destructive" className="rounded-full w-12 h-12"><PhoneOff className="w-6 h-6"/></Button>
                            <Button size="icon" variant="secondary" className="rounded-full w-12 h-12"><Wand2 className="w-6 h-6"/></Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right Column - Chat & Referral */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                   <Card className="flex-1 flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <CardTitle className="text-lg flex items-center gap-2"><Bot className="text-primary"/> AI Doctor</CardTitle>
                             {audioUrl && <audio ref={audioRef} src={audioUrl} />}
                             {isLoading && <Loader2 className="w-5 h-5 animate-spin"/>}
                        </CardHeader>

                         <ScrollArea className="flex-grow p-4" ref={chatContainerRef}>
                            <div className="space-y-4">
                                {history.map((turn, index) => (
                                    <div key={index} className={cn("flex items-start gap-3", turn.role === 'user' && 'justify-end')}>
                                         {turn.role === 'model' && (
                                            <Avatar className="w-8 h-8 border">
                                                <AvatarFallback><Bot /></AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "max-w-xs p-3 rounded-lg text-sm", 
                                            turn.role === 'model' ? "bg-muted" : "bg-primary text-primary-foreground"
                                        )}>
                                            <p>{turn.content}</p>
                                        </div>
                                        {turn.role === 'user' && (
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback><User /></AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        
                         <CardFooter className="p-4 border-t">
                             <div className="relative w-full flex items-center gap-2">
                                <Textarea
                                    placeholder={isRecording ? "Listening..." : "Type or speak your message..."}
                                    className="pr-10"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                                    disabled={isLoading}
                                    rows={1}
                                />
                                 <Button size="icon" variant={isRecording ? "destructive" : "outline"} className="shrink-0" onClick={toggleRecording} disabled={isLoading}>
                                    {isRecording ? <StopCircle className="w-5 h-5"/> : <Mic className="w-5 h-5"/>}
                                </Button>
                                <Button size="icon" className="shrink-0" onClick={handleSendMessage} disabled={isLoading || !userInput.trim()}>
                                    <Send className="w-5 h-5"/>
                                </Button>
                             </div>
                        </CardFooter>
                   </Card>

                    {isReferral && referralInfo && (
                        <Card className="flex-1 flex flex-col">
                            <CardHeader className="border-b">
                                <CardTitle className="flex items-center gap-2 text-lg"><AlertTriangle className="text-destructive"/> Referral Required</CardTitle>
                            </CardHeader>
                            <ScrollArea className="flex-grow p-4">
                               <Accordion type="single" collapsible defaultValue="summary" className="w-full">
                                    <AccordionItem value="summary">
                                        <AccordionTrigger>Consultation Summary</AccordionTrigger>
                                        <AccordionContent className="text-sm text-muted-foreground">{referralInfo.consultationSummary}</AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="soap-note">
                                        <AccordionTrigger>SOAP Note</AccordionTrigger>
                                        <AccordionContent className="prose prose-sm">
                                            <h4>Subjective</h4>
                                            <p>{referralInfo.soapNote?.subjective}</p>
                                            <h4>Objective</h4>
                                            <p>{referralInfo.soapNote?.objective}</p>
                                            <h4>Assessment</h4>
                                            <p>{referralInfo.soapNote?.assessment}</p>
                                            <h4>Plan</h4>
                                            <p>{referralInfo.soapNote?.plan}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="plan">
                                        <AccordionTrigger>Assessment & Plan</AccordionTrigger>
                                        <AccordionContent>
                                            <h4 className="font-semibold">Overview</h4>
                                            <p className="text-sm text-muted-foreground mb-2">{referralInfo.assessmentAndPlan?.overview}</p>
                                            
                                            <h4 className="font-semibold">Differential Diagnosis</h4>
                                            <ul className="list-disc pl-5 text-sm text-muted-foreground mb-2">
                                                {referralInfo.assessmentAndPlan?.differentialDiagnosis.map((dx, i) => (
                                                    <li key={i}><strong>{dx.diagnosis}</strong> ({dx.likelihood}): {dx.rationale}</li>
                                                ))}
                                            </ul>
                                            
                                            <h4 className="font-semibold">Plan of Action</h4>
                                             <p className="text-sm text-muted-foreground">{referralInfo.assessmentAndPlan?.planOfAction.laboratoryTests}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </ScrollArea>
                             <CardFooter className="p-4 border-t">
                                <Button className="w-full" asChild>
                                    <Link href="/search"><Search className="mr-2 h-4 w-4"/> Find a Human Doctor</Link>
                                </Button>
                             </CardFooter>
                        </Card>
                    )}
                </div>
            </main>
             <HumanDoctorPromoModal isOpen={showPromoModal} onOpenChange={setShowPromoModal} />
        </div>
    );
}
