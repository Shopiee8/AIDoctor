'use client';

import { useAuth } from "@/hooks/use-auth";
import { usePatientDataStore } from "@/store/patient-data-store";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
  requiresPatientData?: boolean;
}

// Loading component for consistent loading states
const LoadingScreen = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);

export function DashboardLayoutWrapper({ 
  children, 
  requiresPatientData = true 
}: DashboardLayoutWrapperProps) {
  const { user, loading: authLoading } = useAuth();
  const { fetchPatientData, clearPatientData, isLoading: isPatientDataLoading } = usePatientDataStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const pathname = usePathname();

  // Define routes that should bypass the RoleGuard
  const publicRoutes = [
    '/dashboard/become-provider',
    // Add other public routes here if needed
  ];
  
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // Handle patient data fetching if required
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const loadData = async () => {
      if (!requiresPatientData) {
        setIsInitialLoad(false);
        return;
      }

      try {
        // Only fetch patient data if user is logged in and not on a public route
        if (user?.uid && !isPublicRoute) {
          unsubscribe = await fetchPatientData(user.uid);
        } else {
          clearPatientData();
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      }
    };

    loadData();

    // Cleanup function to unsubscribe from data listeners
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, fetchPatientData, clearPatientData, isPublicRoute, isInitialLoad, requiresPatientData]);

  // Show loading state while auth is initializing or data is loading
  if (authLoading || (isInitialLoad && !isPublicRoute)) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  // If patient data is required and still loading, show loading state
  if (requiresPatientData && isPatientDataLoading) {
    return <LoadingScreen message="Loading your data..." />;
  }

  return <>{children}</>;
}
