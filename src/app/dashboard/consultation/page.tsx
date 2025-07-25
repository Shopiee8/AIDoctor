
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, User, Send, Loader2, Mic, AlertTriangle, Search, PhoneOff, Wand2, StopCircle, VideoIcon, MicIcon, Play, Link as LinkIcon, Download, MoreHorizontal, MessageSquare, Users, Sparkles, Folder, Settings, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { consultationFlow, ConsultationTurn, scribe } from '@/ai/flows/consultation-flow';
import { ttsFlow } from '@/ai/flows/tts-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Waveform } from '@/components/waveform';
import { useAuth } from '@/hooks/use-auth';

export default function ConsultationPage() {
    const { user } = useAuth();
    const [transcript, setTranscript] = useState<ConsultationTurn[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(true);
    const [currentMessage, setCurrentMessage] = useState("");

    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { toast } = useToast();

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
            toast({
                title: 'Camera Access Denied',
                description: 'Please enable camera permissions in your browser settings.',
                variant: 'destructive',
            });
          }
        };
        getCameraPermission();
      }, [toast]);
    
    const handleSendMessage = async () => {
        if (!currentMessage.trim()) return;

        const userTurn: ConsultationTurn = { role: 'user', content: currentMessage };
        const newHistory = [...transcript, userTurn];
        setTranscript(newHistory);
        setCurrentMessage("");
        setIsLoading(true);

        try {
            const responseHistory = await consultationFlow(newHistory);
            const aiTurn = responseHistory[responseHistory.length - 1];

            if (aiTurn.role === 'model' && aiTurn.content) {
                const { media } = await ttsFlow(aiTurn.content);
                if (media && audioRef.current) {
                    audioRef.current.src = media;
                    audioRef.current.play();
                }
            }

            setTranscript(responseHistory);
            
            if (aiTurn.isReferral) {
                setSummary({
                    soapNote: aiTurn.soapNote,
                    assessmentAndPlan: aiTurn.assessmentAndPlan,
                });
            }

        } catch (e) {
            console.error(e);
            toast({ title: 'AI Error', description: 'Could not get response from AI.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex h-screen bg-muted/30">
            {/* Main Content */}
            <main className="flex-1 flex flex-col p-4 gap-4">
                {/* Header */}
                <div className="flex justify-between items-center flex-shrink-0">
                    <div>
                        <h1 className="text-xl font-bold font-headline">AI Consultation</h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <LinkIcon className="w-4 h-4"/>
                            Confidential & Secure Meeting
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon"><Search className="w-5 h-5"/></Button>
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.photoURL || undefined} />
                            <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>

                {/* Video & AI Panels */}
                <div className="grid grid-cols-3 gap-4 flex-grow">
                    {/* Left Column (Video + Transcript) */}
                    <div className="col-span-2 flex flex-col gap-4">
                        <div className="relative rounded-lg overflow-hidden flex-grow bg-card">
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            {!hasCameraPermission && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <Alert variant="destructive" className="w-4/5">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Camera Access Required</AlertTitle>
                                        <AlertDescription>
                                            Please allow camera access in your browser settings to use this feature.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-sm p-2 rounded-full">
                                <Button size="icon" variant="secondary" className="rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 text-white border-none"><MicIcon className="w-6 h-6"/></Button>
                                <Button size="icon" variant="secondary" className="rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 text-white border-none"><VideoIcon className="w-6 h-6"/></Button>
                                <Button size="icon" variant="destructive" className="rounded-full w-12 h-12"><PhoneOff className="w-6 h-6"/></Button>
                                <Button size="icon" variant="secondary" className="rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 text-white border-none"><Wand2 className="w-6 h-6"/></Button>
                            </div>
                            <div className="absolute top-4 right-4 flex flex-col gap-3">
                                <Image src="https://placehold.co/180x135.png" width={180} height={135} alt="Tasya" className="rounded-lg" data-ai-hint="person happy" />
                                <Image src="https://placehold.co/180x135.png" width={180} height={135} alt="Malvis" className="rounded-lg" data-ai-hint="person professional"/>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 h-2/5">
                            <Card className="flex flex-col">
                                <CardHeader className="flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />Live Transcript</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto p-4">
                                     <ScrollArea className="h-full">
                                        <div className="space-y-4 text-sm">
                                            {transcript.map((item, index) => (
                                                <div key={index} className="flex gap-3">
                                                    <Avatar className="h-6 w-6">
                                                      <AvatarFallback>{item.role === 'model' ? 'AI' : 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="font-semibold">{item.role === 'model' ? 'AI Doctor' : 'You'}</p>
                                                        <p className="text-muted-foreground">{item.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {transcript.length === 0 && !isLoading && (
                                                <div className="text-center text-muted-foreground pt-8">Conversation will appear here...</div>
                                            )}
                                            {isLoading && <div className="text-center text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin inline mr-2"/>AI is thinking...</div>}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                             <Card className="flex flex-col">
                                <CardHeader className="flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary"/>AI Referral Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto p-4">
                                   {summary ? (
                                    <div className="prose prose-sm max-w-none">
                                        <h4>SOAP Note</h4>
                                        <p><strong>Subjective:</strong> {summary.soapNote.subjective}</p>
                                        <p><strong>Objective:</strong> {summary.soapNote.objective}</p>
                                        <p><strong>Assessment:</strong> {summary.soapNote.assessment}</p>
                                        <p><strong>Plan:</strong> {summary.soapNote.plan}</p>
                                    </div>
                                   ) : <div className="text-center text-muted-foreground pt-8">Referral summary will appear here if required.</div>}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column (Participants & Chat) */}
                    <div className="col-span-1 flex flex-col gap-4">
                        <Card className="flex-1 flex flex-col">
                             <CardHeader className="flex-row items-center justify-between">
                                <CardTitle className="text-base">Participants (3)</CardTitle>
                                <Button variant="link" size="sm" className="p-0">View All</Button>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto space-y-3">
                                {/* Mock participants */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8"><AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person friendly"/><AvatarFallback>MB</AvatarFallback></Avatar>
                                        <p className="text-sm font-medium">Malvis Barry</p>
                                    </div>
                                    <div className="flex gap-2 text-muted-foreground"><Mic className="w-4 h-4"/><VideoIcon className="w-4 h-4"/></div>
                                </div>
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8"><AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="woman professional"/><AvatarFallback>CM</AvatarFallback></Avatar>
                                        <p className="text-sm font-medium">Cindy Marlina</p>
                                    </div>
                                    <div className="flex gap-2 text-muted-foreground"><Mic className="w-4 h-4"/><VideoIcon className="w-4 h-4"/></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8"><AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person professional"/><AvatarFallback>DR</AvatarFallback></Avatar>
                                        <p className="text-sm font-medium">Dimas Ramadhan</p>
                                    </div>
                                    <div className="flex gap-2 text-muted-foreground"><Mic className="w-4 h-4"/><VideoIcon className="w-4 h-4"/></div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 flex flex-col">
                             <CardHeader className="flex-row items-center justify-between">
                                <CardTitle className="text-base">Chat with AI Doctor</CardTitle>
                            </CardHeader>
                             <CardContent className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-4 text-sm">
                                    {/* Chat messages will be mirrored in transcript section */}
                                     {transcript.length === 0 && !isLoading && (
                                        <div className="text-center text-muted-foreground pt-8">
                                            <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                                            <p>Type a message below to start your AI consultation.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                             <div className="p-4 border-t">
                                <div className="relative">
                                    <Input 
                                      placeholder="Reply or @mention someone" 
                                      className="pr-10"
                                      value={currentMessage}
                                      onChange={(e) => setCurrentMessage(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                      disabled={isLoading}
                                    />
                                    <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8" onClick={handleSendMessage} disabled={isLoading || !currentMessage}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                <audio ref={audioRef} className="hidden" />
            </main>
        </div>
    );
}
