import React from 'react';
import DoctorProfile from './components';

interface PageProps {
  params: { id: string };
}

export default function DoctorProfilePage({ params }: PageProps) {
  // In Next.js 15.3.3+, we can directly destructure params
  // as they are automatically unwrapped in Server Components
  const { id } = params;
  
  return (
    <div className="container mx-auto py-8">
      <DoctorProfile doctorId={id} />
    </div>
  );
}
