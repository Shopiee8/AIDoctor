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
import { Stethoscope, Baby, Brain, Bone, Heart, Smile, UserMd, FlaskConical, GitMerge, Eye, Users, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const specialities: { name: string; doctors: number; icon: LucideIcon }[] = [
    { name: "Cardiology", doctors: 25, icon: Heart },
    { name: "Orthopedics", doctors: 18, icon: Bone },
    { name: "Neurology", doctors: 22, icon: Brain },
    { name: "Pediatrics", doctors: 30, icon: Baby },
    { name: "Psychiatry", doctors: 15, icon: Shield },
    { name: "Urology", doctors: 12, icon: GitMerge },
    { name: "Dentistry", doctors: 45, icon: Smile },
    { name: "General Medicine", doctors: 50, icon: Stethoscope },
    { name: "Lab Testing", doctors: 10, icon: FlaskConical },
    { name: "Ophthalmology", doctors: 8, icon: Eye },
    { name: "Family Medicine", doctors: 28, icon: Users },
];


export function SectionSpeciality() {
    return (
        <section className="py-20 md:py-24 bg-gray-50/50">
            <div className="container">
                <div className="section-header sec-header-one text-center mb-12">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold font-headline mb-2">Top Specialties</span>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Highlighting the Care & Support</h2>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2">
                        {specialities.map((spec, index) => (
                            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 xl:basis-1/6 pl-2">
                                <div className="p-1">
                                    <Link href="#" className="block group">
                                        <div className="relative aspect-square overflow-hidden rounded-lg">
                                            <Image
                                                src={`https://placehold.co/300x300.png`}
                                                alt={spec.name}
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                data-ai-hint="medical specialty"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-sm">
                                                    <spec.icon className="w-7 h-7 text-white" />
                                                </div>
                                                <h6 className="font-semibold text-lg">{spec.name}</h6>
                                                <p className="text-sm text-white/80">{spec.doctors} Doctors</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2" />
                </Carousel>
            </div>
        </section>
    );
}