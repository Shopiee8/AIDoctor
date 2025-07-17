
'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User, Camera, ShieldCheck } from 'lucide-react';

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        values: {
            displayName: user?.displayName || '',
            email: user?.email || '',
        },
    });

    async function onSubmit(data: ProfileFormValues) {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await updateProfile(user, { displayName: data.displayName });
            toast({ title: "Profile Updated", description: "Your display name has been updated." });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({ title: "Error", description: "Could not update your profile.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0 || !user) {
            return;
        }
        const file = event.target.files[0];
        setIsUploading(true);
        try {
            const storageRef = ref(storage, `profile_images/${user.uid}`);
            await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(storageRef);
            await updateProfile(user, { photoURL });
            toast({ title: "Avatar Updated", description: "Your profile picture has been changed." });
            // Manually trigger a re-render or state update if needed, as auth state might take time to propagate
            window.location.reload(); 
        } catch (error) {
            console.error("Error uploading file:", error);
            toast({ title: "Upload Error", description: "Failed to upload new avatar.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Settings</h1>
                <p className="text-muted-foreground">Manage your account and profile settings.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>This is how others will see you on the site.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative">
                            <Avatar className="w-24 h-24 cursor-pointer" onClick={handleAvatarClick}>
                                <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                                <AvatarFallback className="text-3xl">{user?.displayName?.[0] || user?.email?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 border-2 border-background">
                                {isUploading ? <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" /> : <Camera className="w-4 h-4 text-primary-foreground" />}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/jpeg"
                            />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{user?.displayName || "User"}</h3>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
                            <FormField
                                control={form.control}
                                name="displayName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Email" {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Profile
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Change your password and manage account security.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button variant="outline">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Change Password
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
