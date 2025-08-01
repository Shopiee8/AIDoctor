"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, orderBy, where, limit } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Button } from "../ui/button";
import { Calendar, MessageSquare, ArrowRight, User, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
    id: string;
    title: string;
    excerpt?: string;
    content?: string;
    image: string;
    imageHint?: string;
    category: string;
    author?: string;
    authorImage?: string;
    date: string;
    comments?: number;
    views?: number;
    link: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    tags?: string[];
    createdAt?: any;
    updatedAt?: any;
}

// Fallback articles in case Firestore is empty
const fallbackArticles: Article[] = [
    {
        id: "1",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=375&h=250&fit=crop",
        imageHint: "doctor writing medical notes",
        category: "Health",
        date: "July 30, 2025",
        comments: 12,
        views: 245,
        title: "Simple & Awesome Ways to Keep Your Body Healthy",
        excerpt: "Discover practical tips and strategies to maintain optimal health through simple daily habits and lifestyle changes.",
        link: "/blog/healthy-body-tips",
        author: "Dr. Sarah Johnson",
        isPublished: true,
        isFeatured: true,
        tags: ["health", "wellness", "lifestyle"],
    },
    {
        id: "2",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=375&h=250&fit=crop",
        imageHint: "AI medical technology interface",
        category: "Technology",
        date: "July 29, 2025",
        comments: 8,
        views: 189,
        title: "The Future of AI in Personalized Medicine",
        excerpt: "Explore how artificial intelligence is revolutionizing healthcare with personalized treatment plans and predictive diagnostics.",
        link: "/blog/ai-personalized-medicine",
        author: "Dr. Michael Chen",
        isPublished: true,
        isFeatured: true,
        tags: ["AI", "technology", "medicine"],
    },
    {
        id: "3",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=375&h=250&fit=crop",
        imageHint: "person meditating in peaceful environment",
        category: "Wellness",
        date: "July 28, 2025",
        comments: 15,
        views: 312,
        title: "Mindfulness and Its Impact on Patient Recovery",
        excerpt: "Learn how mindfulness practices can accelerate healing and improve overall patient outcomes in medical treatment.",
        link: "/blog/mindfulness-patient-recovery",
        author: "Dr. Emily Rodriguez",
        isPublished: true,
        isFeatured: false,
        tags: ["mindfulness", "recovery", "wellness"],
    },
    {
        id: "4",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=375&h=250&fit=crop",
        imageHint: "telemedicine consultation setup",
        category: "Telemedicine",
        date: "July 27, 2025",
        comments: 6,
        views: 156,
        title: "Telemedicine: Bridging the Gap in Healthcare Access",
        excerpt: "How remote healthcare services are making quality medical care accessible to patients worldwide.",
        link: "/blog/telemedicine-healthcare-access",
        author: "Dr. James Wilson",
        isPublished: true,
        isFeatured: false,
        tags: ["telemedicine", "access", "remote care"],
    },
    {
        id: "5",
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=375&h=250&fit=crop",
        imageHint: "mental health support session",
        category: "Mental Health",
        date: "July 26, 2025",
        comments: 20,
        views: 428,
        title: "Breaking the Stigma: Mental Health in the Digital Age",
        excerpt: "Addressing mental health challenges and the role of digital platforms in providing accessible mental healthcare.",
        link: "/blog/mental-health-digital-age",
        author: "Dr. Lisa Thompson",
        isPublished: true,
        isFeatured: true,
        tags: ["mental health", "stigma", "digital health"],
    },
    {
        id: "6",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=375&h=250&fit=crop",
        imageHint: "preventive healthcare checkup",
        category: "Prevention",
        date: "July 25, 2025",
        comments: 9,
        views: 203,
        title: "The Power of Preventive Healthcare: Early Detection Saves Lives",
        excerpt: "Understanding the importance of regular health screenings and preventive measures in maintaining long-term health.",
        link: "/blog/preventive-healthcare-importance",
        author: "Dr. Robert Kim",
        isPublished: true,
        isFeatured: false,
        tags: ["prevention", "screening", "early detection"],
    },
];

export function SectionArticle() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const articlesRef = collection(db, 'articles');
                const articlesQuery = query(
                    articlesRef,
                    where('isPublished', '==', true),
                    orderBy('createdAt', 'desc'),
                    limit(6)
                );
                const articlesSnapshot = await getDocs(articlesQuery);
                const fetchedArticles: Article[] = [];
                
                articlesSnapshot.forEach((doc) => {
                    const articleData = { id: doc.id, ...doc.data() } as Article;
                    fetchedArticles.push(articleData);
                });

                // Use fetched data or fallback
                setArticles(fetchedArticles.length > 0 ? fetchedArticles : fallbackArticles);

            } catch (error) {
                console.error("Error fetching articles: ", error);
                // Use fallback data on error
                setArticles(fallbackArticles);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();

        // Set up real-time listener for live updates
        const articlesRef = collection(db, 'articles');
        const articlesQuery = query(
            articlesRef,
            where('isPublished', '==', true),
            orderBy('createdAt', 'desc'),
            limit(6)
        );
        const unsubscribe = onSnapshot(articlesQuery, (snapshot) => {
            const updatedArticles: Article[] = [];
            snapshot.forEach((doc) => {
                const articleData = { id: doc.id, ...doc.data() } as Article;
                updatedArticles.push(articleData);
            });
            if (updatedArticles.length > 0) {
                setArticles(updatedArticles);
            }
        }, (error) => {
            console.error("Error in articles real-time listener: ", error);
        });

        return () => unsubscribe();
    }, []);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <section className="py-16 md:py-20 bg-gray-50/50">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="section-header sec-header-one text-center mb-10">
                        <Skeleton className="h-6 w-32 mx-auto mb-2" />
                        <Skeleton className="h-8 w-80 mx-auto" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-card rounded-lg shadow-md overflow-hidden">
                                <Skeleton className="w-full h-[250px]" />
                                <div className="p-5">
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-6 w-full mb-3" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-20 bg-gray-50/50">
            <div className="container mx-auto px-6 md:px-8">
                <div className="section-header sec-header-one text-center mb-10">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">
                        Blogs and News
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">
                        Read Our Latest Articles
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Stay informed with the latest insights on healthcare, AI technology, and wellness from our expert contributors.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <div key={article.id} className="bg-card rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
                            <Link href={article.link} className="block relative">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    width={375}
                                    height={250}
                                    className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={article.imageHint}
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded">
                                        {article.category}
                                    </span>
                                </div>
                                {article.isFeatured && (
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-1 rounded">
                                            Featured
                                        </span>
                                    </div>
                                )}
                            </Link>
                            <div className="p-5">
                                <div className="flex items-center text-xs text-muted-foreground mb-2 space-x-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{formatDate(article.date)}</span>
                                    </div>
                                    {article.comments !== undefined && (
                                        <div className="flex items-center gap-1.5">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span>{article.comments} Comments</span>
                                        </div>
                                    )}
                                    {article.views !== undefined && (
                                        <div className="flex items-center gap-1.5">
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>{article.views} Views</span>
                                        </div>
                                    )}
                                </div>
                                
                                {article.author && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">By {article.author}</span>
                                    </div>
                                )}
                                
                                <h3 className="text-base font-bold mb-2 font-headline line-clamp-2">
                                    <Link href={article.link} className="hover:text-primary transition-colors">
                                        {article.title}
                                    </Link>
                                </h3>
                                
                                {article.excerpt && (
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                )}
                                
                                {article.tags && article.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {article.tags.slice(0, 3).map((tag, index) => (
                                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                <Button asChild variant="link" className="p-0 h-auto font-semibold text-primary">
                                    <Link href={article.link}>
                                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* View All Articles Button */}
                <div className="text-center mt-10">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/blog">
                            View All Articles <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}