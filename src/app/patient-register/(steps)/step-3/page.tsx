
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useRegistrationStore } from '@/store/registration-store';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Stethoscope, Minus, Plus } from "lucide-react";
import Link from "next/link";

export default function PatientRegisterStepThree() {
    const router = useRouter();
    const { familyMembers, setFamilyMembers } = useRegistrationStore();
    const [childCount, setChildCount] = useState(familyMembers.childCount);

    const handleContinue = () => {
        setFamilyMembers({ ...familyMembers, childCount });
        router.push('/patient-register/step-4');
    };

    const handleIncrement = () => setChildCount(prevCount => prevCount + 1);
    const handleDecrement = () => setChildCount(prevCount => Math.max(0, prevCount - 1));

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <Link href="/" className="inline-block mb-4">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto" />
                </Link>

                <div className="flex justify-center gap-2 my-4">
                    <Link href="/patient-register/step-1" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">1</Link>
                    <Link href="/patient-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">2</Link>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">3</div>
                    <Link href="/patient-register/step-4" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">4</Link>
                    <Link href="/patient-register/step-5" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">5</Link>
                </div>

                <CardTitle className="text-2xl font-headline">Select Members</CardTitle>
                <CardDescription>Who do you want to cover in health insurance?</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-md border">
                        <Label htmlFor="self" className="text-base font-medium">Self</Label>
                        <Checkbox id="self" checked={familyMembers.self} onCheckedChange={(checked) => setFamilyMembers({ ...familyMembers, self: !!checked })} />
                    </div>
                     <div className="flex items-center justify-between p-3 rounded-md border">
                        <Label htmlFor="spouse" className="text-base font-medium">Spouse</Label>
                        <Checkbox id="spouse" checked={familyMembers.spouse} onCheckedChange={(checked) => setFamilyMembers({ ...familyMembers, spouse: !!checked })} />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-md border">
                        <Label htmlFor="child" className="text-base font-medium">Child</Label>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={handleDecrement} disabled={childCount === 0}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                type="text"
                                id="child"
                                value={childCount}
                                readOnly
                                className="w-12 h-8 text-center"
                            />
                            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={handleIncrement}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                     <div className="flex items-center justify-between p-3 rounded-md border">
                        <Label htmlFor="mother" className="text-base font-medium">Mother</Label>
                        <Checkbox id="mother" checked={familyMembers.mother} onCheckedChange={(checked) => setFamilyMembers({ ...familyMembers, mother: !!checked })} />
                    </div>
                     <div className="flex items-center justify-between p-3 rounded-md border">
                        <Label htmlFor="father" className="text-base font-medium">Father</Label>
                        <Checkbox id="father" checked={familyMembers.father} onCheckedChange={(checked) => setFamilyMembers({ ...familyMembers, father: !!checked })}/>
                    </div>
                </div>

                <div className="mt-8">
                    <Button onClick={handleContinue} className="w-full">
                        Continue
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
