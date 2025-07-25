
'use client';

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { usePatientDataStore } from "@/store/patient-data-store";
import { RoleGuard } from "@/components/role-guard";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { fetchPatientData, clearPatientData } = usePatientDataStore();

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
      <SidebarProvider
        style={
            {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
            <main className="flex-1 w-full flex flex-col">
                <SiteHeader />
                <div className="flex-1 p-6">{children}</div>
            </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleGuard>
  );
}
