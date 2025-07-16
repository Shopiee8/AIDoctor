import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AiProviderRegisterPage() {
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
                                alt="AI Provider Banner"
                                width={600}
                                height={800}
                                className="object-cover w-full h-full"
                                data-ai-hint="futuristic abstract"
                            />
                             <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                        </div>
                        <div className="p-6 sm:p-8 flex flex-col justify-center">
                            <div className="text-center mb-6">
                                <Link href="/" className="inline-block mb-4">
                                    <Bot className="h-10 w-10 text-primary mx-auto" />
                                </Link>
                                <CardTitle className="text-2xl font-headline">AI Provider Registration</CardTitle>
                                <CardDescription>
                                    Join our platform to deploy your AI agents.
                                </CardDescription>
                            </div>
                           
                            <form action="/ai-provider-register/step-2">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="provider-name">Provider or Company Name</Label>
                                        <Input id="provider-name" placeholder="InnovateHealth AI" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Technical Contact Email</Label>
                                        <Input id="email" type="email" placeholder="tech@example.com" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="website">Company Website (Optional)</Label>
                                        <Input id="website" type="url" placeholder="https://innovatehealth.ai" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Create Password</Label>
                                        <Input id="password" type="password" required />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Create Account & Define Agent
                                    </Button>
                                    <div className="mt-2 text-center text-sm">
                                      Already have an account?{" "}
                                        <Link href="/login" className="underline">
                                          Login
                                        </Link>
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
