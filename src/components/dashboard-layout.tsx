
'use client';

import { SessionNavBar } from "@/components/ui/sidebar";

export function DashboardLayout({
  children,
  userRole, // userRole is kept for potential future use but is not used by the new sidebar
}: {
  children: React.ReactNode;
  userRole: 'Patient' | 'Doctor' | 'Admin' | 'AI Provider';
}) {
  return (
    <div className="flex h-screen w-screen flex-row">
      <SessionNavBar />
      <main className="flex h-screen grow flex-col overflow-auto ml-12">
        <div className="p-4 md:p-6 lg:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
