'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from './dashboard-header';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import PatientSidebar from '@/components/patient-sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'Patient' | 'Doctor' | 'Admin' | 'AI Provider' | string;
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const { user, userRole: actualUserRole, validateUserRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!validateUserRole(userRole)) {
      switch (actualUserRole) {
        case 'Patient':
          router.push('/dashboard');
          break;
        case 'Doctor':
          router.push('/doctor/dashboard');
          break;
        case 'AI Provider':
          router.push('/ai-provider/dashboard');
          break;
        case 'Admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/login');
      }
      return;
    }
  }, [user, userRole, actualUserRole, validateUserRole, router]);

  if (!user || !actualUserRole || !validateUserRole(userRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Validating access...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        {/* Sidebar is fixed at w-64 (16rem) on desktop, so main content needs ml-64 */}
        {userRole === 'Patient' ? <PatientSidebar /> : <Sidebar />}
        <div className="flex flex-col min-h-screen w-full md:ml-64">
          <DashboardHeader />
          <main className="flex-1 w-full p-6 pt-20 flex flex-col">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
