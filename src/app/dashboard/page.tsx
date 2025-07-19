
'use client';

import {
  LineChart, AreaChart, Area, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from "next/image";
import {
    Activity, ArrowRight, Share2, CheckCircle, Clock, MessageSquare, Bot, Mic, Video, Link as LinkIcon, Send, Sparkles, AlignLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";


const timeOfRelaxationData = [
    { name: '1', relaxation: 20 },
    { name: '2', relaxation: 40 },
    { name: '3', relaxation: 30 },
    { name: '4', relaxation: 60 },
    { name: '5', relaxation: 50 },
    { name: '6', relaxation: 70 },
    { name: '7', relaxation: 40 },
    { name: '8', relaxation: 80 },
    { name: '9', relaxation: 60 },
    { name: '10', relaxation: 90 },
    { name: '11', relaxation: 50 },
    { name: '12', relaxation: 75 },
    { name: '13', relaxation: 65 },
    { name: '14', relaxation: 85 },
];
const relaxationVsMoodData = [
  { name: 'Mon', mood: 40, relaxation: 24 },
  { name: 'Tue', mood: 30, relaxation: 13 },
  { name: 'Wed', mood: 60, relaxation: 58 },
  { name: 'Thu', mood: 47, relaxation: 39 },
  { name: 'Fri', mood: 58, relaxation: 48 },
  { name: 'Sat', mood: 43, relaxation: 38 },
  { name: 'Sun', mood: 60, relaxation: 43 },
];

const relaxationDistributionData = [
  { subject: 'Reading', A: 80, fullMark: 100 },
  { subject: 'Napping', A: 50, fullMark: 100 },
  { subject: 'Meditation', A: 90, fullMark: 100 },
  { subject: 'Watch TV', A: 40, fullMark: 100 },
  { subject: 'Walking Outdoors', A: 60, fullMark: 100 },
  { subject: 'Music', A: 70, fullMark: 100 },
];

const bestTimeData = [
  { name: 'Morning', value: 29, color: '#8884d8' },
  { name: 'Afternoon', value: 42, color: '#82ca9d' },
  { name: 'Evening', value: 58, color: '#ffc658' },
];

const audioTherapyData = [
    { name: "Delta (0.5-4Hz)", duration: 54 },
    { name: "Alpha (8-12 Hz)", duration: 43 },
    { name: "Beta (12-30 Hz)", duration: 8 },
]


export default function PatientDashboardPage() {

    return (
        <div className="grid grid-cols-12 gap-6 items-start">
            {/* Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
                <Card className="bg-card/80 backdrop-blur-sm border-border">
                    <CardHeader>
                        <CardTitle>Time of Relaxation</CardTitle>
                        <p className="text-sm text-muted-foreground">Your average relaxation percentage</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                             <BarChart data={timeOfRelaxationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-card/80 backdrop-blur-sm border-border">
                        <CardHeader>
                            <CardTitle>Relaxation vs Mood</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={relaxationVsMoodData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                                    <YAxis stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                                    <Legend />
                                    <Area type="monotone" dataKey="mood" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                    <Area type="monotone" dataKey="relaxation" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/80 backdrop-blur-sm border-border">
                        <CardHeader>
                            <CardTitle>Relaxation Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <RadarChart outerRadius={90} data={relaxationDistributionData}>
                                    <PolarGrid strokeOpacity={0.3} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <Radar name="Mike" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-card/80 backdrop-blur-sm border-border">
                        <CardHeader>
                            <CardTitle>Best Time of Day for Relaxation</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={bestTimeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" label>
                                        {bestTimeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/80 backdrop-blur-sm border-border">
                        <CardHeader>
                            <CardTitle>Audio Therapy</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                                {audioTherapyData.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center text-sm mb-1">
                                            <span className="text-muted-foreground">{item.name}</span>
                                            <span className="font-semibold">{item.duration}m</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2.5">
                                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(item.duration / 60) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                           </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* AI Assistant Sidebar */}
            <div className="col-span-12 lg:col-span-4">
                <Card className="bg-card/80 backdrop-blur-sm border-border sticky top-24 flex flex-col h-full min-h-[calc(100vh-7rem)]">
                     <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between">
                        <div>
                           <CardTitle className="text-lg">AI Assistant</CardTitle>
                        </div>
                        <div className="flex items-center gap-1 bg-accent p-1 rounded-lg">
                           <Button size="sm" variant="secondary" className="h-7 px-3">Chat</Button>
                           <Button size="sm" variant="ghost" className="h-7 px-3">Video</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                       <div className="flex flex-col items-center text-center">
                             <div className="mb-4">
                                <Sparkles className="h-8 w-8 text-primary mx-auto" />
                                <h3 className="text-xl font-bold mt-2">Meet Gia</h3>
                                <p className="text-sm text-muted-foreground">Your Supportive AI Companion</p>
                            </div>
                            <Image
                                src="https://placehold.co/200x300.png"
                                alt="AI Doctor Gia"
                                width={200}
                                height={300}
                                className="rounded-xl object-cover shadow-lg"
                                data-ai-hint="woman portrait friendly"
                            />
                            <div className="mt-6 text-left w-full">
                                <h4 className="font-semibold text-sm mb-3">Suggestions</h4>
                                 <div className="flex flex-wrap gap-2">
                                    <Button variant="secondary" size="sm" className="text-xs">Request a team meeting</Button>
                                    <Button variant="secondary" size="sm" className="text-xs">Find groups</Button>
                                    <Button variant="secondary" size="sm" className="text-xs">Find Game</Button>
                                    <Button variant="secondary" size="sm" className="text-xs">Emergency</Button>
                                    <Button variant="secondary" size="sm" className="text-xs">More</Button>
                                </div>
                            </div>
                        </div>
                         <div className="mt-auto pt-6">
                            <div className="p-2 bg-accent rounded-full flex items-center justify-around">
                                <Button variant="ghost" size="icon"><AlignLeft className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon"><Mic className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon"><Video className="h-4 w-4"/></Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
