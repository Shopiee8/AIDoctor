
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db, storage } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, setDoc, deleteDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Download, Trash2, Edit, FileText, CalendarIcon, Loader2, Upload } from 'lucide-react';


// Types
interface MedicalRecord {
  id: string;
  name: string;
  date: string;
  recordFor: string;
  recordForImage?: string;
  comments: string;
  fileUrl?: string;
  timestamp: any;
}

interface Prescription {
  id: string;
  date: string;
  doctor: string;
  doctorImage?: string;
  items: {
      name: string;
      quantity: number;
      days: number;
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
      night: boolean;
  }[];
}

const recordFormSchema = z.object({
  name: z.string().min(1, 'Title is required.'),
  recordFor: z.string().min(1, 'Patient name is required.'),
  date: z.date({ required_error: "A date is required." }),
  comments: z.string().min(1, 'Comments are required.'),
  file: z.any().optional(),
});

type RecordFormValues = z.infer<typeof recordFormSchema>;

export default function MedicalRecordsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const recordsQuery = query(collection(db, 'users', user.uid, 'medical-records'), orderBy('timestamp', 'desc'));
        const prescriptionsQuery = query(collection(db, 'users', user.uid, 'prescriptions'), orderBy('date', 'desc'));

        const unsubRecords = onSnapshot(recordsQuery, (snapshot) => {
            const fetchedRecords: MedicalRecord[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as MedicalRecord));
            setMedicalRecords(fetchedRecords);
            if (isLoading) setIsLoading(false);
        }, (error) => {
            console.error("Error fetching medical records: ", error);
            toast({ title: "Error", description: "Could not fetch medical records.", variant: "destructive" });
        });

        const unsubPrescriptions = onSnapshot(prescriptionsQuery, (snapshot) => {
            const fetchedPrescriptions: Prescription[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Prescription));
            setPrescriptions(fetchedPrescriptions);
             if (isLoading) setIsLoading(false);
        }, (error) => {
             console.error("Error fetching prescriptions: ", error);
             toast({ title: "Error", description: "Could not fetch prescriptions.", variant: "destructive" });
        });

        return () => {
            unsubRecords();
            unsubPrescriptions();
        }
    }, [user, toast, isLoading]);

    if (isLoading) {
        return <RecordsSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Medical Records</h1>
                <p className="text-muted-foreground">Manage your medical records and prescriptions.</p>
            </div>
            
            <Tabs defaultValue="medical-records">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                </TabsList>
                <TabsContent value="medical-records">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Your Records</CardTitle>
                            <RecordFormDialog user={user} />
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Record For</TableHead>
                                        <TableHead>Comments</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {medicalRecords.length > 0 ? medicalRecords.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium text-primary">#{record.id.slice(0, 6)}</TableCell>
                                            <TableCell className="font-medium">{record.name}</TableCell>
                                            <TableCell>{format(new Date(record.date), 'dd MMM yyyy')}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={record.recordForImage || user?.photoURL || undefined} />
                                                        <AvatarFallback>{record.recordFor?.[0] || 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{record.recordFor}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{record.comments}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    {record.fileUrl && (
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <a href={record.fileUrl} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4"/></a>
                                                        </Button>
                                                    )}
                                                    <RecordFormDialog user={user} existingRecord={record} />
                                                    <DeleteRecordDialog recordId={record.id} userId={user!.uid} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                No medical records found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="prescriptions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Prescriptions</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Prescribed By</TableHead>
                                        <TableHead>Medications</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prescriptions.length > 0 ? prescriptions.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium text-primary">#{item.id.slice(0, 6)}</TableCell>
                                            <TableCell>{format(new Date(item.date), 'dd MMM yyyy')}</TableCell>
                                            <TableCell>
                                                 <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={item.doctorImage} />
                                                        <AvatarFallback>{item.doctor?.[0] || 'D'}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{item.doctor}</span>
                                                </div>
                                            </TableCell>
                                             <TableCell>
                                                <ul className="list-disc list-inside text-sm">
                                                    {item.items.slice(0, 2).map((med, i) => <li key={i}>{med.name}</li>)}
                                                    {item.items.length > 2 && <li>...and {item.items.length - 2} more</li>}
                                                </ul>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm">Download</Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                No prescriptions found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function RecordFormDialog({ user, existingRecord }: { user: any, existingRecord?: MedicalRecord }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const isEditMode = !!existingRecord;

    const form = useForm<RecordFormValues>({
        resolver: zodResolver(recordFormSchema),
        defaultValues: isEditMode ? {
            name: existingRecord.name,
            recordFor: existingRecord.recordFor,
            date: new Date(existingRecord.date),
            comments: existingRecord.comments,
        } : {
            name: '',
            recordFor: user?.displayName || '',
            date: new Date(),
            comments: '',
            file: null,
        }
    });
     
    useEffect(() => {
        if (open) {
            form.reset(isEditMode ? {
                name: existingRecord.name,
                recordFor: existingRecord.recordFor,
                date: new Date(existingRecord.date),
                comments: existingRecord.comments,
            } : {
                name: '',
                recordFor: user?.displayName || '',
                date: new Date(),
                comments: '',
                file: null,
            });
        }
    }, [open, form, isEditMode, existingRecord, user]);

    async function onSubmit(data: RecordFormValues) {
        if (!user) {
            toast({ title: "Not Authenticated", variant: "destructive" });
            return;
        }

        try {
            let fileUrl = existingRecord?.fileUrl || '';
            if (data.file && data.file instanceof File) {
                const storageRef = ref(storage, `medical-records/${user.uid}/${data.file.name}`);
                const uploadTask = await uploadBytes(storageRef, data.file);
                fileUrl = await getDownloadURL(uploadTask.ref);
            }

            const recordData = {
                name: data.name,
                recordFor: data.recordFor,
                recordForImage: user?.photoURL || '',
                date: format(data.date, 'yyyy-MM-dd'),
                comments: data.comments,
                fileUrl: fileUrl,
                timestamp: serverTimestamp(),
            };

            if (isEditMode) {
                const docRef = doc(db, 'users', user.uid, 'medical-records', existingRecord.id);
                await setDoc(docRef, recordData, { merge: true });
                toast({ title: "Success", description: "Record updated." });
            } else {
                const collectionRef = collection(db, 'users', user.uid, 'medical-records');
                await addDoc(collectionRef, recordData);
                toast({ title: "Success", description: "New record added." });
            }
            setOpen(false);
        } catch (error) {
            console.error("Error saving record:", error);
            toast({ title: "Error saving record", variant: "destructive" });
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditMode ? (
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                ) : (
                    <Button><Plus className="mr-2 h-4 w-4" /> Add Record</Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit' : 'Add'} Medical Record</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="recordFor" render={({ field }) => (
                            <FormItem><FormLabel>Record For</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="date" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
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
                         <FormField control={form.control} name="comments" render={({ field }) => (
                            <FormItem><FormLabel>Comments</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="file" render={({ field: { onChange, value, ...rest } }) => (
                           <FormItem>
                               <FormLabel>Upload Record</FormLabel>
                               <FormControl>
                                   <div className="relative border border-dashed rounded-lg p-4 text-center hover:border-primary">
                                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm mt-2 text-muted-foreground">{value?.name || 'Click or drag to upload'}</p>
                                        <Input
                                            type="file"
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                                            {...rest}
                                        />
                                    </div>
                               </FormControl>
                               <FormMessage />
                           </FormItem>
                        )} />

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

function DeleteRecordDialog({ recordId, userId }: { recordId: string, userId: string }) {
    const { toast } = useToast();
    
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'users', userId, 'medical-records', recordId));
            toast({ title: "Record Deleted", description: "The medical record has been removed." });
        } catch (error) {
            console.error("Error deleting record:", error);
            toast({ title: "Error", description: "Could not delete the record.", variant: "destructive" });
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
                        This action cannot be undone. This will permanently delete this record.
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


function RecordsSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
             <Tabs defaultValue="medical-records">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                </TabsList>
                <TabsContent value="medical-records">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <Skeleton className="h-8 w-36" />
                            <Skeleton className="h-10 w-28" />
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-2">
                               <Skeleton className="h-12 w-full" />
                               <Skeleton className="h-12 w-full" />
                               <Skeleton className="h-12 w-full" />
                           </div>
                        </CardContent>
                    </Card>
                </TabsContent>
             </Tabs>
        </div>
    )
}
