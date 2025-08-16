
'use client';

import { RoleGuard } from "@/components/role-guard";
import { DoctorSidebar } from "@/components/doctor/doctor-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import PatientSidebar from "./patient-sidebar";
import { AiProviderSidebar } from "@/components/ai-provider/ai-provider-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'Patient' | 'Doctor' | 'Admin' | 'AI Provider' | string;
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  
  if (userRole === 'Patient') {
     return (
        <RoleGuard allowedRoles={['Patient']}>
            <div className="flex min-h-screen">
                <PatientSidebar />
                <div className="flex flex-col flex-1 lg:ml-64 md:ml-20">
                    <DashboardHeader />
                    <main className="flex-1 p-6 bg-muted/30">{children}</main>
                </div>
            </div>
        </RoleGuard>
     )
  }

  if (userRole === 'Doctor') {
    return (
       <RoleGuard allowedRoles={['Doctor']}>
          <div className="flex min-h-screen">
              <DoctorSidebar />
              <div className="flex-1 flex flex-col md:ml-20">
                  <DashboardHeader />
                  <main className="flex-1 p-6 bg-muted/30">
                      {children}
                  </main>
              </div>
          </div>
      </RoleGuard>
    )
  }

  // AI Provider layout
  if (userRole === 'AI Provider') {
    return (
      <RoleGuard allowedRoles={['AI Provider']}>
        <div className="flex min-h-screen">
          <AiProviderSidebar />
          <div className="flex-1 flex flex-col md:ml-64">
            <DashboardHeader />
            <main className="flex-1 p-6 bg-muted/30">
              {children}
            </main>
          </div>
        </div>
      </RoleGuard>
    );
  }

  // Fallback for other roles or if role is not provided
  return (
    <RoleGuard allowedRoles={[userRole]}>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className="flex-1 p-6 bg-muted/30">
                    {children}
                </main>
            </div>
        </div>
    </RoleGuard>
  );
}
