'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AppUser, onAuthStateChanged } from '@/lib/auth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  loadingComponent?: ReactNode;
  skipForRoutes?: string[];
}

export function RoleGuard({ 
  children, 
  allowedRoles = ['Patient'], 
  redirectTo = '/login',
  loadingComponent = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    </div>
  ),
  skipForRoutes = []
}: RoleGuardProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if current route should skip role guard
  const shouldSkipGuard = skipForRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (currentUser) => {
      setLoading(true);
      
      try {
        setUser(currentUser);
        
        // If no user is logged in, redirect to login (unless on a public route)
        if (!currentUser) {
          if (!shouldSkipGuard) {
            router.push(redirectTo);
          }
          return;
        }

        const userRole = currentUser?.role;
        
        // If user role is not in allowed roles, redirect to appropriate dashboard
        if (userRole && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
          switch(userRole) {
            case 'Doctor':
              router.push('/doctor/dashboard');
              break;
            case 'AI Provider':
              router.push('/ai-provider/dashboard');
              break;
            case 'Admin':
              router.push('/admin/dashboard');
              break;
            default:
              router.push('/');
          }
          return;
        }

        // If we get here, user is authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error in RoleGuard:', error);
        router.push('/error');
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [allowedRoles, redirectTo, router, shouldSkipGuard]);

  // Skip guard for specified routes
  if (shouldSkipGuard) {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (loading) {
    return <>{loadingComponent}</>;
  }

  // If user is authorized, render children
  if (isAuthorized && user) {
    return <>{children}</>;
  }

  // Show loading state while redirecting
  return <>{loadingComponent}</>;
}

export default RoleGuard;
