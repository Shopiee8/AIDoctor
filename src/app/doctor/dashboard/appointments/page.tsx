
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, XCircle, Clock, Video, MessageSquare, Phone, Calendar, List, LayoutGrid, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientImage?: string;
  dateTime: Date;
  purpose: string;
  visitType: string;
  appointmentType: 'Video' | 'Audio' | 'Chat' | 'In-person';
  amount: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Accepted';
}

const apptIcons = {
    Video: Video,
    Chat: MessageSquare,
    Audio: Phone,
    'In-person': Calendar
};

type ViewMode = 'list' | 'grid';

const AppointmentCard = ({ appt, onStatusChange }: { appt: Appointment; onStatusChange: (id: string, status: Appointment['status']) => void; }) => {
    const ApptIcon = apptIcons[appt.appointmentType];

    return (
        <div className="border rounded-lg p-4 space-y-4 shadow-sm">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={appt.patientImage} data-ai-hint="person portrait" />
                        <AvatarFallback>{appt.patientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-bold">{appt.patientName}</h4>
                        <Link href={`/doctor/dashboard/my-patients/${appt.patientId}`} className="text-xs text-primary hover:underline">View Profile</Link>
                    </div>
                </div>
                 <div className="flex flex-col items-end gap-1">
                    <Badge variant={
                        appt.status === 'Completed' ? 'default' :
                        appt.status === 'Upcoming' || appt.status === 'Accepted' ? 'secondary' : 'destructive'
                        } className="capitalize w-28 justify-center">
                        {appt.status === 'Completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                        {appt.status === 'Upcoming' && <Clock className="mr-1 h-3 w-3" />}
                        {appt.status === 'Accepted' && <CheckCircle className="mr-1 h-3 w-3 text-green-500" />}
                        {appt.status === 'Cancelled' && <XCircle className="mr-1 h-3 w-3" />}
                        {appt.status}
                    </Badge>
                 </div>
            </div>

            <div className="border-t border-b py-3 text-sm text-muted-foreground grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <p className="text-xs">Date & Time</p>
                    <p className="font-medium text-foreground">{format(appt.dateTime, 'dd MMM yyyy, p')}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs">Appointment Type</p>
                    <p className="font-medium text-foreground flex items-center gap-2"><ApptIcon className="w-4 h-4 text-primary"/>{appt.appointmentType}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs">Purpose</p>
                    <p className="font-medium text-foreground">{appt.purpose || 'Consultation'}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-xs">Paid Amount</p>
                    <p className="font-medium text-foreground">${appt.amount}</p>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                {appt.status === 'Upcoming' && <>
                    <Button variant="outline" size="sm" onClick={() => onStatusChange(appt.id, 'Cancelled')}>Cancel</Button>
                    <Button size="sm" onClick={() => onStatusChange(appt.id, 'Accepted')}>Accept</Button>
                </>}
                 {appt.status === 'Accepted' && <>
                    <Button variant="destructive" size="sm" onClick={() => onStatusChange(appt.id, 'Cancelled')}>Cancel</Button>
                    <Button size="sm"><Video className="mr-2 h-4 w-4"/> Start Session</Button>
                </>}
                 {appt.status === 'Completed' && <>
                    <Button variant="outline" size="sm">View Prescription</Button>
                    <Button size="sm">Add to patient record</Button>
                </>}
            </div>
        </div>
    )
};


const AppointmentsList = ({ data, viewMode, onStatusChange }: { data: Appointment[], viewMode: ViewMode, onStatusChange: (id: string, status: Appointment['status']) => void }) => {
    if (data.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No appointments in this category.</p>;
    }
    
    // Grid view is not implemented for this dynamic version yet.
    // It will fallback to list view for now.

    return (
        <div className="space-y-4">
            {data.map((appt) => (
                <AppointmentCard key={appt.id} appt={appt} onStatusChange={onStatusChange} />
            ))}
        </div>
    );
};

export default function AppointmentsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const q = query(collection(db, `doctors/${user.uid}/appointments`), orderBy('dateTime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedAppointments = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    dateTime: data.dateTime.toDate(),
                } as Appointment;
            });
            setAppointments(fetchedAppointments);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching appointments: ", error);
            toast({ title: "Error", description: "Failed to fetch appointments.", variant: "destructive" });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, toast]);

    const handleStatusChange = async (appointmentId: string, status: Appointment['status']) => {
        if (!user) return;
        
        try {
            const appointment = appointments.find(a => a.id === appointmentId);
            if (!appointment) return;
            
            const batch = writeBatch(db);
            
            // Update doctor's copy
            const doctorApptRef = doc(db, 'doctors', user.uid, 'appointments', appointmentId);
            batch.update(doctorApptRef, { status });

            // Update patient's copy
            const patientApptRef = doc(db, 'users', appointment.patientId, 'appointments', appointmentId);
            batch.update(patientApptRef, { status });

            await batch.commit();

            toast({ title: "Status Updated", description: `Appointment has been ${status.toLowerCase()}.` });
        } catch (error) {
            console.error("Error updating appointment status:", error);
            toast({ title: 'Error', description: 'Failed to update appointment status.', variant: 'destructive' });
        }
    };

    const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming' || a.status === 'Accepted');
    const completedAppointments = appointments.filter(a => a.status === 'Completed');
    const cancelledAppointments = appointments.filter(a => a.status === 'Cancelled');

    return (
        <div className="space-y-6">
           <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Appointments</h1>
                    <p className="text-muted-foreground">Manage your patient appointments.</p>
                </div>
                 <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}>
                        <List className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}>
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {isLoading ? (
                 <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <Tabs defaultValue="upcoming">
                    <TabsList>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upcoming">
                    <Card>
                        <CardContent className="p-4 md:p-6">
                            <AppointmentsList data={upcomingAppointments} viewMode={viewMode} onStatusChange={handleStatusChange} />
                        </CardContent>
                    </Card>
                    </TabsContent>
                    <TabsContent value="completed">
                    <Card>
                        <CardContent className="p-4 md:p-6">
                            <AppointmentsList data={completedAppointments} viewMode={viewMode} onStatusChange={handleStatusChange}/>
                        </CardContent>
                    </Card>
                    </TabsContent>
                    <TabsContent value="cancelled">
                    <Card>
                        <CardContent className="p-4 md:p-6">
                            <AppointmentsList data={cancelledAppointments} viewMode={viewMode} onStatusChange={handleStatusChange}/>
                        </CardContent>
                    </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
