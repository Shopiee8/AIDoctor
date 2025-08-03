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
import { Shield, Eye, EyeOff, Mail, Lock, ArrowRight, AlertTriangle, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // For this dedicated login, we can hardcode the check or use a more robust role system later
    if (email !== 'admin@aidoctor.com') {
        setError("This login is for administrators only.");
        toast({ title: 'Access Denied', description: "Please use the main login for patient or doctor accounts.", variant: 'destructive' });
        setIsLoading(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements - darker theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-red-500/10 to-amber-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-500/5 to-red-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with logo and title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-red-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-2xl group-hover:shadow-amber-500/20 transition-all duration-300 border border-amber-500/20">
                <Shield className="h-8 w-8 text-amber-400 mx-auto" />
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold font-headline mt-6 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
            Administrator Access
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Secure login for system administrators
          </p>
        </div>

        {/* Security Notice */}
        <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-amber-200 text-sm font-medium">Restricted Access</p>
              <p className="text-amber-300/80 text-xs mt-1">
                This portal is exclusively for authorized administrators. All access attempts are logged and monitored.
              </p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-sm bg-slate-800/80 border-0 shadow-2xl shadow-amber-500/10 relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-red-500/5 pointer-events-none"></div>
          
          <CardContent className="p-8 relative z-10">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-200">
                  Administrator Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-400 transition-colors duration-200" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@aidoctor.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 border-slate-600/50 focus:border-amber-500/50 bg-slate-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/70 focus:bg-slate-700/90 text-slate-100 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-200">
                  Administrator Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-400 transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter secure password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 border-slate-600/50 focus:border-amber-500/50 bg-slate-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/70 focus:bg-slate-700/90 text-slate-100 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-pop-in">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <KeyRound className="h-4 w-4" />
                    <span>Secure Login</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>
            </form>

            {/* Navigation Links */}
            <div className="mt-8 space-y-4">
              <div className="text-center">
                <Link 
                  href="/login" 
                  className="text-sm text-slate-400 hover:text-amber-400 transition-colors duration-200 inline-flex items-center space-x-1 group"
                >
                  <ArrowRight className="h-3 w-3 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
                  <span>Back to main login</span>
                </Link>
              </div>
              
              <div className="text-center pt-4 border-t border-slate-600/30">
                <p className="text-xs text-slate-500">
                  Need help? Contact{" "}
                  <Link href="#" className="text-amber-400 hover:text-amber-300 transition-colors duration-200">
                    IT Support
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Footer */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-xs text-slate-500 bg-slate-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-600/20">
            <Shield className="h-3 w-3" />
            <span>Protected by enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
}