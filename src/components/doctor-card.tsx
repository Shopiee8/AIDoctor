'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useBookingStore } from '@/store/booking-store';

export interface Doctor {
    name: string;
    specialty: string;
    location: string;
    rating: number;
    image: string;
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
        <div className="border rounded-lg overflow-hidden group transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="p-4">
                <div className="relative">
                    <button
                        onClick={handleFavoriteClick}
                        className="absolute top-2 right-2 z-10 p-1.5 bg-background/60 backdrop-blur-sm rounded-full text-destructive transition-colors hover:bg-destructive/10"
                    >
                        <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
                    </button>
                    <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={300}
                        height={200}
                        className="rounded-md object-cover w-full aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="mt-4">
                    <h3 className="font-bold font-headline text-lg flex items-center">
                        <Link href="#" className="hover:text-primary transition-colors">{doctor.name}</Link>
                        {doctor.isVerified && <CheckCircle className="w-4 h-4 ml-2 text-primary" />}
                    </h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    
                    <div className="flex items-center gap-1 text-sm mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{doctor.rating.toFixed(1)}</span>
                    </div>

                    <ul className="text-xs text-muted-foreground space-y-1.5 mt-3">
                        {doctor.nextAvailable && (
                            <li className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Next Availability: {doctor.nextAvailable}</span>
                            </li>
                        )}
                        <li className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{doctor.location}</span>
                        </li>
                    </ul>
                     {doctor.lastBooked && <p className="text-xs text-muted-foreground mt-2">Last booked on {doctor.lastBooked}</p>}
                </div>
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
