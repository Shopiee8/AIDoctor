
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope, LayoutDashboard, User, MessageSquare, Calendar, FileText, Star, Settings, LogOut, Wallet, Bot } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const navItems = [
    { href: "/doctor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/doctor/dashboard/appointments", icon: Calendar, label: "Appointments" },
    { href: "/doctor/dashboard/my-patients", icon: User, label: "My Patients" },
    { href: "/doctor/dashboard/schedule", icon: Calendar, label: "Schedule Timings" },
    { href: "/doctor/dashboard/ai-scribe", icon: Bot, label: "AI Scribe" },
    { href: "/doctor/dashboard/invoices", icon: FileText, label: "Invoices" },
    { href: "/doctor/dashboard/reviews", icon: Star, label: "Reviews" },
    { href: "/doctor/dashboard/messages", icon: MessageSquare, label: "Messages" },
    { href: "/doctor/dashboard/settings", icon: Settings, label: "Profile Settings" },
    { href: "/doctor/dashboard/wallet", icon: Wallet, label: "Wallet" },
];

export function DoctorSidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-20 flex-col border-r bg-card sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 py-4">
                <Link href="/doctor/dashboard" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
                    <Stethoscope className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">AIDoctor</span>
                </Link>
                <TooltipProvider>
                    {navItems.map((item) => (
                        <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                                        pathname === item.href && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="sr-only">{item.label}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">{item.label}</TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={signOut}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                variant="ghost"
                                size="icon"
                                >
                                <LogOut className="h-5 w-5" />
                                <span className="sr-only">Logout</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Logout</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
        </aside>
    );
}

