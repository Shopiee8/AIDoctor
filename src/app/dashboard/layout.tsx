import { DashboardLayout } from "@/components/dashboard-layout";

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0b1727] min-h-screen">
        <DashboardLayout userRole="Patient">
            {children}
        </DashboardLayout>
    </div>
  );
}
