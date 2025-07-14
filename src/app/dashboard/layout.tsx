import { DashboardLayout } from "@/components/dashboard-layout";
import { NavItem } from "@/types";
import { LayoutDashboard, HeartPulse, ClipboardPlus, Calendar, FileText } from "lucide-react";

const patientNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Post-Op Follow-Up",
    href: "/dashboard/post-op-follow-up",
    icon: HeartPulse,
  },
  {
    title: "Automated Patient Intake",
    href: "/dashboard/patient-intake",
    icon: ClipboardPlus,
  },
  {
    title: "Appointments",
    href: "/dashboard/appointments",
    icon: Calendar,
  },
  {
    title: "Care Plan",
    href: "/dashboard/care-plan",
    icon: FileText,
  },
];

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={patientNavItems} userRole="Patient">
      {children}
    </DashboardLayout>
  );
}
