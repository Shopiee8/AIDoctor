
"use client";

import { useBookingStore } from "@/store/booking-store";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle, Calendar, ArrowLeft, FileText, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, writeBatch } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export function Step6Confirmation() {
    const { doctor, appointmentDate, appointmentTime, clinic, appointmentType, bookingDetails, closeBookingModal } = useBookingStore();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isBookingComplete, setIsBookingComplete] = useState(false);
    const [appointmentId, setAppointmentId] = useState<string | null>(null);
    
    // useRef to prevent multiple booking attempts
    const hasBooked = useRef(false);

    useEffect(() => {
        const createAppointment = async () => {
            if (!user || !doctor || !appointmentDate || !appointmentTime) {
                toast({ title: "Error", description: "Missing booking information.", variant: "destructive" });
                setIsLoading(false);
                return;
            }

            if (hasBooked.current) return;
            hasBooked.current = true;

            try {
                const newAppointment = {
                    patientId: user.uid,
                    patientName: user.displayName || `${bookingDetails.firstName} ${bookingDetails.lastName}`,
                    patientImage: user.photoURL,
                    doctorId: doctor.id,
                    doctorName: doctor.name,
                    doctorSpecialty: doctor.specialty,
                    doctorImage: doctor.image,
                    dateTime: new Date(`${appointmentDate.toDateString()} ${appointmentTime}`),
                    status: 'Upcoming' as const,
                    visitType: 'Consultation', // Example value
                    purpose: bookingDetails.symptoms || 'Consultation',
                    appointmentType: appointmentType as 'Video' | 'Audio' | 'Chat' | 'In-person',
                    clinicName: clinic ? (doctor.clinics?.find((c: any) => c.id === clinic)?.name || '') : '',
                    clinicLocation: clinic ? (doctor.clinics?.find((c: any) => c.id === clinic)?.location || '') : '',
                    amount: 200, // Example value
                    createdAt: serverTimestamp()
                };

                const batch = writeBatch(db);

                // Create a single document reference for both collections
                const newAppointmentRef = doc(collection(db, "users"));

                // Add to patient's appointments
                const patientApptRef = doc(db, "users", user.uid, "appointments", newAppointmentRef.id);
                batch.set(patientApptRef, newAppointment);

                // Add to doctor's appointments
                const doctorApptRef = doc(db, "doctors", doctor.id, "appointments", newAppointmentRef.id);
                batch.set(doctorApptRef, newAppointment);

                await batch.commit();

                setAppointmentId(patientApptRef.id);
                toast({ title: 'Appointment Booked!', description: 'Your appointment has been confirmed.' });
                setIsBookingComplete(true);

            } catch (error) {
                console.error("Error creating appointment:", error);
                toast({ title: "Booking Failed", description: "Could not book the appointment. Please try again.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };

        createAppointment();
    }, [user, doctor, appointmentDate, appointmentTime, clinic, appointmentType, bookingDetails, toast]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                <h3 className="text-2xl font-bold font-headline mb-2">Confirming your appointment...</h3>
                <p className="text-muted-foreground max-w-md mx-auto">Please wait while we finalize the details with {doctor?.name}.</p>
            </div>
        );
    }
    
    if (!isBookingComplete) {
         return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="text-2xl font-bold font-headline mb-2 text-destructive">Booking Failed</h3>
                <p className="text-muted-foreground max-w-md mx-auto">Something went wrong. Please try again.</p>
                 <Button onClick={closeBookingModal} className="mt-4">Close</Button>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full">
            <Card className="border-none shadow-none">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h3 className="text-2xl font-bold font-headline mb-2">Appointment Booked Successfully!</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            Your appointment with <span className="font-semibold text-primary">{doctor?.name}</span> has been confirmed
                            for{" "}
                            <strong>
                                {appointmentDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {appointmentTime}
                            </strong>
                        </p>
                        
                        <Card className="w-full max-w-2xl text-left space-y-4 my-6">
                            <CardHeader>
                                <div className="flex items-center gap-4 pb-4 border-b">
                                    <Avatar className="w-16 h-16 border">
                                        <AvatarImage src={doctor?.image} />
                                        <AvatarFallback>{doctor?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="text-lg font-bold">{doctor?.name}</h4>
                                        <p className="text-primary">{doctor?.specialty}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Booking Number</p>
                                        <Badge variant="secondary">{appointmentId?.slice(0, 8).toUpperCase()}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Appointment Type</p>
                                        <p className="font-medium capitalize">{appointmentType}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Date & Time</p>
                                        <p className="font-medium">{appointmentDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appointmentTime}</p>
                                    </div>
                                    {clinic && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Clinic</p>
                                            <p className="font-medium">{doctor?.clinics?.find((c:any) => c.id === clinic)?.name || 'N/A'}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 pt-4 border-t">
                                    <Image src="https://placehold.co/100x100.png" width={80} height={80} alt="QR Code" data-ai-hint="qr code"/>
                                    <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground">Scan this QR Code to download the details of your appointment.</p>
                                        <Button size="sm"><Calendar className="mr-2 h-4 w-4" /> Add to Calendar</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                            <Button className="w-full" asChild>
                                <Link href="/dashboard/invoices"><FileText className="mr-2 h-4 w-4" /> View Invoice</Link>
                            </Button>
                            <Button variant="outline" className="w-full" onClick={closeBookingModal}>
                                Start New Booking
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
