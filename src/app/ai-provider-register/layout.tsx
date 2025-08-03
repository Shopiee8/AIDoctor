'use client';

import { usePathname } from 'next/navigation';
import { Steps } from "@/components/ui/steps";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Determine the current step based on the URL
  const getCurrentStep = () => {
    if (pathname.includes('step-3')) return '3';
    if (pathname.includes('step-2')) return '2';
    return '1';
  };

  const steps = [
    { id: '1', name: 'Account', href: '/ai-provider-register/step-1' },
    { id: '2', name: 'Agent Setup', href: '/ai-provider-register/step-2' },
    { id: '3', name: 'Complete', href: '/ai-provider-register/step-3' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Steps
            steps={steps}
            currentStep={getCurrentStep()}
          />
        </div>
        <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
