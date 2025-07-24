
"use client"

import {
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users2,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
  { title: "Orders", icon: ShoppingCart, href: "/dashboard" },
  { title: "Products", icon: Package, href: "/dashboard" },
  { title: "Customers", icon: Users2, href: "/dashboard" },
  { title: "Analytics", icon: LineChart, href: "/dashboard" },
]

export function NavMain() {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  if (isMobile) {
    return (
      <nav className="grid gap-2 text-lg font-medium">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="text-muted-foreground hover:text-foreground"
          >
            {link.title}
          </Link>
        ))}
      </nav>
    )
  }

  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <Package2 className="h-6 w-6" />
        <span className="">Acme Inc</span>
      </Link>
      <nav className="flex flex-1 items-center justify-center gap-2 text-sm font-medium">
        <TooltipProvider>
          {links.map((link, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname === link.href ? "bg-accent text-accent-foreground" : ""
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.title}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </div>
  )
}
