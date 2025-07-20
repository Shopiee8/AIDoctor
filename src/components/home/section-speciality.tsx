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
import {
  Stethoscope,
  Baby,
  Brain,
  Bone,
  Heart,
  Smile,
  Bot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { collection, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from '@/lib/firebase';

interface Specialty {
  name: string;
  count: number;
  type: 'AI' | 'Human';
  icon: LucideIcon;
  image?: string;
  hint?: string;
}

const SPECIALTY_ICON_MAP: Record<string, { icon: LucideIcon; type: 'AI' | 'Human'; image?: string; hint?: string }> = {
  "AI Diagnostics": { icon: Bot, type: 'AI', hint: "Artificial Intelligence diagnostics specialty" },
  "Cardiology": { icon: Heart, type: 'Human', image: "/assets/img/cardio.jpg", hint: "Heart related specialty" },
  "Orthopedics": { icon: Bone, type: 'Human', hint: "Bone and musculoskeletal specialty" },
  "AI Mental Health": { icon: Bot, type: 'AI', hint: "AI mental health specialty" },
  "Neurology": { icon: Brain, type: 'Human', hint: "Brain and nervous system specialty" },
  "Pediatrics": { icon: Baby, type: 'Human', hint: "Child healthcare specialty" },
  "Dentistry": { icon: Smile, type: 'Human', hint: "Dental specialty" },
  "General Medicine": { icon: Stethoscope, type: 'Human', hint: "General health specialty" },
};

interface SectionSpecialityProps {
  onSelectSpecialty?: (specialtyName: string) => void;
}

export function SectionSpeciality({ onSelectSpecialty }: SectionSpecialityProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpecialties = useCallback((snapshot: QuerySnapshot<DocumentData>) => {
    const specialtyCount: Record<string, Specialty> = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      let specs: string[] = [];
      if (Array.isArray(data.specialization)) {
        specs = data.specialization;
      } else if (typeof data.specialization === "string") {
        specs = [data.specialization];
      } else if (Array.isArray(data.specialty)) {
        specs = data.specialty;
      } else if (typeof data.specialty === "string") {
        specs = [data.specialty];
      }
      specs.forEach((spec) => {
        if (!spec) return;
        const iconData = SPECIALTY_ICON_MAP[spec] || { icon: Stethoscope, type: 'Human', hint: "Medical specialty" };
        if (!specialtyCount[spec]) {
          specialtyCount[spec] = { name: spec, count: 1, ...iconData };
        } else {
          specialtyCount[spec].count += 1;
        }
      });
    });

    const sorted = Object.values(specialtyCount)
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    setSpecialties(sorted);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    const doctorsRef = collection(db, 'doctors');
    // Real-time updates with onSnapshot
    const unsubscribe = onSnapshot(
      doctorsRef,
      (snapshot) => {
        fetchSpecialties(snapshot);
      },
      (error) => {
        console.error("Error fetching specialties:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [fetchSpecialties]);

  // Handler for when a specialty is clicked
  const handleSpecialtyClick = (name: string) => {
    if (onSelectSpecialty) {
      onSelectSpecialty(name);
    }
  };

  // Loading skeleton UI
  const LoadingSkeleton = () => (
    <div className="flex gap-4 overflow-x-auto px-2" aria-busy="true" aria-label="Loading specialties">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-[150px] h-[190px] rounded-lg bg-gray-200 animate-pulse"
          aria-hidden="true"
        />
      ))}
    </div>
  );

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6 md:px-8">
        <div className="section-header text-center mb-10">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">
            Top Specialties
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-headline">
            Care Across AI & Human Expertise
          </h2>
        </div>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
            aria-label="Specialties carousel"
          >
            <CarouselContent className="-ml-2">
              {specialties.map((spec) => {
                const imgSrc =
                  spec.image ??
                  (spec.name === "Cardiology"
                    ? "/assets/img/cardio.jpg"
                    : "https://placehold.co/250x312.png");

                return (
                  <CarouselItem
                    key={spec.name}
                    className="md:basis-1/3 lg:basis-1/4 xl:basis-1/6 pl-2"
                  >
                    <button
                      onClick={() => handleSpecialtyClick(spec.name)}
                      className="p-1 w-full text-left focus:outline-none focus-visible:ring focus-visible:ring-primary rounded-lg group"
                      aria-label={`Select ${spec.name} specialty`}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                        <Image
                          src={imgSrc}
                          alt={spec.name}
                          width={250}
                          height={312}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                          data-ai-hint={spec.hint || "medical specialty"}
                          priority={spec.name === "Cardiology"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 backdrop-blur-sm ${
                              spec.type === "AI" ? "bg-primary/30" : "bg-white/20"
                            }`}
                          >
                            <spec.icon className="w-7 h-7 text-white" aria-hidden="true" />
                          </div>
                          <h6 className="font-semibold text-base font-headline">
                            {spec.name}
                          </h6>
                          <p className="text-xs text-white/80">
                            {spec.type === "AI" ? "AI-Powered" : `${spec.count} Doctors`}
                          </p>
                        </div>
                      </div>
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious
              className="absolute left-[-16px] top-1/2 -translate-y-1/2"
              aria-label="Previous specialty"
            />
            <CarouselNext
              className="absolute right-[-16px] top-1/2 -translate-y-1/2"
              aria-label="Next specialty"
            />
          </Carousel>
        )}
      </div>
    </section>
  );
}
