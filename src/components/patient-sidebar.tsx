
"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LogOut,
  Calendar,
  Heart,
  Star,
  Users,
  FileText,
  Wallet,
  Receipt,
  MessageCircle,
  Activity,
  Settings,
  Stethoscope,
  Bot
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
  { label: 'Dashboard', icon: Activity, path: '/dashboard' },
  { label: 'AI Consultation', icon: Bot, path: '/dashboard/consultation' },
  { label: 'Appointments', icon: Calendar, path: '/dashboard/appointments' },
  { label: 'Vitals', icon: Heart, path: '/dashboard/vitals' },
  { label: 'My Dependents', icon: Users, path: '/dashboard/dependents' },
  { label: 'Medical Records', icon: FileText, path: '/dashboard/medical-records' },
  { label: 'Invoices', icon: Receipt, path: '/dashboard/invoices' },
  { label: 'Messages', icon: MessageCircle, path: '/dashboard/messages' },
  { label: 'My Favorites', icon: Star, path: '/dashboard/favourites' },
  { label: 'Wallet', icon: Wallet, path: '/dashboard/wallet' },
];

export default function PatientSidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  const fallbackInitial = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'P';

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full z-40 hidden md:flex flex-col bg-card text-card-foreground border-r transition-all duration-300 w-20 lg:w-64"
      )}
    >
      <div className="flex-shrink-0 p-4 h-[65px] border-b flex items-center justify-center lg:justify-start overflow-hidden">
             <Link href="/dashboard" className="flex items-center gap-2">
                <Stethoscope className="h-7 w-7 text-primary flex-shrink-0" />
                <span 
                    className="font-bold text-lg whitespace-nowrap hidden lg:inline"
                >
                    AIDoctor
                </span>
             </Link>
      </div>
        
      <ScrollArea className="flex-grow p-3">
         <nav className="flex flex-col gap-1">
           {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={pathname === item.path ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 h-10 text-base"
              onClick={() => router.push(item.path)}
              title={item.label}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="whitespace-nowrap hidden lg:inline">
                  {item.label}
              </span>
            </Button>
          ))}
         </nav>
      </ScrollArea>
        
      <div className="flex-shrink-0 p-3 border-t">
        <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10 text-base"
            onClick={() => router.push('/dashboard/settings')}
            title="Settings"
            >
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span className="whitespace-nowrap hidden lg:inline">Settings</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-base"
          onClick={signOut}
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-destructive" />
          <span className="whitespace-nowrap text-destructive hidden lg:inline">
              Logout
          </span>
        </Button>
      </div>
    </div>
  );
}
