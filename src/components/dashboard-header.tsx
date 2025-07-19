'use client';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from './ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { ShoppingCartDropdown } from './shopping-cart-dropdown';
import { NotificationDropdown } from './notification-dropdown';
import { ArrowLeft, Clock } from 'lucide-react';

export function DashboardHeader() {
  const { signOut, user } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="flex h-16 items-center gap-4 px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

       <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:inline-flex">
          <ArrowLeft className="h-4 w-4"/>
       </Button>
      <h2 className="text-xl font-bold">Hello, {user?.displayName?.split(' ')[0] || 'William'}</h2>
      <div className="flex items-center text-muted-foreground ml-4">
        <Clock className="w-4 h-4 mr-2" />
        <span className="text-sm">5:30 PM</span>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm">Checked in 12h</Button>
        <ShoppingCartDropdown />
        <NotificationDropdown />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <Avatar>
                <AvatarImage src={user?.photoURL || undefined} data-ai-hint="person" />
                <AvatarFallback>{user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'W'}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.displayName || user?.email || 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
