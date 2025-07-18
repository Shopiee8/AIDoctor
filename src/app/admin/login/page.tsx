
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
import { Stethoscope, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // For this dedicated login, we can hardcode the check or use a more robust role system later
    if (email !== 'admin@aidoctor.com') {
        setError("This login is for administrators only.");
        toast({ title: 'Access Denied', description: "Please use the main login for patient or doctor accounts.", variant: 'destructive' });
        return;
    }

    try {
      const user = await signIn(email, password);
       if (user) {
        toast({ title: 'Admin Login Successful!', description: `Welcome back!` });
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <Shield className="h-8 w-8 text-primary mx-auto" />
          </Link>
          <CardTitle className="text-2xl font-headline">Admin Access</CardTitle>
          <CardDescription>
            Enter your administrator credentials below.
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
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
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
          <div className="mt-4 text-center text-sm">
            Not an admin? Go to{" "}
            <Link href="/login" className="underline">
              main login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
