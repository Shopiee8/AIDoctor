"use client";

import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from '@/lib/firebase';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Testimonial {
    id: string;
    name: string;
    location: string;
    title: string;
    quote: string;
    image: string;
    imageHint?: string;
    rating?: number;
    createdAt?: any;
}

interface Stats {
    id: string;
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
    color?: string;
}

interface Company {
    id: string;
    name: string;
    logo: string;
    alt: string;
    hint?: string;
}

// Fallback testimonials in case Firestore is empty
const fallbackTestimonials: Testimonial[] = [
    {
        id: "1",
        name: "Deny Hendrawan",
        location: "United States",
        title: "Nice Treatment",
        quote: "I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
        imageHint: "person portrait",
        rating: 5,
    },
    {
        id: "2",
        name: "Johnson DWayne",
        location: "United States",
        title: "Good Hospitability",
        quote: "Genuinely cares about his patients. He helped me understand my condition and worked with me to create a plan.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        imageHint: "person portrait",
        rating: 5,
    },
    {
        id: "3",
        name: "Rayan Smith",
        location: "United States",
        title: "Nice Treatment",
        quote: "I had a great experience with Dr. Chen. She was not only professional but also made me feel comfortable discussing.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
        imageHint: "person portrait",
        rating: 5,
    },
    {
        id: "4",
        name: "Sofia Doe",
        location: "United States",
        title: "Excellent Service",
        quote: "I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
        imageHint: "person portrait",
        rating: 5,
    },
];

// Fallback stats
const fallbackStats: Stats[] = [
    { id: "1", label: "Doctors Available", value: 300, suffix: "+", color: "text-primary" },
    { id: "2", label: "Specialities", value: 18, suffix: "+", color: "text-secondary-foreground" },
    { id: "3", label: "Bookings Done", value: 30, suffix: "K", color: "text-purple-500" },
    { id: "4", label: "Hospitals & Clinic", value: 97, suffix: "+", color: "text-pink-500" },
    { id: "5", label: "Lab Tests Available", value: 317, suffix: "+", color: "text-orange-500" },
];

// Fallback companies
const fallbackCompanies: Company[] = [
    { id: "1", name: "Company 1", logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=120&h=48&fit=crop", alt: "Healthcare Partner 1", hint: "healthcare company logo" },
    { id: "2", name: "Company 2", logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=48&fit=crop", alt: "Medical Partner 2", hint: "medical company logo" },
    { id: "3", name: "Company 3", logo: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=120&h=48&fit=crop", alt: "Health Tech 3", hint: "health technology logo" },
    { id: "4", name: "Company 4", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=48&fit=crop", alt: "Medical Center 4", hint: "medical center logo" },
    { id: "5", name: "Company 5", logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=120&h=48&fit=crop", alt: "Healthcare 5", hint: "healthcare provider logo" },
    { id: "6", name: "Company 6", logo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&h=48&fit=crop", alt: "Medical Tech 6", hint: "medical technology logo" },
];

export function SectionTestimonial() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [stats, setStats] = useState<Stats[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch testimonials
                const testimonialsRef = collection(db, 'testimonials');
                const testimonialsQuery = query(testimonialsRef, orderBy('createdAt', 'desc'), limit(10));
                const testimonialsSnapshot = await getDocs(testimonialsQuery);
                const fetchedTestimonials: Testimonial[] = [];
                testimonialsSnapshot.forEach((doc) => {
                    fetchedTestimonials.push({ id: doc.id, ...doc.data() } as Testimonial);
                });

                // Fetch stats
                const statsRef = collection(db, 'stats');
                const statsSnapshot = await getDocs(statsRef);
                const fetchedStats: Stats[] = [];
                statsSnapshot.forEach((doc) => {
                    fetchedStats.push({ id: doc.id, ...doc.data() } as Stats);
                });

                // Fetch companies
                const companiesRef = collection(db, 'companies');
                const companiesSnapshot = await getDocs(companiesRef);
                const fetchedCompanies: Company[] = [];
                companiesSnapshot.forEach((doc) => {
                    fetchedCompanies.push({ id: doc.id, ...doc.data() } as Company);
                });

                // Use fetched data or fallback
                setTestimonials(fetchedTestimonials.length > 0 ? fetchedTestimonials : fallbackTestimonials);
                setStats(fetchedStats.length > 0 ? fetchedStats : fallbackStats);
                setCompanies(fetchedCompanies.length > 0 ? fetchedCompanies : fallbackCompanies);

            } catch (error) {
                console.error("Error fetching testimonial data: ", error);
                // Use fallback data on error
                setTestimonials(fallbackTestimonials);
                setStats(fallbackStats);
                setCompanies(fallbackCompanies);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Set up real-time listeners for live updates
        const testimonialsRef = collection(db, 'testimonials');
        const testimonialsQuery = query(testimonialsRef, orderBy('createdAt', 'desc'), limit(10));
        const unsubscribeTestimonials = onSnapshot(testimonialsQuery, (snapshot) => {
            const updatedTestimonials: Testimonial[] = [];
            snapshot.forEach((doc) => {
                updatedTestimonials.push({ id: doc.id, ...doc.data() } as Testimonial);
            });
            if (updatedTestimonials.length > 0) {
                setTestimonials(updatedTestimonials);
            }
        });

        const statsRef = collection(db, 'stats');
        const unsubscribeStats = onSnapshot(statsRef, (snapshot) => {
            const updatedStats: Stats[] = [];
            snapshot.forEach((doc) => {
                updatedStats.push({ id: doc.id, ...doc.data() } as Stats);
            });
            if (updatedStats.length > 0) {
                setStats(updatedStats);
            }
        });

        return () => {
            unsubscribeTestimonials();
            unsubscribeStats();
        };
    }, []);

    const renderStars = (rating: number = 5) => {
        return [...Array(5)].map((_, i) => (
            <Star 
                key={i} 
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
        ));
    };

    if (loading) {
        return (
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="section-header sec-header-one text-center mb-10">
                        <Skeleton className="h-6 w-24 mx-auto mb-2" />
                        <Skeleton className="h-8 w-80 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-card rounded-lg shadow-sm p-5">
                                <Skeleton className="h-4 w-full mb-3" />
                                <Skeleton className="h-4 w-3/4 mb-3" />
                                <Skeleton className="h-16 w-full mb-4" />
                                <div className="flex items-center">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div className="ml-3">
                                        <Skeleton className="h-4 w-24 mb-1" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="section-header sec-header-one text-center mb-10">
                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">
                            Testimonials
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold font-headline">
                            {testimonials.length > 0 ? `${testimonials.length}k+ Users Trust AIDoctor Worldwide` : '15k Users Trust AIDoctor Worldwide'}
                        </h2>
                    </div>
                    <Carousel
                        opts={{ align: "start", loop: true }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial) => (
                                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-2 h-full">
                                        <div className="bg-card rounded-lg shadow-sm p-5 h-full flex flex-col">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center">
                                                    {renderStars(testimonial.rating)}
                                                </div>
                                                <Quote className="w-6 h-6 text-primary/20" />
                                            </div>
                                            <h6 className="text-base font-semibold mb-2">{testimonial.title}</h6>
                                            <p className="text-muted-foreground text-sm flex-grow mb-4">{testimonial.quote}</p>
                                            <div className="flex items-center">
                                                <Image
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                    data-ai-hint={testimonial.imageHint}
                                                />
                                                <div className="ml-3">
                                                    <h6 className="font-semibold text-sm">{testimonial.name}</h6>
                                                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-[-16px] top-1/2 -translate-y-1/2" />
                        <CarouselNext className="absolute right-[-16px] top-1/2 -translate-y-1/2" />
                    </Carousel>
                    
                    {/* Dynamic Stats Section */}
                    <div className="mt-16">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {stats.map((stat) => (
                                <div key={stat.id} className="text-center">
                                    <h3 className={`text-3xl md:text-4xl font-bold font-headline ${stat.color || 'text-primary'}`}>
                                        <CountUp 
                                            end={stat.value} 
                                            duration={5} 
                                            suffix={stat.suffix || ''} 
                                            prefix={stat.prefix || ''}
                                            enableScrollSpy 
                                        />
                                    </h3>
                                    <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Dynamic Companies Section */}
            <section className="bg-slate-900 py-12">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="section-header text-center mb-8">
                        <h6 className="text-white/70 font-semibold text-sm">
                            Trusted by 5+ million people at companies like
                        </h6>
                    </div>
                    <Carousel opts={{ align: "start", loop: true }}>
                        <CarouselContent className="-ml-4">
                            {companies.map((company) => (
                                <CarouselItem key={company.id} className="basis-1/3 md:basis-1/4 lg:basis-1/6 xl:basis-1/8 pl-4">
                                    <div className="flex justify-center items-center">
                                        <Image
                                            src={company.logo}
                                            alt={company.alt}
                                            width={120}
                                            height={48}
                                            className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all object-contain"
                                            data-ai-hint={company.hint}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </section>
        </>
    );
}