
"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const documents = {
  general: [
    { title: "Invoice", href: "/dashboard" },
    { title: "Support", href: "/dashboard" },
  ],
  legal: [
    { title: "Terms of Service", href: "/dashboard" },
    { title: "Privacy Policy", href: "/dashboard" },
  ],
}

export function NavDocuments() {
  const pathname = usePathname()

  return (
    <Accordion
      type="multiple"
      defaultValue={["general", "legal"]}
      className="w-full"
    >
      <AccordionItem value="general">
        <AccordionTrigger className="px-4 text-sm font-medium">
          General
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <div className="flex flex-col space-y-1 pb-2">
            {documents.general.map((doc, i) => (
              <Link
                key={i}
                href={doc.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-auto justify-start px-4 py-1.5",
                  pathname === doc.href
                    ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                    : ""
                )}
              >
                {doc.title}
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="legal" className="border-b-0">
        <AccordionTrigger className="px-4 text-sm font-medium">
          Legal
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <div className="flex flex-col space-y-1 pb-2">
            {documents.legal.map((doc, i) => (
              <Link
                key={i}
                href={doc.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-auto justify-start px-4 py-1.5",
                  pathname === doc.href
                    ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                    : ""
                )}
              >
                {doc.title}
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
