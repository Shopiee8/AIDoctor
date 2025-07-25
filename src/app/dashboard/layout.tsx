
'use client';

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { usePatientDataStore } from "@/store/patient-data-store";
import { RoleGuard } from "@/components/role-guard";
import PatientSidebar from "@/components/patient-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { usePathname } from "next/navigation";

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { fetchPatientData, clearPatientData } = usePatientDataStore();
  const pathname = usePathname();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user) {
      unsubscribe = fetchPatientData(user.uid);
    } else {
      clearPatientData();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, fetchPatientData, clearPatientData]);
  
  // If on consultation page, render children without the layout for a full-screen experience
  if (pathname === '/dashboard/consultation') {
    return <>{children}</>;
  }

  return (
    <RoleGuard allowedRoles={['Patient']}>
       <div className="flex min-h-screen">
          <PatientSidebar />
          <div className="flex flex-col flex-1 md:ml-20 lg:ml-64">
              <DashboardHeader />
              <main className="flex-1 p-6 bg-muted/30">
                  {children}
              </main>
          </div>
      </div>
    </RoleGuard>
  );
}
