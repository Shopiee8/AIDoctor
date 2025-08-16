'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { saveAIProvider } from '@/lib/firebase/providerService';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  website: z.string().url('Please enter a valid URL').or(z.literal('')),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function BecomeProviderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: '',
      website: '',
      description: '',
      terms: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log('Form submission started');
    
    if (!user) {
      const errorMsg = 'You must be logged in to become a provider';
      console.error(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      console.log('Setting loading state to true');
      setIsLoading(true);
      setSubmitError(null);
      
      // Validate form data
      console.log('Validating form data');
      const validationResult = formSchema.safeParse(data);
      if (!validationResult.success) {
        console.log('Form validation failed', validationResult.error.format());
        const errors = validationResult.error.format();
        Object.entries(errors).forEach(([field, error]) => {
          if (field !== '_errors' && error && typeof error === 'object' && '_errors' in error) {
            const errorMessage = Array.isArray(error._errors) ? error._errors[0] : 'Invalid field';
            setError(field as keyof FormValues, {
              type: 'manual',
              message: errorMessage,
            });
          }
        });
        return;
      }

      console.log('Saving AI provider data to Firestore');
      // Save provider data to Firestore
      const providerData = {
        userId: user.uid,
        organizationName: data.organizationName.trim(),
        website: data.website?.trim() || null,
        subscriptionPlan: 'free',
        subscriptionStatus: 'trial',
        settings: {
          notifications: true,
          emailNotifications: true,
          defaultLanguage: 'en',
        },
      };
      
      console.log('Provider data to save:', providerData);
      await saveAIProvider(providerData);
      console.log('Successfully saved AI provider data');

      const successMsg = 'Successfully registered as an AI Provider! Redirecting to your dashboard...';
      console.log(successMsg);
      toast.success(successMsg);
      
      // Add a small delay to show the success message
      console.log('Adding delay before redirect');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to the provider dashboard
      console.log('Initiating redirect to /ai-provider/dashboard');
      router.push('/ai-provider/dashboard');
      console.log('Router push completed, refreshing router');
      router.refresh();
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to register as provider. Please try again.';
      console.error('Error in form submission:', {
        error: errorMsg,
        stack: error?.stack,
        name: error?.name,
        code: error?.code,
      });
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    } finally {
      console.log('Form submission completed, setting loading to false');
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Become an AI Provider</CardTitle>
          <CardDescription>
            Register your organization to start creating and managing AI doctors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  disabled={isLoading}
                  aria-invalid={!!errors.organizationName}
                  aria-describedby={errors.organizationName ? 'organizationName-error' : undefined}
                  placeholder="Your organization name"
                  {...register('organizationName')}
                />
                {errors.organizationName && (
                  <p className="text-sm text-destructive">
                    {errors.organizationName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  disabled={isLoading}
                  aria-invalid={!!errors.website}
                  aria-describedby={errors.website ? 'website-error' : undefined}
                  type="url"
                  placeholder="https://your-organization.com"
                  {...register('website')}
                />
                {errors.website && (
                  <p className="text-sm text-destructive">
                    {errors.website.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">About Your Organization *</Label>
                <Textarea
                  id="description"
                  disabled={isLoading}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? 'description-error' : undefined}
                  placeholder="Tell us about your organization and how you plan to use AI doctors..."
                  className="min-h-[120px]"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    disabled={isLoading}
                    aria-invalid={!!errors.terms}
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                    {...register('terms')}
                  />
                </div>
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                  {errors.terms && (
                    <p className="text-sm text-destructive">
                      {errors.terms.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-end sm:space-x-4 sm:space-y-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Register as Provider'
                  )}
                </Button>
              </div>
            </div>
          </form>
          
          {submitError && (
            <div className="mt-4 p-4 text-sm text-red-600 bg-red-50 rounded-md">
              <p>Error: {submitError}</p>
              <p className="mt-2">Please check your information and try again. If the problem persists, please contact support.</p>
            </div>
          )}
          
          <div className="mt-6 text-sm text-muted-foreground">
            <p>By registering as an AI Provider, you agree to our Terms of Service and Privacy Policy.</p>
            <p className="mt-2">You can update your organization details later in the settings.</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 className="font-medium">Secure & Private</h3>
          <p className="text-sm text-muted-foreground">
            Your data is encrypted and protected with enterprise-grade security.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 className="font-medium">Easy to Use</h3>
          <p className="text-sm text-muted-foreground">
            Intuitive interface to create and manage your AI doctors with ease.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 className="font-medium">24/7 Support</h3>
          <p className="text-sm text-muted-foreground">
            Our team is here to help you every step of the way.
          </p>
        </div>
      </div>
    </div>
  );
}
