
'use client';

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { usePatientDataStore, type HealthRecord, type UpcomingAppointment } from '@/store/patient-data-store';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Heart, 
  Thermometer, 
  Droplets, 
  User, 
  FilePlus2, 
  Eye, 
  Download, 
  Trash2 
} from 'lucide-react';

// Types for the patient data
type PatientDetails = {
  name: string;
  age?: string;
  gender?: string;
  bloodGroup?: string;
  lastVisit?: string;
  photoURL?: string;
};

// Types for the tabs content
interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  dateTime: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  amount: number;
}

interface Prescription {
  id: string;
  doctor: string;
  date: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
}

interface MedicalRecord {
  id: string;
  name: string;
  date: string;
  description: string;
  type: string;
}

interface Billing {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Pending';
  description: string;
}

export function PatientProfile({ patientId }: { patientId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Get patient data from the store
  const {
    healthRecords,
    healthReport,
    upcomingAppointments = [],
    isLoading: isStoreLoading,
    fetchPatientData,
    clearPatientData
  } = usePatientDataStore();

  // Fetch patient data when component mounts
  useEffect(() => {
    const unsubscribe = fetchPatientData(patientId);
    setIsLoading(false);
    
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
      clearPatientData();
    };
  }, [patientId, fetchPatientData, clearPatientData]);

  // Extract patient details from health records
  const getPatientDetails = (): PatientDetails => {
    const details: PatientDetails = {
      name: 'Patient',
    };

    healthRecords.forEach(record => {
      switch (record.title.toLowerCase()) {
        case 'name':
          details.name = record.value;
          break;
        case 'age':
          details.age = record.value;
          break;
        case 'gender':
          details.gender = record.value;
          break;
        case 'blood group':
          details.bloodGroup = record.value;
          break;
        case 'last visit':
          details.lastVisit = record.value;
          break;
        case 'photo':
          details.photoURL = record.value;
          break;
      }
    });

    return details;
  };

  const patientDetails = getPatientDetails();

  // Show loading state while data is being fetched
  if (isLoading || isStoreLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!patientDetails || healthRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">Patient Data Unavailable</h2>
          <p className="text-muted-foreground">
            We couldn't load the patient's information. Please try again later.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Patient Profile</h1>
      </div>

      {/* Patient Summary Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>
                {patientDetails.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{patientDetails.name}</h2>
              <p className="text-sm text-muted-foreground">Patient ID: {patientId}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {patientDetails.age && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{patientDetails.age} years</p>
              </div>
            )}
            {patientDetails.gender && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{patientDetails.gender}</p>
              </div>
            )}
            {patientDetails.bloodGroup && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-medium">{patientDetails.bloodGroup}</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Visit</p>
              <p className="font-medium">
                {patientDetails.lastVisit ? format(new Date(patientDetails.lastVisit), 'do MMM yyyy') : 'N/A'}
              </p>
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
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Appt Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appt: UpcomingAppointment, index: number) => (
                    <TableRow key={`${appt.doctor}-${index}`}>
                      <TableCell>{appt.doctor}</TableCell>
                      <TableCell>{format(new Date(appt.dateTime), 'do MMM yyyy')}</TableCell>
                      <TableCell>${Math.floor(Math.random() * 500) + 100}</TableCell>
                      <TableCell>
                        <Badge variant="default">
                          {index % 2 === 0 ? 'Upcoming' : 'Completed'}
                        </Badge>
                      </TableCell>
                    </TableRow>
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
              <Button><FilePlus2 className="mr-2 h-4 w-4"/> Add Prescription</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Prescribed By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.slice(0, 2).map((appt: UpcomingAppointment, index: number) => (
                    <TableRow key={`prescription-${index}`}>
                      <TableCell>#PRE{index + 1}</TableCell>
                      <TableCell>{appt.doctor}</TableCell>
                      <TableCell>{format(new Date(), 'do MMM yyyy')}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
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
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: '1', name: 'Blood Test', date: new Date(), description: 'Complete Blood Count' },
                    { id: '2', name: 'X-Ray', date: new Date(), description: 'Chest X-Ray' },
                  ].map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{format(item.date, 'do MMM yyyy')}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="space-x-1">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
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
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 'INV001', date: new Date(), amount: 150, status: 'Paid' as const },
                    { id: 'INV002', date: new Date(), amount: 225, status: 'Pending' as const },
                  ].map(item => (
                    <TableRow key={item.id}>
                      <TableCell>#{item.id}</TableCell>
                      <TableCell>{format(item.date, 'do MMM yyyy')}</TableCell>
                      <TableCell>${item.amount}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'Paid' ? 'default' : 'destructive'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add any additional modals or dialogs here */}
    </div>
  );
}
