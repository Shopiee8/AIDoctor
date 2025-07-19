import { DashboardLayout } from "@/components/dashboard-layout";
import { RoleGuard } from "@/components/role-guard";

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['Patient']}>
      <DashboardLayout userRole="Patient">
        {children}
      </DashboardLayout>
    </RoleGuard>
  );
}
