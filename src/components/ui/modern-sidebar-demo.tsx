"use client";
import React, { useState } from "react";
import { ModernSidebar, ModernSidebarBody, ModernSidebarLink } from "./modern-sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut, Stethoscope, User, Calendar, MessageSquare, FileText, HelpCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

type DashboardType = 'provider' | 'patient' | 'doctor';

interface DashboardConfig {
  navLinks: {
    label: string;
    href: string;
    icon: JSX.Element;
  }[];
  profileLink: {
    label: string;
    href: string;
    icon: JSX.Element;
  };
  logo: {
    full: JSX.Element;
    icon: JSX.Element;
  };
}

export function ModernSidebarDemo({ type = 'provider' }: { type?: DashboardType }) {
  const [open, setOpen] = useState(false);
  
  const dashboardConfigs: Record<DashboardType, DashboardConfig> = {
    provider: {
      navLinks: [
        {
          label: "Dashboard",
          href: "/dashboard/provider",
          icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Appointments",
          href: "/dashboard/provider/appointments",
          icon: <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Patients",
          href: "/dashboard/provider/patients",
          icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Messages",
          href: "/dashboard/provider/messages",
          icon: <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Reports",
          href: "/dashboard/provider/reports",
          icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
      ],
      profileLink: {
        label: "Provider Name",
        href: "/dashboard/provider/profile",
        icon: (
          <Image
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9jdG9yfGVufDB8fDB8fHww"
            className="h-7 w-7 flex-shrink-0 rounded-full"
            width={50}
            height={50}
            alt="Provider"
          />
        ),
      },
      logo: {
        full: <Logo />,
        icon: <LogoIcon />
      }
    },
    doctor: {
      navLinks: [
        {
          label: "Dashboard",
          href: "/dashboard/doctor",
          icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "My Schedule",
          href: "/dashboard/doctor/schedule",
          icon: <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Patients",
          href: "/dashboard/doctor/patients",
          icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Messages",
          href: "/dashboard/doctor/messages",
          icon: <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
      ],
      profileLink: {
        label: "Dr. Smith",
        href: "/dashboard/doctor/profile",
        icon: (
          <Image
            src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZG9jdG9yfGVufDB8fDB8fHww"
            className="h-7 w-7 flex-shrink-0 rounded-full"
            width={50}
            height={50}
            alt="Doctor"
          />
        ),
      },
      logo: {
        full: <Logo />,
        icon: <LogoIcon />
      }
    },
    patient: {
      navLinks: [
        {
          label: "Dashboard",
          href: "/dashboard/patient",
          icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Find Doctors",
          href: "/dashboard/patient/doctors",
          icon: <Stethoscope className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Appointments",
          href: "/dashboard/patient/appointments",
          icon: <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Medical Records",
          href: "/dashboard/patient/records",
          icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Help Center",
          href: "/dashboard/patient/help",
          icon: <HelpCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
      ],
      profileLink: {
        label: "John Doe",
        href: "/dashboard/patient/profile",
        icon: (
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww"
            className="h-7 w-7 flex-shrink-0 rounded-full"
            width={50}
            height={50}
            alt="Patient"
          />
        ),
      },
      logo: {
        full: <Logo />,
        icon: <LogoIcon />
      }
    },
  };

  const config = dashboardConfigs[type];

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "min-h-[80vh]"
      )}
    >
      <ModernSidebar open={open} setOpen={setOpen}>
        <ModernSidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? config.logo.full : config.logo.icon}
            <div className="mt-8 flex flex-col gap-2">
              {config.navLinks.map((link, idx) => (
                <ModernSidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <ModernSidebarLink
              link={config.profileLink}
            />
          </div>
        </ModernSidebarBody>
      </ModernSidebar>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome to your {type} dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow h-40 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Dashboard Item {i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-8 w-8 bg-blue-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 flex items-center justify-center">
        <Stethoscope className="h-4 w-4 text-white" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        AI Doctor
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-8 w-8 bg-blue-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 flex items-center justify-center">
        <Stethoscope className="h-4 w-4 text-white" />
      </div>
    </Link>
  );
};
