'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (!userRole) {
      router.push('/login');
      return;
    }

    // Check if user has the required role
    const hasRequiredRole = allowedRoles.includes(userRole);
    setIsAuthorized(hasRequiredRole);
    setIsChecking(false);

    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      switch (userRole) {
        case 'Patient':
          router.push('/dashboard');
          break;
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
          router.push('/login');
      }
    }
  }, [user, userRole, loading, allowedRoles, router]);

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 