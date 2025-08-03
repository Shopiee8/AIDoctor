'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { signIn, googleSignIn, user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging
  console.log('LoginPage render:', { user, loading, error });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = await signIn(email, password);
      if (user) {
        toast({ title: 'Login Successful!', description: `Welcome back!` });
        // Role-based redirection is now handled automatically by AuthContext
      }
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await googleSignIn();
      toast({ title: 'Login Successful!', description: 'Welcome!' });
      // Role-based redirection is now handled automatically by AuthContext
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Google Sign-In Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while auth context is initializing
  if (loading) {
    console.log('LoginPage: Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <Stethoscope className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    console.log('LoginPage: User is logged in, showing redirect state');
    // User is already logged in, AuthContext will handle redirection
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <ArrowRight className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-muted-foreground font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  console.log('LoginPage: Showing login form');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with logo and title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300 border border-primary/10">
                <Stethoscope className="h-8 w-8 text-primary mx-auto" />
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold font-headline mt-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Sign in to your AI Doctor account
          </p>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-primary/10 relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 pointer-events-none"></div>
          
          <CardContent className="p-8 relative z-10">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 border-border/50 focus:border-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:bg-white/90"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 border-border/50 focus:border-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70 focus:bg-white/90"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-pop-in">
                  <p className="text-destructive text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-muted-foreground font-medium">or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button 
              variant="outline" 
              className="w-full h-12 border-2 border-border/50 hover:border-primary/30 bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 group"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">Continue with Google</span>
              </div>
            </Button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  href="/register" 
                  className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200 inline-flex items-center space-x-1 group"
                >
                  <span>Sign up</span>
                  <Sparkles className="h-3 w-3 group-hover:rotate-12 transition-transform duration-200" />
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="#" className="underline hover:text-primary transition-colors duration-200">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-primary transition-colors duration-200">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}