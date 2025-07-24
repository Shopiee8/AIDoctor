
import { NavMain } from "@/components/nav-main"
import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import { Sidebar, SidebarBody } from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarBody>
        <NavMain />
        <NavDocuments />
        <NavSecondary />
      </SidebarBody>
    </Sidebar>
  )
}
