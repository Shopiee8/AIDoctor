import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Activity, HeartPulse, ShoppingBag, Users, FlaskConical, CreditCard, UserPlus, Phone, Watch } from 'lucide-react';

const mainMenu = [
  { label: 'Dashboard', icon: <Activity size={18} />, path: '/dashboard' },
  { label: 'Care Plan', icon: <HeartPulse size={18} />, path: '/dashboard/care-plan' },
  { label: 'Pharmacy', icon: <ShoppingBag size={18} />, path: '/dashboard/pharmacy' },
  { label: 'Community', icon: <Users size={18} />, path: '/dashboard/community' },
];
const additionalMenu = [
  { label: 'Clinical Trials', icon: <FlaskConical size={18} />, path: '/dashboard/clinical-trials' },
  { label: 'Subscriptions', icon: <CreditCard size={18} />, path: '/dashboard/subscriptions' },
];
const emergencyContacts = [
  { name: '911', icon: <Phone size={16} />, action: () => window.open('tel:911', '_self') },
  { name: 'Sarah', icon: <Phone size={16} />, action: () => window.open('tel:+1234567890', '_self') },
  { name: 'Dr. Johnes', icon: <Phone size={16} />, action: () => window.open('tel:+1987654321', '_self') },
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
    return <div className="w-72 p-4">Loading...</div>;
  }

  const name = patient?.name || user?.displayName || 'User';
  const photoURL = user?.photoURL || '/assets/img/ai doctor.png';

  return (
    <aside className="hidden md:flex flex-col min-h-screen w-72 bg-gradient-to-br from-[#1a233a] to-[#22304a] shadow-xl glassmorphism border-r border-blue-900/30">
      {/* App Logo/Name */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-4">
        <img src="/assets/img/ai doctor.png" alt="App Logo" className="w-8 h-8 rounded-full" />
        <span className="font-bold text-xl tracking-tight text-white">AI DOCTOR</span>
      </div>
      {/* User Profile */}
      <div className="flex flex-col items-center gap-2 px-6 pb-6">
        <Avatar className="w-16 h-16 border-4 border-blue-500 shadow-lg">
          <AvatarImage src={photoURL} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-lg font-semibold text-white">{name}</div>
        <div className="text-xs text-blue-300">Checked in 12h</div>
      </div>
      {/* Main Menu */}
      <nav className="flex-1 px-4">
        <div className="mb-2 text-xs text-blue-200 font-semibold px-2">MAIN MENU</div>
        <ul className="space-y-1">
          {mainMenu.map((item) => (
            <li key={item.label}>
              <Button
                variant={pathname === item.path ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 rounded-lg px-3 py-2 text-white/90 ${pathname === item.path ? 'bg-blue-700/80' : 'hover:bg-blue-800/40'}`}
                onClick={() => router.push(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>
        <div className="mt-6 mb-2 text-xs text-blue-200 font-semibold px-2">ADDITIONAL</div>
        <ul className="space-y-1">
          {additionalMenu.map((item) => (
            <li key={item.label}>
              <Button
                variant={pathname === item.path ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 rounded-lg px-3 py-2 text-white/90 ${pathname === item.path ? 'bg-blue-700/80' : 'hover:bg-blue-800/40'}`}
                onClick={() => router.push(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>
        {/* Invite a member */}
        <Button className="w-full mt-6 mb-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold flex items-center gap-2">
          <UserPlus size={18} /> Invite a member
        </Button>
        {/* Emergency Contacts */}
        <div className="mt-6 mb-2 text-xs text-blue-200 font-semibold px-2">EMERGENCY CONTACTS</div>
        <ul className="space-y-2">
          {emergencyContacts.map((c) => (
            <li key={c.name} className="flex items-center justify-between bg-blue-900/40 rounded-lg px-3 py-2">
              <span className="text-white font-medium flex items-center gap-2"><Phone size={16} className="text-blue-400" />{c.name}</span>
              <Button size="sm" variant="secondary" className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded" onClick={c.action}>Call</Button>
            </li>
          ))}
        </ul>
        {/* Devices */}
        <div className="mt-6 mb-2 text-xs text-blue-200 font-semibold px-2">DEVICES</div>
        <div className="flex items-center gap-3 bg-blue-900/40 rounded-lg px-3 py-2">
          <Watch size={18} className="text-blue-400" />
          <span className="text-white">Connect your Watch</span>
        </div>
      </nav>
      {/* Logout */}
      <div className="px-6 pb-8 mt-auto">
        <Button onClick={signOut} className="w-full bg-blue-800 hover:bg-blue-900 text-white rounded-lg py-2 font-semibold flex items-center gap-2">
          <LogOut size={18} /> Logout
        </Button>
      </div>
    </aside>
  );
} 