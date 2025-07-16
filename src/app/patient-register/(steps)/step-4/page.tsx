
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope } from "lucide-react";
import Link from "next/link";

export default function PatientRegisterStepFour() {
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
                    <Link href="/patient-register/step-4" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">4</Link>
                    <Link href="/patient-register/step-5" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">5</Link>
                </div>

                <CardTitle className="text-2xl font-headline">Family Member Details</CardTitle>
                <CardDescription>Add the age and photo for each family member.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action="/patient-register/step-5">
                    <div className="space-y-6">
                        
                        <div className="p-4 border rounded-lg space-y-4">
                             <h4 className="font-semibold">Spouse</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="spouse_age">Spouse's Age</Label>
                                    <Input id="spouse_age" type="number" placeholder="e.g., 34" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="spouse_image">Spouse's Photo</Label>
                                    <Input id="spouse_image" type="file" />
                                </div>
                            </div>
                        </div>

                         <div className="p-4 border rounded-lg space-y-4">
                             <h4 className="font-semibold">Child 1</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="child1_age">Child's Age</Label>
                                    <Input id="child1_age" type="number" placeholder="e.g., 5" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="child1_image">Child's Photo</Label>
                                    <Input id="child1_image" type="file" />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg space-y-4">
                             <h4 className="font-semibold">Father</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="father_age">Father's Age</Label>
                                    <Input id="father_age" type="number" placeholder="e.g., 65" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="father_image">Father's Photo</Label>
                                    <Input id="father_image" type="file" />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg space-y-4">
                             <h4 className="font-semibold">Mother</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="mother_age">Mother's Age</Label>
                                    <Input id="mother_age" type="number" placeholder="e.g., 62" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="mother_image">Mother's Photo</Label>
                                    <Input id="mother_image" type="file" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button type="submit" className="w-full">
                            Continue
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
