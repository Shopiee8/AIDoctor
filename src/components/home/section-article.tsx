
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Calendar, MessageSquare, ArrowRight } from "lucide-react";

const articles = [
    {
        image: "https://placehold.co/375x250.png",
        imageHint: "doctor writing",
        category: "Health",
        date: "April 20, 2024",
        comments: 10,
        title: "Simple & Awesome Ways to Keep Your Body Healthy",
        link: "/blog-details",
    },
    {
        image: "https://placehold.co/375x250.png",
        imageHint: "medical scanner",
        category: "Technology",
        date: "April 21, 2024",
        comments: 5,
        title: "The Future of AI in Personalized Medicine",
        link: "/blog-details",
    },
    {
        image: "https://placehold.co/375x250.png",
        imageHint: "person meditating",
        category: "Wellness",
        date: "April 22, 2024",
        comments: 8,
        title: "Mindfulness and Its Impact on Patient Recovery",
        link: "/blog-details",
    },
];

export function SectionArticle() {
    return (
        <section className="py-16 md:py-20 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="section-header sec-header-one text-center mb-10">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">
                        Blogs and News
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">
                        Read Our Latest Articles
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                        <div key={index} className="bg-card rounded-lg shadow-md overflow-hidden group">
                            <Link href={article.link} className="block relative">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    width={375}
                                    height={250}
                                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={article.imageHint}
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded">
                                        {article.category}
                                    </span>
                                </div>
                            </Link>
                            <div className="p-5">
                                <div className="flex items-center text-xs text-muted-foreground mb-2 space-x-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{article.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>{article.comments} Comments</span>
                                    </div>
                                </div>
                                <h3 className="text-base font-bold mb-3 font-headline">
                                    <Link href={article.link} className="hover:text-primary transition-colors">
                                        {article.title}
                                    </Link>
                                </h3>
                                <Button asChild variant="link" className="p-0 h-auto font-semibold text-primary">
                                    <Link href={article.link}>
                                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
