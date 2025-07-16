import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function PatientRegisterStepOne() {
    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <Link href="/" className="inline-block mb-4">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto" />
                </Link>

                <div className="flex justify-center gap-2 my-4">
                    <Link href="/patient-register/step-1" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">1</Link>
                    <Link href="/patient-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">2</Link>
                    <Link href="/patient-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">3</Link>
                    <Link href="/patient-register/step-4" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">4</Link>
                    <Link href="/patient-register/step-5" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">5</Link>
                </div>

                <CardTitle className="text-2xl font-headline">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
                <form action="/patient-register/step-2">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
                            <Camera className="w-12 h-12 text-muted-foreground" />
                             <input type="file" id="profile_image" name="profile_image" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                        <p className="text-sm text-muted-foreground">Upload Profile Picture</p>
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
