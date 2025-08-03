

import type { LucideIcon } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

// Re-export all types from ai-provider
export * from "./ai-provider";

// Export all types individually for easier imports
export type {
  AIAgent,
  AIAgentSettings,
  AIAgentPerformance,
  ConsultationHistory,
  Prescription,
  Analytics,
  ConsultationTrend,
  SpecialtyDistribution,
  RevenueBreakdown,
  PatientDemographics,
  AgeGroup,
  GenderDistribution,
  LocationDistribution,
  PerformanceMetrics,
  APIKey,
  Notification,
  ProviderSettings,
  WorkingHours,
  DaySchedule,
  Break,
  PaymentSettings,
  TaxInformation,
  PrivacySettings,
  DashboardFilters,
  DateRange,
  SearchParams,
  APIResponse,
  PaginationInfo,
  DashboardState,
  CreateAgentForm,
  EditAgentForm,
  ChartDataPoint,
  TimeSeriesData,
  ComparisonData
} from "./ai-provider";

// Existing types
export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  badge?: string;
  isExact?: boolean;
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
  clinicName?: string;
  clinicLocation?: string;
  amount?: number;
};
