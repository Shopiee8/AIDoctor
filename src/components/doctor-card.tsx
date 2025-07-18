
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, MapPin, Calendar, CheckCircle, Clock, Languages, Award, ThumbsUp } from 'lucide-react';
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
    isFavorited?: boolean;
    nextAvailable?: string;
    lastBooked?: string;
    degree?: string;
    languages?: string;
    experience?: string;
    votes?: string;
    fees?: string;
    available?: boolean;
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
    };

    const handleBookNow = () => {
        openBookingModal(doctor);
    };

    return (
        <div className="card doctor-list-card border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="md:flex items-stretch">
                <div className="card-img card-img-hover relative w-full md:w-48 flex-shrink-0">
                    <Link href="#">
                        <Image 
                            src={doctor.image} 
                            alt={doctor.name} 
                            width={200}
                            height={200}
                            className="w-full h-full object-cover rounded-l-lg"
                            data-ai-hint={doctor.imageHint || "doctor portrait"}
                        />
                    </Link>
                    <div className="absolute top-3 right-3 z-10">
                        <span className="badge bg-background/80 backdrop-blur-sm text-primary px-2 py-1 flex items-center gap-1 shadow">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            {doctor.rating}
                        </span>
                    </div>
                     <button
                        onClick={handleFavoriteClick}
                        className="absolute top-3 left-3 z-10 p-1.5 bg-background/60 backdrop-blur-sm rounded-full text-destructive transition-colors hover:bg-destructive/10"
                    >
                        <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
                    </button>
                </div>
                <div className="card-body p-0 flex-1">
                    <div className="flex items-center justify-between border-b p-3">
                        <Link href="#" className="font-medium text-sm text-primary">
                            {doctor.specialty}
                        </Link>
                        <Badge variant={doctor.available ? "default" : "secondary"}>
                           <span className={cn("w-2 h-2 rounded-full mr-2", doctor.available ? "bg-green-500" : "bg-red-500")}></span>
                           {doctor.available ? "Available" : "Unavailable"}
                        </Badge>
                    </div>
                    <div className="p-4">
                        <div className="doctor-info-detail pb-3">
                            <div className="grid sm:grid-cols-2 gap-y-3">
                                <div className="space-y-1">
                                    <h6 className="flex items-center text-base font-bold">
                                        <Link href="#">{doctor.name}</Link>
                                        {doctor.isVerified && <CheckCircle className="w-4 h-4 text-green-500 ms-2" />}
                                    </h6>
                                    {doctor.degree && <p className="text-xs text-muted-foreground">{doctor.degree}</p>}
                                    <p className="flex items-center text-xs text-muted-foreground">
                                        <MapPin className="w-3 h-3 mr-1.5" />
                                        {doctor.location}
                                    </p>
                                </div>
                                <div className="space-y-1.5 text-xs text-muted-foreground">
                                    {doctor.languages && (
                                        <p className="flex items-center"><Languages className="w-3 h-3 mr-1.5" /> {doctor.languages}</p>
                                    )}
                                     {doctor.votes && (
                                        <p className="flex items-center"><ThumbsUp className="w-3 h-3 mr-1.5" /> {doctor.votes}</p>
                                    )}
                                     {doctor.experience && (
                                        <p className="flex items-center"><Award className="w-3 h-3 mr-1.5" /> {doctor.experience} of Experience</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end justify-between flex-wrap gap-3 mt-3">
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Consultation Fees</p>
                                    <h3 className="text-lg font-bold text-primary">{doctor.fees}</h3>
                                </div>
                                {doctor.nextAvailable && (
                                     <div className="text-xs text-muted-foreground">
                                        <p>Next available at</p>
                                        <p className="font-semibold text-foreground">{doctor.nextAvailable}</p>
                                    </div>
                                )}
                            </div>
                           
                            <Button size="sm" onClick={handleBookNow}>
                                <Calendar className="w-4 h-4 mr-2" />
                                Book Appointment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
