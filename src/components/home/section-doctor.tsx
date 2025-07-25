
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import Image from "next/image";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Bot, User, Calendar, CircleUserRound } from "lucide-react";
import { Button } from "../ui/button";
import { useBookingStore } from "@/store/booking-store";

export function SectionDoctor() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { openBookingModal } = useBookingStore();

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const doctorsRef = collection(db, 'doctors');
            const querySnapshot = await getDocs(doctorsRef);
            const allDoctors: any[] = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().name && doc.data().specialty) {
                    allDoctors.push({ id: doc.id, ...doc.data() });
                }
            });
            setDoctors(allDoctors);
        } catch (error) {
            console.error("Error fetching doctors: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = (doctor: any) => {
        openBookingModal(doctor);
    };

    useEffect(() => {
        fetchDoctors();
        // Listen for doctor profile updates
        const handler = () => fetchDoctors();
        window.addEventListener('doctor-profile-updated', handler);
        return () => window.removeEventListener('doctor-profile-updated', handler);
    }, []);

    return (
        <section id="doctors" className="doctor-section py-16 md:py-20 bg-accent">
            <div className="container mx-auto px-6 md:px-8">
                <div className="section-header text-center mb-10">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">Our Doctors</span>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">Meet Our AI and Human Specialists</h2>
                </div>
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {doctors.map((doctor, index) => (
                            <CarouselItem key={doctor.id || index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <div className="p-1">
                                    <Card className="overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1">
                                        <div className="relative">
                                            <Link href={`/doctor-profile/${doctor.id}`}>
                                                <Image
                                                    src={doctor.image || "https://placehold.co/280x280.png"}
                                                    alt={doctor.name}
                                                    width={280}
                                                    height={280}
                                                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                                    data-ai-hint={doctor.imageHint || "doctor portrait"}
                                                />
                                            </Link>
                                            <div className="absolute top-3 right-3">
                                                <Badge className="bg-white text-primary text-xs shadow-md">
                                                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                                    {doctor.rating || 0}
                                                </Badge>
                                            </div>
                                            <Badge variant={doctor.type === 'AI' ? 'default': 'secondary'} className="shadow-md">
                                                {doctor.type === 'AI' ? <Bot className="w-3.5 h-3.5 mr-1" /> : <User className="w-3.5 h-3.5 mr-1" />}
                                                {doctor.type}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-4 space-y-3">
                                            <h3 className="font-bold text-lg font-headline">
                                                <Link href={`/doctor-profile/${doctor.id}`} className="hover:text-primary">{doctor.name}</Link>
                                            </h3>
                                            <p className="text-sm text-muted-foreground -mt-2">{doctor.specialty}</p>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                                <span>{doctor.location}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">${doctor.fees || 0}</p>
                                                <p className="text-xs text-muted-foreground">Consultation Fee</p>
                                            </div>
                                            <Button size="sm" onClick={() => handleBookNow(doctor)}>
                                                <Calendar className="w-3.5 h-3.5 mr-2" />
                                                Book Now
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-[-16px] top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-[-16px] top-1/2 -translate-y-1/2" />
                </Carousel>
                )}
            </div>
        </section>
    );
}
