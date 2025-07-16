
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./ui/input";
import Link from "next/link";

interface Step3Props {
    onBack: () => void;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function DoctorRegisterStep3({ onBack }: Step3Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold font-headline">Availability & Finalization</h2>
                <p className="text-muted-foreground text-sm">Set your working hours and complete your registration.</p>
            </div>
             <div className="space-y-4 rounded-lg border p-4">
                 <h3 className="font-medium">Set Your Weekly Availability</h3>
                 {days.map(day => (
                     <div key={day} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-md hover:bg-accent">
                         <div className="flex items-center gap-3">
                             <Checkbox id={`check-${day}`} />
                             <Label htmlFor={`check-${day}`} className="w-24">{day}</Label>
                         </div>
                         <div className="flex items-center gap-2">
                             <Input type="time" defaultValue="09:00" />
                             <span>to</span>
                             <Input type="time" defaultValue="17:00" />
                         </div>
                     </div>
                 ))}
            </div>

            <div className="space-y-2">
                 <Label htmlFor="timezone">Timezone</Label>
                 <Select>
                    <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="gmt-5">Eastern Time (GMT-5)</SelectItem>
                        <SelectItem value="gmt-6">Central Time (GMT-6)</SelectItem>
                        <SelectItem value="gmt-7">Mountain Time (GMT-7)</SelectItem>
                        <SelectItem value="gmt-8">Pacific Time (GMT-8)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="flex items-start space-x-2 pt-4">
                <Checkbox id="terms" />
                <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Accept terms and conditions
                    </label>
                    <p className="text-sm text-muted-foreground">
                        You agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button asChild>
                    <Link href="/doctor/dashboard">Complete Registration</Link>
                </Button>
            </div>
        </div>
    );
}
