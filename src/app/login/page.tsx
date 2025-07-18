
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope } from "lucide-react";

export default function LoginPage() {
  const { signIn, googleSignIn, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await signIn(email, password);
       if (user) {
        toast({ title: 'Login Successful!', description: `Welcome back!` });

        // Role-based redirection
        if (email === 'admin@aidoctor.com') {
          localStorage.setItem('userRole', 'Admin');
          router.push('/admin/dashboard');
        } else if (email.endsWith('@aiprovider.com')) { // Example logic for AI provider
          localStorage.setItem('userRole', 'AI Provider');
          router.push('/ai-provider/dashboard');
        } else {
            // Check if the user is in the 'doctors' collection, otherwise default to Patient
            const role = localStorage.getItem('userRole') || 'Patient';
            if (role === 'Doctor') {
                router.push('/doctor/dashboard');
            } else {
                router.push('/dashboard');
            }
        }
      }
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await googleSignIn();
      // After Google sign-in, the AuthProvider's onAuthStateChanged will trigger
      // the redirect. You might need to handle role-based redirection there or here.
      toast({ title: 'Login Successful!', description: 'Welcome!' });
      // A simple default redirect, role logic would be more complex.
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Google Sign-In Failed', description: err.message, variant: 'destructive' });
    }
  };

  if (user) {
    // Optional: Redirect if user is already logged in
    // router.push('/dashboard'); 
    // return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <Stethoscope className="h-8 w-8 text-primary mx-auto" />
          </Link>
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
               {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
           <Button variant="outline" className="w-full mt-4" onClick={handleGoogleSignIn}>
            Login with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
