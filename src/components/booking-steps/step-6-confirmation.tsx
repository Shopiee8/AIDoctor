
"use client";

import { useBookingStore } from "@/store/booking-store";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle, Calendar, ArrowLeft, FileText, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Step6Confirmation() {
    const { doctor, appointmentDate, appointmentTime, clinic, appointmentType, resetBooking, closeBookingModal } = useBookingStore();

    return (
        <div className="p-6">
            <div className="flex flex-col items-center text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold font-headline mb-2">Appointment Booked Successfully!</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Your appointment with <span className="font-semibold text-primary">{doctor.name}</span> has been confirmed.
                    <br /> on{" "}
                    <strong>
                        {appointmentDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {appointmentTime}
                    </strong>
                </p>
                 <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                     <Button className="w-full" asChild>
                        <Link href="/dashboard/invoices"><FileText className="mr-2 h-4 w-4" /> View Invoice</Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={closeBookingModal}><Plus className="mr-2 h-4 w-4" /> Book Another Appointment</Button>
                </div>
                <div className="border rounded-lg p-6 w-full max-w-2xl text-left space-y-4 my-6">
                     <div className="flex items-center gap-4 pb-4 border-b">
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
                        <div className="space-y-2">
                             <p className="text-xs text-muted-foreground">Scan this QR Code to download the details of your appointment.</p>
                             <Button size="sm"><Calendar className="mr-2 h-4 w-4" /> Add to Calendar</Button>
                        </div>
                     </div>
                </div>

            </div>
        </div>
    );
}
