'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { completeAIProviderRegistration, getAIProviderData } from "@/lib/ai-provider";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function AiProviderRegisterStepThree() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerData, setProviderData] = useState<any>(null);

  // Check if user can access this step
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        // Check both the aiProviders collection and the users collection
        const [providerDoc, userDoc] = await Promise.all([
          getDoc(doc(db, 'aiProviders', user.uid)),
          getDoc(doc(db, 'users', user.uid))
        ]);
        
        // If user is not an AI Provider or registration step is not 2, redirect to step 1
        const isAIProvider = userDoc.exists() && (userDoc.data().role === 'AI Provider' || userDoc.data().isAIProvider);
        const isRegistrationStep2 = providerDoc.exists() && providerDoc.data().registrationStep === 2;
        
        if (!isAIProvider || !isRegistrationStep2) {
          router.push('/ai-provider-register/step-1');
          return;
        }
        
        setProviderData(providerDoc.data());
        
      } catch (error) {
        console.error('Error checking registration progress:', error);
        toast({
          title: 'Error',
          description: 'Failed to load registration data. Please try again.',
          variant: 'destructive',
        });
        setError('Failed to load registration data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [user, router, toast]);

  // Complete registration when component mounts and data is loaded
  useEffect(() => {
    if (!providerData) return;
    
    let redirectTimer: NodeJS.Timeout;
    
    const completeRegistration = async () => {
      if (!user) return;
      
      setIsCompleting(true);
      
      try {
        // Mark registration as complete in aiProviders collection
        await setDoc(doc(db, 'aiProviders', user.uid), {
          registrationComplete: true,
          registrationStep: 3,
          updatedAt: new Date().toISOString(),
          subscriptionStatus: 'active',
          subscriptionPlan: 'free',
          settings: {
            notifications: true,
            emailNotifications: true,
            defaultLanguage: 'en',
          }
        }, { merge: true });
        
        // Update user document to mark as active AI Provider
        await setDoc(doc(db, 'users', user.uid), {
          isAIProvider: true,
          role: 'AI Provider',
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        // Force refresh the user's token to update claims
        await user.getIdToken(true);
        
        // Show success message
        toast({
          title: 'Registration Complete!',
          description: 'Your AI Provider account has been successfully created.',
        });
        
        // Redirect to AI Provider dashboard after a short delay
        redirectTimer = setTimeout(() => {
          router.push('/ai-provider/dashboard');
        }, 3000);
        
      } catch (error) {
        console.error('Error completing registration:', error);
        toast({
          title: 'Error',
          description: 'Failed to complete registration. Please try again.',
          variant: 'destructive',
        });
        setError('Failed to complete registration. Please try again.');
      } finally {
        setIsCompleting(false);
      }
    };
    
    completeRegistration();
    
    // Clean up the timer if the component unmounts
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [providerData, user, router, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <Bot className="h-8 w-8 text-primary mx-auto" />
          </Link>
          <CardTitle className="text-2xl font-headline">Registration Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-destructive">{error}</p>
            <Button onClick={() => router.push('/ai-provider-register/step-1')}>
              Back to Registration
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <Link href="/" className="inline-block mb-4">
          <Bot className="h-8 w-8 text-primary mx-auto" />
        </Link>
        
        <div className="flex justify-center gap-2 my-4">
          <Link href="/ai-provider-register/step-1" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold dark:bg-primary/30 dark:text-primary-foreground">1</Link>
          <Link href="/ai-provider-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold dark:bg-primary/30 dark:text-primary-foreground">2</Link>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">3</div>
        </div>

        <CardTitle className="text-2xl font-headline">Registration Complete</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
        {isCompleting ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Completing your registration...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="text-destructive text-center">
              <p className="font-medium">Error completing registration</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full max-w-xs mx-auto"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <CardDescription className="mb-6 text-foreground/80 dark:text-foreground/70">
              Thank you for registering your AI agent. Your provider account has been created. 
              You can now access your dashboard to manage your agents and view analytics.
            </CardDescription>
            
            <div className="space-y-4">
              <Button asChild className="w-full max-w-xs mx-auto">
                <Link href="/ai-provider/dashboard">
                  Go to AI Provider Dashboard
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                You'll be redirected automatically in 5 seconds...
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
