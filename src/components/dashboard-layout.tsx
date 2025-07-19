

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';
import { useEffect, useState } from 'react';
import { usePatientDataStore } from '@/store/patient-data-store';

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
    UserSquare, Wallet, LogOut, Activity, Shield, ListCollapse, UserPlus, Clock, UserCog, Mic, Key, Share2, Award, Pill, PhoneCall, Handshake
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';

const patientNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Care Plan", href: "/dashboard/care-plan", icon: FileText },
  { title: "Pharmacy", href: "/dashboard/pharmacy", icon: Pill },
  { title: "Community", href: "/dashboard/community", icon: Users },
  { title: "Clinical Trials", href: "/dashboard/clinical-trials", icon: ClipboardPlus },
  { title: "Subscriptions", href: "/dashboard/subscriptions", icon: Star },
];

const doctorNavItems: NavItem[] = [
  { title: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { title: "Appointments", href: "/doctor/dashboard/appointments", icon: Calendar },
  { title: "My Patients", href: "/doctor/dashboard/my-patients", icon: Users },
  { title: "Schedule Timings", href: "/doctor/dashboard/schedule", icon: Clock },
  { title: "AI Scribe", href: "/doctor/dashboard/ai-scribe", icon: Mic },
  { title: "MDT Meetings", href: "/doctor/dashboard/meetings", icon: UserPlus },
  { title: "Reviews", href: "/doctor/dashboard/reviews", icon: Star },
  { title: "Accounts", href: "/doctor/dashboard/accounts", icon: Wallet },
  { title: "Invoices", href: "/doctor/dashboard/invoices", icon: FileText },
  { title: "Messages", href: "/doctor/dashboard/messages", icon: MessageSquare },
  { title: "Profile Settings", href: "/doctor/dashboard/settings", icon: UserCog },
  { title: "Social Media", href: "/doctor/dashboard/social-media", icon: Share2 },
  { title: "Change Password", href: "/doctor/dashboard/change-password", icon: Key },
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
    const { personalDetails } = usePatientDataStore();

    const isActive = (href: string) => pathname === href;
    const fallbackInitial = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'W';

    return (
        <>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <Stethoscope className="w-8 h-8 text-primary" />
                    <span className="text-2xl font-bold font-headline">SerenIQ</span>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Main Menu</div>
                <SidebarMenu>
                    {patientNavItems.slice(0, 4).map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive(item.href)}
                                className={cn(isActive(item.href) && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
                            >
                                <Link href={item.href}>
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                 <div className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1 mt-4">Additional</div>
                <SidebarMenu>
                    {patientNavItems.slice(4).map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive(item.href)}
                                className={cn(isActive(item.href) && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
                            >
                                <Link href={item.href}>
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 space-y-4">
                 <div className="text-xs font-semibold text-muted-foreground uppercase">Emergency Contacts</div>
                 <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-between"><PhoneCall className="w-4 h-4"/> 911 <span className="text-primary">Call</span></Button>
                    <Button variant="outline" className="w-full justify-between"><Avatar className="w-5 h-5"><AvatarImage src="https://placehold.co/20x20.png" /></Avatar> Sarah <span className="text-primary">Call</span></Button>
                    <Button variant="outline" className="w-full justify-between"><Avatar className="w-5 h-5"><AvatarImage src="https://placehold.co/20x20.png" /></Avatar> Dr. Johnes <span className="text-primary">Call</span></Button>
                 </div>
                 <div className="text-xs font-semibold text-muted-foreground uppercase pt-2 border-t">Devices</div>
                 <Button variant="secondary" className="w-full"><Handshake className="w-4 h-4 mr-2"/> Connect your Watch</Button>
            </SidebarFooter>
        </>
    );
}

function DoctorSidebar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const [isAvailable, setIsAvailable] = useState(true);

    const isActive = (href: string, isExact?: boolean) => {
        if (isExact) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const fallbackInitial = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'D';

    return (
        <>
            <SidebarHeader className="p-4">
                 <div className="flex flex-col items-center text-center">
                    <Link href="/doctor/dashboard/settings">
                       <Avatar className="w-20 h-20 border-4 border-primary/20">
                           <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'Doctor'} data-ai-hint="doctor portrait" />
                           <AvatarFallback className="text-2xl">{fallbackInitial}</AvatarFallback>
                       </Avatar>
                    </Link>
                    <div className="mt-3">
                        <h3 className="font-bold text-lg">
                            <Link href="/doctor/dashboard/settings">{user?.displayName || 'Doctor Name'}</Link>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">BDS, MDS - Oral & Maxillofacial Surgery</p>
                    </div>
                </div>
            </SidebarHeader>
             <SidebarContent>
                <SidebarMenu>
                    {doctorNavItems.map((item) => (
                        <SidebarMenuItem key={`${item.href}-${item.title}`}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive(item.href, !!item.isExact)}
                                className={cn(isActive(item.href, !!item.isExact) && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary")}
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
                        <div className="p-4 border-t w-full">
                                <div className="flex items-center justify-between">
                                <Label htmlFor="availability-switch" className="font-medium text-sm">
                                    Availability
                                </Label>
                                <Switch
                                    id="availability-switch"
                                    checked={isAvailable}
                                    onCheckedChange={setIsAvailable}
                                />
                            </div>
                            {isAvailable && <p className="text-xs text-green-600 mt-1">You are available now</p>}
                        </div>
                    </SidebarMenuItem>
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


function DefaultSidebar({ userRole }: { userRole: 'Admin' | 'AI Provider' }) {
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const navItems = navItemsMap[userRole] || [];

    const isActive = (href: string, isExact?: boolean) => {
        if (isExact) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };
        
    const Icon = userRole === 'AI Provider' ? Bot : Shield;

    return (
        <>
            <SidebarHeader className="p-4">
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
                        <SidebarMenuItem key={`${item.href}-${item.title}`}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive(item.href, !!item.isExact)}
                                className={cn(isActive(item.href, !!item.isExact) && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary")}
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

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const { user } = useAuth();
  const { fetchPatientData, clearPatientData } = usePatientDataStore();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user && userRole === 'Patient') {
      unsubscribe = fetchPatientData(user.uid);
    } else {
      clearPatientData();
    }
    
    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    }
  }, [user, userRole, fetchPatientData, clearPatientData]);
  
  const renderSidebar = () => {
    switch (userRole) {
        case 'Patient':
            return <PatientSidebar />;
        case 'Doctor':
            return <DoctorSidebar />;
        case 'Admin':
        case 'AI Provider':
            return <DefaultSidebar userRole={userRole} />;
        default:
            return null;
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        {renderSidebar()}
      </Sidebar>
      <SidebarInset className="bg-transparent p-0 md:p-0">
        <DashboardHeader />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
