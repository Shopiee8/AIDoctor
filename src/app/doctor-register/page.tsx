import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DoctorRegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50 p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
            <div className="w-full max-w-4xl">
                 <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        <div className="relative hidden md:block">
                            <Image 
                                src="https://placehold.co/600x800.png"
                                alt="Doctor Register Banner"
                                width={600}
                                height={800}
                                className="object-cover w-full h-full"
                                data-ai-hint="doctor smiling"
                            />
                        </div>
                        <div className="p-6 sm:p-8 flex flex-col justify-center">
                            <div className="text-center mb-6">
                                <Link href="/" className="inline-block mb-4">
                                    <Stethoscope className="h-8 w-8 text-primary mx-auto" />
                                </Link>
                                <CardTitle className="text-2xl font-headline">Doctor Registration</CardTitle>
                                <CardDescription>
                                    Not a Doctor? <Link href="/register" className="underline">Sign up as a Patient</Link>
                                </CardDescription>
                            </div>
                           
                            <form action="/doctor-register/step-1">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Dr. John Doe" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="mobile">Mobile Number</Label>
                                        <Input id="mobile" type="tel" placeholder="+1 234 567 890" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Create Password</Label>
                                        <Input id="password" type="password" required />
                                    </div>
                                    <div className="text-right">
                                        <Link href="/login" className="text-sm underline">
                                          Already have an account?
                                        </Link>
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Signup
                                    </Button>
                                    <div className="flex items-center my-2">
                                        <div className="flex-grow border-t border-muted"></div>
                                        <span className="mx-4 text-xs uppercase text-muted-foreground">or</span>
                                        <div className="flex-grow border-t border-muted"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                         <Button variant="outline" className="w-full" asChild>
                                            <a href="#">
                                                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                                                Facebook
                                            </a>
                                        </Button>
                                         <Button variant="outline" className="w-full" asChild>
                                            <a href="#">
                                                 <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.76,4.73 16.04,5.7 17.22,6.73L19.33,4.5C17.22,2.73 14.91,1.7 12.19,1.7C6.42,1.7 1.95,6.58 1.95,12C1.95,17.42 6.42,22.3 12.19,22.3C17.6,22.3 21.54,18.5 21.54,12.21C21.54,11.64 21.48,11.36 21.35,11.1Z" /></svg>
                                                 Google
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                 </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
