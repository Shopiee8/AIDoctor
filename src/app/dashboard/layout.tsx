
'use client';

import { RoleGuard } from "@/components/role-guard";
import { DashboardLayoutWrapper } from "./dashboard-layout-wrapper";
import PatientSidebar from "@/components/patient-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { usePathname } from "next/navigation";

// Define public routes that bypass the RoleGuard
const publicRoutes = [
  '/dashboard/become-provider',
  // Add other public routes here if needed
];

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // For public routes, render without RoleGuard
  if (isPublicRoute) {
    return (
      <DashboardLayoutWrapper requiresPatientData={false}>
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
      </DashboardLayoutWrapper>
    );
  }
  
  // For protected routes, use RoleGuard
  return (
    <RoleGuard 
      allowedRoles={['Patient']}
      skipForRoutes={publicRoutes}
    >
      <DashboardLayoutWrapper>
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
      </DashboardLayoutWrapper>
    </RoleGuard>
  );
}
