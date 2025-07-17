
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell } from 'lucide-react';
import { usePatientDataStore } from '@/store/patient-data-store';
import { Skeleton } from './ui/skeleton';

export function NotificationDropdown() {
  const { notifications, isLoading } = usePatientDataStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {!isLoading && notifications.length > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96 p-0">
        <div className="p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
        </div>
        <ScrollArea className="h-80">
          <div className="p-2">
            {isLoading ? (
                <div className="space-y-2 p-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                </div>
            ) : notifications.length > 0 ? (
                <ul className="space-y-1">
                {notifications.map((item) => (
                    <li key={item.id}>
                        <Link href="#" className="block rounded-md hover:bg-muted/50">
                            <div className="p-2 flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
                                    <item.icon className="w-5 h-5"/>
                                </div>
                                <div className="flex-1 text-sm">
                                    <p className="text-muted-foreground">{item.message}</p>
                                    <p className="text-xs text-muted-foreground/70">{item.time}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
                </ul>
            ) : (
                <div className="text-center text-sm text-muted-foreground py-10">
                    You have no new notifications.
                </div>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
