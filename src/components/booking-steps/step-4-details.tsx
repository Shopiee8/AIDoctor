
"use client";

import { useBookingStore } from "@/store/booking-store";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Star, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";


const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email(),
  patient: z.string().min(1, 'Please select a patient'),
  symptoms: z.string().optional(),
});

export function Step4Details() {
    const { doctor, bookingDetails, setBookingDetails, nextStep, prevStep } = useBookingStore();
    const { user } = useAuth();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: bookingDetails.firstName || user?.displayName?.split(' ')[0] || '',
            lastName: bookingDetails.lastName || user?.displayName?.split(' ')[1] || '',
            phone: bookingDetails.phone || '',
            email: bookingDetails.email || user?.email || '',
            patient: bookingDetails.patient || 'self',
            symptoms: bookingDetails.symptoms || '',
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setBookingDetails(data);
        nextStep();
    }

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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="firstName" render={({ field }) => (
                                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="lastName" render={({ field }) => (
                                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} disabled /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="patient" render={({ field }) => (
                                <FormItem><FormLabel>Select Patient</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="self">Self</SelectItem>
                                            <SelectItem value="child">Child</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="symptoms" render={({ field }) => (
                                <FormItem><FormLabel>Symptoms (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <div className="md:col-span-2">
                                <Label>Attachment (Optional)</Label>
                                <Input type="file" />
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)}>
                    Select Payment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
