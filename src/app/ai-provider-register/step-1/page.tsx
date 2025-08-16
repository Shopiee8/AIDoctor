'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";

export default function AiProviderRegisterPage() {
    const { signUp } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Sign up the user - the signUp function handles user creation and document setup
            await signUp(email, password, 'AI Provider', {
                displayName: email.split('@')[0]
            });
            
            // The signUp function will have created the user and set up the necessary documents
            // Now we just need to redirect to step 2
            router.push('/ai-provider-register/step-2');
        } catch (err) {
            console.error('Error during signup:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during signup');
            toast({
                title: "Error",
                description: error || "Failed to create account. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <Link href="/" className="inline-block mb-4">
                    <Bot className="h-8 w-8 text-primary mx-auto" />
                </Link>

                <div className="flex justify-center gap-2 my-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">1</div>
                    <Link href="/ai-provider-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold dark:bg-gray-700 dark:text-gray-400">2</Link>
                    <Link href="/ai-provider-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold dark:bg-gray-700 dark:text-gray-400">3</Link>
                </div>

                <CardTitle className="text-2xl font-headline">Create Your AI Provider Account</CardTitle>
                <CardDescription>
                    Join our platform to deploy your AI agents.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="name@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="dark:bg-card dark:border-gray-700 dark:text-foreground"
                                required 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="dark:bg-card dark:border-gray-700 dark:text-foreground"
                                required 
                                minLength={6}
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="underline">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
