
'use client';

import {
  Heart, LineChart, Thermometer, TestTube2, Droplets, User, Calendar, Bell, Wallet, MessageSquare, Plus, ChevronRight, Eye, Hospital, Video, Clock, MessageCircle, FileText, Download, Trash2, Link as LinkIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from "next/image";
import {
  ChartContainer as Chart,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig } from "@/components/ui/chart";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React from "react";
import { usePatientDataStore } from "@/store/patient-data-store";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingModal } from "@/components/booking-modal";
import { useBookingStore } from "@/store/booking-store";

const chartConfig: ChartConfig = {
  desktop: {
    label: "Heart Rate",
    color: "hsl(var(--primary))",
  },
  systolic: {
    label: "Systolic",
    color: "hsl(var(--primary))",
  },
  diastolic: {
    label: "Diastolic",
    color: "hsl(var(--secondary))",
  },
}


export default function PatientDashboardPage() {
    const { 
        healthRecords, 
        healthReport,
        analytics, 
        favorites, 
        appointmentDates, 
        upcomingAppointments, 
        dependents, 
        reports,
        isLoading
    } = usePatientDataStore();

    const { isBookingModalOpen, openBookingModal } = useBookingStore();

    if (isLoading) {
        return <DashboardSkeleton />;
    }

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
                                    {healthRecords.length === 0 && <p className="text-muted-foreground col-span-2">No health records available.</p>}
                                </div>
                                <div className="flex flex-col items-center justify-center text-center p-4 border rounded-lg">
                                     <div style={{ width: 200, height: 200 }}>
                                        <CircularProgressbar
                                            value={healthReport.percentage}
                                            text={`${healthReport.percentage}%`}
                                            strokeWidth={7}
                                            styles={buildStyles({
                                                textColor: 'hsl(var(--foreground))',
                                                pathColor: 'hsl(var(--primary))',
                                                trailColor: 'hsl(var(--muted))',
                                                textSize: '16px',
                                            })}
                                        />
                                    </div>
                                    <p className="mt-4 text-sm font-semibold">{healthReport.title}</p>
                                    <p className="text-xs text-muted-foreground">{healthReport.details}</p>
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
                                   <Chart config={chartConfig} className="h-64">
                                      <BarChart accessibilityLayer data={analytics.heartRate}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                      </BarChart>
                                    </Chart>
                                </TabsContent>
                                <TabsContent value="blood-pressure">
                                    <Chart config={chartConfig} className="h-64">
                                      <BarChart accessibilityLayer data={analytics.bloodPressure}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="systolic" fill="var(--color-systolic)" radius={4} />
                                        <Bar dataKey="diastolic" fill="var(--color-diastolic)" radius={4} />
                                      </BarChart>
                                    </Chart>
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
                        <Button variant="secondary" className="w-full" onClick={openBookingModal}>
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
                             {favorites.length === 0 && <p className="text-muted-foreground text-sm">No favorite doctors added yet.</p>}
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
                                {appointmentDates.length > 5 && (
                                    <>
                                        <CarouselPrevious className="left-[-10px]" />
                                        <CarouselNext className="right-[-10px]"/>
                                    </>
                                )}
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
                                {upcomingAppointments.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No upcoming appointments.</p>}
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
                             {dependents.length === 0 && <p className="text-muted-foreground text-sm">No dependents added.</p>}
                        </CardContent>
                    </Card>
                </div>
                 <div className="xl:col-span-7 flex flex-col gap-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-muted-foreground text-sm">Real-time notifications will be managed by the bell icon in the header.</p>
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
                                            {reports.appointments.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No appointment reports.</TableCell></TableRow>}
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
                                             {reports.medicalRecords.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No medical records.</TableCell></TableRow>}
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
                                            {reports.prescriptions.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No prescription reports.</TableCell></TableRow>}
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
                                            {reports.invoices.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No invoice reports.</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                 </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {isBookingModalOpen && <BookingModal />}
        </div>
    );
}


function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Health Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24" />)}
                                </div>
                                <Skeleton className="h-full min-h-48" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-72" />
                        </CardContent>
                    </Card>
                </div>
                <div className="xl:col-span-4 flex flex-col gap-6">
                    <Skeleton className="h-28" />
                    <Card>
                        <CardHeader>
                            <CardTitle>Favourites</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12" />)}
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
                         <CardContent className="space-y-4">
                             <Skeleton className="h-16" />
                             <Skeleton className="h-32" />
                             <Skeleton className="h-32" />
                         </CardContent>
                     </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Dependants</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-12" />)}
                        </CardContent>
                    </Card>
                 </div>
                 <div className="xl:col-span-7 flex flex-col gap-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12" />)}
                        </CardContent>
                     </Card>
                     <Card>
                        <CardHeader>
                             <CardTitle>Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64" />
                        </CardContent>
                     </Card>
                 </div>
            </div>
        </div>
    )
}
