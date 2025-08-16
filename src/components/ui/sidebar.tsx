
"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion, HTMLMotionProps, PanInfo } from "framer-motion";
import { Menu, X, PanelLeft, PanelRight } from "lucide-react";
import { cva } from "class-variance-authority";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
  isCollapsed?: boolean;
  isInside?: boolean;
  isMobile?: boolean;
  isCollapsible?: boolean;
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}


const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"aside"> & {
    variant?: "default" | "inset";
    collapsible?: "default" | "offcanvas";
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
  }
>(({ 
  className, 
  variant = "default", 
  collapsible = "default",
  open,
  setOpen,
  animate = true,
  children,
  ...props 
}, ref) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  return (
    <SidebarContext.Provider
      value={{
        open: open ?? false,
        setOpen: setOpen ?? (() => {}),
        animate: animate ?? true,
        isCollapsed,
        isInside: true,
        isMobile,
        isCollapsible: collapsible === 'default',
        setCollapsed: setIsCollapsed,
      }}
    >
      <motion.aside
        ref={ref}
        data-collapsible={isCollapsed ? "icon" : "full"}
        variants={{
          visible: { 
            width: "var(--sidebar-width)", 
            transition: { type: "spring", stiffness: 300, damping: 30 } 
          },
          hidden: { 
            width: "calc(var(--spacing) * 14)", 
            transition: { type: "spring", stiffness: 300, damping: 30 } 
          },
        }}
        initial={isCollapsed ? "hidden" : "visible"}
        animate={isCollapsed ? "hidden" : "visible"}
        className={cn(
          "group relative flex h-screen flex-col border-r bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)] [border-color:var(--sidebar-border)]",
          variant === "inset" &&
            "left-[var(--sidebar-offset,0)] top-[var(--header-height,0)] h-[calc(100vh-var(--header-height,0))]",
          className
        )}
        drag={!isMobile && collapsible === 'default' ? "x" : undefined}
        dragConstraints={{ right: 0, left: 0 }}
        dragElastic={0.1}
        onDragEnd={(_event, info) => {
          if (!isMobile) {
            const newWidth = info.offset.x;
            setIsCollapsed(newWidth < 0);
          }
        }}
        {...(props as any)}
      >
        {children}
      </motion.aside>
    </SidebarContext.Provider>
  );
});

Sidebar.displayName = "Sidebar";

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { 
    open, 
    setOpen, 
    isCollapsed, 
    setCollapsed,
    isMobile 
  } = useSidebar();
  
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              onDragEnd={(e, info) => {
                // Prevent drag on mobile
                if (isMobile || !setCollapsed) return;
                
                const newWidth = Math.min(Math.max(240, info.point.x), 480);
                setCollapsed(newWidth < 300);
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

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

// Remove the duplicate SidebarProvider implementation



const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
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

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col overflow-y-auto", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 border-t p-2 [border-color:var(--sidebar-border)]",
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

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col",
        className
      )}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-col", className)} {...props} />
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  if (isCollapsed) return null
  return (
    <div
      ref={ref}
      className={cn(
        "px-4 pt-4 pb-2 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"


const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("group/item flex items-center justify-between", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const buttonVariants = cva("flex items-center justify-start gap-4", {
  variants: {
    variant: {
      default:
        "rounded-lg text-[var(--sidebar-muted-fg)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-fg)]",
      active:
        "rounded-lg bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-fg)]",
    },
    size: {
      default: "p-2",
      lg: "p-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type ButtonElement = HTMLButtonElement | HTMLDivElement;

type SidebarMenuButtonProps = {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string
  size?: "default" | "lg" | null | undefined
} & React.ComponentProps<"button">

const SidebarMenuButton = React.forwardRef<ButtonElement, SidebarMenuButtonProps>(({
  className, 
  isActive, 
  asChild, 
  tooltip, 
  size, 
  ...props 
}, ref) => {
  const { isCollapsed } = useSidebar();
  
  const commonProps = {
    'data-slot': 'sidebar-menu-button',
    className: cn(
      buttonVariants({ 
        variant: isActive ? 'active' : 'default', 
        size: size || 'default'
      }),
      'w-full flex-1',
      isCollapsed && 'justify-center',
      className
    )
  };

  if (asChild) {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        {...commonProps}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      />
    );
  }

  const buttonElement = (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      {...commonProps}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );

  if (isCollapsed && tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {buttonElement}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={16}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonElement;
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    showOnHover?: boolean
  }
>(({ className, showOnHover, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  if (isCollapsed) return null
  return (
    <button
      ref={ref}
      className={cn(
        "p-1",
        showOnHover &&
          "invisible group-hover/item:visible",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"


const SidebarCollapseButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 rounded-full border bg-background p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:block",
        className
      )}
      {...props}
    >
      {isCollapsed ? (
        <PanelRight className="h-4 w-4" />
      ) : (
        <PanelLeft className="h-4 w-4" />
      )}
    </button>
  )
})

SidebarCollapseButton.displayName = "SidebarCollapseButton"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("p-2", className)} {...props} />
})
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed, setCollapsed } = useSidebar();
  if (setCollapsed === undefined) return null
  return (
    <button
      ref={ref}
      className={cn("text-muted-foreground", className)}
      onClick={() => setCollapsed(!isCollapsed)}
      {...props}
    >
      {isCollapsed ? (
        <PanelRight className="h-4 w-4" />
      ) : (
        <PanelLeft className="h-4 w-4" />
      )}
    </button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarCollapseButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuAction,
  SidebarTrigger,
}
export type { SidebarContextProps }
