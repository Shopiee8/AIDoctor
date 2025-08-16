"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { Menu, X, LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";

interface LinkItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useCustomSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useCustomSidebar must be used within a CustomSidebarProvider");
  }
  return context;
};

export const CustomSidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp || setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const CustomSidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  animate?: boolean;
}) => {
  return (
    <CustomSidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </CustomSidebarProvider>
  );
};

export const CustomSidebarBody = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <>
      <CustomDesktopSidebar className={className} {...props}>
        {children}
      </CustomDesktopSidebar>
      <CustomMobileSidebar className={className} {...props}>
        {children}
      </CustomMobileSidebar>
    </>
  );
};

const CustomDesktopSidebar = ({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, 'onDrag'>) => {
  const { open, setOpen, animate } = useCustomSidebar();
  
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...(props as any)} // Type assertion to avoid type conflicts with Framer Motion
    >
      {children}
    </motion.div>
  );
};

const CustomMobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useCustomSidebar();
  
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) {
      setOpen(false);
    }
  };
  
  return (
    <div className="md:hidden">
      <div
        className={cn(
          "h-16 px-4 flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
      >
        <button
          onClick={() => setOpen(!open)}
          className="text-neutral-800 dark:text-neutral-200"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 p-4"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDrag as any} // Type assertion to avoid type issues with Framer Motion's event types
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setOpen(false)}
                className="text-neutral-800 dark:text-neutral-200"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CustomSidebarLink = ({
  link,
  className,
  onClick,
  ...linkProps
}: {
  link: LinkItem;
  className?: string;
} & Omit<LinkProps, 'href'>) => {
  const { open, animate } = useCustomSidebar();
  
  return (
    <Link
      {...linkProps}
      href={link.href}
      className={cn(
        "flex items-center gap-3 p-2 rounded-md transition-colors",
        "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-700",
        className
      )}
      onClick={onClick}
    >
      <span className="flex-shrink-0">{link.icon}</span>
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          width: animate ? (open ? 'auto' : 0) : 'auto',
          marginLeft: animate ? (open ? '0.5rem' : 0) : '0.5rem',
        }}
        className="whitespace-nowrap overflow-hidden"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export function CustomSidebarDemo() {
  const [open, setOpen] = useState(false);
  
  const links: LinkItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-900">
      <CustomSidebar open={open} setOpen={setOpen}>
        <CustomSidebarBody className="justify-between">
          <div className="space-y-2">
            <div className="p-4">
              <h1 className={cn(
                "text-xl font-bold whitespace-nowrap overflow-hidden",
                !open && "w-0 h-0 opacity-0"
              )}>
                AI Doctor
              </h1>
            </div>
            <nav className="space-y-1">
              {links.map((link) => (
                <CustomSidebarLink
                  key={link.href}
                  link={link}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
          </div>
          <div className="p-2">
            <CustomSidebarLink
              link={{
                label: 'Logout',
                href: '/logout',
                icon: <LogOut className="h-5 w-5" />,
              }}
              className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
            />
          </div>
        </CustomSidebarBody>
      </CustomSidebar>
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 h-40"
              >
                <h3 className="font-medium mb-2">Card {i}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Content for card {i}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
