
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { Appointment } from '@/types';
import { format } from 'date-fns';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Video, Mic, MessageSquare, Hospital, Calendar, Clock, Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppointmentDetailProps {
    appointmentId: string;
}

const appointmentTypeIcons = {
    Video: Video,
    Audio: Mic,
    Chat: MessageSquare,
    'In-person': Hospital,
};

const statusConfig = {
    Upcoming: { color: 'bg-yellow-100 text-yellow-800', text: 'Upcoming' },
    Completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
    Cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
};


export function AppointmentDetail({ appointmentId }: AppointmentDetailProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || !appointmentId) {
            setIsLoading(false);
            return;
        }

        const appointmentRef = doc(db, 'users', user.uid, 'appointments', appointmentId);

        const unsubscribe = onSnapshot(appointmentRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setAppointment({
                    id: snapshot.id,
                    ...data,
                    dateTime: data.dateTime.toDate(),
                } as Appointment);
            } else {
                toast({ title: 'Not Found', description: 'This appointment could not be found.', variant: 'destructive' });
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching appointment: ", error);
            toast({ title: "Error", description: "Could not fetch appointment details.", variant: "destructive" });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, appointmentId, toast]);

    if (isLoading) {
        return <AppointmentDetailSkeleton />;
    }

    if (!appointment) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">Appointment not found.</p>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/dashboard/appointments">Go back to appointments</Link>
                </Button>
            </div>
        )
    }

    const TypeIcon = appointmentTypeIcons[appointment.appointmentType];
    const statusInfo = statusConfig[appointment.status];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/appointments"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-bold font-headline">Appointment Details</h1>
            </div>
            
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 border">
                                    <AvatarImage src={appointment.doctorImage} />
                                    <AvatarFallback>{appointment.doctorName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-bold">{appointment.doctorName}</h2>
                                    <p className="text-muted-foreground">{appointment.doctorSpecialty}</p>
                                    <div className="text-sm text-muted-foreground mt-2 space-y-1">
                                         <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> doctor@example.com</p>
                                         <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 123 456 7890</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                                <Badge className={`text-sm px-3 py-1 ${statusInfo.color}`}>{statusInfo.text}</Badge>
                                <div className="text-lg font-bold text-primary">
                                    $200.00
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr />

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Appointment Date</p>
                                <p className="font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{format(appointment.dateTime, 'eeee, MMMM d, yyyy')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Appointment Time</p>
                                <p className="font-medium flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{format(appointment.dateTime, 'p')}</p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-muted-foreground">Appointment Type</p>
                                <p className="font-medium flex items-center gap-2"><TypeIcon className="h-4 w-4 text-primary" />{appointment.appointmentType} Consultation</p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-muted-foreground">Visit Type</p>
                                <p className="font-medium">{appointment.visitType}</p>
                            </div>
                            {appointment.clinicName && (
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Clinic</p>
                                    <p className="font-medium flex items-center gap-2"><Hospital className="h-4 w-4 text-primary" />{appointment.clinicName}</p>
                                </div>
                            )}
                             {appointment.clinicLocation && (
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Location</p>
                                    <p className="font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{appointment.clinicLocation}</p>
                                </div>
                            )}
                             <div className="space-y-1">
                                <p className="text-muted-foreground">Patient</p>
                                <p className="font-medium">{user?.displayName || 'Self'}</p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-muted-foreground">Appointment ID</p>
                                <p className="font-medium text-primary">#{appointment.id.slice(0, 8)}</p>
                            </div>
                        </div>
                        
                         {/* Action Buttons */}
                        {appointment.status === 'Upcoming' && (
                             <>
                                <hr />
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button className="w-full sm:w-auto"><Video className="mr-2 h-4 w-4"/> Start Session</Button>
                                    <Button variant="outline" className="w-full sm:w-auto">Reschedule Appointment</Button>
                                    <Button variant="destructive" className="w-full sm:w-auto">Cancel Appointment</Button>
                                </div>
                            </>
                        )}
                        {appointment.status === 'Cancelled' && (
                             <>
                                <hr />
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h4 className="font-semibold text-red-800">Cancellation Reason</h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        I have an urgent surgery, so I am cancelling the appointment. You can reschedule for next week.
                                    </p>
                                     <p className="text-xs text-red-600 mt-2">Cancelled By Doctor on {format(new Date(), 'dd MMM yyyy')}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                    <Button className="w-full sm:w-auto">Book Again</Button>
                                    <Button variant="outline" className="w-full sm:w-auto">Choose Another Doctor</Button>
                                </div>
                            </>
                        )}
                        {appointment.status === 'Completed' && (
                             <>
                                <hr />
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button className="w-full sm:w-auto">Book Again</Button>
                                    <Button variant="outline" className="w-full sm:w-auto">Leave a Review</Button>
                                    <Button variant="outline" className="w-full sm:w-auto">View Prescription</Button>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


function AppointmentDetailSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-8 w-64" />
            </div>
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-16 h-16 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-4 w-60" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-24" />
                        </div>
                        <hr />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-5 w-40" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-5 w-32" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-5 w-36" /></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
