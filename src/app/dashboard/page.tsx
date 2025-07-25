'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FaUserMd, FaFileMedical, FaNotesMedical, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';

export default function PatientDashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      date: '2025-07-25T10:00:00',
      doctor: 'Dr. Smith',
      specialty: 'Cardiology',
    },
    {
      id: 2,
      date: '2025-07-30T14:30:00',
      doctor: 'Dr. Johnson',
      specialty: 'Dermatology',
    },
  ]);

  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      title: 'Blood Test Report',
      date: '2025-07-10',
    },
    {
      id: 2,
      title: 'MRI Scan Result',
      date: '2025-06-28',
    },
  ]);

  const [healthSummary, setHealthSummary] = useState([
    { name: 'Weight (kg)', value: 70 },
    { name: 'Blood Pressure (mmHg)', value: 120 },
    { name: 'Heart Rate (bpm)', value: 72 },
    { name: 'Blood Sugar (mg/dL)', value: 90 },
  ]);

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto p-4">
      <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Doctors</CardTitle>
            <FaUserMd className="text-blue-500 text-xl" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Appointments</CardTitle>
            <FaCalendarAlt className="text-green-500 text-xl" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Records</CardTitle>
            <FaFileMedical className="text-red-500 text-xl" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">6</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notes</CardTitle>
            <FaNotesMedical className="text-purple-500 text-xl" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">4</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={healthSummary}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs: Appointments / Records */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="w-full flex justify-start">
          <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {upcomingAppointments.map((appt) => (
              <Card key={appt.id}>
                <CardHeader>
                  <CardTitle>{appt.doctor}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Date: {format(new Date(appt.date), 'PPPpp')}</p>
                  <p>Specialty: {appt.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="records">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {medicalRecords.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <CardTitle>{record.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Date: {format(new Date(record.date), 'PPP')}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
        </CardContent>
      </Card>
    </div>
  );
}
