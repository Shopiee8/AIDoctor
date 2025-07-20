'use client';

import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { usePatientDataStore } from "@/store/patient-data-store";
import { RoleGuard } from "@/components/role-guard";

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
      <div className="bg-background min-h-screen">
        <DashboardLayout userRole="Patient">
          {children}
        </DashboardLayout>
      </div>
    </RoleGuard>
  );
}
