
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stethoscope } from "lucide-react";
import Link from "next/link";

export default function PatientRegisterStepFive() {
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
                    <Link href="/patient-register/step-5" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">5</Link>
                </div>

                <CardTitle className="text-2xl font-headline">Your Location</CardTitle>
            </CardHeader>
            <CardContent>
                <form action="/dashboard">
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="city">Select City</Label>
                            <Select>
                                <SelectTrigger id="city">
                                    <SelectValue placeholder="Select Your City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ny">New York</SelectItem>
                                    <SelectItem value="la">Los Angeles</SelectItem>
                                    <SelectItem value="chicago">Chicago</SelectItem>
                                    <SelectItem value="houston">Houston</SelectItem>
                                    <SelectItem value="miami">Miami</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="state">Select State</Label>
                             <Select>
                                <SelectTrigger id="state">
                                    <SelectValue placeholder="Select Your State" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ny">New York</SelectItem>
                                    <SelectItem value="ca">California</SelectItem>
                                    <SelectItem value="il">Illinois</SelectItem>
                                    <SelectItem value="tx">Texas</SelectItem>
                                    <SelectItem value="fl">Florida</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button type="submit" className="w-full">
                            Complete Registration
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
