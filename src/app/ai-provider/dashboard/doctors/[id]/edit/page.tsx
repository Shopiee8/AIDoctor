import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { getAIProvider, getAIDoctor } from '@/lib/firebase/providerService';
import { AIDoctorForm } from '@/components/ai-doctor-form';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const aiDoctor = await getAIDoctor(params.id);
  
  return {
    title: aiDoctor ? `Edit ${aiDoctor.name}` : 'AI Doctor Not Found',
    description: aiDoctor ? `Edit your ${aiDoctor.specialty} AI doctor` : 'AI Doctor not found',
  };
}

export default async function EditAIDoctorPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const provider = await getAIProvider(user.id);
  
  if (!provider) {
    redirect('/dashboard/become-provider');
  }

  const aiDoctor = await getAIDoctor(params.id);
  
  if (!aiDoctor || aiDoctor.providerId !== provider.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit AI Doctor</h1>
          <p className="text-muted-foreground">
            Update the details of {aiDoctor.name}
          </p>
        </div>
      </div>

      <AIDoctorForm 
        initialData={aiDoctor} 
        providerId={provider.id} 
      />
    </div>
  );
}
