
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Stethoscope } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PatientRegisterStepTwo() {
    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                 <Link href="/" className="inline-block mb-4">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto" />
                </Link>

                <div className="flex justify-center gap-2 my-4">
                    <Link href="/patient-register/step-1" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">1</Link>
                    <Link href="/patient-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">2</Link>
                    <Link href="/patient-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">3</Link>
                    <Link href="/patient-register/step-4" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">4</Link>
                    <Link href="/patient-register/step-5" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">5</Link>
                </div>

                <CardTitle className="text-2xl font-headline">Personal Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form action="/patient-register/step-3">
                    <div className="space-y-6">
                        <div>
                            <Label>Select Your Gender</Label>
                            <RadioGroup defaultValue="male" className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <RadioGroupItem value="male" id="male" className="peer sr-only" />
                                    <Label
                                        htmlFor="male"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                    >
                                        <Image src="https://placehold.co/40x40.png" data-ai-hint="male symbol" alt="Male" width={40} height={40}/>
                                        Male
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="female" id="female" className="peer sr-only" />
                                    <Label
                                        htmlFor="female"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                    >
                                        <Image src="https://placehold.co/40x40.png" data-ai-hint="female symbol" alt="Female" width={40} height={40}/>
                                        Female
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="weight">Your Weight (kg)</Label>
                                <Input id="weight" type="number" placeholder="70" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="height">Your Height (cm)</Label>
                                <Input id="height" type="number" placeholder="175" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="age">Your Age</Label>
                                <Input id="age" type="number" placeholder="35" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="blood_group">Blood Type</Label>
                                <Select>
                                    <SelectTrigger id="blood_group">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
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
                            </div>
                        </div>

                         <div className="grid gap-2">
                            <Label htmlFor="allergies">Allergies (if any)</Label>
                            <Input id="allergies" placeholder="e.g., Peanuts, Penicillin" />
                        </div>
                        
                        <div className="space-y-2">
                             <div className="flex items-center space-x-2">
                                <Checkbox id="conditions" />
                                <label htmlFor="conditions" className="text-sm font-medium leading-none">Do you have any pre-existing conditions?</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="medication" />
                                <label htmlFor="medication" className="text-sm font-medium leading-none">Are you currently taking any medication?</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="pregnant" />
                                <label htmlFor="pregnant" className="text-sm font-medium leading-none">Are you pregnant?</label>
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

