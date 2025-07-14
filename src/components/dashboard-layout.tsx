'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Stethoscope, LayoutDashboard, HeartPulse, ClipboardPlus, Calendar, FileText, Bot, FileClock, Bell, MessageSquare, Send, Users, Settings } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

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

const doctorNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/doctor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Consults",
    href: "/doctor/dashboard",
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
    href: "/admin/dashboard", 
    icon: Bell,
  },
];


const navItemsMap: Record<string, NavItem[]> = {
    'Patient': patientNavItems,
    'Doctor': doctorNavItems,
    'Admin': adminNavItems,
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'Patient' | 'Doctor' | 'Admin';
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const pathname = usePathname();
  const navItems = navItemsMap[userRole] || [];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-7 h-7 text-primary" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight font-headline">AIDoctor</span>
              <span className="text-xs text-muted-foreground">{userRole}</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/doctor/dashboard' && item.href !== '/admin/dashboard' && pathname.startsWith(item.href))}
                  className={cn((pathname === item.href || (item.href !== '/doctor/dashboard' && item.href !== '/admin/dashboard' && pathname.startsWith(item.href))) && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary")}
                >
                  <Link href={item.href}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
