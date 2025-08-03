// Utility functions for AI Provider Dashboard

import { AIAgent, Analytics, ChartDataPoint, ComparisonData } from '@/types';

/**
 * Format currency values
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format numbers with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Get comparison data for metrics
 */
export const getComparisonData = (current: number, previous: number): ComparisonData => {
  const change = current - previous;
  const changePercentage = calculatePercentageChange(current, previous);
  
  return {
    current,
    previous,
    change,
    changePercentage,
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
  };
};

/**
 * Format time duration
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

/**
 * Format relative time
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

/**
 * Get status color for agents
 */
export const getAgentStatusColor = (status: string): string => {
  const colors = {
    active: 'bg-green-500 text-white',
    inactive: 'bg-red-500 text-white',
    training: 'bg-yellow-500 text-white',
    maintenance: 'bg-blue-500 text-white'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-500 text-white';
};

/**
 * Get consultation status color
 */
export const getConsultationStatusColor = (status: string): string => {
  const colors = {
    completed: 'bg-green-100 text-green-800',
    ongoing: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    scheduled: 'bg-yellow-100 text-yellow-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

/**
 * Calculate agent performance score
 */
export const calculatePerformanceScore = (agent: AIAgent): number => {
  const ratingScore = (agent.rating / 5) * 30; // 30% weight
  const resolutionRateScore = (agent.performance?.resolutionRate || 0) * 0.25; // 25% weight
  const responseTimeScore = Math.max(0, (10 - (agent.responseTime || 0) / 60)) * 20; // 20% weight (convert to minutes)
  const consultationScore = Math.min((agent.consultations || 0) / 100, 1) * 25; // 25% weight
  
  return Math.round(ratingScore + resolutionRateScore + responseTimeScore + consultationScore);
};

/**
 * Get performance score color
 */
export const getPerformanceScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Filter agents by search term
 */
export const filterAgents = (agents: AIAgent[], searchTerm: string, statusFilter: string): AIAgent[] => {
  return agents.filter(agent => {
    const matchesSearch = !searchTerm || 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
};

/**
 * Sort agents by various criteria
 */
export const sortAgents = (agents: AIAgent[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc'): AIAgent[] => {
  const sorted = [...agents].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'consultations':
        aValue = a.performance?.monthlyConsultations || 0;
        bValue = b.performance?.monthlyConsultations || 0;
        break;
      case 'revenue':
        aValue = a.revenue || 0;
        bValue = b.revenue || 0;
        break;
      case 'rating':
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      case 'successRate':
        aValue = a.performance?.resolutionRate || 0;
        bValue = b.performance?.resolutionRate || 0;
        break;
      case 'responseTime':
        aValue = a.responseTime || 0;
        bValue = b.responseTime || 0;
        break;
      case 'created':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

/**
 * Generate chart data for consultation trends
 */
export const generateConsultationTrendData = (analytics: Analytics): ChartDataPoint[] => {
  return analytics.consultationTrends.map(trend => ({
    label: trend.period,
    value: trend.consultations,
    metadata: {
      revenue: trend.revenue,
      averageRating: trend.averageRating,
      uniquePatients: trend.uniquePatients
    }
  }));
};

/**
 * Generate chart data for revenue trends
 */
export const generateRevenueTrendData = (analytics: Analytics): ChartDataPoint[] => {
  return analytics.consultationTrends.map(trend => ({
    label: trend.period,
    value: trend.revenue,
    metadata: {
      consultations: trend.consultations,
      averageRating: trend.averageRating,
      uniquePatients: trend.uniquePatients
    }
  }));
};

/**
 * Generate chart data for specialty distribution
 */
export const generateSpecialtyDistributionData = (analytics: Analytics): ChartDataPoint[] => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  return analytics.specialtyDistribution.map((specialty, index) => ({
    label: specialty.specialty,
    value: specialty.count,
    color: colors[index % colors.length],
    metadata: {
      percentage: specialty.percentage,
      revenue: specialty.revenue,
      averageRating: specialty.averageRating
    }
  }));
};

/**
 * Calculate total metrics from agents
 */
export const calculateTotalMetrics = (agents: AIAgent[]) => {
  const activeAgents = agents.filter(agent => agent.status === 'active');
  
  return {
    totalAgents: agents.length,
    activeAgents: activeAgents.length,
    totalConsultations: agents.reduce((sum, agent) => sum + (agent.performance?.monthlyConsultations || 0), 0),
    totalRevenue: agents.reduce((sum, agent) => sum + (agent.revenue || 0), 0),
    averageRating: agents.length > 0 
      ? agents.reduce((sum, agent) => sum + (agent.rating || 0), 0) / agents.length 
      : 0,
    averageSuccessRate: agents.length > 0 
      ? (agents.reduce((sum, agent) => sum + (agent.performance?.resolutionRate || 0), 0) / agents.length) * 100
      : 0,
    averageResponseTime: agents.length > 0 
      ? agents.reduce((sum, agent) => sum + (agent.responseTime || 0), 0) / agents.length 
      : 0
  };
};

/**
 * Get top performing agents
 */
export const getTopPerformingAgents = (agents: AIAgent[], limit: number = 3): AIAgent[] => {
  return agents
    .map(agent => ({
      ...agent,
      performanceScore: calculatePerformanceScore(agent)
    }))
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, limit);
};

/**
 * Generate mock consultation data for charts
 */
export const generateMockConsultationData = (days: number = 30): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic consultation numbers (higher on weekdays)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseConsultations = isWeekend ? 15 : 35;
    const consultations = baseConsultations + Math.floor(Math.random() * 20);
    
    data.push({
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: consultations,
      metadata: {
        date: date.toISOString(),
        revenue: consultations * (20 + Math.random() * 15),
        isWeekend
      }
    });
  }
  
  return data;
};

/**
 * Validate agent form data
 */
export const validateAgentForm = (formData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!formData.name || formData.name.trim().length < 2) {
    errors.push('Agent name must be at least 2 characters long');
  }
  
  if (!formData.specialty || formData.specialty.trim().length === 0) {
    errors.push('Specialty is required');
  }
  
  if (!formData.description || formData.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  
  if (formData.settings?.maxConsultations && formData.settings.maxConsultations < 1) {
    errors.push('Maximum consultations must be at least 1');
  }
  
  if (formData.settings?.consultationPrice && formData.settings.consultationPrice < 0) {
    errors.push('Consultation price cannot be negative');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate API key
 */
export const generateApiKey = (prefix: string = 'sk-ai'): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix + '-';
  
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Mask API key for display
 */
export const maskApiKey = (apiKey: string): string => {
  if (apiKey.length <= 8) return apiKey;
  return apiKey.substring(0, 8) + '...';
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Debounce function for search
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Get time-based greeting
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Calculate working hours status
 */
export const getWorkingHoursStatus = (workingHours: string): { isActive: boolean; nextChange: string } => {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (workingHours === '24/7') {
    return { isActive: true, nextChange: 'Always available' };
  }
  
  // Parse working hours (e.g., "9:00-17:00")
  const [start, end] = workingHours.split('-').map(time => {
    const [hour] = time.split(':').map(Number);
    return hour;
  });
  
  const isActive = currentHour >= start && currentHour < end;
  const nextChange = isActive 
    ? `Until ${end}:00`
    : currentHour < start 
      ? `From ${start}:00`
      : `Tomorrow at ${start}:00`;
  
  return { isActive, nextChange };
};
