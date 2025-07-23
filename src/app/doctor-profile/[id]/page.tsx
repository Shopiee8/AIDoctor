
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';

import { LandingHeader } from "@/components/landing-header";
import { Footer } from "@/components/home/footer";
import { ProfileHeader } from "@/components/doctor-profile/profile-header";
import { ProfileContent } from "@/components/doctor-profile/profile-content";
import type { Doctor } from '@/components/doctor-card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingModal } from '@/components/booking-modal';

export default function DoctorProfilePage({ params }: { params: { id: string } }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchDoctorData = async () => {
      try {
        const docRef = doc(db, 'doctors', params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDoctor({ id: docSnap.id, ...docSnap.data() } as Doctor);
        } else {
          setError('Doctor not found.');
        }
      } catch (err) {
        setError('Failed to fetch doctor data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [params.id]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-muted/50">
        <LandingHeader />
        <main className="flex-1">
          {/* Breadcrumb */}
          <div className="bg-card py-4 border-b">
              <div className="container">
                  <nav className="text-sm">
                      <ol className="list-none p-0 inline-flex items-center">
                          <li className="flex items-center">
                              <Link href="/" className="text-muted-foreground hover:text-primary">Home</Link>
                          </li>
                          <li className="flex items-center mx-2 text-muted-foreground">/</li>
                          <li className="flex items-center">
                              <Link href="/search" className="text-muted-foreground hover:text-primary">Doctors</Link>
                          </li>
                           <li className="flex items-center mx-2 text-muted-foreground">/</li>
                          <li className="text-foreground">Doctor Profile</li>
                      </ol>
                  </nav>
              </div>
          </div>

          <div className="content py-8">
              <div className="container">
                  {loading && <ProfileSkeleton />}
                  {error && <div className="text-center text-red-500">{error}</div>}
                  {!loading && !error && doctor && (
                      <div className="space-y-6">
                          <ProfileHeader doctor={doctor} />
                          <ProfileContent doctor={doctor} />
                      </div>
                  )}
              </div>
          </div>
        </main>
        <Footer />
      </div>
      <BookingModal />
    </>
  );
}


function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div className="p-6 bg-card border rounded-lg">
                <div className="flex items-start gap-6">
                    <Skeleton className="w-36 h-36 rounded-lg" />
                    <div className="space-y-3 flex-1">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-5 w-3/4" />
                    </div>
                </div>
            </div>
            <div className="p-6 bg-card border rounded-lg">
                 <Skeleton className="h-10 w-full" />
                 <div className="mt-6 space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                 </div>
            </div>
        </div>
    )
}
