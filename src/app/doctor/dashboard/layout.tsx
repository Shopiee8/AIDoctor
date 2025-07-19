import { DashboardLayout } from "@/components/dashboard-layout";
import { RoleGuard } from "@/components/role-guard";

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['Doctor']}>
      <DashboardLayout userRole="Doctor">
        {children}
      </DashboardLayout>
    </RoleGuard>
  );
}
