
"use client";

import { useBookingStore } from "@/store/booking-store";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Star, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const morningSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
const afternoonSlots = ["12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM"];
const eveningSlots = ["03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"];

export function Step3DateTime() {
    const { doctor, appointmentDate, setAppointmentDate, appointmentTime, setAppointmentTime, nextStep, prevStep } = useBookingStore();

    const TimeSlotGroup = ({ title, slots }: { title: string, slots: string[] }) => (
        <div>
            <h6 className="text-sm font-semibold mb-2">{title}</h6>
            <div className="flex flex-wrap gap-2">
                {slots.map(slot => (
                    <Button
                        key={slot}
                        variant={appointmentTime === slot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAppointmentTime(slot)}
                        className={cn("text-xs h-8", appointmentTime === slot && "bg-primary text-primary-foreground")}
                    >
                        {slot}
                    </Button>
                ))}
            </div>
        </div>
    );

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
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <Calendar
                            mode="single"
                            selected={appointmentDate}
                            onSelect={setAppointmentDate}
                            className="rounded-md border p-0"
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                        />
                    </div>
                    <div className="space-y-4">
                        <TimeSlotGroup title="Morning" slots={morningSlots} />
                        <TimeSlotGroup title="Afternoon" slots={afternoonSlots} />
                        <TimeSlotGroup title="Evening" slots={eveningSlots} />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={nextStep} disabled={!appointmentDate || !appointmentTime}>
                    Add Basic Information <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
