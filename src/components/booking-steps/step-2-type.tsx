
"use client";

import { useBookingStore } from "@/store/booking-store";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Star, MapPin, ArrowRight, ArrowLeft, Hospital, Video, Mic, MessageSquare, Home } from "lucide-react";
import Image from "next/image";

const appointmentTypes = [
    { id: "clinic", name: "Clinic", icon: Hospital },
    { id: "video", name: "Video Call", icon: Video },
    { id: "audio", name: "Audio Call", icon: Mic },
    { id: "chat", name: "Chat", icon: MessageSquare },
    { id: "home", name: "Home Visit", icon: Home },
];

const clinics = [
    { id: "c1", name: "AllCare Family Medicine", location: "3343 Private Lane, Valdosta", distance: "500 Meters" },
    { id: "c2", name: "Vitalplus Clinic", location: "4223 Pleasant Hill Road, Miami, FL 33169", distance: "12 KM" },
    { id: "c3", name: "Wellness Path Chiropractic", location: "418 Patton Lane, Garner, NC 27529", distance: "16 KM" },
];

export function Step2Type() {
    const { doctor, appointmentType, clinic, setAppointmentType, setClinic, nextStep, prevStep } = useBookingStore();

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="bg-muted/50 rounded-t-lg">
                <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24 border-4 border-background">
                        <AvatarImage src={doctor.image} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="text-xl font-bold flex items-center gap-2">{doctor.name} <Badge variant="secondary"><Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" />{doctor.rating}</Badge></h4>
                        <p className="text-primary font-semibold">{doctor.specialty}</p>
                        <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" /> {doctor.location}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div>
                        <h6 className="font-semibold mb-3">Select Appointment Type</h6>
                        <RadioGroup value={appointmentType} onValueChange={setAppointmentType} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {appointmentTypes.map(type => (
                                <div key={type.id}>
                                    <RadioGroupItem value={type.id} id={type.id} className="sr-only peer" />
                                    <Label htmlFor={type.id} className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer h-24 hover:bg-accent hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors">
                                        <type.icon className="w-8 h-8 mb-2 text-primary" />
                                        <span className="text-sm font-medium">{type.name}</span>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    {appointmentType === 'clinic' && (
                        <div>
                             <h6 className="font-semibold mb-3">Select Clinic</h6>
                             <RadioGroup value={clinic} onValueChange={setClinic} className="space-y-3">
                                {clinics.map(c => (
                                    <div key={c.id}>
                                        <RadioGroupItem value={c.id} id={c.id} className="sr-only peer" />
                                        <Label htmlFor={c.id} className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-accent hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors">
                                            <Image src="https://placehold.co/40x40.png" width={40} height={40} alt="clinic" className="rounded-full" data-ai-hint="building modern" />
                                            <div>
                                                <p className="font-semibold">{c.name}</p>
                                                <p className="text-xs text-muted-foreground">{c.location} - {c.distance}</p>
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                             </RadioGroup>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={nextStep} disabled={appointmentType === 'clinic' && !clinic}>
                    Select Date & Time <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
