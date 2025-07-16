import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AiProviderRegisterStepThree() {
    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <Link href="/" className="inline-block mb-4">
                    <Bot className="h-8 w-8 text-primary mx-auto" />
                </Link>
                
                <div className="flex justify-center gap-2 my-4">
                    <Link href="/ai-provider-register" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">1</Link>
                    <Link href="/ai-provider-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">2</Link>
                    <Link href="/ai-provider-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">3</Link>
                </div>

                <CardTitle className="text-2xl font-headline">Registration Complete</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardDescription className="mb-6">
                    Thank you for registering your AI agent. Your provider account has been created. You can now access your dashboard to manage your agents and view analytics.
                </CardDescription>
                
                <Button asChild className="w-full max-w-xs mx-auto">
                    <Link href="/ai-provider/dashboard">
                        Go to AI Provider Dashboard
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
