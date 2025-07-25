
'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Video, Mic, MessageSquare, Hospital, Calendar, Clock, Eye, XCircle, CheckCircle, Plus } from 'lucide-react';
import type { Appointment } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface AppointmentCardProps {
    appointment: Appointment;
    onCancel: (appointmentId: string) => void;
}

const appointmentTypeIcons = {
    Video: Video,
    Audio: Mic,
    Chat: MessageSquare,
    'In-person': Hospital,
};

const statusConfig = {
    Upcoming: { color: 'bg-yellow-400', icon: Clock },
    Completed: { color: 'bg-green-500', icon: CheckCircle },
    Cancelled: { color: 'bg-red-500', icon: XCircle },
    Accepted: { color: 'bg-green-500', icon: CheckCircle }, // Added for doctor view
};

export function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
    // Fallback to Hospital icon if type is unknown
    const TypeIcon = appointmentTypeIcons[appointment.appointmentType] || Hospital;
    const statusInfo = statusConfig[appointment.status] || statusConfig['Upcoming'];

    return (
        <div className="block border rounded-lg p-4 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-primary transition-all group">
            <Link href={`/dashboard/appointments/${appointment.id}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={appointment.doctorImage} alt={appointment.doctorName} />
                            <AvatarFallback>{appointment.doctorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-bold group-hover:text-primary">{appointment.doctorName}</h4>
                            <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
                        </div>
                    </div>
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full text-white ${statusInfo.color}`}>
                        <statusInfo.icon className="h-5 w-5" />
                    </div>
                </div>
            
                <div className="border-t border-b py-3 text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-primary" />
                        <span>{appointment.appointmentType} Consultation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{format(appointment.dateTime, 'eeee, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{format(appointment.dateTime, 'p')}</span>
                    </div>
                </div>
            </Link>

            {appointment.status === 'Upcoming' && (
                <div className="flex items-center justify-between gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full" onClick={(e) => e.stopPropagation()}>
                                <XCircle className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to cancel this appointment? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>No, keep it</AlertDialogCancel>
                                <AlertDialogAction onClick={(e) => { e.stopPropagation(); onCancel(appointment.id); }}>
                                    Yes, cancel
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button size="sm" className="w-full">
                        <Video className="w-4 h-4 mr-2" /> Attend
                    </Button>
                </div>
            )}

             {appointment.status !== 'Upcoming' && (
                <div className="flex items-center justify-between gap-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/dashboard/appointments/${appointment.id}`}><Eye className="w-4 h-4 mr-2" /> View Details</Link>
                    </Button>
                    {(appointment.status === 'Completed' || appointment.status === 'Cancelled') && (
                         <Button size="sm" className="w-full">
                            <Plus className="w-4 h-4 mr-2" /> Book Again
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
