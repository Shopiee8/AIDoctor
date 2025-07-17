
"use client";

import { useBookingStore } from "@/store/booking-store";
import { CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle, Calendar, ArrowLeft } from "lucide-react";
import Image from "next/image";

export function Step6Confirmation() {
    const { doctor, appointmentDate, appointmentTime, clinic, appointmentType, resetBooking } = useBookingStore();

    return (
        <div className="p-6">
            <div className="flex flex-col items-center text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold font-headline mb-2">Booking Confirmed!</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Your appointment with <span className="font-semibold text-primary">{doctor.name}</span> has been successfully booked. Please be on time.
                </p>

                <div className="border rounded-lg p-6 w-full max-w-2xl text-left space-y-4 mb-6">
                     <div className="flex items-center gap-4 pb-4 border-b">
                        <Avatar className="w-16 h-16 border">
                            <AvatarImage src={doctor.image} />
                            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="text-lg font-bold">{doctor.name}</h4>
                            <p className="text-primary">{doctor.specialty}</p>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Booking Number</p>
                            <Badge variant="secondary">DCRA12565</Badge>
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
                                <p className="font-medium">{clinic}</p>
                            </div>
                        )}
                    </div>
                     <div className="flex items-center gap-4 pt-4 border-t">
                        <Image src="https://placehold.co/100x100.png" width={80} height={80} alt="QR Code" data-ai-hint="qr code"/>
                        <p className="text-xs text-muted-foreground">Scan this QR Code to download the details of your appointment.</p>
                     </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
                    <Button className="w-full"><Calendar className="mr-2 h-4 w-4" /> Add to Calendar</Button>
                    <Button variant="outline" className="w-full" onClick={resetBooking}><ArrowLeft className="mr-2 h-4 w-4" /> Start New Booking</Button>
                </div>
            </div>
        </div>
    );
}
