
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Loader2 } from 'lucide-react';

const prescriptionItemSchema = z.object({
  name: z.string().min(1, 'Medication name is required.'),
  quantity: z.coerce.number().min(1, 'Quantity is required.'),
  days: z.coerce.number().min(1, 'Days are required.'),
  morning: z.boolean().default(false),
  afternoon: z.boolean().default(false),
  evening: z.boolean().default(false),
  night: z.boolean().default(false),
});

const formSchema = z.object({
  items: z.array(prescriptionItemSchema).min(1, 'At least one medication is required.'),
});

type PrescriptionFormValues = z.infer<typeof formSchema>;

interface AddPrescriptionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  patient: { id: string; name: string, image?: string };
}

export function AddPrescriptionDialog({ isOpen, setIsOpen, patient }: AddPrescriptionDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ name: '', quantity: 0, days: 0, morning: false, afternoon: false, evening: false, night: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const onSubmit = async (data: PrescriptionFormValues) => {
    if (!user || !patient) {
      toast({ title: 'Error', description: 'Authentication or patient data is missing.', variant: 'destructive' });
      return;
    }

    const prescriptionData = {
      patientId: patient.id,
      patientName: patient.name,
      doctor: user.displayName || 'N/A',
      doctorImage: user.photoURL || '',
      date: new Date().toISOString(),
      items: data.items,
      createdAt: serverTimestamp(),
    };
    
    try {
        const patientPrescriptionsRef = collection(db, 'users', patient.id, 'prescriptions');
        await addDoc(patientPrescriptionsRef, prescriptionData);
        
        toast({ title: 'Prescription Saved', description: `Prescription for ${patient.name} has been successfully created.` });
        form.reset();
        setIsOpen(false);
    } catch(error) {
        console.error("Error saving prescription:", error);
        toast({ title: 'Error', description: 'Failed to save the prescription.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Prescription for {patient.name}</DialogTitle>
          <DialogDescription>
            Create and save a new prescription. The patient will be able to view it in their dashboard.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-h-[50vh] overflow-y-auto pr-4">
                <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FormField control={form.control} name={`items.${index}.name`} render={({ field }) => (
                                <FormItem className="col-span-2"><FormLabel>Medication Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                                <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name={`items.${index}.days`} render={({ field }) => (
                                <FormItem><FormLabel>Days</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div>
                             <FormLabel>Timing</FormLabel>
                             <div className="flex items-center space-x-4 mt-2">
                                <FormField control={form.control} name={`items.${index}.morning`} render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0">Morning</FormLabel></FormItem>
                                )}/>
                                <FormField control={form.control} name={`items.${index}.afternoon`} render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0">Afternoon</FormLabel></FormItem>
                                )}/>
                                <FormField control={form.control} name={`items.${index}.evening`} render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0">Evening</FormLabel></FormItem>
                                )}/>
                                <FormField control={form.control} name={`items.${index}.night`} render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0">Night</FormLabel></FormItem>
                                )}/>
                             </div>
                        </div>
                        {fields.length > 1 && (
                            <div className="text-right">
                                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
                </div>
            </div>
             <div className="flex justify-between items-center">
                <Button type="button" variant="outline" onClick={() => append({ name: '', quantity: 0, days: 0, morning: false, afternoon: false, evening: false, night: false })}>
                    <Plus className="mr-2 h-4 w-4" /> Add Medication
                </Button>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Prescription
                    </Button>
                </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

