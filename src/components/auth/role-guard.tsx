'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
};

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  redirectTo = '/unauthorized' 
}: RoleGuardProps) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;

    // If user is not authenticated, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user has any of the allowed roles
    const hasRequiredRole = userRole ? allowedRoles.includes(userRole) : false;
    
    if (hasRequiredRole) {
      setIsAuthorized(true);
    } else {
      console.warn(`User with role ${userRole} is not authorized to access this page`);
      router.push(redirectTo);
    }
  }, [user, userRole, loading, allowedRoles, redirectTo, router]);

  // Show loading state while checking authentication
  if (loading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if user has any of the allowed roles
  const hasRequiredRole = userRole && allowedRoles.includes(userRole);

  // If user has required role, render children, otherwise null (will be redirected)
  return hasRequiredRole ? <>{children}</> : null;
}
