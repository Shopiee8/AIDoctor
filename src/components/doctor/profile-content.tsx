'use client';

import { Suspense } from 'react';
import DoctorProfile from '@/app/doctor/dashboard/profile';
import { BookingModal } from '@/components/booking-modal';
import { useParams } from 'next/navigation';

function DoctorProfilePage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DoctorProfile doctorId={id} />
            <BookingModal />
        </Suspense>
    );
}

export default DoctorProfilePage;