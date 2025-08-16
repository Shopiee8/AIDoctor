// TypeScript interfaces for AI Provider Dashboard

export interface AIProvider {
  id: string;
  userId: string;
  organizationName: string;
  website?: string | null;
  subscriptionPlan: string;
  subscriptionStatus: string;
  settings: {
    notifications: boolean;
    emailNotifications: boolean;
    defaultLanguage: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any; // For any additional properties
}

export interface AIDoctor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  avatar: string;
  rating: number;
  responseTime: number;
  isActive: boolean;
  providerId: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  
  // Add stats property
  stats?: {
    totalConsultations: number;
    averageRating: number;
    totalPatients: number;
    // Add other stats properties as needed
  };
  
  // Add settings property
  settings: {
    consultationFee: number;
    availability: '24/7' | 'office-hours' | 'custom';
    language: string;
    // Add other settings properties as needed
  };
}

export interface AIAgent {
  id: string;
  name: string;
  specialty: string;
  status: 'active' | 'inactive' | 'training' | 'maintenance';
  avatar: string;
  description: string;
  consultations: number;
  rating: number;
  responseTime: number; // in seconds
  successRate: number; // percentage
  revenue: number;
  createdAt: string;
  lastActive: string;
  apiKey: string;
  providerId: string;
  settings: AIAgentSettings;
  performance: AIAgentPerformance;
}

export interface AIAgentSettings {
  maxConsultations: number;
  workingHours: string;
  languages: string[];
  autoRespond: boolean;
  consultationPrice: number;
  specializations: string[];
  availabilityStatus: 'available' | 'busy' | 'offline';
  responseDelay: number; // in seconds
  maxSessionDuration: number; // in minutes
}

export interface AIAgentPerformance {
  dailyConsultations: number;
  weeklyConsultations: number;
  monthlyConsultations: number;
  averageSessionDuration: number;
  patientSatisfactionScore: number;
  resolutionRate: number;
  escalationRate: number;
  popularSymptoms: string[];
  peakHours: string[];
}

export interface ConsultationHistory {
  id: string;
  patientId: string;
  patientName: string;
  agentId: string;
  agentName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: 'completed' | 'ongoing' | 'cancelled' | 'scheduled';
  rating: number;
  revenue: number;
  symptoms: string[];
  diagnosis: string;
  prescriptions: Prescription[];
  followUpRequired: boolean;
  notes: string;
  sessionType: 'text' | 'voice' | 'video';
  providerId: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Analytics {
  totalConsultations: number;
  totalRevenue: number;
  averageRating: number;
  activeAgents: number;
  monthlyGrowth: number;
  topPerformingAgent: string;
  consultationTrends: ConsultationTrend[];
  specialtyDistribution: SpecialtyDistribution[];
  revenueBreakdown: RevenueBreakdown;
  patientDemographics: PatientDemographics;
  performanceMetrics: PerformanceMetrics;
}

export interface ConsultationTrend {
  period: string; // 'Jan', 'Feb', etc. or '2024-01', etc.
  consultations: number;
  revenue: number;
  averageRating: number;
  uniquePatients: number;
}

export interface SpecialtyDistribution {
  specialty: string;
  count: number;
  percentage: number;
  revenue: number;
  averageRating: number;
}

export interface RevenueBreakdown {
  totalRevenue: number;
  platformFee: number;
  netRevenue: number;
  pendingPayments: number;
  monthlyRecurring: number;
  oneTimePayments: number;
  refunds: number;
}

export interface PatientDemographics {
  ageGroups: AgeGroup[];
  genderDistribution: GenderDistribution[];
  locationDistribution: LocationDistribution[];
  returningPatients: number;
  newPatients: number;
}

export interface AgeGroup {
  range: string; // '18-25', '26-35', etc.
  count: number;
  percentage: number;
}

export interface GenderDistribution {
  gender: string;
  count: number;
  percentage: number;
}

export interface LocationDistribution {
  country: string;
  count: number;
  percentage: number;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  averageSessionDuration: number;
  patientSatisfactionScore: number;
  resolutionRate: number;
  escalationRate: number;
  noShowRate: number;
  repeatPatientRate: number;
}

export interface APIKey {
  id: string;
  agentId: string;
  key: string;
  name: string;
  createdAt: string;
  lastUsed: string;
  usageCount: number;
  isActive: boolean;
  permissions: string[];
  rateLimit: number;
}

export interface Notification {
  id: string;
  type: 'consultation' | 'payment' | 'system' | 'performance' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired: boolean;
  relatedEntityId?: string;
  relatedEntityType?: 'agent' | 'consultation' | 'patient';
}

export interface ProviderSettings {
  id: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoAcceptConsultations: boolean;
  performanceAnalytics: boolean;
  dataSharing: boolean;
  workingHours: WorkingHours;
  paymentSettings: PaymentSettings;
  privacySettings: PrivacySettings;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
  timezone: string;
}

export interface DaySchedule {
  isActive: boolean;
  startTime: string; // '09:00'
  endTime: string; // '17:00'
  breaks: Break[];
}

export interface Break {
  startTime: string;
  endTime: string;
  description: string;
}

export interface PaymentSettings {
  revenueShare: number; // percentage
  paymentMethod: 'bank_transfer' | 'paypal' | 'stripe' | 'crypto';
  paymentFrequency: 'weekly' | 'monthly' | 'quarterly';
  minimumPayout: number;
  taxInformation: TaxInformation;
}

export interface TaxInformation {
  taxId: string;
  businessType: 'individual' | 'business';
  country: string;
  state?: string;
  vatNumber?: string;
}

export interface PrivacySettings {
  sharePerformanceData: boolean;
  allowDataAnalytics: boolean;
  sharePatientInsights: boolean;
  marketingCommunications: boolean;
}

// Dashboard Filter and Search Types
export interface DashboardFilters {
  dateRange: DateRange;
  agentIds: string[];
  specialties: string[];
  status: string[];
  consultationTypes: string[];
}

export interface DateRange {
  startDate: string;
  endDate: string;
  preset?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}

export interface SearchParams {
  query: string;
  filters: DashboardFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Dashboard State Management
export interface DashboardState {
  agents: AIAgent[];
  consultations: ConsultationHistory[];
  analytics: Analytics;
  notifications: Notification[];
  settings: ProviderSettings;
  apiKeys: APIKey[];
  loading: boolean;
  error: string | null;
  filters: DashboardFilters;
  selectedAgent: AIAgent | null;
}

// Form Types for Creating/Editing Agents
export interface CreateAgentForm {
  name: string;
  specialty: string;
  description: string;
  avatar?: File;
  settings: Partial<AIAgentSettings>;
}

export interface EditAgentForm extends CreateAgentForm {
  id: string;
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  category?: string;
}

export interface ComparisonData {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}
