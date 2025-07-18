
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, Loader2, Eye } from 'lucide-react';

interface Invoice {
    id: string;
    patientId: string;
    patientName: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Cancelled';
}

interface Patient {
    id: string;
    name: string;
}

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
});

const invoiceFormSchema = z.object({
  patientId: z.string().min(1, "Please select a patient."),
  status: z.enum(["Pending", "Paid", "Cancelled"]),
  items: z.array(invoiceItemSchema).min(1, "Please add at least one item."),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export default function DoctorInvoicesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const invoicesQuery = query(collection(db, 'invoices'), where('doctorId', '==', user.uid), orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(invoicesQuery, (snapshot) => {
            const fetchedInvoices = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as Invoice));
            setInvoices(fetchedInvoices);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching invoices: ", error);
            toast({ title: "Error", description: "Could not fetch invoices.", variant: "destructive" });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, toast]);
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Invoices</h1>
                    <p className="text-muted-foreground">Manage and track your patient billing.</p>
                </div>
                <CreateInvoiceDialog doctorId={user?.uid} />
            </div>

            <Card>
                <CardContent className="p-6">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <TableRow><TableCell colSpan={6} className="text-center"><Loader2 className="animate-spin" /></TableCell></TableRow>}
                            {!isLoading && invoices.length === 0 && <TableRow><TableCell colSpan={6} className="text-center">No invoices found.</TableCell></TableRow>}
                            {!isLoading && invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium text-primary">#{invoice.id.slice(0, 6)}</TableCell>
                                    <TableCell>{invoice.patientName}</TableCell>
                                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                                    <TableCell>{format(new Date(invoice.date), 'dd MMM yyyy')}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            invoice.status === 'Paid' ? 'default' :
                                            invoice.status === 'Pending' ? 'secondary' : 'destructive'
                                        }>{invoice.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}


function CreateInvoiceDialog({ doctorId }: { doctorId?: string }) {
    const [open, setOpen] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const fetchPatients = async () => {
            if (!open) return;
            // In a real app, this would likely fetch patients associated with the doctor.
            // For now, we fetch all users with a 'Patient' role. This is not scalable.
            const usersRef = collection(db, 'users');
            const q = query(usersRef); // Ideally, add where('role', '==', 'Patient')
            const querySnapshot = await getDocs(q);
            const patientList: Patient[] = [];
            querySnapshot.forEach(doc => {
                 patientList.push({ id: doc.id, name: doc.data().personalDetails?.name || doc.data().email });
            });
            setPatients(patientList);
        };
        fetchPatients();
    }, [open]);

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues: {
            patientId: "",
            status: "Pending",
            items: [{ description: "", amount: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const onSubmit = async (data: InvoiceFormValues) => {
        if (!doctorId) return;

        const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);
        const selectedPatient = patients.find(p => p.id === data.patientId);

        const newInvoice = {
            doctorId,
            patientId: data.patientId,
            patientName: selectedPatient?.name || 'Unknown Patient',
            date: new Date().toISOString(),
            amount: totalAmount,
            status: data.status,
            items: data.items,
            createdAt: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, 'invoices'), newInvoice);
            // Also add to patient's subcollection
            await addDoc(collection(db, 'users', data.patientId, 'invoices'), newInvoice);

            toast({ title: "Invoice Created", description: "The new invoice has been saved successfully." });
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error("Error creating invoice: ", error);
            toast({ title: "Error", description: "Failed to create invoice.", variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Create Invoice</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <CardDescription>Fill in the details below to create a new invoice for a patient.</CardDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="patientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Patient</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a patient" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Paid">Paid</SelectItem>
                                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <Label>Invoice Items</Label>
                            <div className="mt-2 space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-start gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Item Description" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.amount`}
                                            render={({ field }) => (
                                                <FormItem className="w-40">
                                                    <FormControl>
                                                        <Input type="number" placeholder="Amount" {...field} />
                                                    </FormControl>
                                                     <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            disabled={fields.length <= 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => append({ description: "", amount: 0 })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Item
                            </Button>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Invoice
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

    