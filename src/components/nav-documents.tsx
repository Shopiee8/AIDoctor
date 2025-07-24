"use client"

import * as React from "react"
import { type Icon as TablerIcon } from "@tabler/icons-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type NavDocumentsProps = {
  items: {
    name: string
    url: string
    icon: TablerIcon
  }[]
}

export function NavDocuments({ items }: NavDocumentsProps) {
  const { isCollapsed } = useSidebar()
  if (isCollapsed) return null
  return (
    <Accordion
      type="multiple"
      defaultValue={["general", "legal"]}
      className="w-full"
    >
      <AccordionItem value="general" className="border-none">
        <AccordionTrigger className="px-4 text-sm font-medium hover:no-underline">
          Documents
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <div className="flex flex-col space-y-1 pb-2">
            {items.map((item, i) => (
              <a
                key={i}
                href={item.url}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-auto justify-start gap-3 px-4 py-1.5"
                )}
              >
                <item.icon className="size-5 shrink-0" />
                {item.name}
              </a>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}