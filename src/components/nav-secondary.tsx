"use client"

import * as React from "react"
import { type Icon as TablerIcon } from "@tabler/icons-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type NavSecondaryProps = React.ComponentProps<"div"> & {
  items: {
    title: string
    url: string
    icon: TablerIcon
    isActive?: boolean
  }[]
}

export function NavSecondary({ items, className, ...props }: NavSecondaryProps) {
  const { isCollapsed } = useSidebar()

  return (
    <TooltipProvider>
      <div className={cn("flex flex-col", className)} {...props}>
        <SidebarMenu>
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={index} className="w-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      className="w-full"
                    >
                      <a href={item.url}>
                        <Icon className="size-5 shrink-0" />
                        <span className="flex-1">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" sideOffset={16}>
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </div>
    </TooltipProvider>
  )
}