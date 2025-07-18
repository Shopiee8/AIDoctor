'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, MapPin, Calendar, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useBookingStore } from '@/store/booking-store';
import { Badge } from './ui/badge';

export interface Doctor {
    name: string;
    specialty: string;
    location: string;
    rating: number;
    image: string;
    imageHint?: string;
    isVerified?: boolean;
    nextAvailable?: string;
    lastBooked?: string;
    isFavorited?: boolean;
}

interface DoctorCardProps {
    doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
    const [isFavorited, setIsFavorited] = useState(doctor.isFavorited);
    const { openBookingModal } = useBookingStore();

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsFavorited(!isFavorited);
        // Here you would also call a function to update the backend/database
    };
    
    const handleBookNow = () => {
        openBookingModal(doctor);
    };

    return (
        <div className="border rounded-lg overflow-hidden group transition-all hover:shadow-lg hover:-translate-y-1 bg-card">
             <div className="relative">
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-background/60 backdrop-blur-sm rounded-full text-destructive transition-colors hover:bg-destructive/10"
                >
                    <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
                </button>
                <div className="absolute top-3 left-3 z-10">
                     <Badge className="shadow-md">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {doctor.rating}
                    </Badge>
                </div>
                <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={300}
                    height={200}
                    data-ai-hint={doctor.imageHint || 'doctor portrait'}
                    className="rounded-t-md object-cover w-full aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-4">
                <Badge variant="secondary" className="mb-2">{doctor.specialty}</Badge>
                <h3 className="font-bold font-headline text-lg flex items-center">
                    <Link href="#" className="hover:text-primary transition-colors">{doctor.name}</Link>
                    {doctor.isVerified && <CheckCircle className="w-4 h-4 ml-2 text-primary" />}
                </h3>
                
                <ul className="text-sm text-muted-foreground space-y-1.5 mt-2">
                    <li className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{doctor.location}</span>
                    </li>
                    {doctor.nextAvailable && (
                        <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>Available: {doctor.nextAvailable}</span>
                        </li>
                    )}
                </ul>
            </div>
            <div className="border-t p-4 bg-muted/30">
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="#">View Profile</Link>
                    </Button>
                    <Button size="sm" onClick={handleBookNow}>
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
