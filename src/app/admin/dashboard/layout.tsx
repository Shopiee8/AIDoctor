import { DashboardLayout } from "@/components/dashboard-layout";
import { NavItem } from "@/types";
import { LayoutDashboard, Bot, FileClock, Bell } from "lucide-react";

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agent Management",
    href: "/admin/dashboard/agents",
    icon: Bot,
  },
  {
    title: "System Logs",
    href: "/admin/dashboard/logs",
    icon: FileClock,
  },
  {
    title: "Alerts",
    href: "/admin/dashboard", // Part of main dashboard
    icon: Bell,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={adminNavItems} userRole="Admin">
      {children}
    </DashboardLayout>
  );
}
