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
        <section className="py-16 md:py-20 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="section-header sec-header-one text-center mb-10">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">Top Specialties</span>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">Highlighting the Care & Support</h2>
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
                                        <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                                            <Image
                                                src={`https://placehold.co/250x312.png`}
                                                alt={spec.name}
                                                width={250}
                                                height={312}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                data-ai-hint="medical specialty"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute bottom-3 left-3 text-white">
                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-1.5 backdrop-blur-sm">
                                                    <spec.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <h6 className="font-semibold text-base">{spec.name}</h6>
                                                <p className="text-xs text-white/80">{spec.doctors} Doctors</p>
                                            </div>
                                        </div>
                                    </Link>
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
