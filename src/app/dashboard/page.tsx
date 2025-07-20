'use client';

import React, { useEffect } from "react";
import {
  LineChart, AreaChart, Area, Line, BarChart, Bar, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis,
  Legend, ResponsiveContainer, PolarRadiusAxis, RadialBarChart, RadialBar, Text
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

import {
  Heart, Thermometer, Brain, Droplets, Scale,
  ArrowUp, ArrowDown
} from "lucide-react";

import { usePatientDataStore } from "@/store/patient-data-store";

const healthRecords = [
  { title: "Heart Rate", value: "140 Bpm", trend: "2%", icon: Heart, trendDirection: 'up' as const },
  { title: "Body Temperature", value: "37.5°C", icon: Thermometer },
  { title: "Glucose Level", value: "70-90", trend: "6%", icon: Brain, trendDirection: 'down' as const },
  { title: "SPO2", value: "96%", icon: Droplets },
  { title: "Blood Pressure", value: "100 mg/dl", trend: "2%", icon: Droplets, trendDirection: 'up' as const },
  { title: "BMI", value: "20.1 kg/m²", icon: Scale }
];

const biologicalAgeData = [
  { subject: 'Biological', A: 80, fullMark: 100 },
  { subject: 'Metabolic', A: 40, fullMark: 100 },
  { subject: 'Lipid', A: 60, fullMark: 100 },
  { subject: 'Heme-Immune', A: 30, fullMark: 100 },
  { subject: 'Kidney', A: 70, fullMark: 100 },
  { subject: 'Liver', A: 90, fullMark: 100 },
];

const riskData = [
  { name: 'Cancer', value: 4.94, fill: 'var(--color-chart-1)' },
  { name: 'COPD', value: 14.45, fill: 'var(--color-chart-2)' },
  { name: 'Stroke', value: 17.54, fill: 'var(--color-chart-3)' },
  { name: 'Type 2 Diabetes', value: 17.32, fill: 'var(--color-chart-4)' },
  { name: 'Heart Disease', value: 34.21, fill: 'var(--color-chart-5)' },
];

const CustomLabel = (props: any) => {
  const { x, y, value, payload } = props;
  if (!payload) return null;

  return (
    <Text x={x} y={y} dy={5} fill="hsl(var(--foreground))" fontSize={12} textAnchor="start">
      {payload.name} {value}%
    </Text>
  );
};

export default function PatientDashboardPage() {
  // Get patient health report from store
  const { healthReport, isLoading } = usePatientDataStore();

  // Placeholder data for patient info and other UI sections
  const patientName = "Hendrita";
  const patientImg = "/assets/img/ai doctor.png";

  // Favourites doctors placeholder
  const favDoctors = [
    { name: 'Dr. Edalin', specialty: 'Endodontists', img: '/assets/img/ai doctor.png' },
    { name: 'Dr. Maloney', specialty: 'Cardiologist', img: '/assets/img/ai doctor.png' },
    { name: 'Dr. Wayne', specialty: 'Dental Specialist', img: '/assets/img/ai doctor.png' },
    { name: 'Dr. Marla', specialty: 'Endodontists', img: '/assets/img/ai doctor.png' },
  ];

  // Upcoming appointments placeholder
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

  // Dependents placeholder
  const dependants = [
    { name: 'Laura', relation: 'Mother', age: '58 years 20 days', img: '/assets/img/ai doctor.png' },
    { name: 'Mathew', relation: 'Father', age: '59 years 15 days', img: '/assets/img/ai doctor.png' },
  ];

  // Reports placeholder
  const reportsTable = [
    { id: '#AP1236', doctor: 'Dr. Robert Womack', date: '21 Mar 2025, 10:30 AM', type: 'Video call', status: 'Upcoming' },
    { id: '#AP3656', doctor: 'Dr. Patricia Cassidy', date: '28 Mar 2025, 11:40 AM', type: 'Clinic Visit', status: 'Completed' },
    { id: '#AP1246', doctor: 'Dr. Kevin Evans', date: '02 Apr 2025, 09:20 AM', type: 'Audio Call', status: 'Completed' },
    { id: '#AP6985', doctor: 'Dr. Lisa Keating', date: '15 Apr 2025, 04:10 PM', type: 'Clinic Visit', status: 'Cancelled' },
    { id: '#AP3659', doctor: 'Dr. John Hammer', date: '10 May 2025, 06:00 PM', type: 'Video Call', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto p-4">

      {/* Patient Header */}
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

      {/* Health Records Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {healthRecords.map((record, index) => (
          <Card key={index} className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{record.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{record.value}</p>
                {record.trend && (
                  <p className={`text-xs flex items-center ${record.trendDirection === 'up' ? 'text-destructive' : 'text-primary'}`}>
                    {record.trendDirection === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {record.trend}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Health Report */}
      <Card className="col-span-1 lg:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle>Overall Report</CardTitle>
          <CardDescription>Report generated on last visit: 25 Mar 2025</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative w-full aspect-square">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={biologicalAgeData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Radar name="Biological Age" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Your health is {healthReport?.percentage ?? 0}% Normal</h3>
            <p className="text-muted-foreground mt-2">
              {healthReport?.details ?? 'No detailed report available.'}
            </p>
            <Progress value={healthReport?.percentage ?? 0} className="mt-4 h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Risk of Disease and Telomere Length */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Your Risk of Disease</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="10%"
                outerRadius="80%"
                data={riskData}
                startAngle={180}
                endAngle={0}
                barSize={15}
              >
                <RadialBar
                  minAngle={15}
                  label={{ content: CustomLabel }}
                  background
                  dataKey="value"
                />
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-5xl font-bold fill-foreground"
                >
                  74th
                </text>
                <text
                  x="50%"
                  y="65%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-lg fill-muted-foreground"
                >
                  Percentile
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Telomere Length</CardTitle>
            <CardDescription>Your telomere length matches that of a typical 50-year-old.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { age: 10, length: 5.8 },
                { age: 20, length: 5.6 },
                { age: 30, length: 5.5 },
                { age: 40, length: 5.2 },
                { age: 50, length: 4.5 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="age" unit="yrs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                <Line type="monotone" dataKey="length" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Full Report</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Favourites, Appointments, Notifications, Dependents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Favourites */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Favourites</CardTitle>
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
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
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
        <Card className="lg:col-span-4">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Notifications</CardTitle>
            <Link href="/dashboard/notifications" className="text-primary text-sm">View All</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {notificationList.map((n, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="text-sm">{n.text}</div>
                <div className="text-xs text-muted-foreground">{n.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Dependents */}
      <Card className="mt-6 w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Dependants</CardTitle>
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

      {/* Reports Table */}
      <div className="mt-10 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
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
