
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, User, Send, Loader2, Mic, AlertTriangle, Search, PhoneOff, Wand2, StopCircle, VideoIcon, MicIcon, Play, Link as LinkIcon, Download, MoreHorizontal, MessageSquare, Users, Sparkles, Folder, Settings, LogOut, ChevronDown, VideoOff, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { consultationFlow, ConsultationTurn } from '@/ai/flows/consultation-flow';
import { ttsFlow } from '@/ai/flows/tts-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Waveform } from '@/components/waveform';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function ConsultationPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [transcript, setTranscript] = useState<ConsultationTurn[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(true);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');
    
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const recognitionRef = useRef<any>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const { toast } = useToast();
    
    const [participants, setParticipants] = useState([
        { id: 1, name: 'You', avatar: user?.photoURL || 'https://placehold.co/40x40.png', avatarHint: 'person friendly', isMuted: isMuted, isCameraOff: isCameraOff },
        { id: 2, name: 'AI Doctor', avatar: 'https://placehold.co/40x40.png', avatarHint: 'robot friendly', isMuted: false, isCameraOff: false },
    ]);
    
    useEffect(() => {
        setParticipants(prev => prev.map(p => p.id === 1 ? { ...p, isMuted, isCameraOff } : p));
    }, [isMuted, isCameraOff]);

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            setHasCameraPermission(true);
          } catch (error) {
            console.error('Error accessing camera/mic:', error);
            setHasCameraPermission(false);
            toast({
                title: 'Permission Denied',
                description: 'Camera and microphone access is required for consultations.',
                variant: 'destructive'
            })
          }
        };
        getCameraPermission();
        
        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
            if (recognitionRef.current) {
              recognitionRef.current.onend = null;
              recognitionRef.current.abort();
            }
        }
    }, [toast]);
      
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast({ title: 'Unsupported Browser', description: 'Speech recognition is not supported in this browser.', variant: 'destructive'});
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
            let final_transcript = '';
            let interim_transcript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }

            setLiveTranscript(interim_transcript);
            
            if (final_transcript.trim()) {
                 handleSendMessage(final_transcript);
            }
        };
        
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            // Avoid spamming toasts for "aborted" errors, which can happen on purpose.
            if (event.error !== 'aborted') {
                toast({ title: 'Transcription Error', description: `Error: ${event.error}. Please try again.`, variant: 'destructive' });
            }
            setIsRecording(false);
        };
        
        recognition.onend = () => {
             // The `isRecording` state is managed outside this hook, so we access its latest value
             // via a function passed to the state setter to ensure we are not using a stale value.
             setIsRecording(currentIsRecording => {
                if (currentIsRecording) {
                    console.log("Speech recognition ended, restarting...");
                    recognition.start(); // Restart if it was supposed to be running
                }
                return currentIsRecording;
             });
        };
        
    }, []);


    const handleToggleMic = () => {
        if (streamRef.current) {
            streamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(prev => !prev);
        }
    };
    
    const handleToggleCamera = () => {
        if (streamRef.current) {
            streamRef.current.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsCameraOff(prev => !prev);
        }
    };

    const handleEndCall = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
        setIsRecording(false);
        router.push('/dashboard');
    };
    
    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        const newUserTurn: ConsultationTurn = { role: 'user', content: message };
        const newHistory = [...transcript, newUserTurn];
        setTranscript(newHistory);
        setCurrentMessage("");
        setLiveTranscript("");
        setIsLoading(true);

        try {
            const resultHistory = await consultationFlow(newHistory);
            const aiResponse = resultHistory[resultHistory.length - 1];
            setTranscript(resultHistory);

            if (aiResponse.isReferral) {
                setSummary(aiResponse);
            }

            // Generate and play audio for the AI response
            if (aiResponse.content) {
                const audioData = await ttsFlow(aiResponse.content);
                if (audioRef.current && audioData?.media) {
                    audioRef.current.src = audioData.media;
                    audioRef.current.play().catch(e => console.error("Error playing audio:", e));
                }
            }

        } catch (error) {
            console.error(error);
            toast({ title: "AI Error", description: "Could not get a response from the AI.", variant: "destructive" });
            setTranscript(prev => [...prev, { role: 'model', content: "I'm having trouble connecting. Please try again."}])
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleToggleRecording = () => {
        setIsRecording(isRec => {
            if (isRec) {
                recognitionRef.current?.stop();
                return false;
            } else {
                 if (recognitionRef.current) {
                    recognitionRef.current.start();
                    return true;
                } else {
                    toast({ title: 'Error', description: 'Speech recognition is not available.', variant: 'destructive'});
                    return false;
                }
            }
        });
    };
    
    return (
        <div className="flex h-screen bg-muted/30">
             <audio ref={audioRef} className="hidden" />
            <main className="flex-1 flex flex-col p-4 gap-4">
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

                <div className="grid grid-cols-3 gap-4 flex-grow">
                    <div className="col-span-2 flex flex-col gap-4">
                        <div className="relative rounded-lg overflow-hidden flex-grow bg-card">
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            {isCameraOff && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src={user?.photoURL || undefined} />
                                        <AvatarFallback className="text-3xl">{user?.displayName?.[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                            )}
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
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant={isMuted ? "destructive" : "secondary"} className="rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 text-white border-none" onClick={handleToggleMic}>
                                                {isMuted ? <MicOff className="w-6 h-6"/> : <MicIcon className="w-6 h-6"/>}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{isMuted ? 'Unmute' : 'Mute'}</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant={isCameraOff ? "destructive" : "secondary"} className="rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 text-white border-none" onClick={handleToggleCamera}>
                                                {isCameraOff ? <VideoOff className="w-6 h-6"/> : <VideoIcon className="w-6 h-6"/>}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}</TooltipContent>
                                    </Tooltip>
                                     <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant={isRecording ? "destructive" : "secondary"} className="rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 text-white border-none" onClick={handleToggleRecording}>
                                                {isRecording ? <StopCircle className="w-6 h-6"/> : <MicIcon className="w-6 h-6"/>}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{isRecording ? 'Stop Transcription' : 'Start Transcription'}</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant="destructive" className="rounded-full w-12 h-12" onClick={handleEndCall}>
                                                <PhoneOff className="w-6 h-6"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>End Call</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant="secondary" className="rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 text-white border-none" onClick={() => toast({ title: 'Coming Soon!', description: 'AI effects will be available in a future update.'})}>
                                                <Wand2 className="w-6 h-6"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>AI Effects</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
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
                                     {isRecording && <Waveform />}
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
                                             {liveTranscript && (
                                                <div className="flex gap-3">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback>U</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="font-semibold">You</p>
                                                        <p className="text-primary">{liveTranscript}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {transcript.length === 0 && !isLoading && !isRecording &&(
                                                <div className="text-center text-muted-foreground pt-8">Press the mic to start your AI consultation...</div>
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

                    <div className="col-span-1 flex flex-col gap-4">
                        <Card className="flex-1 flex flex-col">
                             <CardHeader className="flex-row items-center justify-between">
                                <CardTitle className="text-base">Participants ({participants.length})</CardTitle>
                                <Button variant="link" size="sm" className="p-0">View All</Button>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto space-y-3">
                                {participants.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={p.avatar} data-ai-hint={p.avatarHint} />
                                                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <p className="text-sm font-medium">{p.name}</p>
                                        </div>
                                        <div className="flex gap-2 text-muted-foreground">
                                            {p.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                            {p.isCameraOff ? <VideoOff className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card className="flex-1 flex flex-col">
                             <CardHeader className="flex-row items-center justify-between">
                                <CardTitle className="text-base">Chat with AI Doctor</CardTitle>
                            </CardHeader>
                             <CardContent className="flex-1 overflow-y-auto p-4">
                                <ScrollArea className="h-full">
                                    <div className="space-y-4 text-sm">
                                        {transcript.map((item, index) => (
                                            <div key={index} className={cn(
                                                "flex gap-3",
                                                item.role === 'model' ? 'justify-start' : 'justify-end'
                                            )}>
                                                {item.role === 'model' && 
                                                    <Avatar className="h-6 w-6">
                                                    <AvatarFallback>AI</AvatarFallback>
                                                    </Avatar>
                                                }
                                                <div className={cn(
                                                    "p-2 rounded-lg max-w-xs",
                                                    item.role === 'model' ? 'bg-secondary' : 'bg-primary text-primary-foreground'
                                                )}>
                                                    <p>{item.content}</p>
                                                </div>
                                                {item.role === 'user' && 
                                                    <Avatar className="h-6 w-6">
                                                    <AvatarFallback>U</AvatarFallback>
                                                    </Avatar>
                                                }
                                            </div>
                                        ))}
                                        {transcript.length === 0 && !isLoading && (
                                            <div className="text-center text-muted-foreground pt-8">
                                                <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                                                <p>Type a message below or use the microphone to start your AI consultation.</p>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                             <div className="p-4 border-t">
                                <div className="relative">
                                    <Input 
                                      placeholder="Type message or start recording..." 
                                      className="pr-10"
                                      value={currentMessage}
                                      onChange={(e) => setCurrentMessage(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(currentMessage)}
                                      disabled={isLoading}
                                    />
                                    <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8" onClick={() => handleSendMessage(currentMessage)} disabled={isLoading || !currentMessage}>
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
