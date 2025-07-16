
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegistrationStore } from '@/store/registration-store';
import { useAuth } from '@/hooks/use-auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Stethoscope, Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
});

// Helper function to remove undefined properties from an object
function cleanUndefined(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(v => cleanUndefined(v));
    }
    if (typeof obj !== 'object') {
        return obj;
    }

    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            const cleanedValue = cleanUndefined(value);
            if(cleanedValue !== undefined) {
                 acc[key] = cleanedValue;
            }
        }
        return acc;
    }, {} as any);
}

export default function PatientRegisterStepFive() {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const { personalDetails, familyMembers, familyDetails, location, setLocation, clearStore } = useRegistrationStore();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: location,
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLocation(data);
        setIsLoading(true);

        if (!user) {
            toast({ title: 'Error', description: 'You must be logged in to complete registration.', variant: 'destructive' });
            setIsLoading(false);
            return;
        }

        try {
            const registrationData = {
                personalDetails,
                familyMembers,
                familyDetails,
                location: data,
                userId: user.uid,
                email: user.email,
                createdAt: new Date(),
            };

            const cleanedData = cleanUndefined(registrationData);
            
            await setDoc(doc(db, "users", user.uid), cleanedData, { merge: true });
            
            toast({ title: 'Registration Complete!', description: 'Your profile has been created successfully.' });
            clearStore();
            router.push('/dashboard');
        } catch (error) {
            console.error("Failed to save registration data:", error);
            toast({ title: 'Error', description: 'Failed to save your information. Please try again.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <Link href="/" className="inline-block mb-4">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto" />
                </Link>
                <div className="flex justify-center gap-2 my-4">
                    <Link href="/patient-register/step-1" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">1</Link>
                    <Link href="/patient-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">2</Link>
                    <Link href="/patient-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">3</Link>
                    <Link href="/patient-register/step-4" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">4</Link>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">5</div>
                </div>
                <CardTitle className="text-2xl font-headline">Your Location</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select City</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Your City" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="ny">New York</SelectItem>
                                        <SelectItem value="la">Los Angeles</SelectItem>
                                        <SelectItem value="chicago">Chicago</SelectItem>
                                        <SelectItem value="houston">Houston</SelectItem>
                                        <SelectItem value="miami">Miami</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="state" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select State</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Your State" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="ny">New York</SelectItem>
                                        <SelectItem value="ca">California</SelectItem>
                                        <SelectItem value="il">Illinois</SelectItem>
                                        <SelectItem value="tx">Texas</SelectItem>
                                        <SelectItem value="fl">Florida</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isLoading ? 'Saving...' : 'Complete Registration'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
