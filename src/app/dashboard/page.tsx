
'use client';

import {
  LineChart, AreaChart, Area, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, PolarRadiusAxis, RadialBarChart, RadialBar
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from "next/image";
import {
    Activity, ArrowRight, Share2, CheckCircle, Clock, MessageSquare, Bot, Mic, Video, Link as LinkIcon, Send, Sparkles, AlignLeft, Loader2, Heart, Thermometer, Brain, Droplets, Scale, Wind, FileText, Settings, VideoIcon, PhoneCall, Handshake, Info, ArrowUp, ArrowDown
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { usePatientDataStore } from "@/store/patient-data-store";

const healthRecords = [
    { title: "Heart Rate", value: "140 Bpm", trend: "2%", icon: Heart, trendDirection: 'up' as const },
    { title: "Body Temperature", value: "37.5°C", icon: Thermometer },
    { title: "Glucose Level", value: "70-90", trend: "6%", icon: Brain, trendDirection: 'down' as const },
    { title: "SPO2", value: "96%", icon: Wind },
    { title: "Blood Pressure", value: "100 mg/dl", trend: "2%", icon: Droplets, trendDirection: 'up' as const },
    { title: "BMI", value: "20.1 kg/m²", icon: Scale }
];

const biologicalAgeData = [
  { subject: 'Biological', A: 80, fullMark: 100 },
  { subject: 'Metabolic', A: 40, fullMark: 100 },
  { subject: 'Lipid', A: 60, fullMark: 100 },
  { subject: 'Heme-Immune', A: 30, fullMark: 100 },
  { subject: 'Kidney', A: 70, fullMark: 100 },
  { subject: 'Liver', A: 90, fullMark: 100 },
];

const riskData = [
    { name: 'Cancer', value: 4.94, fill: 'var(--color-chart-1)' },
    { name: 'COPD', value: 14.45, fill: 'var(--color-chart-2)' },
    { name: 'Stroke', value: 17.54, fill: 'var(--color-chart-3)' },
    { name: 'Type 2 Diabetes', value: 17.32, fill: 'var(--color-chart-4)' },
    { name: 'Heart Disease', value: 34.21, fill: 'var(--color-chart-5)' },
];

export default function PatientDashboardPage() {
    const { healthReport, isLoading } = usePatientDataStore();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {healthRecords.map((record, index) => (
                    <Card key={index} className="bg-card">
                        <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium text-muted-foreground">{record.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="flex items-baseline gap-2">
                             <p className="text-2xl font-bold">{record.value}</p>
                             {record.trend && (
                                 <p className={`text-xs flex items-center ${record.trendDirection === 'up' ? 'text-destructive' : 'text-primary'}`}>
                                     {record.trendDirection === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                     {record.trend}
                                 </p>
                             )}
                           </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="col-span-1 lg:col-span-2 xl:col-span-3">
                 <CardHeader>
                    <CardTitle>Overall Report</CardTitle>
                    <CardDescription>Report generated on last visit: 25 Mar 2025</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="relative w-full aspect-square">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={biologicalAgeData}>
                                <PolarGrid stroke="hsl(var(--border))"/>
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
                                <Radar name="Biological Age" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Your health is {healthReport.percentage}% Normal</h3>
                        <p className="text-muted-foreground mt-2">
                            {healthReport.details}
                        </p>
                         <Progress value={healthReport.percentage} className="mt-4 h-2" />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-7">
                    <CardHeader>
                        <CardTitle>Your Risk of Disease</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                innerRadius="10%" 
                                outerRadius="80%" 
                                data={riskData} 
                                startAngle={180} 
                                endAngle={0}
                                barSize={15}
                            >
                                <RadialBar
                                    minAngle={15}
                                    label={{ fill: 'hsl(var(--foreground))', position: 'insideStart', fontSize: '12px', formatter: (value, entry) => `${entry.payload.name} ${value}%` }}
                                    background
                                    dataKey="value"
                                />
                                <text
                                    x="50%"
                                    y="55%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-5xl font-bold fill-foreground"
                                >
                                    74th
                                </text>
                                <text
                                    x="50%"
                                    y="65%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-lg fill-muted-foreground"
                                >
                                    Percentile
                                </text>
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-5">
                    <CardHeader>
                        <CardTitle>Telomere Length</CardTitle>
                        <CardDescription>Your telomere length matches that of a typical 50-year-old.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { age: 10, length: 5.8 },
                                { age: 20, length: 5.6 },
                                { age: 30, length: 5.5 },
                                { age: 40, length: 5.2 },
                                { age: 50, length: 4.5 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="age" unit="yrs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}/>
                                <Line type="monotone" dataKey="length" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">View Full Report</Button>
                    </CardFooter>
                 </Card>
            </div>
        </div>
    );
}
