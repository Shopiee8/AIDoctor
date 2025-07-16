
'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegistrationStore } from '@/store/registration-store';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Stethoscope } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
    gender: z.enum(['male', 'female']),
    weight: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    age: z.coerce.number().min(1, 'Age is required'),
    bloodType: z.string().optional(),
    allergies: z.string().optional(),
    hasPreExistingConditions: z.boolean().default(false),
    isTakingMedication: z.boolean().default(false),
    isPregnant: z.boolean().default(false),
});

export default function PatientRegisterStepTwo() {
    const router = useRouter();
    const { personalDetails, setPersonalDetails } = useRegistrationStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...personalDetails,
            weight: personalDetails.weight || undefined,
            height: personalDetails.height || undefined,
            age: personalDetails.age || undefined,
            bloodType: personalDetails.bloodType || '',
            allergies: personalDetails.allergies || '',
        },
    });
    
    const gender = form.watch('gender');

    function onSubmit(data: z.infer<typeof formSchema>) {
        setPersonalDetails(data);
        router.push('/patient-register/step-3');
    }

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <Link href="/" className="inline-block mb-4">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto" />
                </Link>
                <div className="flex justify-center gap-2 my-4">
                    <Link href="/patient-register/step-1" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">1</Link>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">2</div>
                    <Link href="/patient-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">3</Link>
                    <Link href="/patient-register/step-4" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">4</Link>
                    <Link href="/patient-register/step-5" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">5</Link>
                </div>
                <CardTitle className="text-2xl font-headline">Personal Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Your Gender</FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4 mt-2">
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="male" id="male" className="peer sr-only" />
                                                </FormControl>
                                                <Label htmlFor="male" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                    <Image src="https://placehold.co/40x40.png" data-ai-hint="male symbol" alt="Male" width={40} height={40}/>
                                                    Male
                                                </Label>
                                            </FormItem>
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="female" id="female" className="peer sr-only" />
                                                </FormControl>
                                                <Label htmlFor="female" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                    <Image src="https://placehold.co/40x40.png" data-ai-hint="female symbol" alt="Female" width={40} height={40}/>
                                                    Female
                                                </Label>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="weight" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Weight (kg)</FormLabel>
                                    <FormControl><Input type="number" placeholder="70" {...field} value={field.value ?? ''} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="height" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Height (cm)</FormLabel>
                                    <FormControl><Input type="number" placeholder="175" {...field} value={field.value ?? ''} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="age" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Age</FormLabel>
                                    <FormControl><Input type="number" placeholder="35" {...field} value={field.value ?? ''} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="bloodType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Blood Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="A+">A+</SelectItem>
                                            <SelectItem value="A-">A-</SelectItem>
                                            <SelectItem value="B+">B+</SelectItem>
                                            <SelectItem value="B-">B-</SelectItem>
                                            <SelectItem value="AB+">AB+</SelectItem>
                                            <SelectItem value="AB-">AB-</SelectItem>
                                            <SelectItem value="O+">O+</SelectItem>
                                            <SelectItem value="O-">O-</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>

                         <FormField control={form.control} name="allergies" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Allergies (if any)</FormLabel>
                                <FormControl><Input placeholder="e.g., Peanuts, Penicillin" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        
                        <div className="space-y-2">
                             <FormField control={form.control} name="hasPreExistingConditions" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <FormLabel>Do you have any pre-existing conditions?</FormLabel>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="isTakingMedication" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <FormLabel>Are you currently taking any medication?</FormLabel>
                                </FormItem>
                            )}/>
                             {gender === 'female' && (
                                <FormField control={form.control} name="isPregnant" render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        <FormLabel>Are you pregnant?</FormLabel>
                                    </FormItem>
                                )}/>
                             )}
                        </div>
                        <Button type="submit" className="w-full">Continue</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
