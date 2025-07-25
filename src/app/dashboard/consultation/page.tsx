
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

const initialTranscript = [
    { time: "00.15", speaker: "Client", text: "Hi [User], I hope you're doing well. I wanted to check in on the project timeline. Do we have an estimated completion date?" },
    { time: "00.20", speaker: "User", text: "Hi [Client], thanks for reaching out! Yes, based on the current progress, we're aiming to complete the project by [date]. Let me know if you have any specific deadlines or adjustments in mind." },
    { time: "01.25", speaker: "Client", text: "That sounds good. Let me know what you need" },
];

export default function ConsultationPage() {
    const { user } = useAuth();
    const [transcript, setTranscript] = useState(initialTranscript);
    const [summary, setSummary] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const recognitionRef = useRef<any>(null);
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
    
    // Speech Recognition Setup
    useEffect(() => {
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setTranscript(prev => [...prev, { time: new Date().toLocaleTimeString([], {minute: '2-digit', second: '2-digit'}), speaker: "User", text: finalTranscript }]);
            }
        };
        
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            toast({ title: 'Speech Recognition Error', description: event.error, variant: 'destructive' });
        };
        
        recognitionRef.current = recognition;

    }, [toast]);

    const handleRecord = async () => {
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

            // Generate summary after a delay to simulate live processing
            setIsLoading(true);
            setTimeout(async () => {
                const fullTranscript = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n\n');
                try {
                    const result = await scribe({ conversation: fullTranscript });
                    setSummary(result);
                } catch(e) {
                    console.error(e);
                    toast({ title: 'AI Error', description: 'Could not generate summary.', variant: 'destructive' });
                } finally {
                    setIsLoading(false);
                }
            }, 5000); // 5 second delay
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
                        <Button onClick={handleRecord} variant={isRecording ? 'destructive' : 'default'}>
                            {isRecording ? <StopCircle className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2"/>}
                            {isRecording ? 'Stop Recording' : 'Start Record AI'}
                        </Button>
                        <Button variant="ghost" size="icon"><Search className="w-5 h-5"/></Button>
                        <Button variant="ghost" size="icon"><Bell className="w-5 h-5"/></Button>
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
                                    <CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />AI Tracker Notes</CardTitle>
                                    <div className="flex items-center gap-2">
                                        {isRecording && <Waveform />}
                                        <span className="text-sm text-muted-foreground">00:41</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto p-4">
                                     <ScrollArea className="h-full">
                                        <div className="space-y-4 text-sm">
                                            {transcript.map((item, index) => (
                                                <div key={index} className="flex gap-3">
                                                    <p className="font-mono text-muted-foreground text-xs pt-1">{item.time}</p>
                                                    <div className="flex-1">
                                                        <p className="font-semibold">{item.speaker}</p>
                                                        <p className="text-muted-foreground">{item.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                             <Card className="flex flex-col">
                                <CardHeader className="flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary"/>AI Summarize</CardTitle>
                                    <Button variant="link" size="sm" className="p-0">View All</Button>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto p-4">
                                   {isLoading ? <div className="text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline mr-2"/>Generating...</div> : null}
                                   {summary ? (
                                    <div className="prose prose-sm max-w-none">
                                        <h4>Subjective</h4>
                                        <p>{summary.subjective}</p>
                                        <h4>Assessment</h4>
                                        <p>{summary.assessment}</p>
                                    </div>
                                   ) : !isLoading ? <div className="text-center text-muted-foreground">Summary will appear here.</div> : null}
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
                                <CardTitle className="text-base">Chat</CardTitle>
                                <Button variant="link" size="sm" className="p-0">View All</Button>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
                               <Image src="https://placehold.co/150x120.png" width={150} height={120} alt="No chat" data-ai-hint="mailbox empty" />
                               <p className="text-sm font-semibold mt-4">No chat yet</p>
                               <p className="text-xs text-muted-foreground">Type a message to start</p>
                            </CardContent>
                             <div className="p-4 border-t">
                                <div className="relative">
                                    <Input placeholder="Reply or @mention someone" className="pr-10"/>
                                    <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

            </main>
        </div>
    );
}

const Bell = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
