'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { checkRegistrationProgress } from '@/lib/registration-guard';
import { useToast } from '@/hooks/use-toast';

export default function AiProviderRegisterStepTwo() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    agentName: '',
    agentSpecialty: '',
    systemPrompt: ''
  });

  // Check if user can access this step
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const providerDoc = await getDoc(doc(db, 'temp-ai-providers', user.uid));
        
        // If no document or registration step is not 1, redirect to step 1
        if (!providerDoc.exists() || providerDoc.data()?.registrationStep !== 1) {
          router.push('/ai-provider-register/step-1');
          return;
        }
        
        // Pre-fill form with existing data if available
        const data = providerDoc.data();
        if (data) {
          setFormData(prev => ({
            ...prev,
            agentName: data.agentName || '',
            agentSpecialty: data.agentSpecialty || '',
            systemPrompt: data.systemPrompt || ''
          }));
        }
      } catch (error) {
        console.error('Error checking registration progress:', error);
        toast({
          title: 'Error',
          description: 'Failed to load registration data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [user, router, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Save the form data to the temporary provider document
      await setDoc(doc(db, 'temp-ai-providers', user.uid), {
        ...formData,
        registrationStep: 2,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Move to the next step
      router.push('/ai-provider-register/step-3');
    } catch (error) {
      console.error('Error saving AI provider data:', error);
      // Handle error (you might want to show a toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <Link href="/" className="inline-block mb-4">
          <Bot className="h-8 w-8 text-primary mx-auto" />
        </Link>

        <div className="flex justify-center gap-2 my-4">
          <Link href="/ai-provider-register/step-1" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold dark:bg-primary/30 dark:text-primary-foreground">1</Link>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">2</div>
          <Link href="/ai-provider-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold dark:bg-gray-700 dark:text-gray-400">3</Link>
        </div>

        <CardTitle className="text-2xl font-headline">Define Your AI Agent</CardTitle>
        <CardDescription>Configure the core identity and instructions for your agent.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input 
                  id="agent-name" 
                  name="agentName"
                  value={formData.agentName}
                  onChange={handleChange}
                  placeholder='e.g., "Julia" or "CareBot"' 
                  className="dark:bg-card dark:border-gray-700 dark:text-foreground"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="agent-specialty">Agent Specialty</Label>
                <Input 
                  id="agent-specialty" 
                  name="agentSpecialty"
                  value={formData.agentSpecialty}
                  onChange={handleChange}
                  placeholder="e.g., Post-Op Follow-Up" 
                  className="dark:bg-card dark:border-gray-700 dark:text-foreground"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea 
                id="system-prompt"
                name="systemPrompt"
                value={formData.systemPrompt}
                onChange={handleChange}
                placeholder="You are a friendly and empathetic AI assistant named Julia. Your goal is to conduct post-operative check-ins..."
                className="min-h-[200px] dark:bg-card dark:border-gray-700 dark:text-foreground"
                required
              />
              <p className="text-xs text-muted-foreground">
                This is the core instruction that defines your AI's personality and purpose. Be as descriptive as possible.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Continue to Review'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
