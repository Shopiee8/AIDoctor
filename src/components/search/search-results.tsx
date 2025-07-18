
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, query, where, orderBy, startAt, endAt } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DoctorCard, type Doctor } from "@/components/doctor-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function ResultsComponent() {
    const searchParams = useSearchParams();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            setIsLoading(true);
            try {
                const doctorsRef = collection(db, 'doctors');
                let q = query(doctorsRef);

                const searchQuery = searchParams.get('query')?.toLowerCase() || '';
                const locationQuery = searchParams.get('location')?.toLowerCase() || '';

                // Note: Firestore does not support native text search on parts of a string ('contains').
                // A production app would use a third-party search service like Algolia or Typesense.
                // For this demo, we will fetch all and filter client-side, which is not scalable.
                const querySnapshot = await getDocs(q);
                
                const allDoctors: Doctor[] = [];
                querySnapshot.forEach((doc) => {
                    // Simple check to ensure basic data exists
                    if (doc.data().name && doc.data().specialty) {
                        allDoctors.push({ id: doc.id, ...doc.data() } as Doctor);
                    }
                });
                
                const filtered = allDoctors.filter(doc => {
                    const nameMatch = doc.name ? doc.name.toLowerCase().includes(searchQuery) : false;
                    const specialtyMatch = doc.specialty ? doc.specialty.toLowerCase().includes(searchQuery) : false;
                    
                    const locationMatch = locationQuery 
                        ? (doc.location ? doc.location.toLowerCase().includes(locationQuery) : false)
                        : true;
                    
                    return (nameMatch || specialtyMatch) && locationMatch;
                });
                
                setDoctors(filtered);

            } catch (error) {
                console.error("Error fetching doctors: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
    }, [searchParams]);
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">
                Showing <span className="text-primary">{doctors.length}</span> Results For You
            </h3>

            {doctors.length === 0 ? (
                <Alert>
                    <AlertTitle>No Results Found</AlertTitle>
                    <AlertDescription>
                        No doctors, clinics, or hospitals matched your search criteria. Please try a different search.
                    </AlertDescription>
                </Alert>
            ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {doctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
            )}
            
            {doctors.length > 5 && (
                 <div className="text-center mt-8">
                    <Button variant="outline">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Load More...
                    </Button>
                </div>
            )}
        </div>
    );
}

export function SearchResults() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ResultsComponent />
    </Suspense>
  );
}
