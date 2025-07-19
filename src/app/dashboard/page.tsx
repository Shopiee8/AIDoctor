
'use client';

import { usePatientDataStore } from '@/store/patient-data-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Thermometer, Brain, Droplets, Scale, Star, Calendar, MessageCircle, Users, FileText, Wallet, Receipt, Activity, Settings, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function PatientDashboardPage() {
  // Patient data from store (replace with real data as available)
  const {
    healthRecords,
    healthReport,
    favorites,
    upcomingAppointments,
    notifications,
    dependents,
    reports,
    isLoading,
    personalDetails,
  } = usePatientDataStore();

  // Placeholder data for demonstration
  const vitals = [
    { title: 'Heart Rate', value: '140 Bpm', trend: '+2%', icon: <Heart className="text-red-500" />, color: 'text-red-500' },
    { title: 'Body Temperature', value: '37.5°C', icon: <Thermometer className="text-amber-500" />, color: 'text-amber-500' },
    { title: 'Glucose Level', value: '70 - 90', trend: '+6%', icon: <Brain className="text-blue-700" />, color: 'text-blue-700' },
    { title: 'SPO2', value: '96%', icon: <Droplets className="text-cyan-500" />, color: 'text-cyan-500' },
    { title: 'Blood Pressure', value: '100 mg/dl', trend: '+2%', icon: <Droplets className="text-red-500" />, color: 'text-red-500' },
    { title: 'BMI', value: '20.1 kg/m²', icon: <Scale className="text-purple-500" />, color: 'text-purple-500' },
  ];
  const lastVisit = '25 Mar 2025';
  const healthStatus = '95% Normal';
  const patientName = 'Hendrita';
  const patientImg = '/assets/img/ai doctor.png';

  // Favourites placeholder
  const favDoctors = [
    { name: 'Dr. Edalin', specialty: 'Endodontists', img: '/assets/img/ai doctor.png' },
    { name: 'Dr. Maloney', specialty: 'Cardiologist', img: '/assets/img/ai doctor.png' },
    { name: 'Dr. Wayne', specialty: 'Dental Specialist', img: '/assets/img/ai doctor.png' },
    { name: 'Dr. Marla', specialty: 'Endodontists', img: '/assets/img/ai doctor.png' },
  ];
  // Appointments placeholder
  const appointments = [
    { doctor: 'Dr.Edalin Hendry', specialty: 'Dentist', img: '/assets/img/ai doctor.png', date: '21 Mar 2025 - 10:30 PM' },
    { doctor: 'Dr.Juliet Gabriel', specialty: 'Cardiologist', img: '/assets/img/ai doctor.png', date: '22 Mar 2025 - 10:30 PM' },
  ];
  // Notifications placeholder
  const notificationList = [
    { text: 'Booking Confirmed on 21 Mar 2025 10:30 AM', time: 'Just Now' },
    { text: 'You have a New Review for your Appointment', time: '5 Days ago' },
    { text: 'You have Appointment with Ahmed by 01:20 PM', time: '12:55 PM' },
    { text: 'Sent an amount of $200 for an Appointment by 01:20 PM', time: '2 Days ago' },
    { text: 'You have a New Review for your Appointment', time: '5 Days ago' },
  ];
  // Dependants placeholder
  const dependants = [
    { name: 'Laura', relation: 'Mother', age: '58 years 20 days', img: '/assets/img/ai doctor.png' },
    { name: 'Mathew', relation: 'Father', age: '59 years 15 days', img: '/assets/img/ai doctor.png' },
  ];
  // Reports table placeholder
  const reportsTable = [
    { id: '#AP1236', doctor: 'Dr. Robert Womack', date: '21 Mar 2025, 10:30 AM', type: 'Video call', status: 'Upcoming' },
    { id: '#AP3656', doctor: 'Dr. Patricia Cassidy', date: '28 Mar 2025, 11:40 AM', type: 'Clinic Visit', status: 'Completed' },
    { id: '#AP1246', doctor: 'Dr. Kevin Evans', date: '02 Apr 2025, 09:20 AM', type: 'Audio Call', status: 'Completed' },
    { id: '#AP6985', doctor: 'Dr. Lisa Keating', date: '15 Apr 2025, 04:10 PM', type: 'Clinic Visit', status: 'Cancelled' },
    { id: '#AP3659', doctor: 'Dr. John Hammer', date: '10 May 2025, 06:00 PM', type: 'Video Call', status: 'Upcoming' },
  ];

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 md:px-6 py-4 md:py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-16 h-16">
          <AvatarImage src={patientImg} alt={patientName} />
          <AvatarFallback>{patientName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="text-muted-foreground">Welcome back, {patientName}!</div>
        </div>
      </div>
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
        {/* Left Column: Vitals, Overall Report, Analytics */}
        <div className="flex flex-col gap-8 xl:col-span-2">
          {/* Vitals */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
            {vitals.map((v, i) => (
              <Card key={i} className="p-4 flex flex-col items-center text-center w-full">
                <div className={`mb-2 text-2xl ${v.color}`}>{v.icon}</div>
                <div className="font-semibold text-lg">{v.title}</div>
                <div className="text-2xl font-bold">{v.value} {v.trend && <span className="text-xs font-normal text-green-500">{v.trend}</span>}</div>
              </Card>
            ))}
          </div>
          {/* Overall Report */}
          <Card className="w-full">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 w-full">
              <div>
                <div className="text-sm text-muted-foreground">Last Visit {lastVisit}</div>
                <div className="text-2xl font-bold mb-2">Your health is {healthStatus}</div>
                <Button className="mt-2">Book a new Appointment</Button>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-semibold mb-2">Overall Report</div>
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-600">95%</div>
              </div>
            </CardContent>
          </Card>
          {/* Analytics */}
          <Card className="p-4 w-full">
            <div className="font-bold text-lg mb-2">Analytics</div>
            <div className="text-sm mb-2">Mar 14 - Mar 21</div>
            <div className="flex gap-6 w-full">
              <div>
                <div className="font-semibold">Heart Rate</div>
                <div className="text-2xl font-bold">140 Bpm</div>
              </div>
              <div>
                <div className="font-semibold">Blood Pressure</div>
                <div className="text-2xl font-bold">100 mg/dl</div>
              </div>
            </div>
          </Card>
        </div>
        {/* Right Column: Favourites, Appointments, Notifications, Dependants, Reports */}
        <div className="flex flex-col gap-8 xl:col-span-1">
          {/* Favourites */}
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Favourites</CardTitle>
              <Link href="/dashboard/favourites" className="text-primary text-sm">View All</Link>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {favDoctors.map((doc, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Avatar className="w-12 h-12 mb-2">
                    <AvatarImage src={doc.img} alt={doc.name} />
                    <AvatarFallback>{doc.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="font-semibold text-sm">{doc.name}</div>
                  <div className="text-xs text-muted-foreground">{doc.specialty}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Appointments */}
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {appointments.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={a.img} alt={a.doctor} />
                    <AvatarFallback>{a.doctor[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{a.doctor}</div>
                    <div className="text-xs text-muted-foreground">{a.specialty}</div>
                    <div className="text-xs">{a.date}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Notifications */}
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <Link href="/dashboard/notifications" className="text-primary text-sm">View All</Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {notificationList.map((n, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="text-sm">{n.text}</div>
                  <div className="text-xs text-muted-foreground">{n.time}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Dependants */}
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Dependants</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">Add New</Button>
                <Link href="/dashboard/dependants" className="text-primary text-sm">View All</Link>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {dependants.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Avatar className="w-12 h-12 mb-2">
                    <AvatarImage src={d.img} alt={d.name} />
                    <AvatarFallback>{d.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="font-semibold text-sm">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.relation} - {d.age}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Reports Table (Full Width) */}
      <div className="mt-10 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto w-full">
            <table className="min-w-full text-sm w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Doctor</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportsTable.map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{r.id}</td>
                    <td className="p-2">{r.doctor}</td>
                    <td className="p-2">{r.date}</td>
                    <td className="p-2">{r.type}</td>
                    <td className="p-2">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
