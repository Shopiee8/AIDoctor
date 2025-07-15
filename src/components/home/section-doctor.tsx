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
import { Star, MapPin, Bot, User, Calendar, CircleUserRound } from "lucide-react";
import { Button } from "../ui/button";

const doctors = [
    {
        name: "Julia, AI Agent",
        specialty: "AI Cardiologist",
        location: "Virtual",
        fees: 25,
        rating: 4.9,
        image: "https://placehold.co/280x280.png",
        imageHint: "robot abstract",
        available: true,
        type: "AI"
    },
    {
        name: "Dr. Nicholas Tello",
        specialty: "Human Pediatrician",
        location: "Ogden, IA",
        fees: 250,
        rating: 4.8,
        image: "https://placehold.co/280x280.png",
        imageHint: "doctor portrait",
        available: true,
        type: "Human"
    },
    {
        name: "Sam, AI Agent",
        specialty: "AI General Practice",
        location: "Virtual",
        fees: 15,
        rating: 4.9,
        image: "https://placehold.co/280x280.png",
        imageHint: "robot friendly",
        available: true,
        type: "AI"
    },
    {
        name: "Dr. Sandra Jones",
        specialty: "Human Cardiologist",
        location: "Beckley, WV",
        fees: 300,
        rating: 4.9,
        image: "https://placehold.co/280x280.png",
        imageHint: "doctor portrait friendly",
        available: true,
        type: "Human"
    },
    {
        name: "Dr. Harold Bryant",
        specialty: "Human Neurologist",
        location: "Winona, MS",
        fees: 275,
        rating: 4.7,
        image: "https://placehold.co/280x280.png",
        imageHint: "doctor portrait serious",
        available: true,
        type: "Human"
    },
];

export function SectionDoctor() {
    return (
        <section id="doctors" className="doctor-section py-16 md:py-20 bg-accent">
            <div className="container mx-auto px-4">
                <div className="section-header text-center mb-10">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">Our Doctors</span>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">Meet Our AI and Human Specialists</h2>
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
                                    <Card className="overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1">
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
                                            <div className="absolute top-3 right-3">
                                                <Badge className="bg-white text-primary text-xs shadow-md">
                                                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                                    {doctor.rating}
                                                </Badge>
                                            </div>
                                             <div className="absolute top-3 left-3">
                                                <Badge variant={doctor.type === 'AI' ? 'default': 'secondary'} className="shadow-md">
                                                    {doctor.type === 'AI' ? <Bot className="w-3.5 h-3.5 mr-1" /> : <User className="w-3.5 h-3.5 mr-1" />}
                                                    {doctor.type}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-4 space-y-3">
                                            <h3 className="font-bold text-lg font-headline">
                                                <Link href="/doctor-profile" className="hover:text-primary">{doctor.name}</Link>
                                            </h3>
                                            <p className="text-sm text-muted-foreground -mt-2">{doctor.specialty}</p>

                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                                <span>{doctor.location}</span>
                                            </div>

                                            <div className="border-t pt-3 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">${doctor.fees}</p>
                                                    <p className="text-xs text-muted-foreground">Consultation Fee</p>
                                                </div>
                                                <Button asChild size="sm">
                                                    <Link href="/booking">
                                                        <Calendar className="w-3.5 h-3.5 mr-2" />
                                                        Book Now
                                                    </Link>
                                                </Button>
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
