
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
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';

const SPECIALTY_ICON_MAP: Record<string, { icon: LucideIcon, type: 'AI' | 'Human', image?: string }> = {
    "AI Diagnostics": { icon: Bot, type: 'AI' },
    "Cardiology": { icon: Heart, type: 'Human', image: "/assets/img/cardio.jpg" },
    "Orthopedics": { icon: Bone, type: 'Human' },
    "AI Mental Health": { icon: Bot, type: 'AI' },
    "Neurology": { icon: Brain, type: 'Human' },
    "Pediatrics": { icon: Baby, type: 'Human' },
    "Dentistry": { icon: Smile, type: 'Human' },
    "General Medicine": { icon: Stethoscope, type: 'Human' },
};

export function SectionSpeciality() {
    const [specialties, setSpecialties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpecialties = async () => {
            setLoading(true);
            try {
                const doctorsRef = collection(db, 'doctors');
                const querySnapshot = await getDocs(doctorsRef);
                const specialtyCount: Record<string, { count: number, type: 'AI' | 'Human', icon: LucideIcon, image?: string }> = {};
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    let specs = data.specialization || data.specialty || [];
                    if (typeof specs === 'string') specs = [specs];
                    specs.forEach((spec: string) => {
                        if (!spec) return;
                        const iconData = SPECIALTY_ICON_MAP[spec] || { icon: Stethoscope, type: 'Human' };
                        if (!specialtyCount[spec]) {
                            specialtyCount[spec] = { count: 1, ...iconData };
                        } else {
                            specialtyCount[spec].count += 1;
                        }
                    });
                });
                // Sort by count desc, then name
                const sorted = Object.entries(specialtyCount)
                    .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
                    .map(([name, data]) => ({ name, ...data }));
                setSpecialties(sorted);
            } catch (error) {
                console.error("Error fetching specialties:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSpecialties();
        // Optionally, add a listener for live updates
        // window.addEventListener('doctor-profile-updated', fetchSpecialties);
        // return () => window.removeEventListener('doctor-profile-updated', fetchSpecialties);
    }, []);

    return (
        <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-6 md:px-8">
                <div className="section-header text-center mb-10">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">Top Specialties</span>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">Care Across AI & Human Expertise</h2>
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
                    <CarouselContent className="-ml-2">
                        {specialties.map((spec, index) => (
                            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 xl:basis-1/6 pl-2">
                                <div className="p-1">
                                    <Link href="#" className="block group">
                                        <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                                            <Image
                                                src={spec.name === "Cardiology" ? "/assets/img/cardio.jpg" : spec.image || "https://placehold.co/250x312.png"}
                                                alt={spec.name}
                                                width={250}
                                                height={312}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                data-ai-hint="medical specialty"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 backdrop-blur-sm ${spec.type === 'AI' ? 'bg-primary/30' : 'bg-white/20'}`}>
                                                    <spec.icon className="w-7 h-7 text-white" />
                                                </div>
                                                <h6 className="font-semibold text-base font-headline">{spec.name}</h6>
                                                <p className="text-xs text-white/80">{spec.type === 'AI' ? 'AI-Powered' : `${spec.count} Doctors`}</p>
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
                )}
            </div>
        </section>
    );
}
