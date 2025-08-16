'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Stethoscope, LineChart, Settings, User, Plus, CreditCard } from 'lucide-react';

export function ProviderSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const navItems = useMemo(
    () => [
      {
        name: 'Dashboard',
        href: '/ai-provider/dashboard',
        icon: LayoutDashboard,
        active: pathname === '/ai-provider/dashboard',
      },
      {
        name: 'AI Doctors',
        href: '/ai-provider/doctors',
        icon: Stethoscope,
        active: pathname.startsWith('/ai-provider/doctors'),
      },
      {
        name: 'Analytics',
        href: '/ai-provider/analytics',
        icon: LineChart,
        active: pathname.startsWith('/ai-provider/analytics'),
      },
      {
        name: 'Billing',
        href: '/ai-provider/billing',
        icon: CreditCard,
        active: pathname.startsWith('/ai-provider/billing'),
      },
      {
        name: 'Settings',
        href: '/ai-provider/settings',
        icon: Settings,
        active: pathname.startsWith('/ai-provider/settings'),
      },
    ],
    [pathname]
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Stethoscope className="h-6 w-6" />
            <span className="text-lg">AI Doctor</span>
          </Link>
        </div>
        
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  item.active && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
                {item.name === 'AI Doctors' && (
                  <span className="ml-auto">
                    <Plus className="h-4 w-4" />
                  </span>
                )}
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t">
              <Link
                href="/ai-provider/doctors/new"
                className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New AI Doctor
              </Link>
            </div>
          </nav>
        </div>
        
        <div className="mt-auto p-4">
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                <AvatarFallback>
                  {user?.displayName
                    ? user.displayName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{user?.displayName || 'User'}</p>
                <p className="text-xs text-muted-foreground">AI Provider</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleSignOut}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
