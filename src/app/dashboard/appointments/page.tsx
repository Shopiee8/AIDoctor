

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentCard } from '@/components/appointment-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Appointment } from '@/types';
import { Loader2 } from 'lucide-react';

export default function AppointmentsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const appointmentsQuery = query(collection(db, 'users', user.uid, 'appointments'), orderBy('dateTime', 'desc'));

        const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
            const fetchedAppointments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                dateTime: doc.data().dateTime.toDate(),
            } as Appointment));
            setAppointments(fetchedAppointments);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching appointments: ", error);
            toast({ title: "Error", description: "Could not fetch appointments.", variant: "destructive" });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, toast]);

    const cancelAppointment = async (appointmentId: string) => {
        if (!user) return;
        const appointmentRef = doc(db, 'users', user.uid, 'appointments', appointmentId);
        try {
            await updateDoc(appointmentRef, { status: 'Cancelled' });
            toast({ title: 'Appointment Cancelled', description: 'The appointment has been successfully cancelled.' });
        } catch (error) {
            console.error("Error cancelling appointment: ", error);
            toast({ title: 'Error', description: 'Failed to cancel the appointment.', variant: 'destructive' });
        }
    };

    const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');
    const completedAppointments = appointments.filter(a => a.status === 'Completed');
    const cancelledAppointments = appointments.filter(a => a.status === 'Cancelled');

    const renderAppointmentList = (list: Appointment[], emptyMessage: string) => {
        if (isLoading) {
            return (
                 <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )
        }
        if (list.length === 0) {
            return <p className="text-center text-muted-foreground py-10">{emptyMessage}</p>;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {list.map(appt => (
                    <AppointmentCard key={appt.id} appointment={appt} onCancel={cancelAppointment} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Appointments</h1>
                <p className="text-muted-foreground">View and manage your upcoming and past appointments.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
                            <TabsTrigger value="completed">Completed ({completedAppointments.length})</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelled ({cancelledAppointments.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upcoming" className="mt-4">
                            <CardDescription>Here are your scheduled appointments. You can attend, reschedule or cancel.</CardDescription>
                            <CardContent className="p-0 pt-4">
                                {renderAppointmentList(upcomingAppointments, 'You have no upcoming appointments.')}
                            </CardContent>
                        </TabsContent>
                        <TabsContent value="completed" className="mt-4">
                            <CardDescription>A record of your past consultations.</CardDescription>
                            <CardContent className="p-0 pt-4">
                                {renderAppointmentList(completedAppointments, 'You have no completed appointments.')}
                            </CardContent>
                        </TabsContent>
                        <TabsContent value="cancelled" className="mt-4">
                            <CardDescription>A history of your cancelled appointments.</CardDescription>
                            <CardContent className="p-0 pt-4">
                                {renderAppointmentList(cancelledAppointments, 'You have no cancelled appointments.')}
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </CardHeader>
            </Card>
        </div>
    );
}
