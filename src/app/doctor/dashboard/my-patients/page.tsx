
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye, MapPin, Phone, Mail } from 'lucide-react';

const patients = [
  { id: 'PT001', name: 'Richard Wilson', age: 38, address: 'Newyork, USA', phone: '1-202-555-0125', email: 'richard@example.com', lastVisit: '20 Oct 2023', paid: 150 },
  { id: 'PT002', name: 'Charlene Reed', age: 29, address: 'North Carolina, USA', phone: '1-828-632-9170', email: 'charlene@example.com', lastVisit: '18 Oct 2023', paid: 200 },
  { id: 'PT003', name: 'Travis Trimble', age: 23, address: 'Maine, USA', phone: '1-207-729-9974', email: 'travis@example.com', lastVisit: '15 Oct 2023', paid: 250 },
  { id: 'PT004', name: 'Carl Kelly', age: 42, address: 'Indiana, USA', phone: '1-260-724-7769', email: 'carl@example.com', lastVisit: '12 Oct 2023', paid: 300 },
  { id: 'PT005', name: 'Michelle Fairfax', age: 25, address: 'California, USA', phone: '1-530-622-4589', email: 'michelle@example.com', lastVisit: '11 Oct 2023', paid: 180 },
];

export default function MyPatientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Patients</h1>
        <p className="text-muted-foreground">List of patients you have consulted.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Total Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person portrait" />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{patient.name}</span>
                        <p className="text-xs text-muted-foreground">{patient.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{patient.phone}</span>
                      <span className="text-muted-foreground">{patient.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>${patient.paid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
