
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Calendar, Check, X, Eye, Video, Bell, Star, CalendarDays, DollarSign, Activity, Users, Clock } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const todayAppointments = [
    { id: 1, patient: 'Adrian Marshall', patientId: 'PT001', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', time: '10:45 AM', purpose: 'Video Consultation' },
    { id: 2, patient: 'Kelly Stevens', patientId: 'PT002', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', time: '11:00 AM', purpose: 'Clinic Follow-up' },
    { id: 3, patient: 'Samuel Anderson', patientId: 'PT003', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', time: '02:00 PM', purpose: 'General Checkup' },
];

const recentPatients = [
    { id: 1, patient: 'Gina Moore', patientId: 'PT006', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', lastVisit: '2 days ago', paid: 150 },
    { id: 2, patient: 'Carl Kelly', patientId: 'PT004', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', lastVisit: '3 days ago', paid: 300 },
]

const notifications = [
    { id: 1, message: "Booking Confirmed on 21 Mar 2025 10:30 AM", time: "Just Now", color: "bg-violet-100 text-violet-600", icon: Bell },
    { id: 2, message: "You have a New Review for your Appointment", time: "5 Days ago", color: "bg-blue-100 text-blue-600", icon: Star },
    { id: 3, message: "You have Appointment with Ahmed by 01:20 PM", time: "12:55 PM", color: "bg-red-100 text-red-600", icon: CalendarDays },
]


export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6">
        {/* Top Stat Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Patient</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1,245</div>
                    <p className="text-xs text-muted-foreground">+10.2% from last month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+5 since yesterday</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$25,350</div>
                    <p className="text-xs text-muted-foreground">+18.4% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4.9 / 5.0</div>
                    <p className="text-xs text-muted-foreground">Based on 245 reviews</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Today's Appointments</CardTitle>
                        <CardDescription>You have {todayAppointments.length} appointments scheduled for today.</CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/doctor/dashboard/appointments">View All</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {todayAppointments.map((appt) => (
                            <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={appt.image} data-ai-hint={appt.imageHint} />
                                        <AvatarFallback>{appt.patient.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{appt.patient}</p>
                                        <p className="text-xs text-muted-foreground">{appt.purpose}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-primary" />{appt.time}</p>
                                    <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                                        <Link href={`/doctor/dashboard/my-patients/${appt.patientId}`}>View Patient</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Patient Activity</CardTitle>
                     <Button asChild variant="outline" size="sm">
                        <Link href="/doctor/dashboard/my-patients">View All</Link>
                    </Button>
                </CardHeader>
                 <CardContent>
                    <table className="w-full text-sm">
                         <tbody>
                            {recentPatients.map((patient) => (
                                <tr key={patient.id} className="border-b last:border-b-0">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={patient.image} data-ai-hint={patient.imageHint} />
                                                <AvatarFallback>{patient.patient.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{patient.patient}</p>
                                                <p className="text-xs text-muted-foreground">#{patient.patientId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-muted-foreground">{patient.lastVisit}</td>
                                    <td className="p-3 font-medium">${patient.paid.toFixed(2)}</td>
                                     <td className="text-right p-3">
                                        <Button variant="ghost" size="sm">View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {notifications.map((item) => {
                            const Icon = item.icon;
                            return(
                            <li key={item.id} className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
                                    <Icon className="w-4 h-4"/>
                                </div>
                                <div className="flex-1 text-sm">
                                    <p className="text-muted-foreground leading-tight">{item.message}</p>
                                    <p className="text-xs text-muted-foreground/70">{item.time}</p>
                                </div>
                            </li>
                        )})}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Availability Summary</CardTitle>
                    <CardDescription>Your current weekly schedule.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="font-medium">Mon, Wed, Fri</span><span className="text-muted-foreground">09:00 AM - 05:00 PM</span></div>
                    <div className="flex justify-between"><span className="font-medium">Tue, Thu</span><span className="text-muted-foreground">10:00 AM - 07:00 PM</span></div>
                    <div className="flex justify-between"><span className="font-medium">Sat, Sun</span><span className="text-muted-foreground">Closed</span></div>
                     <Button asChild variant="secondary" className="w-full mt-2 !mt-4">
                        <Link href="/doctor/dashboard/schedule">Edit Schedule</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
