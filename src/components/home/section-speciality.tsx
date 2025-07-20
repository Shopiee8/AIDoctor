
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
import { Stethoscope, Baby, Brain, Bone, Heart, Smile, FlaskConical, GitMerge, Eye, Users, Shield, Bot } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const specialities: { name: string; doctors: number; icon: LucideIcon; type: 'AI' | 'Human'; image: string; hint: string; }[] = [
    { name: "AI Diagnostics", doctors: 15, icon: Bot, type: 'AI', image: "https://placehold.co/250x312.png", hint: "medical specialty" },
    { name: "Cardiology", doctors: 25, icon: Heart, type: 'Human', image: "https://placehold.co/250x312.png", hint: "medical specialty" },
    { name: "Orthopedics", doctors: 18, icon: Bone, type: 'Human', image: "https://placehold.co/250x312.png", hint: "orthopedic surgery" },
    { name: "AI Mental Health", doctors: 12, icon: Bot, type: 'AI', image: "https://placehold.co/250x312.png", hint: "medical specialty" },
    { name: "Neurology", doctors: 22, icon: Brain, type: 'Human', image: "https://placehold.co/250x312.png", hint: "medical specialty" },
    { name: "Pediatrics", doctors: 30, icon: Baby, type: 'Human', image: "https://placehold.co/250x312.png", hint: "medical specialty" },
    { name: "Dentistry", doctors: 45, icon: Smile, type: 'Human', image: "https://placehold.co/250x312.png", hint: "medical specialty" },
    { name: "General Medicine", doctors: 50, icon: Stethoscope, type: 'Human', image: "https://placehold.co/250x312.png", hint: "medical specialty" },
];


export function SectionSpeciality() {
    return (
        <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-6 md:px-8">
                <div className="section-header text-center mb-10">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">Top Specialties</span>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">Care Across AI & Human Expertise</h2>
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
                                                src={spec.image}
                                                alt={spec.name}
                                                width={250}
                                                height={312}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                data-ai-hint={spec.hint}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 backdrop-blur-sm ${spec.type === 'AI' ? 'bg-primary/30' : 'bg-white/20'}`}>
                                                    <spec.icon className="w-7 h-7 text-white" />
                                                </div>
                                                <h6 className="font-semibold text-base font-headline">{spec.name}</h6>
                                                <p className="text-xs text-white/80">{spec.type === 'AI' ? 'AI-Powered' : `${spec.doctors} Doctors`}</p>
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
