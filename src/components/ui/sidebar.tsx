"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { LogOut, Settings, Users, Calendar, FileText, Wallet, Receipt, MessageCircle, Star, Heart, Activity, Stethoscope, Bot, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils"
import Link from "next/link";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

type SidebarContextProps = {
  isCollapsed?: boolean
  isInside?: boolean
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const SIDEBAR_STYLES = [
  "[--sidebar-width:18rem]",
  "[--sidebar-offset:0rem]",
  "[--sidebar-border-width:0px]",
  "[--sidebar-bg:theme(colors.background)]",
  "[--sidebar-fg:theme(colors.foreground)]",
  "[--sidebar-border:theme(colors.border)]",
  "[--sidebar-muted-fg:theme(colors.muted.foreground)]",
  "[--sidebar-accent-fg:theme(colors.accent.foreground)]",
  "[--sidebar-accent:theme(colors.accent)]",
]

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(SIDEBAR_STYLES, "flex min-h-screen", className)}
      {...props}
    />
  )
})
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"aside"> & {
    variant?: "default" | "inset"
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <aside
      ref={ref}
      className={cn(
        "relative flex h-screen w-[var(--sidebar-width)] flex-col border-r bg-[var(--sidebar-bg)] text-[--sidebar-fg] [border-color:var(--sidebar-border)]",
        variant === "inset" &&
          "left-[var(--sidebar-offset,0)] top-[var(--header-height,0)] h-[calc(100vh-var(--header-height,0))]",
        className
      )}
      {...props}
    />
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-[var(--header-height)] items-center border-b px-4 [border-color:var(--sidebar-border)]",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col", className)}
      {...props}
    />
  )
})
SidebarBody.displayName = "SidebarBody"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 border-t p-4 [border-color:var(--sidebar-border)]",
        className
      )}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1", className)}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarMain = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col", className)}
      {...props}
    />
  )
})
SidebarMain.displayName = "SidebarMain"


const adminMenuItems = [
  { label: 'Dashboard', icon: Activity, path: '/admin/dashboard' },
  { label: 'AI Agents', icon: Bot, path: '/admin/dashboard/agents' },
  { label: 'System Logs', icon: FileText, path: '/admin/dashboard/logs' },
  { label: 'Settings', icon: Settings, path: '/admin/dashboard/settings' },
];

const doctorMenuItems = [
  { label: 'Dashboard', icon: Activity, path: '/doctor/dashboard' },
  { label: 'AI Scribe', icon: Bot, path: '/doctor/dashboard/ai-scribe' },
  { label: 'Appointments', icon: Calendar, path: '/doctor/dashboard/appointments' },
  { label: 'My Patients', icon: Users, path: '/doctor/dashboard/my-patients' },
  { label: 'Schedule', icon: Clock, path: '/doctor/dashboard/schedule' },
  { label: 'Invoices', icon: Receipt, path: '/doctor/dashboard/invoices' },
  { label: 'Reviews', icon: Star, path: '/doctor/dashboard/reviews' },
  { label: 'Messages', icon: MessageCircle, path: '/doctor/dashboard/messages' },
  { label: 'Profile Settings', icon: Settings, path: '/doctor/dashboard/settings' },
  { label: 'Social Media', icon: Heart, path: '/doctor/dashboard/social-media' },
  { label: 'Change Password', icon: Wallet, path: '/doctor/dashboard/change-password' },
];

const sidebarVariants = {
  open: { width: "16rem" },
  closed: { width: "5rem" },
};

const textVariants = {
  open: { opacity: 1, x: 0, display: 'inline-block' },
  closed: { opacity: 0, x: -10, display: 'none' },
};

const navLinkTransition = { type: "tween", ease: "easeOut", duration: 0.2 };

export function SessionNavBar() {
  const { user, userRole, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = userRole === 'Doctor' ? doctorMenuItems : adminMenuItems;
  const dashboardHome = userRole === 'Doctor' ? '/doctor/dashboard' : '/admin/dashboard';
  
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
             <Link href={dashboardHome} className="flex items-center gap-2 overflow-hidden">
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
           {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={pathname === item.path ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 h-10 text-base"
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
        
      <div className="flex-shrink-0 p-3 border-t border-[--sidebar-border]">
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
  )
}

export {
  useSidebar,
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMain,
  SidebarProvider,
}
export type { SidebarContextProps }
