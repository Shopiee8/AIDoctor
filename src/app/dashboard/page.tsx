
'use client';

import {
  LineChart, AreaChart, Area, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from "next/image";
import {
    Activity, ArrowRight, Share2, CheckCircle, Clock, MessageSquare, Bot, Mic, Video, Link as LinkIcon, Send, Sparkles, AlignLeft, Loader2, Heart, Thermometer, Brain, Droplets, Scale, Wind, FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { gpDoctorFlow, GpTurn } from "@/ai/flows/gp-doctor-flow";
import { cn } from "@/lib/utils";
import { usePatientDataStore } from "@/store/patient-data-store";


export default function PatientDashboardPage() {
    const [view, setView] = useState<'chat' | 'video'>('chat');
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState<GpTurn[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { healthRecords, healthReport, isLoading: isDataLoading } = usePatientDataStore();

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const userTurn: GpTurn = { role: 'user', content: userInput };
        const newConversation = [...conversation, userTurn];
        setConversation(newConversation);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await gpDoctorFlow(newConversation);
            const aiTurn = response[response.length - 1];

            setConversation(prev => [...prev, { role: 'model', content: '' }]);

            const streamContent = aiTurn.content;
            let currentContent = '';
            const interval = setInterval(() => {
                currentContent += streamContent.charAt(currentContent.length);
                setConversation(prev => {
                    const updatedConversation = [...prev];
                    updatedConversation[updatedConversation.length - 1].content = currentContent;
                    return updatedConversation;
                });
                if (currentContent.length === streamContent.length) {
                    clearInterval(interval);
                    setIsLoading(false);
                }
            }, 20); 


        } catch (error) {
            console.error("Error with AI flow:", error);
            const errorTurn: GpTurn = {
                role: 'model',
                content: "I'm sorry, I encountered an error. Please try again.",
            };
            setConversation([...newConversation, errorTurn]);
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-12 gap-6 items-start">
            {/* Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
                <Card className="bg-card/80 backdrop-blur-sm border-border">
                    <CardHeader>
                        <CardTitle>Health Records</CardTitle>
                        <CardDescription>Report generated on last visit: 25 Mar 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           {healthRecords.map((record) => {
                            const Icon = record.icon;
                            return (
                                <div key={record.title} className="p-4 border rounded-lg shadow-sm bg-muted/30">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-semibold">{record.title}</h4>
                                        <Icon className={`w-6 h-6 ${record.color}`} />
                                    </div>
                                    <p className="text-xl font-bold">{record.value}</p>
                                    {record.trend && <p className="text-xs text-green-500">{record.trend}</p>}
                                </div>
                            )
                           })}
                       </div>
                    </CardContent>
                </Card>

                 <Card className="bg-card/80 backdrop-blur-sm border-border">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center gap-4">
                                 <div className="w-24 h-24 relative">
                                    <svg className="w-full h-full" viewBox="0 0 36 36">
                                        <path
                                            d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="hsl(var(--primary) / 0.1)"
                                            strokeWidth="3"
                                        />
                                        <path
                                            className="transition-all duration-1000"
                                            d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth="3"
                                            strokeDasharray={`${healthReport.percentage}, 100`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold">{healthReport.percentage}%</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{healthReport.title}</h3>
                                    <p className="text-sm text-muted-foreground">{healthReport.details}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Last Visit 25 Mar 2025</p>
                                </div>
                            </div>
                            <Button variant="outline" className="mt-4 md:mt-0">
                                <FileText className="w-4 h-4 mr-2" />
                                View Full Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-border">
                    <CardHeader>
                        <CardTitle>Time of Relaxation</CardTitle>
                        <p className="text-sm text-muted-foreground">Your average relaxation percentage</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                             <BarChart data={[]} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                                <YAxis unit="%" stroke="hsl(var(--muted-foreground))" />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--background))', 
                                        borderColor: 'hsl(var(--border))' 
                                    }} 
                                />
                                <Bar dataKey="relaxation" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* AI Assistant Sidebar */}
            <div className="col-span-12 lg:col-span-4 h-full">
                <Card className="bg-card/80 backdrop-blur-sm border-border sticky top-24 flex flex-col h-full min-h-[calc(100vh-7rem)]">
                     <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between">
                        <div>
                           <CardTitle className="text-lg">AI GP Doctor</CardTitle>
                        </div>
                        <div className="flex items-center gap-1 bg-accent p-1 rounded-lg">
                           <Button size="sm" variant={view === 'chat' ? 'secondary' : 'ghost'} className="h-7 px-3" onClick={() => setView('chat')}>Chat</Button>
                           <Button size="sm" variant={view === 'video' ? 'secondary' : 'ghost'} className="h-7 px-3" onClick={() => setView('video')}>Video</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col overflow-auto p-4">
                        <div className="flex-grow space-y-4">
                            {conversation.length === 0 && (
                                <div className="flex-grow flex flex-col items-center text-center justify-center h-full">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold mt-2">Meet Dr. Dana</h3>
                                        <p className="text-sm text-muted-foreground">Our AI GP Doctor</p>
                                    </div>
                                    <div className="relative w-[200px] h-[300px]">
                                        <Image
                                            src="https://placehold.co/200x300.png"
                                            alt="Dr. Dana, AI GP Doctor"
                                            width={200}
                                            height={300}
                                            className="rounded-xl object-contain shadow-lg"
                                            data-ai-hint="doctor friendly transparent background"
                                        />
                                    </div>
                                </div>
                            )}
                            {conversation.map((turn, index) => (
                                <div key={index} className={cn("flex items-start gap-3", turn.role === 'user' ? "justify-end" : "justify-start")}>
                                    {turn.role === 'model' && (
                                        <Avatar className="w-8 h-8 flex-shrink-0">
                                            <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="robot friendly"/>
                                            <AvatarFallback>AI</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn("max-w-xs md:max-w-sm p-3 rounded-lg text-sm", turn.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                        <p>{turn.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && conversation.length > 0 && (
                                <div className="flex items-start gap-3 justify-start">
                                     <Avatar className="w-8 h-8 flex-shrink-0">
                                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="robot friendly"/>
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                   <div className="max-w-xs md:max-w-sm p-3 rounded-lg bg-muted flex items-center">
                                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                   </div>
                                </div>
                            )}
                        </div>

                         <div className="mt-auto pt-6 flex-shrink-0">
                            <div className="text-left w-full mb-4">
                                <h4 className="font-semibold text-sm mb-3">Suggestions</h4>
                                 <div className="flex flex-wrap gap-2">
                                    <Button variant="secondary" size="sm" className="text-xs">Request a team meeting</Button>
                                    <Button variant="secondary" size="sm" className="text-xs">Find groups</Button>
                                    <Button variant="secondary" size="sm" className="text-xs">Find Game</Button>
                                    <Button variant="secondary" size="sm" className="text-xs">Emergency</Button>
                                    <Button variant="secondary" size="sm" className="text-xs">More</Button>
                                </div>
                            </div>
                            <div className="relative">
                               <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Mic className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Video className="h-4 w-4" /></Button>
                               </div>
                               <Input 
                                 placeholder="Type your message..." 
                                 className="w-full rounded-full h-12 pl-20 pr-14" 
                                 value={userInput}
                                 onChange={(e) => setUserInput(e.target.value)}
                                 onKeyDown={(e) => {
                                     if (e.key === 'Enter' && !e.shiftKey) {
                                         e.preventDefault();
                                         handleSend();
                                     }
                                 }}
                               />
                               <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full" onClick={handleSend} disabled={isLoading}>
                                   <Send className="w-4 h-4" />
                               </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

