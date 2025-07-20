
'use client';

import { usePatientDataStore } from '@/store/patient-data-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Thermometer, Brain, Droplets, Scale, Star, Calendar, MessageCircle, Users, FileText, Wallet, Receipt, Activity, Settings, ChevronRight, Plus, Video, MessageSquare, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function AIDoctorPanel() {
  return (
    <aside className="hidden xl:flex flex-col w-[340px] min-h-[calc(100vh-32px)] ml-6 rounded-3xl glassmorphism bg-gradient-to-br from-[#1a233a]/80 to-[#22304a]/90 shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <div className="text-xs text-blue-200 font-semibold uppercase tracking-wide mb-1">AI Doctor</div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white">Dr. Dana</span>
            <span className="bg-blue-700 text-xs text-white px-2 py-0.5 rounded-full">GP</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="secondary" className="rounded-full bg-blue-800/80 text-white"><MessageSquare size={18} /></Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-blue-800/80 text-white"><Video size={18} /></Button>
        </div>
      </div>
      <div className="flex flex-col items-center mb-4">
        <Avatar className="w-24 h-24 border-4 border-blue-500 shadow-lg mb-2">
          <AvatarImage src="/assets/img/ai doctor.png" alt="Dr. Dana" />
          <AvatarFallback>DD</AvatarFallback>
        </Avatar>
        <div className="text-white text-lg font-semibold">Meet Dr. Dana</div>
        <div className="text-blue-200 text-xs mb-2">Your Supportive AI GP Doctor</div>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <Button variant="outline" className="w-full bg-blue-900/40 text-white border-none hover:bg-blue-800/60">Request a team meeting</Button>
        <Button variant="outline" className="w-full bg-blue-900/40 text-white border-none hover:bg-blue-800/60">Find groups</Button>
        <Button variant="outline" className="w-full bg-blue-900/40 text-white border-none hover:bg-blue-800/60">Find Game</Button>
        <Button variant="outline" className="w-full bg-blue-900/40 text-white border-none hover:bg-blue-800/60">Emergency</Button>
        <Button variant="outline" className="w-full bg-blue-900/40 text-white border-none hover:bg-blue-800/60">More</Button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center justify-center gap-2 text-blue-300 text-xs mt-auto">
        <User size={14} /> Checked in 12h
      </div>
    </aside>
  );
}

export default function PatientDashboardPage() {
  // Placeholder data for demonstration
  const vitals = [
    { title: 'Heart Rate', value: '140 Bpm', trend: '+2%', icon: <Heart className="text-blue-400" />, color: 'text-blue-400' },
    { title: 'Body Temperature', value: '37.5°C', icon: <Thermometer className="text-blue-300" />, color: 'text-blue-300' },
    { title: 'Glucose Level', value: '70 - 90', trend: '+6%', icon: <Brain className="text-blue-500" />, color: 'text-blue-500' },
    { title: 'SPO2', value: '96%', icon: <Droplets className="text-blue-400" />, color: 'text-blue-400' },
    { title: 'Blood Pressure', value: '100 mg/dl', trend: '+2%', icon: <Droplets className="text-blue-400" />, color: 'text-blue-400' },
    { title: 'BMI', value: '20.1 kg/m²', icon: <Scale className="text-blue-500" />, color: 'text-blue-500' },
  ];
  const lastVisit = '25 Mar 2025';
  const healthStatus = '95% Normal';
  const patientName = 'Hendrita';
  const patientImg = '/assets/img/ai doctor.png';

  return (
    <div className="flex flex-row w-full min-h-[calc(100vh-32px)] gap-6">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Hello, {patientName}</h1>
            <span className="text-blue-300 text-lg font-mono">5:30 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="bg-blue-900/40 text-white border-none hover:bg-blue-800/60">Checked in 12h</Button>
            <Avatar className="w-10 h-10 border-2 border-blue-500">
              <AvatarImage src={patientImg} alt={patientName} />
              <AvatarFallback>{patientName[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        {/* Analytics Card */}
        <Card className="rounded-3xl glassmorphism bg-gradient-to-br from-[#1a233a]/80 to-[#22304a]/90 shadow-2xl border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white">Relaxation</CardTitle>
            <Button size="sm" variant="outline" className="bg-blue-900/40 text-white border-none hover:bg-blue-800/60">Last Month</Button>
          </CardHeader>
          <CardContent>
            {/* Placeholder for charts and analytics */}
            <div className="flex flex-col gap-6">
              <div className="h-40 bg-blue-950/30 rounded-xl flex items-center justify-center text-blue-200 text-lg font-semibold">[Charts Placeholder]</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vitals.map((v, i) => (
                  <div key={i} className="flex flex-col items-center bg-blue-900/40 rounded-xl p-4">
                    <div className={`mb-1 text-2xl ${v.color}`}>{v.icon}</div>
                    <div className="font-semibold text-base text-white">{v.title}</div>
                    <div className="text-xl font-bold text-white">{v.value} {v.trend && <span className="text-xs font-normal text-green-400">{v.trend}</span>}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* AI Doctor Panel */}
      <AIDoctorPanel />
    </div>
  );
}
