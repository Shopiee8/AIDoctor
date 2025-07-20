
'use client';

import {
  LineChart, AreaChart, Area, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, PolarRadiusAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from "next/image";
import {
    Activity, ArrowRight, Share2, CheckCircle, Clock, MessageSquare, Bot, Mic, Video, Link as LinkIcon, Send, Sparkles, AlignLeft, Loader2, Heart, Thermometer, Brain, Droplets, Scale, Wind, FileText, Settings, VideoIcon, PhoneCall, Handshake
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { gpDoctorFlow, GpTurn } from "@/ai/flows/gp-doctor-flow";
import { cn } from "@/lib/utils";
import { usePatientDataStore } from "@/store/patient-data-store";


export default function PatientDashboardPage() {
    const [view, setView] = useState<'chat' | 'video'>('chat');
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState<GpTurn[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { healthRecords, healthReport, relaxationData, isLoading: isDataLoading } = usePatientDataStore();

    const {
        timeOfRelaxation,
        relaxationVsMood,
        relaxationDistribution,
        bestTimeOfDay,
        audioTherapy
    } = relaxationData;

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
            
            for (let i = 0; i < streamContent.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 20));
                currentContent += streamContent[i];
                setConversation(prev => {
                    const updatedConversation = [...prev];
                    updatedConversation[updatedConversation.length - 1].content = currentContent;
                    return updatedConversation;
                });
            }
            
        } catch (error) {
            console.error("Error with AI flow:", error);
            const errorTurn: GpTurn = {
                role: 'model',
                content: "I'm sorry, I encountered an error. Please try again.",
            };
            setConversation([...newConversation, errorTurn]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-background/80 backdrop-blur-sm border border-border p-2 rounded-lg text-sm">
            <p className="label">{`Date : ${payload[0].payload.date}`}</p>
            <p className="intro">{`Relaxation Index : ${payload[0].value}%`}</p>
            <p className="intro">{`Relaxation Score : 90%`}</p>
          </div>
        );
      }

      return null;
    };


    return (
        <div className="grid grid-cols-12 gap-6 items-start">
            {/* Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* Health Records */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {healthRecords.map((record, index) => (
                        <Card key={index} className="p-4">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-semibold text-muted-foreground">{record.title}</h4>
                                <record.icon className={cn("w-5 h-5", record.color)} />
                            </div>
                            <p className="text-xl font-bold">{record.value}</p>
                            {record.trend && <p className="text-xs text-green-500">{record.trend} from last month</p>}
                        </Card>
                    ))}
                    <Card className="p-4 bg-muted/40">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold text-muted-foreground">Overall Report</h4>
                            <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold">{healthReport.title}</p>
                        <p className="text-xs text-muted-foreground">Last Visit: {new Date().toLocaleDateString()}</p>
                    </Card>
                </div>

                {/* Relaxation charts */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Relaxation Analytics</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon"><Share2 className="w-4 h-4" /></Button>
                             <Select defaultValue="last-month">
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="last-month">Last Month</SelectItem>
                                    <SelectItem value="last-week">Last Week</SelectItem>
                                    <SelectItem value="last-year">Last Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div>
                            <h3 className="font-semibold text-sm">Time of Relaxation</h3>
                            <p className="text-xs text-muted-foreground">Your average relaxation percentage daily.</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={timeOfRelaxation}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                                    <XAxis dataKey="date" tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" />
                                    <YAxis unit="%" tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--primary)/0.1)'}}/>
                                    <Bar dataKey="relaxation" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={10} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                           <Card className="p-4">
                                <h3 className="font-semibold text-sm">Relaxation vs Mood</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={relaxationVsMood}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2}/>
                                        <XAxis dataKey="day" tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" />
                                        <YAxis tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" />
                                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}/>
                                        <Legend iconType="circle" iconSize={8} />
                                        <Line type="monotone" dataKey="Relaxation" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="Mood" stroke="hsl(var(--secondary-foreground))" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                           </Card>
                           <Card className="p-4">
                                <h3 className="font-semibold text-sm">Best Time of Day for Relaxation</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={bestTimeOfDay} dataKey="minutes" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5}>
                                           {bestTimeOfDay.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                                        <Legend iconType="circle" iconSize={8} />
                                    </PieChart>
                                </ResponsiveContainer>
                           </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Assistant Sidebar */}
            <div className="col-span-12 lg:col-span-4 h-full">
                <Card className="sticky top-6 flex flex-col h-[calc(100vh-3rem)] max-h-[calc(100vh-3rem)]">
                     <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between">
                        <div>
                           <CardTitle className="text-lg">AI GP Doctor</CardTitle>
                        </div>
                        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                           <Button size="sm" variant={view === 'chat' ? 'secondary' : 'ghost'} className="h-7 px-3" onClick={() => setView('chat')}>Chat</Button>
                           <Button size="sm" variant={view === 'video' ? 'secondary' : 'ghost'} className="h-7 px-3" onClick={() => setView('video')}>Video</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col overflow-auto p-4">
                        <div className="flex-grow space-y-4">
                            {conversation.length === 0 && (
                                <div className="flex-grow flex flex-col items-center text-center justify-center h-full">
                                    <div className="mb-4 text-center">
                                        <h3 className="text-xl font-bold mt-2">Meet Dr. Dana</h3>
                                        <p className="text-sm text-muted-foreground">Your Supportive AI Companion</p>
                                    </div>
                                    <div className="relative w-full max-w-[250px] h-auto">
                                        <Image
                                            src="https://placehold.co/400x600.png"
                                            alt="AI Doctor Dana"
                                            width={400}
                                            height={600}
                                            className="rounded-xl object-contain"
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
                            {isLoading && (
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
                    </CardContent>
                     <div className="mt-auto p-4 border-t flex-shrink-0 bg-background">
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
                            <Input
                                placeholder="Type a message..."
                                className="pr-28 pl-4 h-12"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                    }
                                }}
                            />
                            <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
                                <Button variant="ghost" size="icon"><Mic className="w-5 h-5"/></Button>
                                <Button variant="ghost" size="icon"><VideoIcon className="w-5 h-5"/></Button>
                                <Button size="sm" onClick={handleSend} disabled={isLoading || !userInput.trim()}>Send</Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
