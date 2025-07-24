"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { motion, useAnimation } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarRightCollapse } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

type SidebarContextProps = {
  isCollapsed?: boolean
  isInside?: boolean
  isMobile?: boolean
  isCollapsible?: boolean
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

const SessionNavBar = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"aside">
>(({ className, children, ...props }, ref) => {
  return (
     <aside
      ref={ref}
      className={cn("w-20 flex-col border-r bg-background text-foreground", className)}
      {...props}
    >
      {children}
    </aside>
  );
});
SessionNavBar.displayName = "SessionNavBar";


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
    collapsible?: "default" | "offcanvas"
  }
>(
  (
    {
      className,
      variant = "default",
      collapsible = "default",
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const controls = useAnimation()
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    React.useEffect(() => {
      if (isMobile) {
        controls.start("hidden")
        setIsCollapsed(true)
      } else {
        controls.start("visible")
        setIsCollapsed(false)
      }
    }, [isMobile, controls])

    const handleMouseEnter = () => {
      if (!isMobile) {
        setIsCollapsed(false)
        controls.start("visible")
      }
    }

    const handleMouseLeave = () => {
      if (!isMobile) {
        setIsCollapsed(true)
        controls.start("hidden")
      }
    }

    const isCollapsible = collapsible !== "offcanvas"

    return (
      <SidebarContext.Provider
        value={{
          isCollapsed,
          isInside: true,
          isMobile: isMobile,
          isCollapsible,
        }}
      >
        <motion.aside
          ref={ref}
          initial={isMobile ? "hidden" : "visible"}
          animate={controls}
          data-collapsible={isCollapsible ? (isCollapsed ? "icon" : "full") : "none"}
          variants={{
            visible: { width: "var(--sidebar-width)", transition: { type: "spring", stiffness: 300, damping: 30 } },
            hidden: { width: "calc(var(--spacing) * 14)", transition: { type: "spring", stiffness: 300, damping: 30 } },
          }}
          onMouseEnter={isCollapsible ? handleMouseEnter : undefined}
          onMouseLeave={isCollapsible ? handleMouseLeave : undefined}
          className={cn(
            "group relative flex h-screen flex-col border-r bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)] [border-color:var(--sidebar-border)]",
            variant === "inset" &&
              "left-[var(--sidebar-offset,0)] top-[var(--header-height,0)] h-[calc(100vh-var(--header-height,0))]",
            className
          )}
          {...props}
        >
          {children}
        </motion.aside>
      </SidebarContext.Provider>
    )
  }
)
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
  return (
    <div ref={ref} className={cn("flex flex-col", className)} {...props} />
  )
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

const buttonVariants = cva("flex items-center justify-start gap-4 p-2", {
  variants: {
    variant: {
      default:
        "rounded-lg text-[var(--sidebar-muted-fg)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-fg)]",
      active:
        "rounded-lg bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-fg)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
  }
>(({ className, isActive, asChild, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  const Comp = asChild ? "div" : "button"
  return (
    <Comp
      data-slot="sidebar-menu-button"
      ref={ref}
      className={cn(
        buttonVariants({ variant: isActive ? "active" : "default" }),
        "w-full flex-1",
        isCollapsed && "justify-center",
        className
      )}
      {...props}
    />
  )
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
        <IconLayoutSidebarRightCollapse />
      ) : (
        <IconLayoutSidebarLeftCollapse />
      )}
    </button>
  )
})

SidebarCollapseButton.displayName = "SidebarCollapseButton"

export {
  useSidebar,
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
  SessionNavBar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
}
export type { SidebarContextProps }
