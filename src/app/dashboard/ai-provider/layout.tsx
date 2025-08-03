import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { getAIProvider } from '@/lib/firebase/providerService';
import { ProviderSidebar } from '@/components/sidebar-provider';

export const metadata: Metadata = {
  title: 'AI Provider Dashboard',
  description: 'Manage your AI doctors and view analytics',
};

export default async function AIProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  // Check if user is an AI provider
  const provider = await getAIProvider(user.id);
  
  // Redirect to become a provider page if not a provider
  if (!provider) {
    redirect('/dashboard/become-provider');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <ProviderSidebar />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <main className="flex-1">
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
