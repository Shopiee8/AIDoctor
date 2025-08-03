import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { getAIProvider } from '@/lib/firebase/providerService';
import { AIDoctorForm } from '@/components/ai-doctor-form';

export const metadata: Metadata = {
  title: 'New AI Doctor',
  description: 'Create a new AI doctor for your practice',
};

export default async function NewAIDoctorPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const provider = await getAIProvider(user.id);
  
  if (!provider) {
    redirect('/dashboard/become-provider');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New AI Doctor</h1>
        <p className="text-muted-foreground">
          Set up a new AI doctor for your practice
        </p>
      </div>

      <AIDoctorForm providerId={provider.id} />
    </div>
  );
}
