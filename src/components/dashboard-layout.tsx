
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

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
import { 
    Stethoscope, LayoutDashboard, HeartPulse, ClipboardPlus, Calendar, FileText, 
    Bot, FileClock, Bell, MessageSquare, Send, Users, Settings, Cpu, Star, 
    UserSquare, Wallet, LogOut, Activity
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import Image from 'next/image';

const patientNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Appointments", href: "/dashboard/appointments", icon: Calendar },
  { title: "Favourites", href: "/dashboard/favourites", icon: Star },
  { title: "Dependants", href: "/dashboard/dependents", icon: UserSquare },
  { title: "Medical Records", href: "/dashboard/medical-records", icon: ClipboardPlus },
  { title: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { title: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { title: "Message", href: "/dashboard/messages", icon: MessageSquare, badge: "7" },
  { title: "Vitals", href: "/dashboard/vitals", icon: Activity },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

const doctorNavItems: NavItem[] = [
  { title: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { title: "AI Consults", href: "/doctor/dashboard", icon: MessageSquare },
  { title: "Referrals", href: "/doctor/dashboard/referrals", icon: Send },
  { title: "MDT Meetings", href: "/doctor/dashboard/meetings", icon: Users },
];

const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Agent Management", href: "/admin/dashboard/agents", icon: Bot },
  { title: "System Logs", href: "/admin/dashboard/logs", icon: FileClock },
  { title: "Alerts", href: "/admin/dashboard", icon: Bell },
];

const aiProviderNavItems: NavItem[] = [
    { title: "Dashboard", href: "/ai-provider/dashboard", icon: LayoutDashboard },
    { title: "My Agents", href: "/ai-provider/dashboard", icon: Cpu },
    { title: "Analytics", href: "/ai-provider/dashboard", icon: FileClock }
];

const navItemsMap: Record<string, NavItem[]> = {
    'Patient': patientNavItems,
    'Doctor': doctorNavItems,
    'Admin': adminNavItems,
    'AI Provider': aiProviderNavItems,
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'Patient' | 'Doctor' | 'Admin' | 'AI Provider';
}

function PatientSidebar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    // A simple check to see if the current path is active
    const isActive = (href: string) => pathname.includes(href);

    return (
        <>
            <SidebarHeader className="p-4">
                <div className="flex flex-col items-center text-center">
                    <Link href="/dashboard/settings">
                        <Image
                            src={user?.photoURL || "https://placehold.co/80x80.png"}
                            alt="User Image"
                            width={80}
                            height={80}
                            className="rounded-full border-4 border-primary/20"
                            data-ai-hint="person portrait"
                        />
                    </Link>
                    <div className="mt-3">
                        <h3 className="font-bold text-lg">
                            <Link href="/dashboard/settings">{user?.displayName || user?.email || 'User'}</Link>
                        </h3>
                        <div className="text-xs text-muted-foreground mt-1">
                            <p>Patient ID : PT254654</p>
                            <span className="mt-1 inline-flex items-center gap-1.5">
                                Female <span className="w-1 h-1 bg-muted-foreground/50 rounded-full" /> 32 years
                            </span>
                        </div>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {patientNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive(item.href)}
                                className={cn(isActive(item.href) && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary")}
                            >
                                <Link href={item.href} className="relative">
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.title}</span>
                                    {item.badge && (
                                        <small className="absolute right-3 top-1/2 -translate-y-1/2 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                            {item.badge}
                                        </small>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                 <SidebarMenu>
                     <SidebarMenuItem>
                        <SidebarMenuButton onClick={signOut}>
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                 </SidebarMenu>
            </SidebarFooter>
        </>
    );
}


function DefaultSidebar({ userRole }: { userRole: 'Doctor' | 'Admin' | 'AI Provider' }) {
    const pathname = usePathname();
    const navItems = navItemsMap[userRole] || [];
    const Icon = userRole === 'AI Provider' ? Bot : Stethoscope;

    const isActive = (href: string) => pathname === href || (href !== '/doctor/dashboard' && href !== '/admin/dashboard' && pathname.startsWith(href));

    return (
        <>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Icon className="w-7 h-7 text-primary" />
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
                                isActive={isActive(item.href)}
                                className={cn(isActive(item.href) && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary")}
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
        </>
    );
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar>
        {userRole === 'Patient' ? <PatientSidebar /> : <DefaultSidebar userRole={userRole} />}
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
