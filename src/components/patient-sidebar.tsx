import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, Heart, Star, Users, FileText, Wallet, Receipt, MessageCircle, Activity, Settings } from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: <Activity size={18} />, path: '/dashboard' },
  { label: 'My Appointments', icon: <Calendar size={18} />, path: '/dashboard/appointments' },
  { label: 'Favourites', icon: <Star size={18} />, path: '/dashboard/favourites' },
  { label: 'Dependants', icon: <Users size={18} />, path: '/dashboard/dependants' },
  { label: 'Medical Records', icon: <FileText size={18} />, path: '/dashboard/medical-records' },
  { label: 'Wallet', icon: <Wallet size={18} />, path: '/dashboard/wallet' },
  { label: 'Invoices', icon: <Receipt size={18} />, path: '/dashboard/invoices' },
  { label: 'Messages', icon: <MessageCircle size={18} />, path: '/dashboard/messages' },
  { label: 'Vitals', icon: <Heart size={18} />, path: '/dashboard/vitals' },
  { label: 'Settings', icon: <Settings size={18} />, path: '/dashboard/settings' },
];

export default function PatientSidebar() {
  const { user, signOut } = useAuth();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const fetchPatient = async () => {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPatient(docSnap.data());
      }
      setLoading(false);
    };
    fetchPatient();
  }, [user]);

  if (loading) {
    return <div className="w-64 p-4">Loading...</div>;
  }

  const personal = patient?.personalDetails || {};
  const gender = personal.gender ? (personal.gender.charAt(0).toUpperCase() + personal.gender.slice(1)) : 'N/A';
  const age = personal.age ? `${personal.age} years` : 'N/A';
  const name = patient?.name || user?.displayName || 'User';
  const patientId = patient?.id || user?.uid || 'N/A';
  const photoURL = user?.photoURL || '/assets/img/ai doctor.png';

  return (
    <SidebarProvider>
      <Sidebar className="bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 min-h-screen w-64">
        <SidebarHeader className="flex flex-col items-center py-6">
          {/* App Logo/Name */}
          <div className="mb-4 flex items-center gap-2">
            <img src="/assets/img/ai doctor.png" alt="App Logo" className="w-8 h-8 rounded-full" />
            <span className="font-bold text-lg tracking-tight">AI Doctor</span>
          </div>
          {/* User Info */}
          <Avatar className="w-16 h-16 mb-2">
            <AvatarImage src={photoURL} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-base font-semibold">{name}</div>
          <div className="text-xs text-gray-500">Patient ID : {patientId}</div>
          <div className="text-xs text-gray-500">{gender}</div>
          <div className="text-xs text-gray-500 mb-2">{age}</div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  isActive={pathname === item.path}
                  onClick={() => router.push(item.path)}
                  className="flex items-center gap-3"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={signOut}
                className="flex items-center gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
} 