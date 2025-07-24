
"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  LogOut,
  Settings,
  Stethoscope,
  LayoutDashboard,
  Calendar,
  Users,
  MessageCircle,
  FileText,
  DollarSign,
  Star,
  Share2,
  Clock,
  Wand2,
  Video
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/doctor/dashboard/my-patients", label: "My Patients", icon: Users },
  { href: "/doctor/dashboard/schedule", label: "Schedule", icon: Clock },
  { href: "/doctor/dashboard/ai-scribe", label: "AI Scribe", icon: Wand2 },
  { href: "/doctor/dashboard/meetings", label: "MDT Meetings", icon: Video },
  { href: "/doctor/dashboard/messages", label: "Messages", icon: MessageCircle },
  { href: "/doctor/dashboard/invoices", label: "Invoices", icon: DollarSign },
  { href: "/doctor/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/doctor/dashboard/referrals", label: "Referrals", icon: Share2 },
  { href: "/doctor/dashboard/accounts", label: "Accounts", icon: FileText },
];

const sidebarVariants = {
  open: { width: "16rem" },
  closed: { width: "5rem" },
};

const textVariants = {
  open: { opacity: 1, x: 0, display: "inline-block" },
  closed: { opacity: 0, x: -10, display: "none" },
};

const navLinkTransition = { type: "tween", ease: "easeOut", duration: 0.2 };

export function SessionNavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const fallbackInitial =
    user?.displayName?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "D";

  return (
    <motion.div
      variants={sidebarVariants}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      transition={navLinkTransition}
      className={cn(
        "fixed left-0 top-0 h-full z-40 hidden md:flex flex-col bg-[--sidebar] text-[--sidebar-foreground] border-r border-[--sidebar-border]"
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="flex-shrink-0 p-4 h-[65px] border-b border-[--sidebar-border] flex items-center justify-center">
        <Link
          href="/doctor/dashboard"
          className="flex items-center gap-2 overflow-hidden"
        >
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

      <ScrollArea className="flex-grow p-3">
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.label}
              variant={pathname.startsWith(link.href) ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 h-10 text-base"
              onClick={() => router.push(link.href)}
            >
              <link.icon className="h-5 w-5 flex-shrink-0" />
              <motion.span
                variants={textVariants}
                transition={navLinkTransition}
                className="whitespace-nowrap"
              >
                {link.label}
              </motion.span>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      <div className="flex-shrink-0 p-3 border-t border-[--sidebar-border]">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-base"
          onClick={() => router.push('/doctor/dashboard/settings')}
        >
          <Settings className="h-5 w-5" />
          <motion.span
            variants={textVariants}
            transition={navLinkTransition}
            className="whitespace-nowrap"
          >
            Settings
          </motion.span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-base"
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
    </motion.div>
  );
}
