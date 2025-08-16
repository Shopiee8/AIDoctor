'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme } from './theme';

// Define the HealthReport interface to match the store's structure
interface HealthReport {
  percentage: number;
  title: string;
  details: string;
  lastVisit: string | Date;  // Made required to match usage
  status: string;           // Made required to match usage
}

// Add default health report values
const defaultHealthReport: HealthReport = {
  percentage: 0,
  title: 'Overall Health',
  details: 'Your health report is being generated',
  lastVisit: new Date(),
  status: 'Normal'
};
import { ModernSidebar, ModernSidebarBody, ModernSidebarLink } from '@/components/ui/modern-sidebar';
import { 
  LayoutDashboard,
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut, 
  Stethoscope, 
  User, 
  Calendar, 
  HelpCircle, 
  Home, 
  HeartPulse, 
  Pill, 
  ClipboardList, 
  Bell, 
  UserPlus,
  Heart, 
  Thermometer, 
  Activity, 
  Droplets, 
  Scale, 
  Wind,
  MessageCircle,
  Video,
  Hospital,
  Star,
  Users,
  Plus,
  ChevronRight,
  Clock,
  MapPin,
  TrendingUp,
  Eye,
  Download,
  Trash2,
  Link2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { usePatientDataStore } from '@/store/patient-data-store';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';

// Types for enhanced dashboard
interface HealthMetric {
  id: string;
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  trend?: string;
  bgColor: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
}

interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  time: string;
  type: 'video' | 'clinic' | 'audio';
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface Notification {
  id: string;
  type: 'appointment' | 'review' | 'payment' | 'reminder';
  message: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

interface Dependent {
  id: string;
  name: string;
  relation: string;
  age: number;
  image: string;
}

// Helper function to get initials from name
function getInitials(name: string) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(part => part[0] || '')
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Add a custom hook to handle the initial data loading
export default function EnhancedPatientDashboard() {
  const [isClientSide, setIsClientSide] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user, userRole } = useAuth();
  const router = useRouter();
  
  // Use the imported theme as initial state
  const [currentTheme, setCurrentTheme] = useState(theme);
  const {
    healthRecords = [],
    healthReport = defaultHealthReport as HealthReport,
    analytics = {},
    favorites = [],
    appointmentDates = [],
    upcomingAppointments = [],
    notifications = [],
    dependents = [],
    relaxationData = {},
    isLoading,
    fetchPatientData,
  } = usePatientDataStore();
  
  // Track if we're on the client side to prevent hydration issues
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Debug logging
  console.log('Dashboard rendering - isLoading:', isLoading, 'user:', !!user);
  
  // Handle role-based redirection and data loading
  useEffect(() => {
    console.log('useEffect triggered - user:', user, 'userRole:', userRole);
    
    // Set client-side flag
    setIsClientSide(true);
    
    // If no user, let the UI handle the auth state
    if (!user) {
      console.log('No user found');
      return;
    }
    
    // Normalize role and redirect if needed (case-insensitive)
    const normalizedRole = (userRole || '').toLowerCase();
    if (normalizedRole && normalizedRole !== 'patient') {
      if (!isRedirecting) {
        console.log(`User has role '${userRole}', redirecting to appropriate dashboard`);
        setIsRedirecting(true);
        // Redirect based on role
        if (normalizedRole === 'ai provider') {
          router.push('/ai-provider/dashboard');
        } else if (normalizedRole === 'doctor') {
          router.push('/doctor/dashboard');
        } else if (normalizedRole === 'admin') {
          router.push('/admin/dashboard');
        } else {
          // Default redirect for other non-patient roles
          router.push(`/${normalizedRole.replace(/\s+/g, '-')}/dashboard`);
        }
      }
      return;
    }
    
    console.log('Starting data fetch for user:', user.uid);
    let isMounted = true;
    
    const loadData = async () => {
      console.log('loadData started');
      try {
        // Set loading state
        usePatientDataStore.setState({ isLoading: true });
        
        // Fetch patient data with a timeout
        const fetchWithTimeout = () => {
          return new Promise<() => void>(async (resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Data fetch timed out after 10 seconds'));
            }, 10000);
            
            try {
              if (!user?.uid) {
                throw new Error('No user UID available');
              }
              const unsub = await fetchPatientData(user.uid);
              clearTimeout(timeout);
              resolve(unsub);
            } catch (error) {
              clearTimeout(timeout);
              reject(error);
            }
          });
        };
        
        const unsub = await fetchWithTimeout();
        console.log('fetchPatientData completed');
        return unsub;
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Ensure loading state is reset on error
        usePatientDataStore.setState({ isLoading: false });
        return () => {}; // Return empty cleanup function
      }
    };
    
    // Only fetch data if we're not redirecting
    if (!isRedirecting) {
      const cleanupPromise = loadData();
      
      // Cleanup function to handle component unmounting
      return () => {
        console.log('Cleanup function called');
        isMounted = false;
        cleanupPromise.then((unsub: (() => void) | undefined) => {
          if (typeof unsub === 'function') {
            unsub();
          }
        }).catch(error => {
          console.error('Error during cleanup:', error);
        });
      };
    }
    
    return () => {
      isMounted = false;
    };
  }, [user?.uid, userRole, router, isRedirecting]);

  // Show loading state while data is being fetched or redirecting
  if (isLoading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">
            {isRedirecting ? 'Redirecting...' : 'Loading your dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  // If no user data is available after loading
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
          <p className="text-muted-foreground mb-6">Please sign in to access your dashboard</p>
          <Button onClick={() => router.push('/login')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Dark theme colors
  const theme = {
    background: 'bg-gray-900',
    chart: {
      grid: {
        stroke: '#374151', // gray-700
      },
      text: {
        primary: '#f3f4f6', // gray-100
        secondary: '#9ca3af', // gray-400
      },
      tooltip: {
        background: '#1f2937', // gray-800
        border: '#374151', // gray-700
      },
      line: '#3b82f6', // blue-500
    },
    card: 'bg-gray-800 border-gray-700',
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
      muted: 'text-gray-400',
    },
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700',
    accent: 'bg-blue-600 hover:bg-blue-700'
  };

  // Enhanced health metrics with real data integration
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: 'heart-rate',
      title: 'Heart Rate',
      value: '140 Bpm',
      icon: Heart,
      color: 'text-orange-500',
      trend: '+2%',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'temperature',
      title: 'Body Temperature',
      value: '37.5°C',
      icon: Thermometer,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50'
    },
    {
      id: 'glucose',
      title: 'Glucose Level',
      value: '70-90 mg/dL',
      icon: Activity,
      color: 'text-blue-700',
      trend: '+6%',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'spo2',
      title: 'SPO2',
      value: '96%',
      icon: Wind,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'blood-pressure',
      title: 'Blood Pressure',
      value: '120/80 mmHg',
      icon: Droplets,
      color: 'text-red-500',
      trend: '+2%',
      bgColor: 'bg-red-50'
    },
    {
      id: 'bmi',
      title: 'BMI',
      value: '20.1 kg/m²',
      icon: Scale,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]);

  // Sample data for enhanced features
  const [favoritesDoctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Edalin Hendry',
      specialty: 'Endodontist',
      image: 'https://i.pravatar.cc/40?img=1',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Dr. Maloney',
      specialty: 'Cardiologist',
      image: 'https://i.pravatar.cc/40?img=2',
      rating: 4.9
    },
    {
      id: '3',
      name: 'Dr. Wayne',
      specialty: 'Dental Specialist',
      image: 'https://i.pravatar.cc/40?img=3',
      rating: 4.7
    },
    {
      id: '4',
      name: 'Dr. Marla',
      specialty: 'Endodontist',
      image: 'https://i.pravatar.cc/40?img=4',
      rating: 4.6
    }
  ]);

  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      doctor: {
        id: '1',
        name: 'Dr. Edalin Hendry',
        specialty: 'Dentist',
        image: 'https://i.pravatar.cc/40?img=5',
        rating: 4.8
      },
      date: '2025-07-31',
      time: '10:30 PM',
      type: 'clinic',
      status: 'upcoming'
    },
    {
      id: '2',
      doctor: {
        id: '2',
        name: 'Dr. Juliet Gabriel',
        specialty: 'Cardiologist',
        image: 'https://i.pravatar.cc/40?img=6',
        rating: 4.9
      },
      date: '2025-08-01',
      time: '10:30 PM',
      type: 'video',
      status: 'upcoming'
    }
  ]);

  const [dashboardNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      message: 'Booking Confirmed on 21 Mar 2025 10:30 AM',
      time: 'Just Now',
      icon: Bell,
      color: 'text-violet-500'
    },
    {
      id: '2',
      type: 'review',
      message: 'You have a New Review for your Appointment',
      time: '5 Days ago',
      icon: Star,
      color: 'text-blue-500'
    },
    {
      id: '3',
      type: 'appointment',
      message: 'You have Appointment with Ahmed by 01:20 PM',
      time: '12:55 PM',
      icon: Calendar,
      color: 'text-red-500'
    },
    {
      id: '4',
      type: 'payment',
      message: 'Sent an amount of $200 for an Appointment by 01:20 PM',
      time: '2 Days ago',
      icon: Droplets,
      color: 'text-yellow-500'
    }
  ]);

  const [dependentsList] = useState<Dependent[]>([
    {
      id: '1',
      name: 'Laura',
      relation: 'Mother',
      age: 58,
      image: 'https://i.pravatar.cc/40?img=10'
    },
    {
      id: '2',
      name: 'Mathew',
      relation: 'Father',
      age: 59,
      image: 'https://i.pravatar.cc/40?img=11'
    }
  ]);

  // Chart data
  const heartRateData = [
    { day: 'Mon', rate: 140 },
    { day: 'Tue', rate: 100 },
    { day: 'Wed', rate: 180 },
    { day: 'Thu', rate: 130 },
    { day: 'Fri', rate: 100 },
    { day: 'Sat', rate: 130 }
  ];

  const bloodPressureData = [
    { day: 'Mon', systolic: 110, diastolic: 90 },
    { day: 'Tue', systolic: 90, diastolic: 60 },
    { day: 'Wed', systolic: 40, diastolic: 30 },
    { day: 'Thu', systolic: 120, diastolic: 60 },
    { day: 'Fri', systolic: 130, diastolic: 90 },
    { day: 'Sat', systolic: 130, diastolic: 70 },
    { day: 'Sun', systolic: 130, diastolic: 70 }
  ];

  // Removed duplicate data fetching effect

  // Update health metrics when healthRecords change
  useEffect(() => {
    if (healthRecords && healthRecords.length > 0) {
      const updatedMetrics = healthMetrics.map(metric => {
        const record = healthRecords.find((r: any) => 
          r.title && r.title.toLowerCase().includes(metric.title.toLowerCase().split(' ')[0])
        );
        return record ? { ...metric, value: record.value } : metric;
      });
      setHealthMetrics(updatedMetrics);
    }
  }, [healthRecords, healthMetrics, setHealthMetrics]);

  // Removed duplicate loading state

  return (
    <main className={`min-h-screen w-full ${currentTheme.background} ${currentTheme.text.primary} overflow-x-hidden`}>
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div>
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <p className={currentTheme.text.secondary}>Welcome back, {user?.displayName || 'Patient'}</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Avatar className="h-10 w-10 border border-gray-600">
              <AvatarImage 
                src={user?.photoURL || ''} 
                fallbackText={user?.displayName || 'Patient'}
                className="bg-gray-700 text-gray-200"
              />
            </Avatar>
            <span className={`font-medium ${currentTheme.text.primary}`}>
              {user?.displayName || 'Patient'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Health Records Section */}
          <div className="xl:col-span-8">
            <Card className={`mb-6 ${theme.card} border ${theme.border}`}>
              <CardHeader className="border-b border-gray-700">
                <CardTitle className={currentTheme.text.primary}>Health Overview</CardTitle>
              </CardHeader>
              <CardContent className="bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {healthMetrics.map((metric) => {
                    // Adjust colors for dark mode
                    const darkModeBg = metric.bgColor
                      .replace('50', '900')
                      .replace('100', '800')
                      .replace('200', '700');
                    
                    const darkModeText = metric.color.includes('500') 
                      ? metric.color.replace('500', '300')
                      : metric.color;
                    
                    return (
                      <div key={metric.id} className={`p-4 rounded-lg ${darkModeBg} border ${currentTheme.border}`}>
                        <div className="flex items-center justify-between mb-2">
                          <metric.icon className={`h-5 w-5 ${darkModeText}`} />
                          {metric.trend && (
                            <Badge variant="secondary" className="bg-gray-700 text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {metric.trend}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${currentTheme.text.secondary} mb-1`}>{metric.title}</p>
                        <p className={`text-lg font-semibold ${currentTheme.text.primary}`}>{metric.value}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Overall Health Report */}
                <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Overall Report</h3>
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="2"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="2"
                              strokeDasharray={`${healthReport?.percentage ?? 0}, 100`}
                            />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-semibold">{healthReport?.percentage ?? 0}%</span>
                          </div>
                        </svg>
                      </div>
                        <div>
                          <p className="text-sm text-gray-300">
                            Your health is {healthReport?.percentage ?? 0}% Normal
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Last Visit: {healthReport?.lastVisit ? format(new Date(healthReport.lastVisit as string), 'dd MMM yyyy') : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <Button className="rounded-full">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>

          {/* Book Appointment & Favorites */}
          <div className="xl:col-span-4">
            <div className="space-y-6">
              {/* Dark mode chart styles */}
              <style jsx global>{`
                .recharts-cartesian-grid-horizontal line,
                .recharts-cartesian-grid-vertical line {
                  stroke: ${currentTheme.chart.grid};
                }
                .recharts-text {
                  fill: ${currentTheme.chart.text};
                }
                .recharts-line {
                  stroke: ${currentTheme.chart.line};
                }
              `}</style>
              {/* Book Appointment */}
              <Card className={`mb-6 ${theme.card} border ${theme.border} hover:bg-gray-700/50 transition-colors`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${currentTheme.text.secondary}`}>Book a new</h3>
                      <h2 className={`text-xl font-bold ${currentTheme.text.primary}`}>Appointment</h2>
                    </div>
                    <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Favorites */}
              <Card className={`mb-6 ${theme.card} border ${theme.border} hover:bg-gray-700/50 transition-colors`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={currentTheme.text.primary}>Favourites</CardTitle>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">View All</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {favoritesDoctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between hover:bg-gray-700/30 p-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-600">
                          <AvatarImage src={doctor.image} />
                          <AvatarFallback className="bg-gray-700 text-gray-200">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={`font-medium ${currentTheme.text.primary}`}>{doctor.name}</p>
                          <p className={`text-sm ${currentTheme.text.secondary}`}>{doctor.specialty}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-blue-400 hover:bg-gray-600/50">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Appointments Section */}
          <div className="xl:col-span-5">
            <Card className={`mb-6 ${theme.card} border ${theme.border}`}>
              <CardHeader>
                <CardTitle className={currentTheme.text.primary}>Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className={`border ${currentTheme.border} rounded-lg p-4 hover:bg-gray-700/30 transition-colors`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-600">
                          <AvatarImage src={appointment.doctor.image} />
                          <AvatarFallback className="bg-gray-700 text-gray-200">
                            {appointment.doctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={`font-medium ${currentTheme.text.primary}`}>{appointment.doctor.name}</p>
                          <p className={`text-sm ${currentTheme.text.secondary}`}>{appointment.doctor.specialty}</p>
                        </div>
                      </div>
                      {appointment.type === 'video' ? (
                        <Video className="h-5 w-5 text-blue-400" />
                      ) : (
                        <Hospital className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {format(new Date(appointment.date), 'dd MMM yyyy')} - {appointment.time}
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Attend
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className={`mt-6 ${theme.card} border ${theme.border} hover:bg-gray-700/50 transition-colors`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={currentTheme.text.primary}>Notifications</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors"
                  >
                    <div className={`p-2 rounded-full bg-gray-700/50`}>
                      <notification.icon 
                        className={`h-4 w-4 ${
                          notification.color.includes('yellow') 
                            ? 'text-yellow-400' 
                            : notification.color.includes('red')
                              ? 'text-red-400'
                              : notification.color.includes('blue')
                                ? 'text-blue-400'
                                : notification.color
                        }`} 
                      />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${currentTheme.text.primary}`}>{notification.message}</p>
                      <p className={`text-xs ${currentTheme.text.muted} mt-1`}>{notification.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <div className="xl:col-span-7">
            <Card className={`${currentTheme.card} border ${currentTheme.border} hover:bg-gray-700/50 transition-colors`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={currentTheme.text.primary}>Analytics</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Mar 14 - Mar 21
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="heart-rate" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800 p-1">
                    <TabsTrigger 
                      value="heart-rate"
                      className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                    >
                      Heart Rate
                    </TabsTrigger>
                    <TabsTrigger 
                      value="blood-pressure"
                      className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                    >
                      Blood Pressure
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="heart-rate" className="mt-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={heartRateData}>
                        <XAxis 
                          dataKey="day" 
                          stroke={theme.chart.text.secondary}
                          tick={{ fill: theme.chart.text.secondary }}
                        />
                        <YAxis 
                          stroke={theme.chart.text.secondary}
                          tick={{ fill: theme.chart.text.secondary }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: theme.chart.tooltip.background,
                            borderColor: theme.chart.tooltip.border,
                            color: theme.chart.text.primary,
                            borderRadius: '0.375rem',
                            padding: '0.5rem'
                          }}
                        />
                        <Bar 
                          dataKey="rate" 
                          fill="#3b82f6" 
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="blood-pressure" className="mt-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={bloodPressureData}>
                        <XAxis 
                          dataKey="day" 
                          stroke={theme.chart.text.secondary}
                          tick={{ fill: theme.chart.text.secondary }}
                        />
                        <YAxis 
                          stroke={theme.chart.text.secondary}
                          tick={{ fill: theme.chart.text.secondary }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: theme.chart.tooltip.background,
                            borderColor: theme.chart.tooltip.border,
                            color: theme.chart.text.primary,
                            borderRadius: '0.375rem',
                            padding: '0.5rem'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{
                            paddingTop: '20px',
                            color: theme.chart.text.primary,
                            fontSize: '0.875rem'
                          }}
                          iconType="square"
                        />
                        <Bar 
                          dataKey="systolic" 
                          fill="#3b82f6" 
                          name="Systolic" 
                          radius={[4, 4, 0, 0]} 
                        />
                        <Bar 
                          dataKey="diastolic" 
                          fill="#10b981" 
                          name="Diastolic" 
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Dependents */}
            <Card className={`mt-6 ${theme.card} border ${theme.border} hover:bg-gray-700/50 transition-colors`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={theme.text.primary}>Dependents</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {dependentsList.map((dependent) => (
                  <div 
                    key={dependent.id} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-gray-600">
                        <AvatarImage src={dependent.image} />
                        <AvatarFallback className="bg-gray-700 text-gray-200">
                          {dependent.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={`font-medium ${theme.text.primary}`}>{dependent.name}</p>
                        <p className={`text-sm ${theme.text.secondary}`}>
                          {dependent.relation} - {dependent.age} years
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-gray-400 hover:text-blue-400 hover:bg-gray-600/50"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-gray-400 hover:text-blue-400 hover:bg-gray-600/50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reports Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Reports</CardTitle>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback>{user?.displayName?.[0] || 'P'}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user?.displayName || 'Patient'}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appointments" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appointments" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">ID</th>
                        <th className="text-left p-2">Doctor</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">#AP1236</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>RW</AvatarFallback>
                            </Avatar>
                            Dr. Robert Womack
                          </div>
                        </td>
                        <td className="p-2">21 Mar 2025, 10:30 AM</td>
                        <td className="p-2">Video call</td>
                        <td className="p-2">
                          <Badge variant="secondary">Upcoming</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="medical-records" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">ID</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Record For</th>
                        <th className="text-left p-2">Comments</th>
                        <th className="text-left p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">#MR1236</td>
                        <td className="p-2">Electro cardiography</td>
                        <td className="p-2">24 Mar 2025</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>HC</AvatarFallback>
                            </Avatar>
                            Hendrita Clark
                          </div>
                        </td>
                        <td className="p-2">Take Good Rest</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Link2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="prescriptions" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-gray-500">No prescriptions available</p>
                </div>
              </TabsContent>
              
              <TabsContent value="invoices" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-gray-500">No invoices available</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}