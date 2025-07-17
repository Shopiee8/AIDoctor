
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

export type Appointment = {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  visitType: 'General Visit' | 'Consultation' | 'Follow-up';
  appointmentType: 'Video' | 'Audio' | 'Chat' | 'In-person';
  dateTime: Date;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
};
