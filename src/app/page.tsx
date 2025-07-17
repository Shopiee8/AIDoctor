
import { LandingHeader } from "@/components/landing-header";
import { Footer } from "@/components/home/footer";
import { HomeBanner } from "@/components/home/home-banner";
import { SectionList } from "@/components/home/section-list";
import { SectionSpeciality } from "@/components/home/section-speciality";
import { SectionDoctor } from "@/components/home/section-doctor";
import { SectionService } from "@/components/home/section-service";
import { SectionReason } from "@/components/home/section-reason";
import { SectionBook } from "@/components/home/section-book";
import { SectionTestimonial } from "@/components/home/section-testimonial";
import { SectionFaq } from "@/components/home/section-faq";
import { SectionApp } from "@/components/home/section-app";
import { SectionArticle } from "@/components/home/section-article";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1">
        <HomeBanner />
        <SectionList />
        <SectionSpeciality />
        <SectionDoctor />
        <SectionBook />
        <div className="bg-primary/5 py-16 text-center">
            <div className="container">
                <h2 className="text-3xl font-bold font-headline mb-4">Ready to Talk to our AI Doctor?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    Get instant, confidential, and intelligent answers to your health questions. Our AI is available 24/7 to help you understand your symptoms and guide you on your next steps.
                </p>
                <Button size="lg" className="text-lg h-12" asChild>
                    <Link href="/dashboard/consultation"><MessageSquarePlus className="mr-3 h-6 w-6" /> Start Your AI Consultation Now</Link>
                </Button>
            </div>
        </div>
        <SectionReason />
        <SectionTestimonial />
        <SectionFaq />
        <SectionApp />
        <SectionArticle />
      </main>
      <Footer />
    </div>
  );
}
