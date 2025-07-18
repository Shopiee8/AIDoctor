
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Plus, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InfoCard } from '@/components/doctor/info-card';
import { EducationCard } from '@/components/doctor/education-card';
import { ExperienceCard } from '@/components/doctor/experience-card';
import { RegistrationCard } from '@/components/doctor/registration-card';

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required." }),
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;


export default function DoctorSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // These would come from Firestore for the logged-in doctor
  const [doctorData, setDoctorData] = useState({
      name: user?.displayName || '',
      email: user?.email || '',
      phone: '+1 234 567 890',
      gender: 'Male',
      dob: '1980-01-24',
      bio: 'Dr. John Doe is a dedicated and experienced general practitioner...',
      clinicName: 'Doe Medical Center',
      clinicAddress: '123 Health St, Wellness City',
      pricing: 250,
      services: ['General Checkup', 'Vaccinations'],
      specialization: ['Family Medicine', 'Pediatrics'],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setDoctorData(prev => ({...prev, [id]: value}));
  };
   
  const handleSelectChange = (id: string, value: string) => {
    setDoctorData(prev => ({...prev, [id]: value}));
  };

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    }
  });

  async function onPasswordSubmit(data: PasswordFormValues) {
    if (!user || !user.email) return;
    setIsSubmitting(true);
    
    const credential = EmailAuthProvider.credential(user.email, data.currentPassword);

    try {
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

  return (
    <div className="space-y-6">
       <div>
            <h1 className="text-3xl font-bold font-headline">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your public profile and account details.</p>
        </div>
      <Tabs defaultValue="basic">
        <TabsList className="flex-wrap h-auto justify-start">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="clinic">Clinic Info</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="services">Services & Specialization</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="memberships">Memberships</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update your personal details. This information will be displayed on your public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.photoURL || 'https://placehold.co/100x100.png'} />
                        <AvatarFallback>{doctorData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <Button asChild>
                            <label htmlFor="avatar-upload"><Upload className="mr-2 h-4 w-4" /> Change Photo</label>
                        </Button>
                        <input id="avatar-upload" type="file" className="hidden" />
                        <p className="text-xs text-muted-foreground">Allowed JPG, GIF or PNG. Max size of 2MB</p>
                    </div>
                </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={doctorData.name} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={doctorData.email} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={doctorData.phone} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" value={doctorData.dob} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={doctorData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea id="bio" value={doctorData.bio} onChange={handleInputChange} rows={5} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="education">
            <EducationCard />
        </TabsContent>

        <TabsContent value="experience">
            <ExperienceCard />
        </TabsContent>

         <TabsContent value="security">
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Change your password here.</CardDescription>
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
                                Save Changes
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="clinic">
            <Card>
                <CardHeader>
                    <CardTitle>Clinic Information</CardTitle>
                    <CardDescription>Details about your primary practice location.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="clinic-name">Clinic Name</Label>
                            <Input id="clinic-name" value={doctorData.clinicName} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="clinic-address">Clinic Address</Label>
                            <Input id="clinic-address" value={doctorData.clinicAddress} onChange={handleInputChange} />
                        </div>
                     </div>
                     <div>
                        <Label>Clinic Images</Label>
                         <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Drag & drop files here, or click to browse</p>
                            <Input id="clinic-images" type="file" multiple className="sr-only" />
                        </div>
                     </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="services">
            <div className="grid lg:grid-cols-2 gap-6">
                <InfoCard title="Services" placeholder="e.g. Digital Bllods" initialItems={['Digital Bllods', 'Surgery']} />
                <InfoCard title="Specialization" placeholder="e.g. Urology" initialItems={['Urology', 'Orthopedic']} />
                <InfoCard title="Awards" placeholder="e.g. Best Surgeon" initialItems={['Best Surgeon 2023']} hasExtraFields={true} />
            </div>
        </TabsContent>

        <TabsContent value="registrations">
            <RegistrationCard />
        </TabsContent>
        
        <TabsContent value="memberships">
            <InfoCard title="Memberships" placeholder="e.g. American Medical Association" initialItems={['American Medical Association']} />
        </TabsContent>

        <TabsContent value="insurance">
            <InfoCard title="Accepted Insurance" placeholder="e.g. Blue Cross" initialItems={['Star Health', 'United Healthcare']} />
        </TabsContent>
        
        <TabsContent value="account">
            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account availability and other settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <Label htmlFor="account-status" className="font-semibold">Account Status</Label>
                            <p className="text-sm text-muted-foreground">Toggle your account online/offline for bookings.</p>
                        </div>
                        <Switch id="account-status" defaultChecked />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
      <div className="flex justify-end mt-6">
        <Button size="lg">Save Changes</Button>
      </div>
    </div>
  );
}
