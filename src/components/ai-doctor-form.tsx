"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Upload, X, User } from 'lucide-react';

// Import individual UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { uploadAIDoctorAvatar, saveAIDoctor } from '@/lib/firebase/providerService';
import { Avatar, getInitials } from '@/lib/avatar-utils';

// Define AIDoctor type
interface AIDoctor {
  id?: string;
  name: string;
  specialty: string;
  description: string;
  avatar?: string;
  isActive: boolean;
  providerId?: string;
  settings: {
    voice: string;
    language: string;
    consultationFee: number;
    availability: '24/7' | 'office-hours' | 'custom';
  };
  createdAt?: Date;
  updatedAt?: Date;
}

type FormValues = Omit<AIDoctor, 'id' | 'createdAt' | 'updatedAt' | 'providerId'>;

interface AIDoctorFormProps {
  initialData?: AIDoctor;
  providerId: string;
}

const specialities = [
  'General Practice', 'Cardiology', 'Dermatology', 'Endocrinology',
  'Gastroenterology', 'Neurology', 'Oncology', 'Pediatrics',
  'Psychiatry', 'Radiology', 'Urology'
];

const voices = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ar', name: 'Arabic' },
];

const availabilityOptions = [
  { value: '24/7', label: '24/7' },
  { value: 'office-hours', label: 'Office Hours (9AM-5PM)' },
  { value: 'custom', label: 'Custom Schedule' },
];

const formSchema = z.object({
  name: z.string().min(2),
  specialty: z.string().min(1),
  description: z.string().min(10),
  isActive: z.boolean().default(true),
  settings: z.object({
    voice: z.string().min(1),
    language: z.string().min(1),
    consultationFee: z.coerce.number().min(0),
    availability: z.enum(['24/7', 'office-hours', 'custom']),
  }),
});

export function AIDoctorForm({ initialData, providerId }: AIDoctorFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      specialty: '',
      description: '',
      isActive: true,
      settings: {
        voice: voices[0].id,
        language: 'en',
        consultationFee: 0,
        availability: '24/7',
      },
    },
  });

  const renderError = (error: FieldError | undefined) => {
    return error && <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-medium">{error.message}</p>;
  };

  const availability = watch('settings.availability');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      let avatarUrl = initialData?.avatar || '';

      if (avatarFile) {
        setIsUploading(true);
        const uploadResult = await uploadAIDoctorAvatar(avatarFile, initialData?.id || 'new');
        avatarUrl = uploadResult.url;
        setIsUploading(false);
      }

      const aiDoctorData: AIDoctor = {
        ...data,
        id: initialData?.id,
        providerId,
        avatar: avatarUrl,
      };

      await saveAIDoctor(aiDoctorData);
      toast.success(initialData ? 'AI Doctor updated!' : 'AI Doctor created!');
      router.push('/dashboard/ai-provider');
    } catch (error) {
      console.error('Error saving AI doctor:', error);
      toast.error('Failed to save AI doctor.');
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 text-gray-900 dark:text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="max-w-3xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {initialData ? 'Edit' : 'Create'} AI Doctor
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
              Fill in the details to {initialData ? 'update' : 'create'} an AI doctor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar</Label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="relative group">
                    <div className={`w-24 h-24 rounded-full overflow-hidden border-2 ${avatarPreview ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600'} group-hover:border-blue-500 transition-colors duration-200`}>
                      <Avatar 
                        src={avatarPreview || undefined} 
                        name={watch('name') || 'AI Doctor'}
                        size="lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Change</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div>
                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full sm:w-auto"
                      >
                        {isUploading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </>
                        ) : 'Choose Image'}
                      </Button>
                    </div>
                    {avatarPreview && (
                      <Button 
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    JPG, PNG or WebP. Max 2MB. Recommended size: 400x400px
                  </p>
                  {isUploading && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold text-gray-900 dark:text-white">
                Name *
              </Label>
              <Input 
                id="name" 
                {...register('name')} 
                disabled={isLoading}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Enter AI doctor's name"
              />
              {renderError(errors.name as FieldError)}
            </div>

            {/* Specialty */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-900 dark:text-white">
                Specialty *
              </Label>
              <Controller
                name="specialty"
                control={control}
                render={({ field }) => (
                  <Select {...field} disabled={isLoading}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select specialty" className="text-gray-500 dark:text-gray-400" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                      {specialities.map((item) => (
                        <SelectItem 
                          key={item} 
                          value={item}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {renderError(errors.specialty as FieldError)}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-900 dark:text-white">
                Description *
              </Label>
              <Textarea 
                {...register('description')} 
                disabled={isLoading}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Describe the AI doctor's expertise and approach..."
              />
              {renderError(errors.description as FieldError)}
            </div>

            {/* Fee */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-900 dark:text-white">
                Consultation Fee ($)
              </Label>
              <Input 
                type="number" 
                {...register('settings.consultationFee')} 
                disabled={isLoading}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {renderError(errors.settings?.consultationFee as FieldError)}
            </div>

            {/* Voice Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-900 dark:text-white">
                Voice
              </Label>
              <Controller
                name="settings.voice"
                control={control}
                render={({ field }) => (
                  <Select {...field} disabled={isLoading}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                      {voices.map((voice) => (
                        <SelectItem 
                          key={voice.id} 
                          value={voice.id}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-900 dark:text-white">
                Language
              </Label>
              <Controller
                name="settings.language"
                control={control}
                render={({ field }) => (
                  <Select {...field} disabled={isLoading}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                      {languages.map((lang) => (
                        <SelectItem 
                          key={lang.code} 
                          value={lang.code}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-900 dark:text-white">
                Availability
              </Label>
              <Controller
                name="settings.availability"
                control={control}
                render={({ field }) => (
                  <Select {...field} disabled={isLoading}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                      {availabilityOptions.map((opt) => (
                        <SelectItem 
                          key={opt.value} 
                          value={opt.value}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {availability === 'custom' && (
                <div className="mt-4 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                    Custom schedule configuration coming soon.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 max-w-3xl mx-auto">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()} 
            disabled={isLoading}
            className="px-6 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || isUploading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {(isLoading || isUploading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                {isUploading ? 'Uploading...' : 'Saving...'}
              </>
            ) : (
              initialData ? 'Save Changes' : 'Create AI Doctor'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}