
'use client';

import { RoleGuard } from "@/components/role-guard";
import { DoctorSidebar } from "@/components/doctor/doctor-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  );
}
