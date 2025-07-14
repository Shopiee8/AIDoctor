import { DashboardLayout } from "@/components/dashboard-layout";
import { NavItem } from "@/types";
import { LayoutDashboard, MessageSquare, Send, Users } from "lucide-react";

const doctorNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/doctor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Consults",
    href: "/doctor/dashboard", // Main page shows this
    icon: MessageSquare,
  },
  {
    title: "Referrals",
    href: "/doctor/dashboard/referrals",
    icon: Send,
  },
  {
    title: "MDT Meetings",
    href: "/doctor/dashboard/meetings",
    icon: Users,
  },
];

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={doctorNavItems} userRole="Doctor">
      {children}
    </DashboardLayout>
  );
}
