

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, setDoc, deleteDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Brain, Wind, Droplets, Thermometer, Scale, Plus, CalendarIcon, Loader2, Trash2, Edit } from 'lucide-react';
import Image from 'next/image';

// Types
interface VitalsSummary {
  bloodPressure: string;
  heartRate: string;
  glucoseLevel: string;
  temperature: string;
  bmi: string;
  spo2: string;
  lastUpdated: string;
}

interface VitalsRecord {
  id: string;
  bmi: number;
  heartRate: number;
  weight: number;
  fbc: number;
  addedOn: string;
  patientName: string; 
  patientImage: string;
  timestamp: any;
}

const vitalsFormSchema = z.object({
  bmi: z.coerce.number().min(1, 'BMI is required.'),
  heartRate: z.coerce.number().min(1, 'Heart rate is required.'),
  weight: z.coerce.number().min(1, 'Weight is required.'),
  fbc: z.coerce.number().min(1, 'FBC is required.'),
  addedOn: z.date({ required_error: "A date is required." }),
});

type VitalsFormValues = z.infer<typeof vitalsFormSchema>;

export default function VitalsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [summary, setSummary] = useState<VitalsSummary | null>(null);
    const [records, setRecords] = useState<VitalsRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const vitalsCollectionRef = collection(db, 'users', user.uid, 'vitals');
        const q = query(vitalsCollectionRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedRecords: VitalsRecord[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                fetchedRecords.push({
                    id: doc.id,
                    bmi: data.bmi,
                    heartRate: data.heartRate,
                    weight: data.weight,
                    fbc: data.fbc,
                    addedOn: data.addedOn ? format(new Date(data.addedOn), 'dd MMM yyyy') : 'N/A',
                    patientName: user.displayName || 'Current User',
                    patientImage: user.photoURL || 'https://placehold.co/40x40.png',
                    timestamp: data.timestamp
                });
            });
            setRecords(fetchedRecords);

            if (fetchedRecords.length > 0) {
                const latest = fetchedRecords[0];
                setSummary({
                    bloodPressure: '120/80 mmHg', // Placeholder
                    heartRate: `${latest.heartRate} Bpm`,
                    glucoseLevel: '90 mg/dL', // Placeholder
                    temperature: '37.0 C', // Placeholder
                    bmi: `${latest.bmi} kg/m2`,
                    spo2: '98%', // Placeholder
                    lastUpdated: latest.addedOn,
                });
            } else {
                setSummary(null);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching vitals: ", error);
            toast({ title: "Error", description: "Could not fetch vitals data.", variant: "destructive" });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, toast]);

    const vitalsCards = summary ? [
        { title: "Blood Pressure", value: summary.bloodPressure, icon: Droplets, color: "text-red-500" },
        { title: "Heart Rate", value: summary.heartRate, icon: Heart, color: "text-orange-500" },
        { title: "Glucose Level", value: summary.glucoseLevel, icon: Brain, color: "text-blue-700" },
        { title: "Body Temperature", value: summary.temperature, icon: Thermometer, color: "text-amber-500" },
        { title: "BMI", value: summary.bmi, icon: Scale, color: "text-purple-500" },
        { title: "SPO2", value: summary.spo2, icon: Wind, color: "text-cyan-500" },
    ] : [];


    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
                <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Vitals</h1>
                <p className="text-muted-foreground">Your latest medical details and history.</p>
            </div>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Latest Vitals</CardTitle>
                        <CardDescription>
                            {summary ? `Last updated on: ${summary.lastUpdated}` : 'No vitals recorded yet.'}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {summary ? vitalsCards.map((vital, index) => (
                             <div key={index} className="p-4 border rounded-lg text-center shadow-sm">
                                <vital.icon className={`w-8 h-8 mx-auto mb-2 ${vital.color}`} />
                                <h4 className="text-sm font-semibold text-muted-foreground">{vital.title}</h4>
                                <p className="text-xl font-bold">{vital.value}</p>
                            </div>
                        )) : (
                            <p className="col-span-full text-center text-muted-foreground py-8">No summary available.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Vitals History</CardTitle>
                    <VitalsFormDialog user={user} />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Patient Name</TableHead>
                                <TableHead>BMI</TableHead>
                                <TableHead>Heart Rate</TableHead>
                                <TableHead>FBC Status</TableHead>
                                <TableHead>Weight</TableHead>
                                <TableHead>Added on</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {records.length > 0 ? records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium text-primary">#{record.id.slice(0, 6)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Image src={record.patientImage} alt={record.patientName} width={32} height={32} className="rounded-full" />
                                            <span>{record.patientName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{record.bmi}</TableCell>
                                    <TableCell>{record.heartRate}</TableCell>
                                    <TableCell>{record.fbc}</TableCell>
                                    <TableCell>{record.weight} Kg</TableCell>
                                    <TableCell>{record.addedOn}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <VitalsFormDialog user={user} existingRecord={record} />
                                            <DeleteVitalsDialog recordId={record.id} userId={user!.uid} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                        No vitals history found. Add a new record to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}


// --- Dialog Components ---

function VitalsFormDialog({ user, existingRecord }: { user: any, existingRecord?: VitalsRecord }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const isEditMode = !!existingRecord;

    const defaultAddValues = {
        bmi: '' as any,
        heartRate: '' as any,
        weight: '' as any,
        fbc: '' as any,
        addedOn: new Date(),
    };

    const form = useForm<VitalsFormValues>({
        resolver: zodResolver(vitalsFormSchema),
        defaultValues: isEditMode ? {
            bmi: existingRecord.bmi,
            heartRate: existingRecord.heartRate,
            weight: existingRecord.weight,
            fbc: existingRecord.fbc,
            addedOn: new Date(existingRecord.addedOn),
        } : defaultAddValues
    });

    async function onSubmit(data: VitalsFormValues) {
        if (!user) {
            toast({ title: "Not Authenticated", variant: "destructive" });
            return;
        }

        const vitalsData = {
            ...data,
            addedOn: format(data.addedOn, 'yyyy-MM-dd'),
            timestamp: serverTimestamp(),
            userId: user.uid,
        };

        try {
            if (isEditMode) {
                const docRef = doc(db, 'users', user.uid, 'vitals', existingRecord.id);
                await setDoc(docRef, vitalsData, { merge: true });
                toast({ title: "Success", description: "Vitals record updated." });
            } else {
                const collectionRef = collection(db, 'users', user.uid, 'vitals');
                await addDoc(collectionRef, vitalsData);
                toast({ title: "Success", description: "New vitals record added." });
            }
            setOpen(false);
            if (!isEditMode) {
                form.reset(defaultAddValues);
            }
        } catch (error) {
            console.error("Error saving vitals:", error);
            toast({ title: "Error saving vitals", variant: "destructive" });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditMode ? (
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                ) : (
                    <Button><Plus className="mr-2 h-4 w-4" /> Add Vitals</Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit' : 'Add'} Medical Details</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="bmi" render={({ field }) => (
                                <FormItem><FormLabel>BMI (kg/m²)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="heartRate" render={({ field }) => (
                                <FormItem><FormLabel>Heart Rate (Bpm)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="weight" render={({ field }) => (
                                <FormItem><FormLabel>Weight (Kg)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="fbc" render={({ field }) => (
                                <FormItem><FormLabel>FBC</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="addedOn" render={({ field }) => (
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
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteVitalsDialog({ recordId, userId }: { recordId: string, userId: string }) {
    const { toast } = useToast();
    
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'users', userId, 'vitals', recordId));
            toast({ title: "Record Deleted", description: "The vitals record has been removed." });
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
                        This action cannot be undone. This will permanently delete this vitals record.
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
