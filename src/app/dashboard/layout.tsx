import { DashboardLayout } from "@/components/dashboard-layout";

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout userRole="Patient">
      {children}
    </DashboardLayout>
  );
}
