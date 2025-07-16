
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegistrationStore } from '@/store/registration-store';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { useEffect } from 'react';

const formSchema = z.object({
    spouse_age: z.coerce.number().optional(),
    child_ages: z.array(z.coerce.number().optional()).optional(),
    father_age: z.coerce.number().optional(),
    mother_age: z.coerce.number().optional(),
});

export default function PatientRegisterStepFour() {
    const router = useRouter();
    const { familyMembers, familyDetails, setFamilyDetails } = useRegistrationStore();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            spouse_age: familyDetails.spouse_age ?? undefined,
            father_age: familyDetails.father_age ?? undefined,
            mother_age: familyDetails.mother_age ?? undefined,
            child_ages: familyDetails.child_ages || Array(familyMembers.childCount).fill(undefined),
        },
    });

    useEffect(() => {
        const initialChildAges = Array(familyMembers.childCount)
            .fill(undefined)
            .map((_, i) => familyDetails.child_ages?.[i] || undefined);
        form.setValue('child_ages', initialChildAges);
    }, [familyMembers.childCount, familyDetails.child_ages, form]);


    function onSubmit(data: z.infer<typeof formSchema>) {
        setFamilyDetails(data);
        router.push('/patient-register/step-5');
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
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">4</div>
                    <Link href="/patient-register/step-5" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">5</Link>
                </div>
                <CardTitle className="text-2xl font-headline">Family Member Details</CardTitle>
                <CardDescription>Add the age for each family member.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {familyMembers.spouse && (
                            <div className="p-4 border rounded-lg space-y-4">
                                <h4 className="font-semibold">Spouse</h4>
                                <FormField control={form.control} name="spouse_age" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Spouse's Age</FormLabel>
                                        <FormControl><Input type="number" placeholder="e.g., 34" {...field} value={field.value ?? ''} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        )}
                        
                        {Array.from({ length: familyMembers.childCount }).map((_, index) => (
                             <div key={index} className="p-4 border rounded-lg space-y-4">
                                <h4 className="font-semibold">Child {index + 1}</h4>
                                <FormField control={form.control} name={`child_ages.${index}` as const} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Child's Age</FormLabel>
                                        <FormControl><Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                             </div>
                        ))}

                        {familyMembers.father && (
                             <div className="p-4 border rounded-lg space-y-4">
                                <h4 className="font-semibold">Father</h4>
                                <FormField control={form.control} name="father_age" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Father's Age</FormLabel>
                                        <FormControl><Input type="number" placeholder="e.g., 65" {...field} value={field.value ?? ''} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        )}

                        {familyMembers.mother && (
                            <div className="p-4 border rounded-lg space-y-4">
                                <h4 className="font-semibold">Mother</h4>
                                <FormField control={form.control} name="mother_age" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mother's Age</FormLabel>
                                        <FormControl><Input type="number" placeholder="e.g., 62" {...field} value={field.value ?? ''} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        )}
                        
                        <Button type="submit" className="w-full">Continue</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
