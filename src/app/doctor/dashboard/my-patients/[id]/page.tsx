import { PatientProfile } from "@/components/doctor/patient-profile";

export default function PatientProfilePage({ params }: { params: { id: string } }) {
  return (
    <PatientProfile patientId={params.id} />
  );
}
