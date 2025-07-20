
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Check, X, Eye, Video, Bell, Star, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const upcomingAppointments = [
    { id: 1, patient: 'Adrian Marshall', patientId: 'PT001', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', date: '11 Nov 2025', time: '10:45 AM', purpose: 'General' },
    { id: 2, patient: 'Kelly Stevens', patientId: 'PT002', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', date: '10 Nov 2025', time: '11:00 AM', purpose: 'Clinic Consulting' },
    { id: 3, patient: 'Samuel Anderson', patientId: 'PT003', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', date: '03 Nov 2025', time: '02:00 PM', purpose: 'General' },
];

const recentInvoices = [
    { id: 1, patient: 'Adrian Marshall', patientId: 'PT001', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', amount: 450, date: '11 Nov 2025' },
    { id: 2, patient: 'Kelly Stevens', patientId: 'PT002', image: 'https://placehold.co/40x40.png', imageHint: 'person portrait', amount: 500, date: '10 Nov 2025' },
]

const notifications = [
    { id: 1, message: "Booking Confirmed on 21 Mar 2025 10:30 AM", time: "Just Now", color: "bg-violet-100 text-violet-600", icon: Bell },
    { id: 2, message: "You have a New Review for your Appointment", time: "5 Days ago", color: "bg-blue-100 text-blue-600", icon: Star },
    { id: 3, message: "You have Appointment with Ahmed by 01:20 PM", time: "12:55 PM", color: "bg-red-100 text-red-600", icon: CalendarDays },
]


export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 flex flex-col gap-6">
                <Card className="flex-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Patient</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">978</div>
                        <p className="text-xs text-green-500">+15% From Last Week</p>
                    </CardContent>
                </Card>
                 <Card className="flex-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Patients Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">80</div>
                        <p className="text-xs text-red-500">+15% From Yesterday</p>
                    </CardContent>
                </Card>
                 <Card className="flex-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">50</div>
                        <p className="text-xs text-green-500">+20% From Yesterday</p>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-9">
                <Card>
                    <CardHeader>
                        <CardTitle>Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="table-responsive">
                        <table className="table w-full">
                            <tbody>
                                {upcomingAppointments.map((appt) => (
                                    <tr key={appt.id}>
                                        <td className="p-2">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={appt.image} data-ai-hint={appt.imageHint} />
                                                    <AvatarFallback>{appt.patient.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">#{appt.patientId}</p>
                                                    <p className="font-medium">{appt.patient}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <p className="font-medium">{appt.date}</p>
                                            <p className="text-xs text-muted-foreground">{appt.time}</p>
                                        </td>
                                        <td className="p-2">
                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">{appt.purpose}</div>
                                        </td>
                                        <td className="text-right p-2 space-x-2">
                                            <Button variant="outline" size="icon" className="h-8 w-8 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"><Check className="h-4 w-4" /></Button>
                                            <Button variant="outline" size="icon" className="h-8 w-8 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Appointment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src="https://placehold.co/50x50.png" />
                                    <AvatarFallback>AM</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm text-muted-foreground">#Apt0001</p>
                                    <h4 className="font-bold">Adrian Marshall</h4>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">General Visit</p>
                                <h6 className="font-semibold">Today, 10:45 AM</h6>
                            </div>
                        </div>
                        <div className="border-t pt-4 flex items-center justify-between">
                             <h5 className="font-semibold flex items-center gap-2 text-primary"><Video className="w-5 h-5"/> Video Appointment</h5>
                             <div className="flex gap-2">
                                <Button variant="outline">Chat Now</Button>
                                <Button>Start Appointment</Button>
                             </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Recent Invoices</CardTitle>
                        <Button variant="link" asChild><Link href="/doctor/dashboard/invoices">View All</Link></Button>
                    </CardHeader>
                     <CardContent>
                        <div className="table-responsive">
                        <table className="table w-full">
                             <tbody>
                                {recentInvoices.map((invoice) => (
                                    <tr key={invoice.id}>
                                        <td className="p-2">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={invoice.image} data-ai-hint={invoice.imageHint} />
                                                    <AvatarFallback>{invoice.patient.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{invoice.patient}</p>
                                                    <p className="text-xs text-muted-foreground">#{invoice.patientId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <p className="text-xs text-muted-foreground">Amount</p>
                                            <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                                        </td>
                                        <td className="p-2">
                                            <p className="text-xs text-muted-foreground">Paid On</p>
                                            <p className="font-medium">{invoice.date}</p>
                                        </td>
                                         <td className="text-right p-2">
                                            <Button variant="outline" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Notifications</CardTitle>
                        <Button variant="link" asChild><Link href="#">View All</Link></Button>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {notifications.map((item) => {
                                const Icon = item.icon;
                                return(
                                <li key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
                                        <Icon className="w-4 h-4"/>
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <p className="text-muted-foreground">{item.message}</p>
                                        <p className="text-xs text-muted-foreground/70">{item.time}</p>
                                    </div>
                                </li>
                            )})}
                        </ul>
                    </CardContent>
                 </Card>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Clinics & Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 border rounded-lg">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src="https://placehold.co/40x40.png" />
                                        <AvatarFallback>SC</AvatarFallback>
                                    </Avatar>
                                    <h6 className="font-bold">Sofi’s Clinic</h6>
                                </div>
                                <span className="font-bold text-primary">$900</span>
                             </div>
                             <div className="mt-2 pt-2 border-t text-sm text-muted-foreground space-y-1">
                                <p>Tue : 07:00 AM - 09:00 PM</p>
                                <p>Wed : 07:00 AM - 09:00 PM</p>
                             </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src="https://placehold.co/40x40.png" />
                                        <AvatarFallback>FD</AvatarFallback>
                                    </Avatar>
                                    <h6 className="font-bold">The Family Dentistry Clinic</h6>
                                </div>
                                <span className="font-bold text-primary">$600</span>
                             </div>
                             <div className="mt-2 pt-2 border-t text-sm text-muted-foreground space-y-1">
                                <p>Sat : 07:00 AM - 09:00 PM</p>
                                <p>Tue : 07:00 AM - 09:00 PM</p>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
