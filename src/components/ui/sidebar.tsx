"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

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
  React.ComponentProps<"aside">
>(({ className, ...props }, ref) => {
  return (
    <aside
      ref={ref}
      className={cn(
        "relative flex h-screen w-[var(--sidebar-width)] flex-col border-r bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)] [border-color:var(--sidebar-border)]",
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