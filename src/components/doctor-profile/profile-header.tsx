
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ThumbsUp, MessageSquare, Phone, Video, Bookmark, CheckCircle, Smile } from 'lucide-react';
import { ClinicGallery } from '@/components/clinic-gallery';
import type { Doctor } from '@/components/doctor-card';
import { useBookingStore } from '@/store/booking-store';

interface ProfileHeaderProps {
    doctor: Doctor;
}

export function ProfileHeader({ doctor }: ProfileHeaderProps) {
    const { openBookingModal } = useBookingStore();

    return (
        <div className="p-6 bg-card border rounded-lg">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                    <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover w-36 h-36"
                        data-ai-hint={doctor.imageHint}
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {doctor.name}
                            {doctor.isVerified && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </h2>
                    </div>
                    <p className="text-primary font-medium">{doctor.specialty}</p>
                    <p className="text-sm text-muted-foreground">{doctor.degree || 'BDS, MDS - Oral & Maxillofacial Surgery'}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">
                            <Star className="w-3.5 h-3.5 mr-1 text-yellow-400 fill-yellow-400" />
                            {doctor.rating}
                        </Badge>
                        <span className="text-sm text-muted-foreground">(35 Reviews)</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{doctor.location}</span>
                    </div>
                     <div className="mt-2 flex flex-wrap gap-2">
                        {doctor.services?.slice(0, 2).map((service: string, index: number) => (
                            <Badge key={index} variant="outline">{service}</Badge>
                        )) || ['Dental Fillings', 'Teeth Whitening'].map((s: string) => <Badge key={s} variant="outline">{s}</Badge>)}
                    </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-start md:items-end gap-3">
                     <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground"><ThumbsUp className="w-4 h-4 text-primary" /> 99%</div>
                        <div className="flex items-center gap-1.5 text-muted-foreground"><MessageSquare className="w-4 h-4 text-primary" /> 35 Feedback</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon"><Bookmark className="w-4 h-4" /></Button>
                        <Button variant="outline" size="icon"><MessageSquare className="w-4 h-4" /></Button>
                        <Button variant="outline" size="icon"><Phone className="w-4 h-4" /></Button>
                        <Button variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                    </div>
                     <Button size="lg" className="w-full md:w-auto" onClick={() => openBookingModal(doctor)}>Book Appointment</Button>
                </div>
            </div>
        </div>
    );
}
