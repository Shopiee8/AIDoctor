
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Stethoscope } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterStepTwo() {
    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                 <Link href="/" className="inline-block mb-4">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto" />
                </Link>

                <div className="flex justify-center gap-2 my-4">
                    <Link href="/doctor-register/step-1" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">1</Link>
                    <Link href="/doctor-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">2</Link>
                    <Link href="/doctor-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">3</Link>
                </div>

                <CardTitle className="text-2xl font-headline">Personal Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form action="/doctor-register/step-3">
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
                        
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="address">Registered Clinic Address</Label>
                                <Input id="address" placeholder="123 Health St." required />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="address2">Address 2</Label>
                                <Input id="address2" placeholder="Suite 100" />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="zipcode">Pincode / Zipcode</Label>
                                <Input id="zipcode" placeholder="12345" required />
                            </div>
                        </div>

                        <div>
                            <Label>Certifications and Documents</Label>
                            <div className="grid md:grid-cols-2 gap-4 mt-2">
                                 <div className="relative border-2 border-dashed border-muted-foreground rounded-lg p-4 text-center">
                                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">Upload Right to Sell Certificate</p>
                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                                <div className="relative border-2 border-dashed border-muted-foreground rounded-lg p-4 text-center">
                                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">Upload Photo ID</p>
                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
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

