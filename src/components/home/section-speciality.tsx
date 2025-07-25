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
import { useEffect, useState, useCallback, useRef } from "react";
import { collection, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from '@/lib/firebase';

interface DoctorData {
  specialization?: string | string[];
  specialty?: string | string[];
  isAI?: boolean;
}

interface Specialty {
  name: string;
  count: number;
  type: 'AI' | 'Human';
  icon: LucideIcon;
  image?: string;
  hint?: string;
}

const SPECIALTY_ICON_MAP: Record<string, { icon: LucideIcon; type: 'AI' | 'Human'; image?: string; hint?: string }> = {
  "AI Diagnostics": { icon: Bot, type: 'AI', image: "/assets/img/ai cardiology.jpg", hint: "Artificial Intelligence diagnostics specialty" },
  "AI Cardiology": { icon: Bot, type: 'AI', image: "/assets/img/ai cardiology.jpg", hint: "Artificial Intelligence cardiology specialty" },
  "AI Cardiologist": { icon: Bot, type: 'AI', image: "/assets/img/ai cardiology.jpg", hint: "Artificial Intelligence cardiology specialty (use 'AI Cardiology' as the standard name)" },
  "Cardiology": { icon: Heart, type: 'Human', image: "/assets/img/cardio.jpg", hint: "Heart related specialty" },
  "Orthopedics": { icon: Bone, type: 'Human', hint: "Bone and musculoskeletal specialty" },
  "AI Mental Health": { icon: Bot, type: 'AI', hint: "AI mental health specialty" },
  "Neurology": { icon: Brain, type: 'Human', image: "/assets/img/neurology.jfif", hint: "Brain and nervous system specialty" },
  "Pediatrics": { icon: Baby, type: 'Human', image: "/assets/img/pediatric.jpg", hint: "Child healthcare specialty" },
  "Dentistry": { icon: Smile, type: 'Human', hint: "Dental specialty" },
  "General Medicine": { icon: Stethoscope, type: 'Human', hint: "General health specialty" },
  "Psychology": { icon: Brain, type: 'Human', image: "/assets/img/psychology.jpg", hint: "Psychology specialty (use 'Psychology' as the standard name)" },
  "Psychologist": { icon: Brain, type: 'Human', image: "/assets/img/psychology.jpg", hint: "Psychology specialty (use 'Psychology' as the standard name)" },
  "AI Pediatrics": { icon: Baby, type: 'AI', image: "/assets/img/ai pediatric.jfif", hint: "AI child healthcare specialty" },
  "Pediatric Cardiology": { icon: Baby, type: 'Human', image: "/assets/img/pediatric cardio.avif", hint: "Pediatric heart specialty" },
  "AI Pediatric Cardiology": { icon: Baby, type: 'AI', image: "/assets/img/ai pediatric.jfif", hint: "AI pediatric heart specialty" },
};

interface SectionSpecialityProps {
  onSelectSpecialty?: (specialtyName: string) => void;
}

export function SectionSpeciality({ onSelectSpecialty }: SectionSpecialityProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<() => void>();

  const processDoctorsSnapshot = useCallback((snapshot: QuerySnapshot<DocumentData>) => {
    try {
      const specialtyCount: Record<string, Specialty> = {};

      snapshot.forEach((doc) => {
        // Use DoctorData interface to type the document data
        const data = doc.data() as DoctorData;
        let specs: string[] = [];
        
        // Handle different possible field names and types with type safety
        if (Array.isArray(data.specialization)) {
          specs = data.specialization;
        } else if (typeof data.specialization === 'string') {
          specs = [data.specialization];
        } else if (Array.isArray(data.specialty)) {
          specs = data.specialty;
        } else if (typeof data.specialty === 'string') {
          specs = [data.specialty];
        }

        // Process each specialty
        specs.forEach((spec) => {
          if (!spec) return;

          const iconData = SPECIALTY_ICON_MAP[spec] || { 
            icon: Stethoscope, 
            type: data.isAI ? 'AI' : 'Human',
            hint: 'Medical specialty' 
          };

          if (!specialtyCount[spec]) {
            specialtyCount[spec] = { 
              name: spec, 
              count: 1, 
              ...iconData 
            };
          } else {
            specialtyCount[spec].count += 1;
          }
        });
      });

      const sorted = Object.values(specialtyCount)
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

      setSpecialties(sorted);
      setError(null);
    } catch (err) {
      console.error('Error processing doctors data:', err);
      setError('Failed to load specialties. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);

    try {
      const doctorsRef = collection(db, 'doctors');

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        doctorsRef,
        (snapshot) => {
          processDoctorsSnapshot(snapshot);
        },
        (error) => {
          console.error("Error fetching specialties:", error);
          setError('Failed to connect to the database. Please check your connection.');
          setLoading(false);
        }
      );

      // Store unsubscribe function
      unsubscribeRef.current = unsubscribe;

      // Cleanup function
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };
    } catch (err) {
      console.error('Error setting up Firestore listener:', err);
      setError('Failed to initialize data connection.');
      setLoading(false);
    }
  }, [processDoctorsSnapshot]);

  // Handler for when a specialty is clicked
  const handleSpecialtyClick = (name: string) => {
    // Remove 'AI ' prefix if present for the search
    const searchTerm = name.replace(/^AI\s+/, '');
    // Construct the search URL with the specialty as a parameter
    const searchUrl = `/search?specialty=${encodeURIComponent(searchTerm)}`;
    // Navigate to the search results page
    window.location.href = searchUrl;
    
    // Call the onSelectSpecialty callback if provided
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

  // Error state UI
  if (error) {
    return (
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error Loading Specialties</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

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
                            {spec.type === "AI" ? "AI-Powered" : `${spec.count} ${spec.count === 1 ? 'Doctor' : 'Doctors'}`}
                          </p>
                        </div>
                      </div>
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </div>
    </section>
  );
}
