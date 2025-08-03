"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LogOut,
  Calendar,
  Heart,
  Star,
  Users,
  FileText,
  Wallet,
  Receipt,
  MessageCircle,
  Activity,
  Settings,
  Stethoscope,
  Bot,
  UserPlus,
  Phone,
  Watch,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: Activity, path: "/dashboard" },
  { label: "AI Consultation", icon: Bot, path: "/dashboard/ai-consultation" },
  { label: "Appointments", icon: Calendar, path: "/dashboard/appointments" },
  { label: "Vitals", icon: Heart, path: "/dashboard/vitals" },
  { label: "My Dependents", icon: Users, path: "/dashboard/dependents" },
  { label: "Medical Records", icon: FileText, path: "/dashboard/medical-records" },
  { label: "Invoices", icon: Receipt, path: "/dashboard/invoices" },
  { label: "Messages", icon: MessageCircle, path: "/dashboard/messages" },
  { label: "My Favorites", icon: Star, path: "/dashboard/favourites" },
  { label: "Wallet", icon: Wallet, path: "/dashboard/wallet" },
];

const emergencyContacts = [
  { name: "911", icon: <Phone size={16} />, action: () => window.open("tel:911", "_self") },
  { name: "Sarah", icon: <Phone size={16} />, action: () => window.open("tel:+1234567890", "_self") },
  { name: "Dr. Johnes", icon: <Phone size={16} />, action: () => window.open("tel:+1987654321", "_self") },
];

export default function PatientSidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes to get updated user data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Initial fetch
    const fetchPatient = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPatient(docSnap.data());
        }
      } catch (error) {
        console.error("Failed to fetch patient data", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Subscribe to real-time updates
    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setPatient(doc.data());
      }
    });
    
    // Initial fetch
    fetchPatient();
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div className="w-72 p-4">Loading...</div>;
  }

  const name = patient?.name || user?.displayName || "User";
  const photoURL = user?.photoURL || "/assets/img/ai doctor.png";
  const fallbackInitial =
    user?.displayName?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "P";

  return (
    <aside className="hidden md:flex flex-col min-h-screen w-72 bg-card shadow-xl border-r border-border">
      {/* App Logo/Name */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-4">
        <img
          src="/assets/img/ai doctor.png"
          alt="App Logo"
          className="w-8 h-8 rounded-full"
        />
        <span className="font-bold text-xl tracking-tight text-foreground">
          AI DOCTOR
        </span>
      </div>

      {/* User Profile */}
      <div className="flex flex-col items-center gap-2 px-6 pb-6">
        <Avatar className="w-16 h-16 border-4 border-primary shadow-lg">
          <AvatarImage src={photoURL} alt={name} />
          <AvatarFallback className="bg-primary text-primary-foreground">{fallbackInitial}</AvatarFallback>
        </Avatar>
        <div className="text-lg font-semibold text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">Checked in 12h</div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-4">
        <div className="mb-2 text-xs text-muted-foreground font-semibold px-2">
          MAIN MENU
        </div>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Button
                variant={pathname === item.path ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                  pathname === item.path 
                    ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-medium border-l-4 border-primary shadow-sm" 
                    : "text-foreground/90 hover:bg-accent/30 hover:translate-x-1"
                }`}
                onClick={() => router.push(item.path)}
                title={item.label}
              >
                <item.icon />
                <span className="hidden lg:inline">{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>

        {/* Invite a member */}
        <Button className="w-full mt-6 mb-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-2 font-semibold flex items-center gap-2">
          <UserPlus size={18} /> Invite a member
        </Button>

        {/* Emergency Contacts */}
        <div className="mt-6 mb-2 text-xs font-semibold px-2 text-destructive">
          EMERGENCY CONTACTS
        </div>
        <ul className="space-y-2">
          {emergencyContacts.map((c) => (
            <li
              key={c.name}
              className="flex items-center justify-between bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 hover:bg-destructive/15 transition-colors"
            >
              <span className="text-destructive font-medium flex items-center gap-2">
                {c.icon}
                {c.name}
              </span>
              <Button
                size="sm"
                variant="secondary"
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-md text-sm font-medium shadow-sm"
                onClick={c.action}
              >
                Call
              </Button>
            </li>
          ))}
        </ul>

        {/* Devices */}
        <div className="mt-6 mb-2 text-xs text-muted-foreground font-semibold px-2">
          DEVICES
        </div>
        <div className="flex items-center gap-3 bg-accent/30 rounded-lg px-3 py-2">
          <Watch size={18} className="text-muted-foreground" />
          <span className="text-foreground">Connect your Watch</span>
        </div>
      </nav>

      {/* Logout & Settings */}
      <div className="px-6 pb-8 mt-auto flex flex-col gap-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-lg py-2 text-foreground hover:bg-accent/50"
          onClick={() => router.push("/dashboard/settings")}
          title="Settings"
        >
          <Settings size={18} />
          <span className="hidden lg:inline">Settings</span>
        </Button>
        <Button
          onClick={signOut}
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg py-2 font-semibold flex items-center gap-2"
          title="Logout"
        >
          <LogOut size={18} /> Logout
        </Button>
      </div>
    </aside>
  );
}
