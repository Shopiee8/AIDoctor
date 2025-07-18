
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Plus, Trash2 } from 'lucide-react';


const ServiceInformation = () => {
    const [services, setServices] = useState(['Digital Bllods', 'Surgery']);
    const [newService, setNewService] = useState('');

    const addService = () => {
        if (newService.trim()) {
            setServices([...services, newService.trim()]);
            setNewService('');
        }
    }
    const removeService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    }

    return (
        <Card>
            <CardHeader><CardTitle>Service Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input value={service} readOnly />
                        <Button variant="destructive" size="icon" onClick={() => removeService(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <div className="flex items-center gap-2">
                    <Input placeholder="Add new service" value={newService} onChange={(e) => setNewService(e.target.value)} />
                    <Button onClick={addService}><Plus className="mr-2 h-4 w-4" /> Add</Button>
                </div>
            </CardContent>
        </Card>
    )
}

const SpecializationInformation = () => {
    const [specializations, setSpecializations] = useState(['Urology', 'Orthopedic']);
    const [newSpec, setNewSpec] = useState('');

    const addSpec = () => {
        if (newSpec.trim()) {
            setSpecializations([...specializations, newSpec.trim()]);
            setNewSpec('');
        }
    }
     const removeSpec = (index: number) => {
        setSpecializations(specializations.filter((_, i) => i !== index));
    }

    return (
        <Card>
            <CardHeader><CardTitle>Specialization</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 {specializations.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input value={spec} readOnly />
                        <Button variant="destructive" size="icon" onClick={() => removeSpec(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <div className="flex items-center gap-2">
                    <Input placeholder="Add new specialization" value={newSpec} onChange={(e) => setNewSpec(e.target.value)} />
                    <Button onClick={addSpec}><Plus className="mr-2 h-4 w-4" /> Add</Button>
                </div>
            </CardContent>
        </Card>
    )
}


export default function DoctorSettingsPage() {
  const { user } = useAuth();
  
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

  return (
    <div className="space-y-6">
       <div>
            <h1 className="text-3xl font-bold font-headline">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your public profile and account details.</p>
        </div>
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="clinic">Clinic Info</TabsTrigger>
          <TabsTrigger value="services">Services & Specialization</TabsTrigger>
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
                  <Input id="name" value={doctorData.name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={doctorData.email} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={doctorData.phone} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" value={doctorData.dob} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={doctorData.gender}>
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
                    <Textarea id="bio" value={doctorData.bio} rows={5} />
                </div>
              </div>
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
                            <Input id="clinic-name" value={doctorData.clinicName} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="clinic-address">Clinic Address</Label>
                            <Input id="clinic-address" value={doctorData.clinicAddress} />
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
                <ServiceInformation />
                <SpecializationInformation />
            </div>
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
