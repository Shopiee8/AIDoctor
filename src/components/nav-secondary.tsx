
"use client"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CircleHelp, Settings } from "lucide-react"
import Link from "next/link"
import { NavUser } from "./nav-user"

export function NavSecondary() {
  return (
    <>
      <div className="mt-auto flex flex-col gap-2 p-4">
        <Card x-chunk="dashboard-02-chunk-0">
          <CardHeader className="p-2 pt-0 md:p-4">
            <CardTitle>Upgrade to Pro</CardTitle>
            <CardDescription>
              Unlock all features and get unlimited access to our support team.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ size: "sm" }), "w-full")}
            >
              Upgrade
            </Link>
          </CardContent>
        </Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-8 w-8 shrink-0"
              )}
            >
              <CircleHelp className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-8 w-8 shrink-0"
              )}
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
          <NavUser />
        </div>
      </div>
    </>
  )
}
