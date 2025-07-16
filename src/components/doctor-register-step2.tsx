
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface Step2Props {
    onNext: () => void;
    onBack: () => void;
}

export function DoctorRegisterStep2({ onNext, onBack }: Step2Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold font-headline">Professional Details</h2>
                <p className="text-muted-foreground text-sm">Provide your professional credentials and specialization.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="medicalLicense">Medical License Number</Label>
                <Input id="medicalLicense" placeholder="GMC-1234567" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="specialty">Specialization</Label>
                 <Select>
                    <SelectTrigger id="specialty">
                        <SelectValue placeholder="Select your primary specialty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="general-practice">General Practice</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" type="number" placeholder="5" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="documents">Upload Documents</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Drag & drop your documents here, or click to browse.</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">Medical license, certifications, etc. (PDF, PNG, JPG)</p>
                    <Button variant="outline" className="mt-4">Browse Files</Button>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">Short Biography</Label>
                <Textarea id="bio" placeholder="Briefly describe your professional background and philosophy of care." className="min-h-[100px]" />
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={onNext}>Next Step</Button>
            </div>
        </div>
    );
}
