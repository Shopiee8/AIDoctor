
import { NavMain } from "@/components/nav-main"
import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"

export function AppSidebar() {
  return (
    <div className="hidden border-r bg-sidebar lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <NavMain />
        <NavDocuments />
        <NavSecondary />
      </div>
    </div>
  )
}
