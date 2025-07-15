"use client";

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
import { Star, Heart, MapPin, Circle, Calendar } from "lucide-react";
import { Button } from "../ui/button";

const doctors = [
    {
        name: "Dr. Michael Brown",
        specialty: "Psychologist",
        location: "Minneapolis, MN",
        duration: "30 Min",
        fees: 650,
        rating: 5.0,
        image: "https://placehold.co/280x280.png",
        imageHint: "doctor portrait",
        available: true,
        specialtyColor: "text-indigo-500",
    },
    {
        name: "Dr. Nicholas Tello",
        specialty: "Pediatrician",
        location: "Ogden, IA",
        duration: "60 Min",
        fees: 400,
        rating: 4.6,
        image: "https://placehold.co/280x280.png",
        imageHint: "doctor portrait",
        available: true,
        specialtyColor: "text-pink-500",
    },
    {
        name: "Dr. Harold Bryant",
        specialty: "Neurologist",
        location: "Winona, MS",
        duration: "30 Min",
        fees: 500,
        rating: 4.8,
        image: "https://placehold.co/280x280.png",
        imageHint: "doctor portrait",
        available: true,
        specialtyColor: "text-teal-500",
    },
    {
        name: "Dr. Sandra Jones",
        specialty: "Cardiologist",
        location: "Beckley, WV",
        duration: "30 Min",
        fees: 550,
        rating: 4.8,
        image: "https://placehold.co/280x280.png",
        imageHint: "doctor portrait",
        available: true,
        specialtyColor: "text-info-500",
    },
    {
        name: "Dr. Charles Scott",
        specialty: "Neurologist",
        location: "Hamshire, TX",
        duration: "30 Min",
        fees: 600,
        rating: 4.2,
        image: "https://placehold.co/280x280.png",
        imageHint: "doctor portrait",
        available: true,
        specialtyColor: "text-teal-500",
    },
];

export function SectionDoctor() {
    return (
        <section className="doctor-section py-16 md:py-20">
            <div className="container mx-auto px-4">
                <div className="section-header sec-header-one text-center mb-10">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">Featured Doctors</span>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">Our Highlighted Doctors</h2>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {doctors.map((doctor, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <div className="p-1">
                                    <Card className="overflow-hidden group">
                                        <div className="relative">
                                            <Link href="/doctor-profile">
                                                <Image
                                                    src={doctor.image}
                                                    alt={doctor.name}
                                                    width={280}
                                                    height={280}
                                                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                                    data-ai-hint={doctor.imageHint}
                                                />
                                            </Link>
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-orange-500 text-white text-xs">
                                                    <Star className="w-3 h-3 mr-1 fill-white" />
                                                    {doctor.rating}
                                                </Badge>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-white/80 rounded-full p-1.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Heart className="w-4 h-4 text-primary" />
                                            </div>
                                        </div>
                                        <CardContent className="p-0">
                                            <div className="flex items-center justify-between p-3 border-b">
                                                <Link href="#" className={`font-medium text-xs ${doctor.specialtyColor}`}>
                                                    {doctor.specialty}
                                                </Link>
                                                {doctor.available && (
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                                        <Circle className="w-1.5 h-1.5 mr-1 fill-green-500" />
                                                        Available
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="p-3 space-y-3">
                                                <div className="pb-3 border-b">
                                                    <h3 className="font-bold text-base mb-1">
                                                        <Link href="/doctor-profile">{doctor.name}</Link>
                                                    </h3>
                                                    <div className="flex items-center text-xs text-muted-foreground">
                                                        <MapPin className="w-3.5 h-3.5 mr-1" />
                                                        <span>{doctor.location}</span>
                                                        <Circle className="w-1 h-1 mx-2 fill-primary text-primary" />
                                                        <span>{doctor.duration}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Consultation Fees</p>
                                                        <p className="text-lg font-bold text-orange-500">${doctor.fees}</p>
                                                    </div>
                                                    <Button asChild size="sm">
                                                        <Link href="/booking">
                                                            <Calendar className="w-3.5 h-3.5 mr-2" />
                                                            Book Now
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-[-16px] top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-[-16px] top-1/2 -translate-y-1/2" />
                </Carousel>
            </div>
        </section>
    );
}
