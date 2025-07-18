
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, XCircle, Clock, Video, MessageSquare, Phone, MoreVertical, Calendar, List, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const appointments = [
  { id: 'APT006', patient: 'Gina Moore', image: `https://placehold.co/40x40.png`, date: '27 Oct 2023', time: '10.00 AM', purpose: 'Follow Up', type: 'Old Patient', paid: 150, status: 'Upcoming' as const, apptType: 'Video' as const, patientEmail: "gina@example.com", patientPhone: "+1 234 567 890" },
  { id: 'APT001', patient: 'Richard Wilson', image: `https://placehold.co/40x40.png`, date: '11 Nov 2023', time: '10.00 AM', purpose: 'General', type: 'New Patient', paid: 150, status: 'Completed' as const, apptType: 'Chat' as const, patientEmail: "richard@example.com", patientPhone: "+1 234 567 890" },
  { id: 'APT002', patient: 'Charlene Reed', image: `https://placehold.co/40x40.png`, date: '3 Nov 2023', time: '11.00 AM', purpose: 'General', type: 'Old Patient', paid: 200, status: 'Completed' as const, apptType: 'In-person' as const, patientEmail: "charlene@example.com", patientPhone: "+1 234 567 890" },
  { id: 'APT003', patient: 'Travis Trimble', image: `https://placehold.co/40x40.png`, date: '1 Nov 2023', time: '8.30 AM', purpose: 'General', type: 'New Patient', paid: 350, status: 'Completed' as const, apptType: 'Video' as const, patientEmail: "travis@example.com", patientPhone: "+1 234 567 890" },
  { id: 'APT005', patient: 'Michelle Fairfax', image: `https://placehold.co/40x40.png`, date: '28 Oct 2023', time: '1.00 PM', purpose: 'General', type: 'New Patient', paid: 250, status: 'Cancelled' as const, apptType: 'Audio' as const, patientEmail: "michelle@example.com", patientPhone: "+1 234 567 890" },
];

const apptIcons = {
    Video: Video,
    Chat: MessageSquare,
    Audio: Phone,
    'In-person': Calendar
};

type ViewMode = 'list' | 'grid';

const ListViewCard = ({ appt }: { appt: typeof appointments[0] }) => {
    const ApptIcon = apptIcons[appt.apptType];

    return (
        <div className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={appt.image} data-ai-hint="person portrait" />
                        <AvatarFallback>{appt.patient.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-bold">{appt.patient}</h4>
                        <div className="text-xs text-muted-foreground">
                            <p>{appt.patientEmail}</p>
                            <p>{appt.patientPhone}</p>
                        </div>
                    </div>
                </div>
                 <div className="flex flex-col items-end gap-1">
                    <Badge variant={
                        appt.status === 'Completed' ? 'default' :
                        appt.status === 'Upcoming' ? 'secondary' : 'destructive'
                        } className="capitalize w-28 justify-center">
                        {appt.status === 'Completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                        {appt.status === 'Upcoming' && <Clock className="mr-1 h-3 w-3" />}
                        {appt.status === 'Cancelled' && <XCircle className="mr-1 h-3 w-3" />}
                        {appt.status}
                    </Badge>
                     {appt.type === 'New Patient' && <Badge variant="outline" className="text-xs">{appt.type}</Badge>}
                 </div>
            </div>

            <div className="border-t border-b py-3 text-sm text-muted-foreground grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <p className="text-xs">Date & Time</p>
                    <p className="font-medium text-foreground">{appt.date}, {appt.time}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs">Appointment Type</p>
                    <p className="font-medium text-foreground flex items-center gap-2"><ApptIcon className="w-4 h-4 text-primary"/>{appt.apptType}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs">Purpose</p>
                    <p className="font-medium text-foreground">{appt.purpose}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-xs">Paid Amount</p>
                    <p className="font-medium text-foreground">${appt.paid}</p>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                {appt.status === 'Upcoming' && <>
                    <Button variant="outline" size="sm">Cancel</Button>
                    <Button size="sm"><Video className="mr-2 h-4 w-4"/> Start Session</Button>
                </>}
                 {appt.status === 'Completed' && <>
                    <Button variant="outline" size="sm">View Prescription</Button>
                    <Button size="sm">Add to patient record</Button>
                </>}
                 {appt.status === 'Cancelled' && <>
                    <Button variant="destructive" size="sm">Delete Record</Button>
                    <Button size="sm">Notify Patient</Button>
                </>}
            </div>
        </div>
    )
};

const GridViewCard = ({ appt }: { appt: typeof appointments[0] }) => {
    const ApptIcon = apptIcons[appt.apptType];
     return (
        <div className="border rounded-lg p-4 flex flex-col gap-3">
             <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={appt.image} data-ai-hint="person portrait" />
                        <AvatarFallback>{appt.patient.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-bold text-sm">{appt.patient}</h4>
                        <p className="text-xs text-muted-foreground">{appt.id}</p>
                    </div>
                </div>
                <ApptIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>{appt.date}, {appt.time}</span></div>
                <div className="flex items-center gap-2 text-foreground font-medium"><p className="font-medium text-foreground">{appt.purpose}</p></div>
            </div>
            <div className="flex justify-end gap-2 mt-auto pt-3 border-t">
                {appt.status === 'Upcoming' && <>
                    <Button variant="outline" size="sm" className="w-full">Cancel</Button>
                    <Button size="sm" className="w-full">Start</Button>
                </>}
                 {(appt.status === 'Completed' || appt.status === 'Cancelled') && <>
                    <Button variant="outline" size="sm" className="w-full">View Details</Button>
                </>}
            </div>
        </div>
     )
}

const AppointmentsList = ({ data, viewMode }: { data: typeof appointments, viewMode: ViewMode }) => {
    if (data.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No appointments in this category.</p>;
    }
    
    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                 {data.map((appt) => (
                    <GridViewCard key={appt.id} appt={appt} />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {data.map((appt) => (
                <ListViewCard key={appt.id} appt={appt} />
            ))}
        </div>
    );
};

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');
  const completedAppointments = appointments.filter(a => a.status === 'Completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'Cancelled');

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold font-headline">Appointments</h1>
                <p className="text-muted-foreground">Manage your patient appointments.</p>
            </div>
             <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}>
                    <List className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}>
                    <LayoutGrid className="h-4 w-4" />
                </Button>
            </div>
        </div>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Card>
            <CardContent className="p-4 md:p-6">
              <AppointmentsList data={upcomingAppointments} viewMode={viewMode} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
           <Card>
            <CardContent className="p-4 md:p-6">
              <AppointmentsList data={completedAppointments} viewMode={viewMode} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cancelled">
           <Card>
            <CardContent className="p-4 md:p-6">
              <AppointmentsList data={cancelledAppointments} viewMode={viewMode} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
