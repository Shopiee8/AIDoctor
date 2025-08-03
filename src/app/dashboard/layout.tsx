
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
  
  return (
    <RoleGuard allowedRoles={['Patient']}>
       <div className="flex min-h-screen w-full">
          <PatientSidebar />
          <div className="flex flex-col flex-1 overflow-x-hidden">
              <DashboardHeader />
              <main className="flex-1 w-full p-4 md:p-6 lg:p-8">
                  <div className="w-full max-w-7xl mx-auto">
                    {children}
                  </div>
              </main>
          </div>
      </div>
    </RoleGuard>
  );
}
