
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, MapPin, Calendar, CheckCircle, Clock, Languages, Award, ThumbsUp, Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useBookingStore } from '@/store/booking-store';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';


export interface Doctor {
    id: string;
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
    type: 'AI' | 'Human';
    aiMatchScore?: number;
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

    const aiMatchScore = doctor.aiMatchScore || Math.floor(Math.random() * (99 - 85 + 1)) + 85;

    return (
        <div className={cn(
            "doctor-card-container card doctor-list-card border rounded-lg bg-card text-card-foreground shadow-sm transition-all hover:shadow-xl hover:-translate-y-1",
            doctor.type === 'AI' && "ai-doctor-card"
        )}>
            <div className="flex flex-col h-full">
                <div className="card-img card-img-hover relative w-full h-52 flex-shrink-0">
                    <Link href="#">
                        <Image 
                            src={doctor.image} 
                            alt={doctor.name} 
                            width={300}
                            height={220}
                            className="w-full h-full object-cover rounded-t-lg"
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
                <div className="card-body p-4 flex flex-col flex-1">
                     <div className="flex items-center justify-between border-b pb-2">
                        <Link href="#" className="font-medium text-xs text-primary">
                            {doctor.specialty}
                        </Link>
                         <Badge variant={doctor.type === 'AI' ? 'default' : 'secondary'} className="shadow-sm">
                            {doctor.type === 'AI' ? <Bot className="w-3.5 h-3.5 mr-1" /> : <User className="w-3.5 h-3.5 mr-1" />}
                            {doctor.type === 'AI' ? 'AI Doctor' : 'Human'}
                        </Badge>
                    </div>
                    <div className="py-3 flex-grow">
                         <h6 className="flex items-center text-lg font-bold font-headline">
                            <Link href="#">{doctor.name}</Link>
                            {doctor.isVerified && <CheckCircle className="w-4 h-4 text-green-500 ms-2" />}
                        </h6>
                        {doctor.degree ? <p className="text-xs text-muted-foreground">{doctor.degree}</p> : <div className="flex items-center gap-1 text-xs text-primary"><Bot className="w-3 h-3" /> AI Specialist</div>}
                        <p className="flex items-center text-xs text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3 mr-1.5" />
                            {doctor.location}
                        </p>
                    </div>
                     <div className="space-y-2 mb-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground flex items-center gap-1"><Sparkles className="w-3 h-3 text-primary" /> AI Match</span>
                            <span className="font-bold">{aiMatchScore}%</span>
                        </div>
                        <Progress value={aiMatchScore} className="h-1.5" />
                    </div>
                    <div className="flex items-end justify-between flex-wrap gap-2 mt-auto border-t pt-3">
                        <div>
                            <p className="text-xs text-muted-foreground">Fees</p>
                            <h3 className="text-md font-bold text-primary">{doctor.fees}</h3>
                        </div>
                        <Button size="sm" onClick={handleBookNow}>
                            <Calendar className="w-4 h-4 mr-2" />
                            {doctor.type === 'AI' ? 'Consult Now' : 'Book'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
