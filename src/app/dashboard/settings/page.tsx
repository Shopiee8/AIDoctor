
'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential, User as FirebaseUser } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, storage, db } from '@/lib/firebase';
import Image from 'next/image';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User, Camera, ShieldCheck, Trash2, Eye, EyeOff, CalendarIcon, Mail, Smartphone } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';


const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  phone: z.string().optional(),
  dob: z.date().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
});

// Extend the Firebase User type to include our custom fields
type AppUser = FirebaseUser & {
  phone?: string;
  dob?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  updatedAt?: string;
  createdAt?: string;
};

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required." }),
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;


export default function SettingsPage() {
    const { user, refreshUser, loading, signOut } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<AppUser | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');

    // Fetch user data from Firestore
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData({
                        ...user,
                        ...userDoc.data()
                    } as AppUser);
                    setAvatarUrl(user.photoURL || '');
                } else {
                    setUserData(user as AppUser);
                    setAvatarUrl(user.photoURL || '');
                    // Create a basic user document if it doesn't exist
                    await setDoc(doc(db, 'users', user.uid), {
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL || null,
                        createdAt: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load user data',
                    variant: 'destructive'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            displayName: userData?.displayName || '',
            email: userData?.email || '',
            phone: userData?.phone || '',
            dob: userData?.dob ? new Date(userData.dob) : undefined,
            bloodGroup: userData?.bloodGroup || '',
            address: userData?.address || '',
            city: userData?.city || '',
            state: userData?.state || '',
            country: userData?.country || '',
            pincode: userData?.pincode || ''
        }
    });

    // Reset form when userData changes
    useEffect(() => {
        if (userData) {
            profileForm.reset({
                displayName: userData.displayName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                dob: userData.dob ? new Date(userData.dob) : undefined,
                bloodGroup: userData.bloodGroup || '',
                address: userData.address || '',
                city: userData.city || '',
                state: userData.state || '',
                country: userData.country || '',
                pincode: userData.pincode || ''
            });
            setAvatarUrl(userData.photoURL || '');
        }
    }, [userData]);

     const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        }
    });

    async function onProfileSubmit(data: ProfileFormValues) {
        if (!user || !userData) return;
        setIsSubmitting(true);
        
        try {
            // Get current user from auth
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error('No authenticated user');

            // Update authentication profile
            if (data.displayName !== user.displayName) {
                await updateProfile(currentUser, { 
                    displayName: data.displayName
                });
            }

            // Prepare user data for Firestore
            const userUpdate: Partial<AppUser> = {
                displayName: data.displayName,
                phone: data.phone || undefined,
                dob: data.dob ? data.dob.toISOString() : undefined,
                bloodGroup: data.bloodGroup || undefined,
                address: data.address || undefined,
                city: data.city || undefined,
                state: data.state || undefined,
                country: data.country || undefined,
                pincode: data.pincode || undefined,
                updatedAt: new Date().toISOString()
            };

            // Update user document in Firestore
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, userUpdate, { merge: true });

            // Update local state
            setUserData((prev: AppUser | null) => ({
                ...prev!,
                ...userUpdate,
                photoURL: avatarUrl || (prev ? prev.photoURL : '')
            } as AppUser));
            
            // Refresh user data in auth context
            await refreshUser();
            
            toast({ 
                title: "Profile Updated", 
                description: "Your profile information has been updated successfully." 
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({ 
                title: "Error", 
                description: error instanceof Error ? error.message : "Could not update your profile. Please try again.", 
                variant: "destructive" 
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onPasswordSubmit(data: PasswordFormValues) {
        if (!user || !user.email) return;
        setIsSubmitting(true);
        
        const credential = EmailAuthProvider.credential(user.email, data.currentPassword);

        try {
            // Re-authenticate user before changing password
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, data.newPassword);
            toast({ title: "Password Updated", description: "Your password has been changed successfully." });
            passwordForm.reset();
        } catch (error: any) {
            console.error("Error updating password:", error);
            toast({ title: "Error", description: "Failed to update password. Check your current password and try again.", variant: "destructive" });
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
        
        // Check file type
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            toast({
                title: "Invalid File Type",
                description: "Please upload a valid image file (JPEG, PNG, GIF, or WebP).",
                variant: "destructive"
            });
            return;
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast({
                title: "File Too Large",
                description: "Please upload an image smaller than 5MB.",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);
        try {
            // Get the current user from auth
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error('No authenticated user found');
            }

            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `profile_images/${currentUser.uid}`);
            await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(storageRef);

            // Update the user's profile
            await updateProfile(currentUser, { photoURL });
            
            // Force token refresh to ensure the photo URL is updated
            await currentUser.getIdToken(true);
            
            // Update the UI
            setAvatarUrl(photoURL);
            await refreshUser();
            
            toast({ 
                title: "Avatar Updated", 
                description: "Your profile picture has been changed successfully." 
            });
        } catch (error) {
            console.error("Error uploading file:", error);
            toast({ 
                title: "Upload Error", 
                description: error instanceof Error ? error.message : "Failed to upload new avatar.", 
                variant: "destructive" 
            });
        } finally {
            setIsUploading(false);
            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteAccount = async () => {
        await signOut();
        toast({ title: "Account Deleted", description: "Your account has been successfully deleted." });
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
            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="2fa">2FA</TabsTrigger>
                    <TabsTrigger value="delete">Delete Account</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>This is how others will see you on the site.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                                    <div className="flex items-center gap-4 relative">
                                        <div className="relative">
                                            <Avatar className="w-24 h-24 cursor-pointer" onClick={handleAvatarClick}>
                                                {avatarUrl ? (
                                                    <AvatarImage src={avatarUrl} alt={user?.displayName || 'User'} />
                                                ) : null}
                                                <AvatarFallback className="text-3xl">
                                                    {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 border-2 border-background">
                                                {isUploading ? (
                                                    <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                                                ) : (
                                                    <Camera className="w-4 h-4 text-primary-foreground" />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 mt-2">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept="image/jpeg, image/png, image/gif, image/webp"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{user?.displayName || "User"}</h3>
                                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField control={profileForm.control} name="displayName" render={({ field }) => (
                                            <FormItem><FormLabel>Display Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <FormField control={profileForm.control} name="email" render={({ field }) => (
                                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <FormField 
                                            control={profileForm.control} 
                                            name="phone" 
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            {...field} 
                                                            value={field.value || ''} 
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField 
                                            control={profileForm.control} 
                                            name="dob" 
                                            render={({ field }) => {
                                                const handleYearNavigation = (e: React.MouseEvent, change: number) => {
                                                    e.stopPropagation();
                                                    if (field.value) {
                                                        const newDate = new Date(field.value);
                                                        newDate.setFullYear(newDate.getFullYear() + change);
                                                        field.onChange(newDate);
                                                    }
                                                };
                                                
                                                return (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Date of Birth</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button variant={"outline"} className="pl-3 text-left font-normal w-full">
                                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0 z-[9999] bg-background" align="start">
                                                                <div className="bg-background rounded-md border shadow-lg p-2">
                                                                    <div className="flex justify-between items-center px-4 py-2 border-b">
                                                                        <Button 
                                                                            type="button" 
                                                                            variant="ghost" 
                                                                            size="sm" 
                                                                            className="h-7 w-7 p-0"
                                                                            onClick={(e) => handleYearNavigation(e, -10)}
                                                                            aria-label="Previous 10 years"
                                                                        >
                                                                            -10y
                                                                        </Button>
                                                                        <Button 
                                                                            type="button" 
                                                                            variant="ghost" 
                                                                            size="sm" 
                                                                            className="h-7 w-7 p-0"
                                                                            onClick={(e) => handleYearNavigation(e, -1)}
                                                                            aria-label="Previous year"
                                                                        >
                                                                            -1y
                                                                        </Button>
                                                                        <Button 
                                                                            type="button" 
                                                                            variant="ghost" 
                                                                            size="sm" 
                                                                            className="h-7 w-7 p-0"
                                                                            onClick={(e) => handleYearNavigation(e, 1)}
                                                                            aria-label="Next year"
                                                                        >
                                                                            +1y
                                                                        </Button>
                                                                        <Button 
                                                                            type="button" 
                                                                            variant="ghost" 
                                                                            size="sm" 
                                                                            className="h-7 w-7 p-0"
                                                                            onClick={(e) => handleYearNavigation(e, 10)}
                                                                            aria-label="Next 10 years"
                                                                        >
                                                                            +10y
                                                                        </Button>
                                                                    </div>
                                                                    <Calendar 
                                                                        mode="single" 
                                                                        selected={field.value} 
                                                                        onSelect={field.onChange}
                                                                        disabled={false}
                                                                        initialFocus
                                                                        captionLayout="dropdown-buttons"
                                                                        fromYear={1900}
                                                                        toYear={new Date().getFullYear()}
                                                                        className="bg-background text-foreground"
                                                                        classNames={{
                                                                            dropdown: "bg-background border rounded-md px-2 py-1 text-foreground shadow-sm",
                                                                            caption_dropdowns: "flex gap-4 mb-2 p-2 bg-background rounded-md relative",
                                                                            dropdown_year: "flex items-center gap-1 bg-background px-3 py-1.5 rounded-md border shadow-sm hover:bg-accent/50 transition-colors",
                                                                            dropdown_month: "flex items-center gap-1 bg-background px-3 py-1.5 rounded-md border shadow-sm hover:bg-accent/50 transition-colors",
                                                                            caption_label: "hidden",
                                                                            caption: "relative w-full",
                                                                            nav: "absolute inset-0 flex items-center justify-between pointer-events-none",
                                                                            nav_button: "h-7 w-7 bg-background hover:bg-accent rounded-md p-0 flex items-center justify-center shadow-sm hover:shadow-md transition-all pointer-events-auto border",
                                                                            nav_button_previous: "-left-1",
                                                                            nav_button_next: "-right-1",
                                                                            table: "w-full border-collapse space-y-1 mt-2 bg-background p-3 rounded-lg border shadow-md",
                                                                            head_row: "flex w-full justify-between px-1",
                                                                            head_cell: "text-muted-foreground w-9 font-medium text-sm py-2",
                                                                            row: "flex w-full mt-2 justify-between",
                                                                            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                                                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors duration-200 flex items-center justify-center",
                                                                            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm",
                                                                            day_today: "bg-accent/80 text-accent-foreground font-bold border border-foreground/20"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                        <FormField control={profileForm.control} name="bloodGroup" render={({ field }) => (
                                        <FormItem><FormLabel>Blood Group</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="A+">A+</SelectItem>
                                                <SelectItem value="A-">A-</SelectItem>
                                                <SelectItem value="B+">B+</SelectItem>
                                                <SelectItem value="B-">B-</SelectItem>
                                                <SelectItem value="AB+">AB+</SelectItem>
                                                <SelectItem value="AB-">AB-</SelectItem>
                                                <SelectItem value="O+">O+</SelectItem>
                                                <SelectItem value="O-">O-</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage /></FormItem>
                                        )}/>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t">
                                        <h4 className="font-medium">Address</h4>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormField control={profileForm.control} name="address" render={({ field }) => (
                                                <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={profileForm.control} name="city" render={({ field }) => (
                                                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={profileForm.control} name="state" render={({ field }) => (
                                                <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={profileForm.control} name="country" render={({ field }) => (
                                                <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={profileForm.control} name="pincode" render={({ field }) => (
                                                <FormItem><FormLabel>Pincode / Zip Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Update Profile
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                     <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Change your password and manage account security.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-lg">
                                    <FormField
                                        control={passwordForm.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type={showCurrentPassword ? "text" : "password"} {...field} />
                                                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type={showNewPassword ? "text" : "password"} {...field} />
                                                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowNewPassword(!showNewPassword)}>
                                                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type={showConfirmPassword ? "text" : "password"} {...field} />
                                                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Change Password
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="2fa">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                           <div>
                            <CardTitle>Two-Factor Authentication</CardTitle>
                            <CardDescription>Add an extra layer of security to your account.</CardDescription>
                           </div>
                            <Switch />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 border rounded-lg">
                                <Label htmlFor="email-2fa" className="font-semibold flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Set up using Email</Label>
                                <p className="text-xs text-muted-foreground mt-1 mb-3">Enter the email where you want to receive the code.</p>
                                <div className="flex gap-2">
                                    <Input id="email-2fa" type="email" placeholder={user?.email || 'your-email@example.com'} />
                                    <Button>Continue</Button>
                                </div>
                            </div>
                             <div className="p-4 border rounded-lg">
                                <Label htmlFor="sms-2fa" className="font-semibold flex items-center gap-2"><Smartphone className="w-4 h-4 text-primary" /> Set up using SMS</Label>
                                <p className="text-xs text-muted-foreground mt-1 mb-3">Enter the phone number where you want to receive the code.</p>
                                <div className="flex gap-2">
                                    <Input id="sms-2fa" type="tel" placeholder="+1 234 567 890" />
                                    <Button>Continue</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="delete">
                    <Card>
                        <CardHeader>
                            <CardTitle>Delete Account</CardTitle>
                            <CardDescription>Permanently remove your account and all of your content.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                This action is irreversible. All your data, including appointments, medical records, and profile information, will be permanently deleted.
                            </p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteAccount}>
                                            Yes, delete my account
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
