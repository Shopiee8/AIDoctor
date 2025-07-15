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


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1">
        <HomeBanner />
        <SectionList />
        <SectionSpeciality />
        <SectionDoctor />
        <SectionService />
        <SectionReason />
        <SectionBook />
        <SectionTestimonial />
        <SectionFaq />
        <SectionApp />
        <SectionArticle />
      </main>
      <Footer />
    </div>
  );
}