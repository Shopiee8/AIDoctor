
"use client";

import React from "react";
import CountUp from "react-countup";
import Image from "next/image";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Deny Hendrawan",
        location: "United States",
        title: "Nice Treatment",
        quote: "I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.",
        image: "https://placehold.co/64x64.png",
        imageHint: "person portrait",
    },
    {
        name: "Johnson DWayne",
        location: "United States",
        title: "Good Hospitability",
        quote: "Genuinely cares about his patients. He helped me understand my condition and worked with me to create a plan.",
        image: "https://placehold.co/64x64.png",
        imageHint: "person portrait",
    },
    {
        name: "Rayan Smith",
        location: "United States",
        title: "Nice Treatment",
        quote: "I had a great experience with Dr. Chen. She was not only professional but also made me feel comfortable discussing.",
        image: "https://placehold.co/64x64.png",
        imageHint: "person portrait",
    },
    {
        name: "Sofia Doe",
        location: "United States",
        title: "Excellent Service",
        quote: "I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.",
        image: "https://placehold.co/64x64.png",
        imageHint: "person portrait",
    },
];

const counters = [
    { value: 300, suffix: "+", label: "Doctors Available", color: "text-primary" },
    { value: 18, suffix: "+", label: "Specialities", color: "text-secondary-foreground" },
    { value: 30, suffix: "K", label: "Bookings Done", color: "text-purple-500" },
    { value: 97, suffix: "+", label: "Hospitals & Clinic", color: "text-pink-500" },
    { value: 317, suffix: "+", label: "Lab Tests Available", color: "text-orange-500" },
];

const companies = [
    { src: "https://placehold.co/120x48.png", alt: "Company 1", hint: "company logo" },
    { src: "https://placehold.co/120x48.png", alt: "Company 2", hint: "company logo" },
    { src: "https://placehold.co/120x48.png", alt: "Company 3", hint: "company logo" },
    { src: "https://placehold.co/120x48.png", alt: "Company 4", hint: "company logo" },
    { src: "https://placehold.co/120x48.png", alt: "Company 5", hint: "company logo" },
    { src: "https://placehold.co/120x48.png", alt: "Company 6", hint: "company logo" },
    { src: "https://placehold.co/120x48.png", alt: "Company 7", hint: "company logo" },
    { src: "https://placehold.co/120x48.png", alt: "Company 8", hint: "company logo" },
];

export function SectionTestimonial() {
    return (
        <>
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="section-header sec-header-one text-center mb-10">
                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">Testimonials</span>
                        <h2 className="text-2xl md:text-3xl font-bold font-headline">15k Users Trust AIDoctor Worldwide</h2>
                    </div>
                    <Carousel
                        opts={{ align: "start", loop: true }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-2 h-full">
                                        <div className="bg-card rounded-lg shadow-sm p-5 h-full flex flex-col">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    ))}
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
                                                    className="rounded-full"
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
                    <div className="mt-16">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {counters.map((counter, index) => (
                                <div key={index} className="text-center">
                                    <h3 className={`text-3xl md:text-4xl font-bold font-headline ${counter.color}`}>
                                        <CountUp end={counter.value} duration={5} suffix={counter.suffix} enableScrollSpy />
                                    </h3>
                                    <p className="text-muted-foreground text-sm mt-1">{counter.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-slate-900 py-12">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="section-header text-center mb-8">
                        <h6 className="text-white/70 font-semibold text-sm">
                            Trusted by 5+ million people at companies like
                        </h6>
                    </div>
                    <Carousel opts={{ align: "start", loop: true }}>
                        <CarouselContent className="-ml-4">
                            {companies.map((company, index) => (
                                <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/6 xl:basis-1/8 pl-4">
                                    <div className="flex justify-center items-center">
                                        <Image
                                            src={company.src}
                                            alt={company.alt}
                                            width={120}
                                            height={48}
                                            className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
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
