
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DoctorCard, type Doctor } from "@/components/doctor-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const doctorList: Doctor[] = [
    {
        name: "Dr. Michael Brown",
        specialty: "Psychologist",
        location: "Minneapolis, MN",
        languages: "English, German",
        experience: "18 Years",
        votes: "90% (228 / 240)",
        fees: "$400",
        nextAvailable: "04:00 PM - 20 Nov, Wed",
        rating: 5.0,
        available: true,
        image: "https://placehold.co/200x200.png",
        imageHint: "doctor portrait",
        degree: "B.S, M.S - Psychology",
        isFavorited: true,
        isVerified: true,
    },
    {
        name: "Dr. Nicholas Tello",
        specialty: "Pediatrician",
        location: "Ogden, IA",
        languages: "English, Korean",
        experience: "15 Years",
        votes: "95% (200 / 220)",
        fees: "$400",
        nextAvailable: "11:00 AM - 14 Nov, Thu",
        rating: 4.6,
        available: true,
        image: "https://placehold.co/200x200.png",
        imageHint: "doctor friendly",
        degree: "MBBS, MD - Pediatrics",
    },
    {
        name: "Dr. Harold Bryant",
        specialty: "Neurologist",
        location: "Winona, MS",
        languages: "English, French",
        experience: "20 Years",
        votes: "98% (252 / 287)",
        fees: "$600",
        nextAvailable: "10:00 AM - 15 Oct, Tue",
        rating: 4.8,
        available: true,
        image: "https://placehold.co/200x200.png",
        imageHint: "doctor serious",
        degree: "MBBS, DNB - Neurology",
    },
    {
        name: "Dr. Sandra Jones",
        specialty: "Cardiologist",
        location: "Beckley, WV",
        languages: "English, Spanish",
        experience: "30 Years",
        votes: "92% (270 / 300)",
        fees: "$450",
        nextAvailable: "11.00 AM - 19 Oct, Sat",
        rating: 4.8,
        available: false,
        image: "https://placehold.co/200x200.png",
        imageHint: "doctor smiling",
        degree: "MBBS, MD - Cardialogy",
        isVerified: true,
    },
     {
        name: "Dr. Charles Scott",
        specialty: "Neurologist",
        location: "Hamshire, TX",
        languages: "English, French",
        experience: "20 Years",
        votes: "98% (252 / 287)",
        fees: "$600",
        nextAvailable: "10:00 AM - 15 Oct, Tue",
        rating: 4.2,
        available: true,
        image: "https://placehold.co/200x200.png",
        imageHint: "doctor portrait",
        degree: "MBBS, DNB - Neurology",
    },
    {
        name: "Dr. Robert Thomas",
        specialty: "Cardiologist",
        location: "Oakland, CA",
        languages: "English, Spanish",
        experience: "30 Years",
        votes: "92% (270 / 300)",
        fees: "$450",
        nextAvailable: "11.00 AM - 19 Oct, Sat",
        rating: 4.2,
        available: false,
        image: "https://placehold.co/200x200.png",
        imageHint: "doctor professional",
        degree: "MBBS, MD - Cardialogy",
    },
    {
        name: "Dr. Margaret Koller",
        specialty: "Psychologist",
        location: "Killeen, TX",
        languages: "English, Portuguese",
        experience: "15 Years",
        votes: "94% (268 / 312)",
        fees: "$700",
        nextAvailable: "10.30 AM - 29 Oct, Tue",
        rating: 4.7,
        available: true,
        image: "https://placehold.co/200x200.png",
        imageHint: "doctor kind",
        degree: "B.S, M.S - Psychology",
    },
     {
        name: "Dr. Cath Busick",
        specialty: "Pediatrician",
        location: "Schenectady, NY",
        languages: "English, Arabic",
        experience: "12 Years",
        votes: "87% (237 / 250)",
        fees: "$750",
        nextAvailable: "02:00 PM - 04 Nov, Mon",
        rating: 4.7,
        available: false,
        image: "https://placehold.co/200x200.png",
        imageHint: "doctor portrait",
        degree: "MBBS, MD - Pediatrics",
    },
];

function ResultsComponent() {
    const searchParams = useSearchParams();
    const query = (searchParams.get('query') || '').toLowerCase();
    const location = (searchParams.get('location') || '').toLowerCase();

    const filteredDoctors = doctorList.filter((doc) => {
        const matchQuery =
          query === "" ||
          doc.name.toLowerCase().includes(query) ||
          doc.specialty.toLowerCase().includes(query) ||
          (doc.degree && doc.degree.toLowerCase().includes(query));
        
        const matchLocation =
          location === "" || doc.location.toLowerCase().includes(location);

        return matchQuery && matchLocation;
    });

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">
                Showing <span className="text-primary">{filteredDoctors.length}</span> Doctors For You
            </h3>

            {filteredDoctors.length === 0 ? (
                <Alert>
                    <AlertTitle>No Results Found</AlertTitle>
                    <AlertDescription>
                        No doctors, clinics, or hospitals matched your search criteria.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="space-y-6">
                    {filteredDoctors.map((doctor, index) => (
                        <DoctorCard key={index} doctor={doctor} />
                    ))}
                </div>
            )}
            
            {filteredDoctors.length > 0 && (
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
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsComponent />
    </Suspense>
  );
}
