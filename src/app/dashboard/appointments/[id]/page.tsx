import { AppointmentDetail } from "@/components/appointment-detail";

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppointmentDetail appointmentId={params.id} />
  );
}
