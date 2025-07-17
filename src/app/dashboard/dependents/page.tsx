
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db, storage } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, setDoc, deleteDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNowStrict, differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Edit, CalendarIcon, Loader2, Upload, User, Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


// Types
interface Dependent {
  id: string;
  name: string;
  relationship: string;
  dob: string; 
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  photoURL?: string;
  isActive: boolean;
}

const dependentFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  relationship: z.string().min(1, 'Relationship is required.'),
  dob: z.date({ required_error: "Date of birth is required." }),
  gender: z.string().min(1, 'Gender is required'),
  bloodGroup: z.string().optional(),
  photoFile: z.any().optional(),
});

type DependentFormValues = z.infer<typeof dependentFormSchema>;


// Helper function to format age
const formatAge = (dob: string) => {
    const birthDate = new Date(dob);
    const now = new Date();
    const years = differenceInYears(now, birthDate);
    if (years > 0) return `${years} years`;
    const months = differenceInMonths(now, birthDate);
    if (months > 0) return `${months} months`;
    return `${differenceInDays(now, birthDate)} days`;
}

export default function DependentsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [dependents, setDependents] = useState<Dependent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const dependentsQuery = query(collection(db, 'users', user.uid, 'dependents'), orderBy('name', 'asc'));

        const unsubscribe = onSnapshot(dependentsQuery, (snapshot) => {
            const fetchedDependents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as Dependent));
            setDependents(fetchedDependents);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching dependents: ", error);
            toast({ title: "Error", description: "Could not fetch dependents.", variant: "destructive" });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, toast]);

    const handleStatusToggle = async (dependent: Dependent) => {
        if (!user) return;
        const dependentRef = doc(db, 'users', user.uid, 'dependents', dependent.id);
        try {
            await setDoc(dependentRef, { isActive: !dependent.isActive }, { merge: true });
            toast({ title: "Status Updated", description: `${dependent.name}'s status has been changed.` });
        } catch (error) {
            console.error("Error updating status: ", error);
            toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
        }
    };

    if (isLoading) {
        return <DependentsSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">My Dependents</h1>
                    <p className="text-muted-foreground">Manage your family members' profiles.</p>
                </div>
                <DependentFormDialog user={user} />
            </div>

            {dependents.length > 0 ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {dependents.map((dep) => (
                        <Card key={dep.id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-16 h-16">
                                            <AvatarImage src={dep.photoURL} />
                                            <AvatarFallback><User className="w-8 h-8 text-muted-foreground"/></AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-lg">{dep.name}</h3>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                                <span>{dep.relationship}</span>
                                                <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                                                <span>{dep.gender}</span>
                                                <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                                                <span>{formatAge(dep.dob)} old</span>
                                            </div>
                                             <div className="text-xs text-muted-foreground mt-1">Blood Group: <strong>{dep.bloodGroup || 'N/A'}</strong></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DependentFormDialog user={user} existingDependent={dep} />
                                        <DeleteDependentDialog dependentId={dep.id} userId={user!.uid} />
                                    </div>
                                </div>
                                 <div className="border-t mt-4 pt-4 flex justify-end">
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor={`status-${dep.id}`} className="text-sm font-medium text-muted-foreground">
                                           {dep.isActive ? "Active" : "Inactive"}
                                        </label>
                                        <Switch
                                            id={`status-${dep.id}`}
                                            checked={dep.isActive}
                                            onCheckedChange={() => handleStatusToggle(dep)}
                                        />
                                    </div>
                                 </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="flex flex-col items-center justify-center text-center p-12">
                    <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <CardTitle>No Dependents Found</CardTitle>
                    <CardDescription className="mt-2">Add a family member to get started.</CardDescription>
                    <div className="mt-6">
                       <DependentFormDialog user={user} />
                    </div>
                </Card>
            )}
        </div>
    );
}

function DependentFormDialog({ user, existingDependent }: { user: any, existingDependent?: Dependent }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const isEditMode = !!existingDependent;

    const form = useForm<DependentFormValues>({
        resolver: zodResolver(dependentFormSchema),
        defaultValues: isEditMode ? {
            name: existingDependent.name,
            relationship: existingDependent.relationship,
            dob: new Date(existingDependent.dob),
            gender: existingDependent.gender,
            bloodGroup: existingDependent.bloodGroup,
        } : {
            name: '',
            relationship: '',
            dob: new Date(),
            gender: '',
            bloodGroup: '',
            photoFile: null,
        }
    });
     
    useEffect(() => {
        if (open) {
            form.reset(isEditMode ? {
                name: existingDependent.name,
                relationship: existingDependent.relationship,
                dob: new Date(existingDependent.dob),
                gender: existingDependent.gender,
                bloodGroup: existingDependent.bloodGroup,
            } : {
                name: '',
                relationship: '',
                dob: new Date(),
                gender: '',
                bloodGroup: '',
                photoFile: null,
            });
        }
    }, [open, form, isEditMode, existingDependent, user]);

    async function onSubmit(data: DependentFormValues) {
        if (!user) {
            toast({ title: "Not Authenticated", variant: "destructive" });
            return;
        }

        try {
            let photoURL = existingDependent?.photoURL || '';
            const file = data.photoFile?.[0];
            if (file && file instanceof File) {
                const storageRef = ref(storage, `dependents/${user.uid}/${file.name}`);
                const uploadTask = await uploadBytes(storageRef, file);
                photoURL = await getDownloadURL(uploadTask.ref);
            }

            const dependentData = {
                name: data.name,
                relationship: data.relationship,
                dob: format(data.dob, 'yyyy-MM-dd'),
                gender: data.gender,
                bloodGroup: data.bloodGroup || '',
                photoURL: photoURL,
                isActive: existingDependent?.isActive ?? true,
            };

            if (isEditMode) {
                const docRef = doc(db, 'users', user.uid, 'dependents', existingDependent.id);
                await setDoc(docRef, dependentData, { merge: true });
                toast({ title: "Success", description: "Dependent updated." });
            } else {
                const collectionRef = collection(db, 'users', user.uid, 'dependents');
                await addDoc(collectionRef, dependentData);
                toast({ title: "Success", description: "New dependent added." });
            }
            setOpen(false);
        } catch (error) {
            console.error("Error saving dependent:", error);
            toast({ title: "Error saving dependent", variant: "destructive" });
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditMode ? (
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                ) : (
                    <Button><Plus className="mr-2 h-4 w-4" /> Add Dependant</Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit' : 'Add'} Dependant</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="photoFile" render={({ field }) => (
                           <FormItem>
                               <FormLabel>Profile Photo</FormLabel>
                               <FormControl>
                                   <div className="relative border border-dashed rounded-lg p-4 text-center hover:border-primary">
                                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm mt-2 text-muted-foreground">{field.value?.[0]?.name || 'Click or drag to upload'}</p>
                                        <Input
                                            type="file"
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => field.onChange(e.target.files)}
                                        />
                                    </div>
                               </FormControl>
                               <FormMessage />
                           </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="relationship" render={({ field }) => (
                                <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="dob" render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className="pl-3 text-left font-normal">
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="gender" render={({ field }) => (
                                <FormItem><FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )}/>
                        </div>
                         <FormField control={form.control} name="bloodGroup" render={({ field }) => (
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

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteDependentDialog({ dependentId, userId }: { dependentId: string, userId: string }) {
    const { toast } = useToast();
    
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'users', userId, 'dependents', dependentId));
            toast({ title: "Dependent Deleted", description: "The dependent has been removed." });
        } catch (error) {
            console.error("Error deleting dependent:", error);
            toast({ title: "Error", description: "Could not delete the dependent.", variant: "destructive" });
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this dependent's record.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}


function DependentsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <Skeleton className="h-10 w-48" />
                 <Skeleton className="h-10 w-32" />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-32" />)}
            </div>
        </div>
    )
}
