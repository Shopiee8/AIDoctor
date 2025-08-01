"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from '@/lib/firebase';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category?: string;
    isActive?: boolean;
    order?: number;
    createdAt?: any;
    updatedAt?: any;
}

// Fallback FAQ data in case Firestore is empty
const fallbackFaqData: FAQ[] = [
    {
        id: "item-1",
        question: "What is the difference between an AI doctor and a human doctor on this platform?",
        answer: "AI doctors are advanced algorithms designed for initial consultations, quick check-ins, and managing health data. They provide instant, 24/7 support. Human doctors are board-certified specialists who provide in-depth diagnosis, personalized treatment plans, and empathetic care for more complex health concerns.",
        category: "general",
        isActive: true,
        order: 1,
    },
    {
        id: "item-2",
        question: "How do I book an appointment?",
        answer: "Simply use the search bar to find a doctor (AI or human), view their profile, and select an available time slot. The process is quick, easy, and can be done in just a few clicks.",
        category: "booking",
        isActive: true,
        order: 2,
    },
    {
        id: "item-3",
        question: "Is my data safe with an AI doctor?",
        answer: "Absolutely. We use state-of-the-art encryption and adhere to strict privacy regulations to ensure all your personal and health information is kept secure and confidential, whether you're interacting with an AI or a human doctor.",
        category: "privacy",
        isActive: true,
        order: 3,
    },
    {
        id: "item-4",
        question: "When should I choose an AI doctor versus a human doctor?",
        answer: "AI doctors are great for initial symptom checks, post-operative follow-ups, medication reminders, and general health questions. For complex symptoms, a new diagnosis, or if you prefer a personal connection, we recommend booking an appointment with one of our human specialists.",
        category: "general",
        isActive: true,
        order: 4,
    },
    {
        id: "item-5",
        question: "Can an AI doctor prescribe medication?",
        answer: "Currently, our AI doctors can provide recommendations and manage existing prescriptions under the supervision of a human doctor. All new prescriptions must be issued by a licensed human healthcare provider on our platform.",
        category: "medical",
        isActive: true,
        order: 5,
    },
    {
        id: "item-6",
        question: "How much does it cost to consult with an AI doctor?",
        answer: "AI consultations are significantly more affordable than traditional doctor visits. Basic AI consultations start from as low as $5, while comprehensive AI health assessments are available for $15-25. Human doctor consultations vary by specialty and duration.",
        category: "pricing",
        isActive: true,
        order: 6,
    },
    {
        id: "item-7",
        question: "What languages does the AI doctor support?",
        answer: "Our AI doctor currently supports over 50 languages including English, Spanish, French, German, Chinese, Japanese, Arabic, and many more. The AI can seamlessly switch between languages during a conversation to ensure clear communication.",
        category: "features",
        isActive: true,
        order: 7,
    },
    {
        id: "item-8",
        question: "Can I get a second opinion from a human doctor after consulting with AI?",
        answer: "Yes, absolutely! You can easily escalate your AI consultation to a human doctor at any time. Your AI consultation history and data will be seamlessly transferred to the human doctor for continuity of care.",
        category: "general",
        isActive: true,
        order: 8,
    },
];

export function SectionFaq() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            setLoading(true);
            try {
                const faqsRef = collection(db, 'faqs');
                const faqsQuery = query(
                    faqsRef, 
                    where('isActive', '==', true),
                    orderBy('order', 'asc')
                );
                const faqsSnapshot = await getDocs(faqsQuery);
                const fetchedFaqs: FAQ[] = [];
                
                faqsSnapshot.forEach((doc) => {
                    fetchedFaqs.push({ id: doc.id, ...doc.data() } as FAQ);
                });

                // Use fetched data or fallback
                setFaqs(fetchedFaqs.length > 0 ? fetchedFaqs : fallbackFaqData);

            } catch (error) {
                console.error("Error fetching FAQs: ", error);
                // Use fallback data on error
                setFaqs(fallbackFaqData);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();

        // Set up real-time listener for live updates
        const faqsRef = collection(db, 'faqs');
        const faqsQuery = query(
            faqsRef, 
            where('isActive', '==', true),
            orderBy('order', 'asc')
        );
        const unsubscribe = onSnapshot(faqsQuery, (snapshot) => {
            const updatedFaqs: FAQ[] = [];
            snapshot.forEach((doc) => {
                updatedFaqs.push({ id: doc.id, ...doc.data() } as FAQ);
            });
            if (updatedFaqs.length > 0) {
                setFaqs(updatedFaqs);
            }
        }, (error) => {
            console.error("Error in FAQ real-time listener: ", error);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <section id="faq" className="py-16 md:py-20 bg-accent">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="section-header text-center mb-10">
                        <Skeleton className="h-6 w-16 mx-auto mb-2" />
                        <Skeleton className="h-8 w-80 mx-auto" />
                    </div>
                    <div className="max-w-3xl mx-auto">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="bg-card border rounded-lg px-6 py-4 mb-2 shadow-sm">
                                <Skeleton className="h-6 w-full mb-2" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="faq" className="py-16 md:py-20 bg-accent">
            <div className="container mx-auto px-6 md:px-8">
                <div className="section-header text-center mb-10">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">
                        FAQ'S
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">
                        Your Questions are Answered
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Find answers to the most commonly asked questions about our AI and human doctor services.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible defaultValue={faqs[0]?.id} className="w-full">
                        {faqs.map((faq) => (
                            <AccordionItem 
                                key={faq.id} 
                                value={faq.id} 
                                className="bg-card border rounded-lg px-6 mb-2 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <AccordionTrigger className="text-base text-left font-semibold hover:no-underline py-4">
                                    {faq.question}
                                    {faq.category && (
                                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            {faq.category}
                                        </span>
                                    )}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm pt-2 pb-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                
                {/* Additional Help Section */}
                <div className="text-center mt-12">
                    <p className="text-muted-foreground mb-4">
                        Still have questions? We're here to help!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/dashboard/messages" 
                            className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Contact Support
                        </a>
                        <a 
                            href="/dashboard/consultation" 
                            className="inline-flex items-center justify-center px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                        >
                            Ask AI Doctor
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}