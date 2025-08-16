'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Stethoscope, Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function RegisterStepOne() {
    const [profileImage, setProfileImage] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const router = useRouter();

    const validateImageFile = (file: File): string | null => {
        // Check file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
            return 'File size must be less than 2MB';
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return 'Only JPG, PNG, and GIF files are allowed';
        }
        
        return null;
    };

    const handleImageClick = () => {
        if (!isUploading) {
            fileInputRef.current?.click();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file
        const validationError = validateImageFile(file);
        if (validationError) {
            toast({
                title: 'Invalid File',
                description: validationError,
                variant: 'destructive'
            });
            return;
        }

        setIsUploading(true);

        try {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setProfileImage(previewUrl);
            setSelectedFile(file);

            // Store in localStorage for next step (or you could upload to Firebase here)
            localStorage.setItem('doctorRegistration_profileImageFile', JSON.stringify({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            }));

            toast({
                title: 'Image Selected',
                description: 'Profile picture has been selected successfully.'
            });

        } catch (error) {
            console.error('Error processing image:', error);
            toast({
                title: 'Error',
                description: 'Failed to process the selected image.',
                variant: 'destructive'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        if (profileImage) {
            URL.revokeObjectURL(profileImage);
        }
        setProfileImage('');
        setSelectedFile(null);
        localStorage.removeItem('doctorRegistration_profileImageFile');
        
        // Clear the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // You can make profile image optional or required
        // For now, let's make it optional but show a warning if not selected
        if (!selectedFile) {
            const proceed = window.confirm(
                'No profile picture selected. You can add one later in your profile settings. Continue anyway?'
            );
            if (!proceed) return;
        }

        // Store the image data for the next step
        if (selectedFile && profileImage) {
            localStorage.setItem('doctorRegistration_profileImagePreview', profileImage);
        }

        // Navigate to step 2
        router.push('/doctor-register/step-2');
    };

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (profileImage) {
                URL.revokeObjectURL(profileImage);
            }
        };
    }, [profileImage]);

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <Link href="/" className="inline-block mb-4">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto" />
                </Link>

                <div className="flex justify-center gap-2 my-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">1</div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">2</div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">3</div>
                </div>

                <CardTitle className="text-2xl font-headline">Profile Picture</CardTitle>
                <CardDescription>
                    Upload a professional photo that will be displayed on your profile
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleContinue}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div 
                                className={`relative w-32 h-32 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center cursor-pointer transition-all hover:border-primary hover:bg-muted/50 ${
                                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                                } ${profileImage ? 'border-solid border-primary' : ''}`}
                                onClick={handleImageClick}
                            >
                                {profileImage ? (
                                    <>
                                        <img 
                                            src={profileImage} 
                                            alt="Profile preview" 
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {isUploading ? (
                                            <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
                                        ) : (
                                            <Camera className="w-12 h-12 text-muted-foreground" />
                                        )}
                                    </>
                                )}
                            </div>
                            
                            {profileImage && !isUploading && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage();
                                    }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            className="hidden"
                            disabled={isUploading}
                        />

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                {profileImage ? 'Click to change picture' : 'Click to upload profile picture'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Allowed: JPG, PNG, GIF • Max size: 2MB
                            </p>
                            {selectedFile && (
                                <p className="text-xs text-green-600 mt-1">
                                    ✓ {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Continue'
                            )}
                        </Button>
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/doctor-register/step-2')}
                            className="text-sm text-muted-foreground hover:text-primary underline"
                        >
                            Skip for now (add later)
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}