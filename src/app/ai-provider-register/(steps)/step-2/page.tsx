import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot } from "lucide-react";
import Link from "next/link";

export default function AiProviderRegisterStepTwo() {
    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <Link href="/" className="inline-block mb-4">
                    <Bot className="h-8 w-8 text-primary mx-auto" />
                </Link>

                <div className="flex justify-center gap-2 my-4">
                    <Link href="/ai-provider-register" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">1</Link>
                    <Link href="/ai-provider-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">2</Link>
                    <Link href="/ai-provider-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">3</Link>
                </div>

                <CardTitle className="text-2xl font-headline">Define Your AI Agent</CardTitle>
                <CardDescription>Configure the core identity and instructions for your agent.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action="/ai-provider-register/step-3">
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="grid gap-2">
                                <Label htmlFor="agent-name">Agent Name</Label>
                                <Input id="agent-name" placeholder='e.g., "Julia" or "CareBot"' required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="agent-specialty">Agent Specialty</Label>
                                <Input id="agent-specialty" placeholder="e.g., Post-Op Follow-Up" required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                             <Label htmlFor="system-prompt">System Prompt</Label>
                             <Textarea 
                                id="system-prompt"
                                placeholder="You are a friendly and empathetic AI assistant named Julia. Your goal is to conduct post-operative check-ins..."
                                className="min-h-[200px]"
                                required
                             />
                             <p className="text-xs text-muted-foreground">This is the core instruction that defines your AI's personality and purpose. Be as descriptive as possible.</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button type="submit" className="w-full">
                            Save Agent & Continue
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
