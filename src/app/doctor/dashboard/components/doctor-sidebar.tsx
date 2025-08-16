'use client';

import { useState } from 'react';
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
  Video, 
  Bell, 
  UserPlus,
  DollarSign,
  Clock,
  CalendarDays,
  Star
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';

export function DoctorSidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // Navigation links for the sidebar
  const navLinks = [
    {
      label: "Dashboard",
      href: "/doctor/dashboard",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Appointments",
      href: "/doctor/dashboard/appointments",
      icon: <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "My Patients",
      href: "/doctor/dashboard/my-patients",
      icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Schedule",
      href: "/doctor/dashboard/schedule",
      icon: <CalendarDays className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Video Consultations",
      href: "/doctor/dashboard/meetings",
      icon: <Video className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Messages",
      href: "/doctor/dashboard/messages",
      icon: <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Reviews",
      href: "/doctor/dashboard/reviews",
      icon: <Star className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Invoices",
      href: "/doctor/dashboard/invoices",
      icon: <DollarSign className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "/doctor/dashboard/settings",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return 'D';
    return name
      .split(' ')
      .map(part => part[0] || '')
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ModernSidebar open={open} setOpen={setOpen}>
      <ModernSidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? (
            <div className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex items-center justify-center">
                  <Stethoscope className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-black dark:text-white">AI Doctor</span>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="h-8 w-8 bg-blue-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
          <div className="mt-8 flex flex-col gap-2 px-4">
            {navLinks.map((link, idx) => (
              <ModernSidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="relative h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Doctor'}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {user?.displayName ? getInitials(user.displayName) : 'D'}
                </span>
              )}
            </div>
            {open && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Dr. {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </ModernSidebarBody>
    </ModernSidebar>
  );
}
