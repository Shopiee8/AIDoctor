
'use client';

import { DoctorCard, type Doctor } from "@/components/doctor-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Mock data, in a real app this would come from a database query
const doctors: Doctor[] = [
    {
        name: "Dr. Michael Brown",
        specialty: "Psychologist",
        location: "Minneapolis, MN",
        rating: 5.0,
        image: "https://placehold.co/300x300.png",
        imageHint: "doctor portrait",
        isFavorited: true,
        isVerified: true,
        nextAvailable: "10:00 AM",
        lastBooked: "2 days ago",
    },
    {
        name: "Dr. Nicholas Tello",
        specialty: "Pediatrician",
        location: "Ogden, IA",
        rating: 4.6,
        image: "https://placehold.co/300x300.png",
        imageHint: "doctor friendly",
    },
    {
        name: "Dr. Harold Bryant",
        specialty: "Neurologist",
        location: "Winona, MS",
        rating: 4.8,
        image: "https://placehold.co/300x300.png",
        imageHint: "doctor serious",
    },
    {
        name: "Dr. Sandra Jones",
        specialty: "Cardiologist",
        location: "Beckley, WV",
        rating: 4.8,
        image: "https://placehold.co/300x300.png",
        imageHint: "doctor smiling",
        isVerified: true,
    },
     {
        name: "Dr. Charles Scott",
        specialty: "Neurologist",
        location: "Hamshire, TX",
        rating: 4.2,
        image: "https://placehold.co/300x300.png",
        imageHint: "doctor portrait",
    },
    {
        name: "Dr. Robert Thomas",
        specialty: "Cardiologist",
        location: "Oakland, CA",
        rating: 4.2,
        image: "https://placehold.co/300x300.png",
        imageHint: "doctor professional",
    },
    {
        name: "Dr. Margaret Koller",
        specialty: "Psychologist",
        location: "Killeen, TX",
        rating: 4.7,
        image: "https://placehold.co/300x300.png",
        imageHint: "doctor kind",
    },
     {
        name: "Dr. Cath Busick",
        specialty: "Pediatrician",
        location: "Schenectady, NY",
        rating: 4.7,
        image: "https://placehold.co/300x300.png",
        imageHint: "doctor portrait",
    },
];


export function SearchResults() {
  return (
    <div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
                <DoctorCard key={index} doctor={doctor} />
            ))}
        </div>
        <div className="text-center mt-8">
            <Button variant="outline">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Load More...
            </Button>
        </div>
    </div>
  );
}
