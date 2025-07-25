
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Send, Loader2, Mic, AlertTriangle, BookCheck, Stethoscope, FileText, Download, Sparkles, Video, File, ListChecks, Activity, BrainCircuit, Play, Pause, VideoIcon, MicIcon, PhoneOff, Wand2, Grid, Folder, Calendar, Settings, LogOut, Search, Bell, ChevronDown, Paperclip, DownloadCloud, CopyIcon, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { consultationFlow, ConsultationTurn } from '@/ai/flows/consultation-flow';
import { ttsFlow } from '@/ai/flows/tts-flow';
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
import Image from "next/image";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HumanDoctorPromoModal } from '@/components/human-doctor-promo-modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Waveform } from '@/components/waveform';

const sidebarIcons = [
    { icon: Play, label: "Start" },
    { icon: Grid, label: "Apps" },
    { icon: VideoIcon, label: "Video" },
    { icon: Sparkles, label: "AI Tools" },
    { icon: Folder, label: "Files" },
    { icon: Calendar, label: "Schedule" },
]

const participants = [
    { name: 'Malvis Barry', role: 'Owner', image: 'https://placehold.co/40x40.png' },
    { name: 'Cindy Marlina', role: 'Marketing Specialist', image: 'https://placehold.co/40x40.png' },
    { name: 'Dimas Ramadhan', role: 'Software Engineer', image: 'https://placehold.co/40x40.png' },
    { name: 'Tasya Widjaya', role: 'Product Manager', image: 'https://placehold.co/40x40.png' },
    { name: 'Andre Saputra', role: 'Motion Designer', image: 'https://placehold.co/40x40.png' },
]

const timeline = [
    { time: '00.15', user: 'Client', text: "Hi [User], I hope you're doing well. I wanted to check in on the project timeline. Do we have an estimated completion date?" },
    { time: '00.20', user: 'User', text: "Hi [Client], thanks for reaching out! Yes, based on the current progress, we're aiming to complete the project by [date]. Let me know if you have any specific deadlines or adjustments in mind." },
    { time: '01.25', user: 'Client', text: "That sounds good. Let me know what you need" }
]

const summaryPoints = [
    { time: "00.15 - 01.00", title: "Project Timeline", text: "The team inquired about the estimated completion date and is awaiting updates regarding any potential delays. Next steps will be determined based on the current project." },
    { time: "01.00 - 02.00", title: "Development Updates", text: "The discussion focused on assessing the current progress and identifying pending tasks." },
    { time: "02.00 - 03.00", title: "Task Prioritization", text: "The team reassessed workload distribution among members and made necessary adjustments based on project deadlines. It was agreed that priorities would be refined continuously." }
]

export default function ConsultationPage() {
    return (
        <div className="flex h-screen bg-muted/30">
            {/* Left Sidebar */}
            <aside className="w-16 flex flex-col items-center gap-6 py-4 bg-card border-r">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Play className="w-6 h-6" />
                </div>
                <div className="space-y-4">
                    {sidebarIcons.map((item, index) => {
                        const Icon = item.icon;
                        return (
                             <Button key={index} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                <Icon className="w-6 h-6" />
                            </Button>
                        )
                    })}
                </div>
                 <div className="mt-auto space-y-4">
                     <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Settings className="w-6 h-6" /></Button>
                     <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><LogOut className="w-6 h-6" /></Button>
                 </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-y-auto">
                {/* Left and Center Column */}
                <div className="col-span-12 lg:col-span-9 space-y-4">
                     {/* Header */}
                    <div className="flex justify-between items-center">
                        <div className="flex-1">
                            <h1 className="text-xl font-bold font-headline">Client Discussion Meeting</h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <LinkIcon className="w-4 h-4"/>
                                https://meet.google.com/abc-defg-hij
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline">
                                <Sparkles className="w-4 h-4 mr-2 text-primary" /> Start Record AI
                            </Button>
                            <Button variant="ghost" size="icon"><Search className="w-5 h-5"/></Button>
                            <Button variant="ghost" size="icon"><Bell className="w-5 h-5"/></Button>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src="https://placehold.co/40x40.png" />
                                    <AvatarFallback>SN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">Selma Knight</p>
                                    <p className="text-xs text-muted-foreground">selma@gmail.com</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* Video Grid */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-9 relative rounded-lg overflow-hidden">
                            <Image src="https://placehold.co/800x600.png" width={800} height={600} alt="Main participant" className="w-full h-full object-cover" data-ai-hint="person video call" />
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-sm p-2 rounded-full">
                                <Button size="icon" variant="secondary" className="rounded-full w-12 h-12"><VideoIcon className="w-6 h-6"/></Button>
                                <Button size="icon" variant="secondary" className="rounded-full w-12 h-12"><MicIcon className="w-6 h-6"/></Button>
                                <Button size="icon" variant="destructive" className="rounded-full w-12 h-12"><PhoneOff className="w-6 h-6"/></Button>
                                <Button size="icon" variant="secondary" className="rounded-full w-12 h-12"><Paperclip className="w-6 h-6"/></Button>
                                <Button size="icon" variant="secondary" className="rounded-full w-12 h-12"><Wand2 className="w-6 h-6"/></Button>
                            </div>
                        </div>
                        <div className="col-span-3 space-y-4">
                            <div className="relative rounded-lg overflow-hidden">
                                <Image src="https://placehold.co/200x150.png" width={200} height={150} alt="Participant 2" className="w-full h-full object-cover" data-ai-hint="person video call" />
                                <p className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">Tasya Widjaja</p>
                            </div>
                             <div className="relative rounded-lg overflow-hidden">
                                <Image src="https://placehold.co/200x150.png" width={200} height={150} alt="Participant 3" className="w-full h-full object-cover" data-ai-hint="person video call" />
                                <p className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">Malvis Barry</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* AI Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary"/> AI Tracker Notes <Badge variant="secondary">Recording...</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <Button variant="outline" size="icon"><Play className="w-4 h-4"/></Button>
                               <Waveform />
                            </div>
                            <span className="text-sm font-mono text-muted-foreground">00:41</span>
                        </CardContent>
                    </Card>
                    
                    {/* Timeline and Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base">Project Timeline</CardTitle>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="w-7 h-7"><DownloadCloud className="w-4 h-4"/></Button>
                                    <Button variant="ghost" size="icon" className="w-7 h-7"><CopyIcon className="w-4 h-4"/></Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {timeline.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <p className="text-xs text-muted-foreground font-mono mt-1">{item.time}</p>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{item.user}</p>
                                            <p className="text-sm text-muted-foreground">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/> AI Summarize</CardTitle>
                                <Button variant="link" size="sm" className="p-0">View All</Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {summaryPoints.map((point, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">{index + 1}</div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">{point.time}</p>
                                            <p className="text-sm font-semibold">{point.title}</p>
                                            <p className="text-sm text-muted-foreground">{point.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <Card>
                         <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Participants</CardTitle>
                            <Button variant="link" size="sm" className="p-0">View All</Button>
                        </CardHeader>
                         <CardContent className="space-y-3">
                             {participants.map((p, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8"><AvatarImage src={p.image} /><AvatarFallback>{p.name.charAt(0)}</AvatarFallback></Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">{p.name}</p>
                                            <p className="text-xs text-muted-foreground">{p.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 text-muted-foreground">
                                        <Button variant="ghost" size="icon" className="w-6 h-6"><Mic className="w-4 h-4"/></Button>
                                        <Button variant="ghost" size="icon" className="w-6 h-6"><Video className="w-4 h-4"/></Button>
                                    </div>
                                </div>
                             ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Chat</CardTitle>
                            <Button variant="link" size="sm" className="p-0">View All</Button>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Image src="https://placehold.co/150x120.png" width={150} height={120} alt="No chat" className="mx-auto" data-ai-hint="mailbox empty" />
                            <p className="text-sm font-semibold mt-4">No chat yet</p>
                            <p className="text-xs text-muted-foreground">Type a message or mention people</p>
                             <div className="relative mt-4">
                                <Input placeholder="Reply or @mention someone" className="pr-10" />
                                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-primary">
                                    <Send className="w-4 h-4"/>
                                </Button>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
