
"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
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
import { useState } from "react";
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
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const sidebarVariants = {
  open: { width: "16rem" },
  closed: { width: "4rem" },
};

const textVariants = {
  open: { opacity: 1, x: 0, display: 'inline-block' },
  closed: { opacity: 0, x: -10, display: 'none' },
};

const navLinkTransition = { type: "tween", ease: "easeOut", duration: 0.2 };

export default function PatientSidebar() {
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  const fallbackInitial = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'P';

  return (
    <motion.div
      variants={sidebarVariants}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      transition={navLinkTransition}
      className="fixed left-0 top-0 h-full z-40 hidden md:flex"
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="flex flex-col h-full bg-card border-r">
        <div className="flex-shrink-0 p-3 h-[70px] border-b flex items-center justify-center">
             <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
                <Stethoscope className="h-7 w-7 text-primary flex-shrink-0" />
                <motion.span 
                    variants={textVariants} 
                    transition={navLinkTransition}
                    className="font-bold text-lg whitespace-nowrap"
                >
                    AIDoctor
                </motion.span>
             </Link>
        </div>
        
        <ScrollArea className="flex-grow p-2">
           <nav className="flex flex-col gap-1">
             {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => router.push(item.path)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <motion.span 
                    variants={textVariants} 
                    transition={navLinkTransition}
                    className="whitespace-nowrap"
                >
                    {item.label}
                </motion.span>
              </Button>
            ))}
           </nav>
        </ScrollArea>
        
        <div className="flex-shrink-0 p-3 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5 text-destructive" />
            <motion.span 
                variants={textVariants}
                transition={navLinkTransition}
                className="whitespace-nowrap text-destructive"
            >
                Logout
            </motion.span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
