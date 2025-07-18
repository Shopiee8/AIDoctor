
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const appointments = [
  { id: 'APT001', patient: 'Richard Wilson', date: '11 Nov 2023', time: '10.00 AM', purpose: 'General', type: 'New Patient', paid: 150, status: 'Completed' },
  { id: 'APT002', patient: 'Charlene Reed', date: '3 Nov 2023', time: '11.00 AM', purpose: 'General', type: 'Old Patient', paid: 200, status: 'Completed' },
  { id: 'APT003', patient: 'Travis Trimble', date: '1 Nov 2023', time: '8.30 AM', purpose: 'General', type: 'New Patient', paid: 350, status: 'Completed' },
  { id: 'APT004', patient: 'Carl Kelly', date: '30 Oct 2023', time: '9.00 AM', purpose: 'Follow Up', type: 'Old Patient', paid: 400, status: 'Completed' },
  { id: 'APT005', patient: 'Michelle Fairfax', date: '28 Oct 2023', time: '1.00 PM', purpose: 'General', type: 'New Patient', paid: 250, status: 'Cancelled' },
  { id: 'APT006', patient: 'Gina Moore', date: '27 Oct 2023', time: '10.00 AM', purpose: 'Follow Up', type: 'Old Patient', paid: 150, status: 'Upcoming' },
];

const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');
const completedAppointments = appointments.filter(a => a.status === 'Completed');
const cancelledAppointments = appointments.filter(a => a.status === 'Cancelled');

const AppointmentsTable = ({ data }: { data: typeof appointments }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Patient</TableHead>
        <TableHead>Appt Date</TableHead>
        <TableHead>Purpose</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Paid Amount</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Action</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((appt) => (
        <TableRow key={appt.id}>
          <TableCell>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person portrait" />
                <AvatarFallback>{appt.patient.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{appt.patient}</span>
            </div>
          </TableCell>
          <TableCell>{appt.date} <span className="text-muted-foreground">{appt.time}</span></TableCell>
          <TableCell>{appt.purpose}</TableCell>
          <TableCell>{appt.type}</TableCell>
          <TableCell>${appt.paid}</TableCell>
          <TableCell>
            <Badge variant={
              appt.status === 'Completed' ? 'default' :
              appt.status === 'Upcoming' ? 'secondary' : 'destructive'
            } className="capitalize">
              {appt.status === 'Completed' && <CheckCircle className="mr-1 h-3 w-3" />}
              {appt.status === 'Upcoming' && <Clock className="mr-1 h-3 w-3" />}
              {appt.status === 'Cancelled' && <XCircle className="mr-1 h-3 w-3" />}
              {appt.status}
            </Badge>
          </TableCell>
          <TableCell>
            <Button variant="outline" size="sm" asChild>
                <Link href="#"><Eye className="mr-2 h-4 w-4" />View</Link>
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
       <div>
            <h1 className="text-3xl font-bold font-headline">Appointments</h1>
            <p className="text-muted-foreground">Manage your patient appointments.</p>
        </div>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled appointments for the future.</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentsTable data={upcomingAppointments} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
           <Card>
            <CardHeader>
                <CardTitle>Completed Appointments</CardTitle>
                <CardDescription>A record of your past consultations.</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentsTable data={completedAppointments} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cancelled">
           <Card>
            <CardHeader>
                <CardTitle>Cancelled Appointments</CardTitle>
                <CardDescription>A history of appointments that were cancelled.</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentsTable data={cancelledAppointments} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
