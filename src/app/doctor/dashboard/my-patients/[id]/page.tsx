import { PatientProfile } from "@/components/doctor/patient-profile";
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PatientProfilePage({ params }: Props) {
  // In Next.js 13+, params is already available synchronously in page components
  // No need to await it, but we'll keep the component async for any data fetching
  const patientId = params.id;
  
  if (!patientId) {
    return notFound();
  }

  return <PatientProfile patientId={patientId} />;
}