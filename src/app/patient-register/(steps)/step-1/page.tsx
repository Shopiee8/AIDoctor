
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Stethoscope, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function PatientRegisterStepOne() {
  const router = useRouter();
  const { toast } = useToast();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleContinue = () => {
    // Bypassing the broken upload functionality to unblock the user.
    // The upload logic can be re-implemented later once the Firebase project
    // configuration is resolved.
    setIsLoading(true);
    toast({
      title: 'Skipping Upload',
      description: 'Profile picture upload is temporarily disabled. Proceeding to the next step.',
    });
    router.push('/patient-register/step-2');
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <Link href="/" className="inline-block mb-4">
          <Stethoscope className="h-8 w-8 text-primary mx-auto" />
        </Link>
        <div className="flex justify-center gap-2 my-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">1</div>
          <Link href="/patient-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">2</Link>
          <Link href="/patient-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">3</Link>
          <Link href="/patient-register/step-4" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">4</Link>
          <Link href="/patient-register/step-5" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">5</Link>
        </div>
        <CardTitle className="text-2xl font-headline">Profile Picture</CardTitle>
        <CardDescription>Upload a profile picture for a more personalized experience.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <label
            htmlFor="profile_image"
            className="relative w-32 h-32 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile preview"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <Camera className="w-12 h-12 text-muted-foreground" />
            )}
            <input
              type="file"
              id="profile_image"
              name="profile_image"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              disabled={isLoading}
            />
          </label>
          <p className="text-sm text-muted-foreground">
            {imageFile ? imageFile.name : 'Click to upload a picture'}
          </p>
        </div>

        <div className="mt-8">
          <Button onClick={handleContinue} className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
