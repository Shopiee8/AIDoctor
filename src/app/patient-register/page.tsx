import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PatientRegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50 p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
            <div className="w-full max-w-4xl">
                 <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        <div className="p-6 sm:p-8 flex flex-col justify-center">
                            <div className="text-center mb-6">
                                <Link href="/" className="inline-block mb-4">
                                    <Stethoscope className="h-8 w-8 text-primary mx-auto" />
                                </Link>
                                <CardTitle className="text-2xl font-headline">Patient Registration</CardTitle>
                                <CardDescription>
                                    Already have an account? <Link href="/login" className="underline">Login</Link>
                                </CardDescription>
                            </div>
                           
                            <form action="/patient-register/step-1">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Alex Doe" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="mobile">Mobile Number</Label>
                                        <Input id="mobile" type="tel" placeholder="+1 234 567 890" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Create Password</Label>
                                        <Input id="password" type="password" required />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Signup & Continue
                                    </Button>
                                </div>
                            </form>
                        </div>
                         <div className="relative hidden md:block">
                            <Image 
                                src="https://placehold.co/600x800.png"
                                alt="Patient Register Banner"
                                width={600}
                                height={800}
                                className="object-cover w-full h-full"
                                data-ai-hint="friendly diverse patients"
                            />
                        </div>
                    </div>
                 </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
