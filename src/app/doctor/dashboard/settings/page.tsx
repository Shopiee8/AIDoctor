
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, updateProfile } from 'firebase/auth';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

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
import { ExperienceCard, ExperienceItem } from '@/components/doctor/experience-card';
import { RegistrationCard } from '@/components/doctor/registration-card';
import { SocialLinksCard } from '@/components/doctor/social-links-card';
import { TagsInput } from 'react-tag-input-component';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required." }),
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

// Helper to recursively remove undefined values from an object or array
function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    );
  }
  return obj;
}


export default function DoctorSettingsPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Doctor data state
  const [doctorData, setDoctorData] = useState<any>(null);

  // Accordion state for clinics and education
  const [expandedClinic, setExpandedClinic] = useState<string | null>(null);
  const [expandedEducation, setExpandedEducation] = useState<string | null>(null);
  const toggleClinic = useCallback((id: string) => setExpandedClinic(expandedClinic === id ? null : id), [expandedClinic]);
  const toggleEducation = useCallback((id: string) => setExpandedEducation(expandedEducation === id ? null : id), [expandedEducation]);

  // Fetch doctor data from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchDoctor = async () => {
      const docRef = doc(db, 'doctors', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDoctorData({ ...data, email: user.email, experience: data.experience || [] });
        setAvatarUrl(data.image || user.photoURL || '');
      } else {
        setDoctorData({
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          gender: '',
          dob: '',
          bio: '',
          clinicName: '',
          clinicAddress: '',
          pricing: '',
          services: [],
          specialization: [],
          experience: [],
        });
      }
    };
    fetchDoctor();
  }, [user]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setDoctorData((prev: any) => ({ ...prev, [id]: value }));
  };
  const handleSelectChange = (id: string, value: string) => {
    setDoctorData((prev: any) => ({ ...prev, [id]: value }));
  };

  // Handle image upload
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
      const storageRef = ref(storage, `doctor_images/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      setAvatarUrl(photoURL);
      setDoctorData((prev: any) => ({ ...prev, image: photoURL }));
      // Update Firestore
      await setDoc(doc(db, 'doctors', user.uid), { ...doctorData, image: photoURL }, { merge: true });
      // Update auth profile
      await updateProfile(user, { photoURL });
      await refreshUser();
      toast({ title: 'Profile Image Updated', description: 'Your profile image has been updated.' });
      window.dispatchEvent(new Event('doctor-profile-updated'));
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({ title: 'Upload Error', description: 'Failed to upload new avatar.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  // Save doctor info
  const handleSave = async () => {
    if (!user || !doctorData) return;
    setIsSubmitting(true);
    try {
      // Clean insurance field if present
      let cleanedDoctorData = { ...doctorData, image: avatarUrl };
      if (cleanedDoctorData.insurance) {
        cleanedDoctorData.insurance = removeUndefined(cleanedDoctorData.insurance);
      }
      cleanedDoctorData = removeUndefined(cleanedDoctorData);
      await setDoc(doc(db, 'doctors', user.uid), cleanedDoctorData, { merge: true });
      toast({ title: 'Profile Updated', description: 'Your profile information has been updated.' });
      window.dispatchEvent(new Event('doctor-profile-updated'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ title: 'Error', description: 'Could not update your profile.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
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

  // Add these handlers and helpers in the component:
  const addClinic = () => {
    setDoctorData((prev: any) => ({
      ...prev,
      clinics: [...(prev.clinics || []), { id: uuidv4(), name: '', location: '', address: '', logo: '', gallery: [] }],
    }));
    updateClinicsToFirestore([...(doctorData?.clinics || []), { id: uuidv4(), name: '', location: '', address: '', logo: '', gallery: [] }]);
  };
  const removeClinic = (id: string) => {
    const newClinics = (doctorData?.clinics || []).filter((c: any) => c.id !== id);
    setDoctorData((prev: any) => ({ ...prev, clinics: newClinics }));
    updateClinicsToFirestore(newClinics);
  };
  const updateClinicField = (id: string, field: string, value: any) => {
    const newClinics = (doctorData?.clinics || []).map((c: any) => c.id === id ? { ...c, [field]: value } : c);
    setDoctorData((prev: any) => ({ ...prev, clinics: newClinics }));
    updateClinicsToFirestore(newClinics);
  };
  const handleClinicLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `doctor_clinics/${user.uid}/${id}/logo`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    updateClinicField(id, 'logo', url);
  };
  const handleClinicGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (!e.target.files || !user) return;
    const files = Array.from(e.target.files);
    const urls: string[] = [];
    for (const file of files) {
      const storageRef = ref(storage, `doctor_clinics/${user.uid}/${id}/gallery/${uuidv4()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    const clinic = (doctorData?.clinics || []).find((c: any) => c.id === id);
    updateClinicField(id, 'gallery', [...(clinic?.gallery || []), ...urls]);
  };
  const removeClinicGalleryImage = (id: string, img: string) => {
    const clinic = (doctorData?.clinics || []).find((c: any) => c.id === id);
    if (!clinic) return;
    const newGallery = (clinic.gallery || []).filter((g: string) => g !== img);
    updateClinicField(id, 'gallery', newGallery);
  };
  const updateClinicsToFirestore = async (clinics: any[]) => {
    if (!user) return;
    await setDoc(doc(db, 'doctors', user.uid), { clinics }, { merge: true });
    window.dispatchEvent(new Event('doctor-profile-updated'));
  };

  const addEducation = () => {
    setDoctorData((prev: any) => ({
      ...prev,
      education: [...(prev.education || []), { id: uuidv4(), institution: '', course: '', startDate: '', endDate: '', years: '', description: '', logo: '' }],
    }));
    updateEducationToFirestore([...(doctorData?.education || []), { id: uuidv4(), institution: '', course: '', startDate: '', endDate: '', years: '', description: '', logo: '' }]);
  };
  const removeEducation = (id: string) => {
    const newEducation = (doctorData?.education || []).filter((e: any) => e.id !== id);
    setDoctorData((prev: any) => ({ ...prev, education: newEducation }));
    updateEducationToFirestore(newEducation);
  };
  const updateEducationField = (id: string, field: string, value: any) => {
    const newEducation = (doctorData?.education || []).map((e: any) => e.id === id ? { ...e, [field]: value } : e);
    setDoctorData((prev: any) => ({ ...prev, education: newEducation }));
    updateEducationToFirestore(newEducation);
  };
  const handleEducationLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `doctor_education/${user.uid}/${id}/logo`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    updateEducationField(id, 'logo', url);
  };
  const updateEducationToFirestore = async (education: any[]) => {
    if (!user) return;
    // Clean the education array before saving
    const cleanedEducation = removeUndefined(
      education.map(e => ({
        ...e,
        logoPreview: undefined,
        isExpanded: undefined,
        // If your UI uses File objects for logo, remove or convert to string
        logo: typeof e.logo === 'string' ? e.logo : undefined,
        startDate: e.startDate ? e.startDate : null,
        endDate: e.endDate ? e.endDate : null,
      }))
    );
    await setDoc(doc(db, 'doctors', user.uid), { education: cleanedEducation }, { merge: true });
    window.dispatchEvent(new Event('doctor-profile-updated'));
  };

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
          <TabsTrigger value="social">Social Media</TabsTrigger>
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
                <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>{doctorData?.name?.charAt(0) || ''}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button asChild>
                    <label htmlFor="avatar-upload"><Upload className="mr-2 h-4 w-4" /> Change Photo</label>
                  </Button>
                  <input id="avatar-upload" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                  <p className="text-xs text-muted-foreground">Allowed JPG, GIF or PNG. Max size of 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="form-wrap">
                  <Label htmlFor="firstName">First Name <span className="text-danger">*</span></Label>
                  <Input id="firstName" value={doctorData?.firstName || ''} onChange={handleInputChange} />
                </div>
                <div className="form-wrap">
                  <Label htmlFor="lastName">Last Name <span className="text-danger">*</span></Label>
                  <Input id="lastName" value={doctorData?.lastName || ''} onChange={handleInputChange} />
                </div>
                <div className="form-wrap">
                  <Label htmlFor="name">Display Name <span className="text-danger">*</span></Label>
                  <Input id="name" value={doctorData?.name || ''} onChange={handleInputChange} />
                </div>
                <div className="form-wrap">
                  <Label htmlFor="designation">Designation <span className="text-danger">*</span></Label>
                  <Input id="designation" value={doctorData?.designation || ''} onChange={handleInputChange} />
                </div>
                <div className="form-wrap">
                  <Label htmlFor="phone">Phone Number <span className="text-danger">*</span></Label>
                  <Input id="phone" type="tel" value={doctorData?.phone || ''} onChange={handleInputChange} />
                </div>
                <div className="form-wrap">
                  <Label htmlFor="email">Email Address <span className="text-danger">*</span></Label>
                  <Input id="email" type="email" value={doctorData?.email || ''} disabled />
                </div>
                <div className="form-wrap md:col-span-3">
                  <Label htmlFor="languages">Known Languages <span className="text-danger">*</span></Label>
                  <TagsInput
                    value={doctorData?.languages || []}
                    onChange={(langs) => setDoctorData((prev: any) => ({ ...prev, languages: langs }))}
                    name="languages"
                    placeHolder="Type"
                  />
                </div>
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea id="bio" value={doctorData?.bio || ''} onChange={handleInputChange} rows={5} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="education">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold">Education</h3>
            <Button onClick={addEducation} className="btn btn-primary prime-btn">Add New Education</Button>
          </div>
          <div className="space-y-6">
            {doctorData?.education?.map((edu: any, idx: number) => (
              <div key={edu.id} className="bg-white rounded-xl shadow p-0 mb-4 border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4">
                  <button
                    type="button"
                    className="flex-1 text-left focus:outline-none"
                    onClick={() => toggleEducation(edu.id)}
                  >
                    <h4 className="font-semibold text-lg">{edu.institution || `Education ${idx + 1}`}</h4>
                  </button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                    onClick={() => removeEducation(edu.id)}
                  >
                    Delete
                  </Button>
                  <span className={`transition-transform ml-2 ${expandedEducation === edu.id ? 'rotate-90' : ''}`}>▶</span>
                </div>
                {expandedEducation === edu.id && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Logo</Label>
                        <div className="flex items-center gap-4 mt-1">
                          {edu.logo && <img src={edu.logo} alt="Logo" className="w-16 h-16 rounded-full object-cover border" />}
                          <input type="file" accept="image/*" onChange={e => handleEducationLogoUpload(e, edu.id)} className="block" />
                        </div>
                      </div>
                      <div>
                        <Label>Name of the institution</Label>
                        <Input value={edu.institution || ''} onChange={e => updateEducationField(edu.id, 'institution', e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label>Course</Label>
                        <Input value={edu.course || ''} onChange={e => updateEducationField(edu.id, 'course', e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <DatePicker
                          className="form-control mt-1"
                          selected={edu.startDate && !isNaN(Date.parse(edu.startDate)) ? new Date(edu.startDate) : null}
                          onChange={(date: Date | null) => updateEducationField(edu.id, 'startDate', date ? date.toISOString() : '')}
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <DatePicker
                          className="form-control mt-1"
                          selected={edu.endDate && !isNaN(Date.parse(edu.endDate)) ? new Date(edu.endDate) : null}
                          onChange={(date: Date | null) => updateEducationField(edu.id, 'endDate', date ? date.toISOString() : '')}
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                      <div>
                        <Label>No of Years</Label>
                        <Input value={edu.years || ''} onChange={e => updateEducationField(edu.id, 'years', e.target.value)} className="mt-1" />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea value={edu.description || ''} onChange={e => updateEducationField(edu.id, 'description', e.target.value)} rows={3} className="mt-1" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experience">
            <ExperienceCard
              items={doctorData?.experience || []}
              onChange={(items: ExperienceItem[]) => setDoctorData((prev: any) => ({ ...prev, experience: items }))}
            />
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
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold">Clinics</h3>
            <Button onClick={addClinic} className="btn btn-primary prime-btn">Add New Clinic</Button>
          </div>
          <div className="space-y-6">
            {doctorData?.clinics?.map((clinic: any, idx: number) => (
              <div key={clinic.id} className="bg-white rounded-xl shadow p-0 mb-4 border border-gray-200">
                <div
                  className="w-full flex items-center justify-between px-6 py-4 focus:outline-none cursor-pointer"
                  onClick={() => toggleClinic(clinic.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleClinic(clinic.id); }}
                >
                  <h4 className="font-semibold text-lg">{clinic.name || `Clinic ${idx + 1}`}</h4>
                  <div className="flex items-center gap-2">
                    <Button variant="destructive" size="sm" onClick={e => { e.stopPropagation(); removeClinic(clinic.id); }}>Delete</Button>
                    <span className={`transition-transform ${expandedClinic === clinic.id ? 'rotate-90' : ''}`}>▶</span>
                  </div>
                </div>
                {expandedClinic === clinic.id && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Logo</Label>
                        <div className="flex items-center gap-4 mt-1">
                          {clinic.logo && <img src={clinic.logo} alt="Clinic Logo" className="w-16 h-16 rounded-full object-cover border" />}
                          <input type="file" accept="image/*" onChange={e => handleClinicLogoUpload(e, clinic.id)} className="block" />
                        </div>
                      </div>
                      <div>
                        <Label>Clinic Name</Label>
                        <Input value={clinic.name || ''} onChange={e => updateClinicField(clinic.id, 'name', e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input value={clinic.location || ''} onChange={e => updateClinicField(clinic.id, 'location', e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label>Address</Label>
                        <Input value={clinic.address || ''} onChange={e => updateClinicField(clinic.id, 'address', e.target.value)} className="mt-1" />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Gallery</Label>
                        <input type="file" accept="image/*" multiple onChange={e => handleClinicGalleryUpload(e, clinic.id)} className="block mt-1" />
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {clinic.gallery?.map((img: string, i: number) => (
                            <div key={i} className="relative group">
                              <img src={img} alt="Gallery" className="w-20 h-20 object-cover rounded border" />
                              <Button size="icon" variant="destructive" className="absolute top-0 right-0 opacity-80 group-hover:opacity-100" onClick={() => removeClinicGalleryImage(clinic.id, img)}><span>&times;</span></Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services">
            <div className="grid lg:grid-cols-2 gap-6">
                <InfoCard title="Services" placeholder="e.g. Digital Bloods" field="services" userId={user?.uid || ''} />
                <InfoCard title="Specialization" placeholder="e.g. Urology" field="specialization" userId={user?.uid || ''} />
                <InfoCard title="Awards" placeholder="e.g. Best Surgeon" field="awards" userId={user?.uid || ''} hasExtraFields={true} />
            </div>
        </TabsContent>

        <TabsContent value="registrations">
            <RegistrationCard />
        </TabsContent>
        
        <TabsContent value="memberships">
            <InfoCard title="Memberships" placeholder="e.g. American Medical Association" field="memberships" userId={user?.uid || ''} />
        </TabsContent>

        <TabsContent value="insurance">
            <InfoCard title="Accepted Insurance" placeholder="e.g. Blue Cross" field="insurance" userId={user?.uid || ''} />
        </TabsContent>

        <TabsContent value="social">
            <SocialLinksCard />
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
        <Button size="lg" onClick={handleSave} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save Changes</Button>
      </div>
    </div>
  );
}
