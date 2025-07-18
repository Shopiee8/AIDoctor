
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, orderBy, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye, FilePlus2, Link as LinkIcon, Download, Trash2, Calendar, Clock } from 'lucide-react';
import { AddPrescriptionDialog } from './add-prescription-dialog';

interface Patient {
    id: string;
    name: string;
    email: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    bloodGroup: string;
    photoURL?: string;
    lastVisit: string;
}

// Mock data structures - in a real app these would be fetched
interface Appointment { id: string; doctor: string; date: string; status: 'Upcoming' | 'Completed' | 'Cancelled'; amount: number }
interface Prescription { id: string; doctor: string; date: string; }
interface MedicalRecord { id: string; name: string; date: string; description: string; }
interface Billing { id: string; date: string; amount: number; status: 'Paid' | 'Unpaid'; }

const mockAppointments: Appointment[] = [
    { id: 'APT001', doctor: 'Dr. Edalin Hendry', date: '24 Mar 2025', status: 'Completed', amount: 300 },
    { id: 'APT002', doctor: 'Dr. John Homes', date: '17 Mar 2025', status: 'Completed', amount: 450 },
];
const mockPrescriptions: Prescription[] = [
    { id: 'PRE001', doctor: 'Dr. Edalin Hendry', date: '24 Mar 2025' },
];
const mockMedicalRecords: MedicalRecord[] = [
    { id: 'REC001', name: 'Lab Report', date: '24 Mar 2025', description: 'Glucose Test V12' },
];
const mockBillings: Billing[] = [
    { id: 'INV001', date: '24 Mar 2025', amount: 300, status: 'Paid' },
];

export function PatientProfile({ patientId }: { patientId: string }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

    useEffect(() => {
        if (!user || !patientId) {
            setIsLoading(false);
            return;
        }

        // Fetch patient data from a 'patients' collection or similar
        // For this example, we'll use mock data.
        const mockPatientData: Patient = {
            id: patientId,
            name: 'Richard Wilson',
            email: 'richard@example.com',
            age: 38,
            gender: 'Male',
            bloodGroup: 'A+',
            lastVisit: '20 Oct 2023',
            photoURL: 'https://placehold.co/100x100.png'
        };
        setPatient(mockPatientData);
        setIsLoading(false);

    }, [user, patientId, toast]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!patient) {
        return <div>Patient not found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/doctor/dashboard/my-patients"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-bold font-headline">Patient Details</h1>
            </div>
            
             <Card>
                <CardContent className="p-6">
                     <div className="flex flex-col sm:flex-row items-start gap-6">
                        <Avatar className="w-24 h-24 border">
                            <AvatarImage src={patient.photoURL} />
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold">{patient.name}</h2>
                            <p className="text-sm text-primary">#{patient.id}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                <div><p className="text-muted-foreground">Gender</p><p className="font-medium">{patient.gender}</p></div>
                                <div><p className="text-muted-foreground">Age</p><p className="font-medium">{patient.age} Years</p></div>
                                <div><p className="text-muted-foreground">Blood Group</p><p className="font-medium">{patient.bloodGroup}</p></div>
                                <div><p className="text-muted-foreground">Last Visit</p><p className="font-medium">{patient.lastVisit}</p></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="appointments">
                <TabsList>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                    <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>
                <TabsContent value="appointments">
                    <Card>
                        <CardHeader><CardTitle>Appointments</CardTitle></CardHeader>
                        <CardContent>
                           <Table>
                               <TableHeader><TableRow><TableHead>Doctor</TableHead><TableHead>Appt Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                               <TableBody>
                                   {mockAppointments.map(appt => (
                                       <TableRow key={appt.id}><TableCell>{appt.doctor}</TableCell><TableCell>{appt.date}</TableCell><TableCell>${appt.amount}</TableCell><TableCell><Badge variant={appt.status === 'Completed' ? 'default' : 'secondary'}>{appt.status}</Badge></TableCell></TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="prescriptions">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Prescriptions</CardTitle>
                            <Button onClick={() => setIsPrescriptionOpen(true)}><FilePlus2 className="mr-2 h-4 w-4"/> Add Prescription</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                               <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Prescribed By</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                               <TableBody>
                                   {mockPrescriptions.map(item => (
                                       <TableRow key={item.id}><TableCell>#{item.id}</TableCell><TableCell>{item.doctor}</TableCell><TableCell>{item.date}</TableCell><TableCell><Button variant="outline" size="icon"><Eye className="h-4 w-4"/></Button></TableCell></TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="medical-records">
                    <Card>
                        <CardHeader><CardTitle>Medical Records</CardTitle></CardHeader>
                        <CardContent>
                           <Table>
                               <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                               <TableBody>
                                   {mockMedicalRecords.map(item => (
                                       <TableRow key={item.id}><TableCell>{item.name}</TableCell><TableCell>{item.date}</TableCell><TableCell>{item.description}</TableCell><TableCell className="space-x-1"><Button variant="ghost" size="icon"><Download className="h-4 w-4"/></Button><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4"/></Button></TableCell></TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="billing">
                    <Card>
                        <CardHeader><CardTitle>Billing</CardTitle></CardHeader>
                        <CardContent>
                             <Table>
                               <TableHeader><TableRow><TableHead>Invoice ID</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                               <TableBody>
                                   {mockBillings.map(item => (
                                       <TableRow key={item.id}><TableCell>#{item.id}</TableCell><TableCell>{item.date}</TableCell><TableCell>${item.amount}</TableCell><TableCell><Badge variant={item.status === 'Paid' ? 'default' : 'destructive'}>{item.status}</Badge></TableCell></TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <AddPrescriptionDialog 
                isOpen={isPrescriptionOpen}
                setIsOpen={setIsPrescriptionOpen}
                patient={{id: patient.id, name: patient.name}}
            />
        </div>
    );
}
