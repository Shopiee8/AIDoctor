
"use client";

import { useBookingStore } from "@/store/booking-store";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Star, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

const services = [
    { id: "s1", name: "Echocardiograms", price: 310 },
    { id: "s2", name: "Stress tests", price: 754 },
    { id: "s3", name: "Cardiac catheterization", price: 150 },
    { id: "s4", name: "Holter monitoring", price: 200 },
    { id: "s5", name: "Coronary angioplasty", price: 500 },
    { id: "s6", name: "Pacemaker implantation", price: 800 },
];

export function Step1Service() {
    const { doctor, services: selectedServices, setServices, nextStep, prevStep } = useBookingStore();

    const handleServiceToggle = (serviceId: string) => {
        const newServices = selectedServices.includes(serviceId)
            ? selectedServices.filter(id => id !== serviceId)
            : [...selectedServices, serviceId];
        setServices(newServices);
    };

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
                        <Label>Select Specialty</Label>
                        <Select defaultValue={doctor.specialty}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a specialty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cardiology">Cardiology</SelectItem>
                                <SelectItem value="Neurology">Neurology</SelectItem>
                                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <h6 className="font-semibold mb-2">Services</h6>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {services.map(service => (
                                <div key={service.id} className="relative">
                                    <Checkbox
                                        id={service.id}
                                        className="absolute top-3 left-3 h-5 w-5 peer"
                                        checked={selectedServices.includes(service.id)}
                                        onCheckedChange={() => handleServiceToggle(service.id)}
                                    />
                                    <Label
                                        htmlFor={service.id}
                                        className="block p-4 pl-10 border rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors"
                                    >
                                        <span className="font-semibold d-block mb-1">{service.name}</span>
                                        <span className="text-sm d-block text-muted-foreground">${service.price}</span>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={prevStep} disabled>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={nextStep}>
                    Select Appointment Type <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
