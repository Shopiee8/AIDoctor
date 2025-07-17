
'use client';

import {
  Heart, LineChart, Thermometer, TestTube2, Droplets, User, Calendar, Bell, Wallet, MessageSquare, Plus, ChevronRight, Eye, Hospital, Video, Clock, MessageCircle, FileText, Download, Trash2, Link as LinkIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from "next/image";
import {
  Chart as ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig } from "@/components/ui/chart";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React from "react";


const healthRecords = [
  { title: "Heart Rate", value: "140 Bpm", icon: Heart, color: "text-orange-500", trend: "+2%" },
  { title: "Body Temperature", value: "37.5 C", icon: Thermometer, color: "text-amber-500" },
  { title: "Glucose Level", value: "70-90", icon: TestTube2, color: "text-blue-500", trend: "-6%" },
  { title: "Blood Pressure", value: "100/70", icon: Droplets, color: "text-red-500", trend: "+2%" },
  { title: "SPO2", value: "96%", icon: LineChart, color: "text-indigo-500" },
  { title: "BMI", value: "20.1 kg/m2", icon: User, color: "text-purple-500" },
];

const favorites = [
    { name: "Dr. Edalin", specialty: "Endodontist", image: "https://placehold.co/40x40.png" },
    { name: "Dr. Maloney", specialty: "Cardiologist", image: "https://placehold.co/40x40.png" },
    { name: "Dr. Wayne", specialty: "Dental Specialist", image: "https://placehold.co/40x40.png" },
    { name: "Dr. Marla", specialty: "Endodontist", image: "https://placehold.co/40x40.png" },
];

const appointmentDates = [
    { day: "19", weekday: "Mon", available: false },
    { day: "20", weekday: "Mon", available: false },
    { day: "21", weekday: "Tue", available: true },
    { day: "22", weekday: "Wed", available: true },
    { day: "23", weekday: "Thu", available: false },
    { day: "24", weekday: "Fri", available: false },
    { day: "25", weekday: "Sat", available: false },
];

const upcomingAppointments = [
  { doctor: "Dr. Edalin Hendry", specialty: "Dentist", image: "https://placehold.co/40x40.png", typeIcon: Hospital, dateTime: "21 Mar 2025 - 10:30 PM" },
  { doctor: "Dr. Juliet Gabriel", specialty: "Cardiologist", image: "https://placehold.co/40x40.png", typeIcon: Video, dateTime: "22 Mar 2025 - 10:30 PM" },
];

const notifications = [
    { icon: Calendar, color: "bg-purple-100 text-purple-600", message: "Booking Confirmed on 21 Mar 2025 10:30 AM", time: "Just Now" },
    { icon: Bell, color: "bg-blue-100 text-blue-600", message: "You have a New Review for your Appointment", time: "5 Days ago" },
    { icon: Calendar, color: "bg-red-100 text-red-600", message: "You have Appointment with Ahmed by 01:20 PM", time: "12:55 PM" },
    { icon: Wallet, color: "bg-yellow-100 text-yellow-600", message: "Sent an amount of $200 for an Appointment", time: "2 Days ago" },
];

const dependents = [
    { name: "Laura", relation: "Mother", age: 58, image: "https://placehold.co/40x40.png" },
    { name: "Mathew", relation: "Father", age: 59, image: "https://placehold.co/40x40.png" },
];

const reports = {
    appointments: [
        { id: "#AP1236", doctor: "Dr. Robert Womack", image: "https://placehold.co/40x40.png", date: "21 Mar 2025, 10:30 AM", type: "Video call", status: "Upcoming" },
        { id: "#AP3656", doctor: "Dr. Patricia Cassidy", image: "https://placehold.co/40x40.png", date: "28 Mar 2025, 11:40 AM", type: "Clinic Visit", status: "Completed" },
        { id: "#AP1246", doctor: "Dr. Kevin Evans", image: "https://placehold.co/40x40.png", date: "02 Apr 2025, 09:20 AM", type: "Audio Call", status: "Completed" },
        { id: "#AP6985", doctor: "Dr. Lisa Keating", image: "https://placehold.co/40x40.png", date: "15 Apr 2025, 04:10 PM", type: "Clinic Visit", status: "Cancelled" },
    ],
    medicalRecords: [
        { id: "#MR1236", name: "Electrocardiography", date: "24 Mar 2025", comments: "Take Good Rest" },
        { id: "#MR3656", name: "Complete Blood Count", date: "10 Apr 2025", comments: "Stable, no change" },
    ],
    prescriptions: [
        { id: "#P1236", name: "Prescription", date: "21 Mar 2025", doctor: "Edalin Hendry", image: "https://placehold.co/40x40.png" },
        { id: "#P3656", name: "Prescription", date: "28 Mar 2025", doctor: "John Homes", image: "https://placehold.co/40x40.png" },
    ],
    invoices: [
        { id: "#INV1236", doctor: "Edalin Hendry", image: "https://placehold.co/40x40.png", date: "24 Mar 2025", amount: 300 },
        { id: "#INV3656", doctor: "John Homes", image: "https://placehold.co/40x40.png", date: "17 Mar 2025", amount: 450 },
    ],
};

const heartRateChartData = [
  { month: "Mon", desktop: 140 }, { month: "Tue", desktop: 100 }, { month: "Wed", desktop: 180 }, { month: "Thu", desktop: 130 }, { month: "Fri", desktop: 100 }, { month: "Sat", desktop: 130 }
]
const bloodPressureChartData = [
  { month: "Mon", systolic: 110, diastolic: 90 }, { month: "Tue", systolic: 90, diastolic: 60 }, { month: "Wed", systolic: 40, diastolic: 30 }, { month: "Thu", systolic: 120, diastolic: 60 }, { month: "Fri", systolic: 130, diastolic: 90 }, { month: "Sat", systolic: 130, diastolic: 70 }, { month: "Sun", systolic: 130, diastolic: 70 }
]

const chartConfig: ChartConfig = {
  desktop: {
    label: "Heart Rate",
    color: "#0E82FD",
  },
  systolic: {
    label: "Systolic",
    color: "#0E82FD",
  },
  diastolic: {
    label: "Diastolic",
    color: "#A7CFFF",
  },
}

export default function PatientDashboardPage() {

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Left Column */}
                <div className="xl:col-span-8 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Health Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {healthRecords.map((record, index) => (
                                        <div key={index} className="p-4 border rounded-lg">
                                            <div className={`flex items-center gap-2 text-sm ${record.color}`}>
                                                <record.icon className="w-5 h-5" />
                                                <span>{record.title}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold mt-2">{record.value} {record.trend && <sup className={`text-xs font-normal ${record.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{record.trend}</sup>}</h3>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col items-center justify-center text-center p-4 border rounded-lg">
                                     <div style={{ width: 200, height: 200 }}>
                                        <CircularProgressbar
                                            value={95}
                                            text="95%"
                                            strokeWidth={7}
                                            styles={buildStyles({
                                                textColor: 'hsl(var(--foreground))',
                                                pathColor: 'hsl(var(--primary))',
                                                trailColor: 'hsl(var(--muted))',
                                                textSize: '16px',
                                            })}
                                        />
                                    </div>
                                    <p className="mt-4 text-sm font-semibold">Your health is 95% Normal</p>
                                    <p className="text-xs text-muted-foreground">Report generated on last visit: 25 Mar 2025</p>
                                    <Button asChild className="mt-4 w-full">
                                        <Link href="/dashboard/medical-records">View Details <ChevronRight className="w-4 h-4 ml-2"/></Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="heart-rate">
                                <TabsList>
                                    <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
                                    <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
                                </TabsList>
                                <TabsContent value="heart-rate">
                                   <ChartContainer config={chartConfig} className="h-64">
                                      <BarChart accessibilityLayer data={heartRateChartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                      </BarChart>
                                    </ChartContainer>
                                </TabsContent>
                                <TabsContent value="blood-pressure">
                                    <ChartContainer config={chartConfig} className="h-64">
                                      <BarChart accessibilityLayer data={bloodPressureChartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="systolic" fill="var(--color-systolic)" radius={4} />
                                        <Bar dataKey="diastolic" fill="var(--color-diastolic)" radius={4} />
                                      </BarChart>
                                    </ChartContainer>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="xl:col-span-4 flex flex-col gap-6">
                    <div className="bg-primary text-primary-foreground p-6 rounded-lg text-center">
                        <h3 className="font-headline text-xl mb-1">Book a new Appointment</h3>
                        <p className="text-primary-foreground/80 text-sm mb-4">Start your health journey today.</p>
                        <Button variant="secondary" className="w-full">
                            <Plus className="w-4 h-4 mr-2"/> Book Now
                        </Button>
                    </div>
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Favourites</CardTitle>
                            <Button asChild variant="link" size="sm">
                                <Link href="/dashboard/favourites">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {favorites.map((fav, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={fav.image} data-ai-hint="doctor portrait" />
                                            <AvatarFallback>{fav.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{fav.name}</p>
                                            <p className="text-xs text-muted-foreground">{fav.specialty}</p>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost">
                                        <Calendar className="w-4 h-4"/>
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-5 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appointments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Carousel opts={{ align: "start" }}>
                                <CarouselContent className="-ml-2">
                                    {appointmentDates.map((date, index) => (
                                        <CarouselItem key={index} className="basis-1/5 pl-2">
                                            <div className={`p-2 border rounded-lg text-center ${date.available ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/50'}`}>
                                                <p className="font-bold text-lg">{date.day}</p>
                                                <p className="text-xs">{date.weekday}</p>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-[-10px]" />
                                <CarouselNext className="right-[-10px]"/>
                            </Carousel>
                            <div className="space-y-4 mt-4">
                                {upcomingAppointments.map((appt, index) => (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={appt.image} data-ai-hint="doctor portrait"/>
                                                    <AvatarFallback>{appt.doctor.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{appt.doctor}</p>
                                                    <p className="text-xs text-muted-foreground">{appt.specialty}</p>
                                                </div>
                                            </div>
                                            <appt.typeIcon className="w-5 h-5 text-muted-foreground"/>
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-3 flex items-center gap-2"><Clock className="w-4 h-4"/>{appt.dateTime}</div>
                                        <div className="grid grid-cols-2 gap-2 mt-3">
                                            <Button variant="outline" size="sm"><MessageCircle className="w-4 h-4 mr-2"/>Chat</Button>
                                            <Button size="sm"><Calendar className="w-4 h-4 mr-2"/>Attend</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Dependants</CardTitle>
                             <Button asChild variant="link" size="sm">
                                <Link href="/dashboard/dependents">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {dependents.map((dep, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={dep.image} data-ai-hint="person portrait"/>
                                            <AvatarFallback>{dep.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{dep.name}</p>
                                            <p className="text-xs text-muted-foreground">{dep.relation} - {dep.age} years</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="icon" variant="ghost"><Calendar className="w-4 h-4"/></Button>
                                        <Button size="icon" variant="ghost"><Eye className="w-4 h-4"/></Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                 <div className="xl:col-span-7 flex flex-col gap-6">
                     <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Notifications</CardTitle>
                            <Button asChild variant="link" size="sm"><Link href="#">View All</Link></Button>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {notifications.map((note, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${note.color}`}>
                                        <note.icon className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <p className="text-sm">{note.message}</p>
                                        <p className="text-xs text-muted-foreground">{note.time}</p>
                                    </div>
                                </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="appointments">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                                    <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
                                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                                </TabsList>
                                <TabsContent value="appointments">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Doctor</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reports.appointments.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarImage src={item.image} data-ai-hint="doctor portrait"/>
                                                            <AvatarFallback>{item.doctor.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{item.doctor}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell>
                                                    <Badge variant={item.status === "Cancelled" ? "destructive" : item.status === "Upcoming" ? "secondary" : "default"}>{item.status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                 <TabsContent value="medical-records">
                                     <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Comments</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reports.medicalRecords.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell>{item.date}</TableCell>
                                                    <TableCell>{item.comments}</TableCell>
                                                    <TableCell className="text-right space-x-1">
                                                        <Button variant="ghost" size="icon"><LinkIcon className="w-4 h-4"/></Button>
                                                        <Button variant="ghost" size="icon"><Download className="w-4 h-4"/></Button>
                                                        <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive"/></Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                     </Table>
                                </TabsContent>
                                <TabsContent value="prescriptions">
                                     <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Prescribed By</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reports.prescriptions.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.date}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="w-8 h-8">
                                                                <AvatarImage src={item.image} data-ai-hint="doctor portrait" />
                                                                <AvatarFallback>{item.doctor.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium">{item.doctor}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-1">
                                                        <Button variant="ghost" size="icon"><LinkIcon className="w-4 h-4"/></Button>
                                                        <Button variant="ghost" size="icon"><Download className="w-4 h-4"/></Button>
                                                        <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive"/></Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                     </Table>
                                </TabsContent>
                                 <TabsContent value="invoices">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Doctor</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reports.invoices.map(item => (
                                                <TableRow key={item.id}>
                                                     <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="w-8 h-8">
                                                                <AvatarImage src={item.image} data-ai-hint="doctor portrait" />
                                                                <AvatarFallback>{item.doctor.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium">{item.doctor}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>${item.amount.toFixed(2)}</TableCell>
                                                    <TableCell>{item.date}</TableCell>
                                                    <TableCell className="text-right space-x-1">
                                                        <Button variant="ghost" size="icon"><LinkIcon className="w-4 h-4"/></Button>
                                                        <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive"/></Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                 </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

            </div>

        </div>
    );
}
