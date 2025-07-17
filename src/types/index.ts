import type { LucideIcon } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";


export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  badge?: string;
};
