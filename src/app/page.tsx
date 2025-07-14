import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import Image from "next/image";
import { Stethoscope, Bot, Users, ShieldCheck, HeartPulse, Activity, ClipboardPlus } from "lucide-react";

const agents = [
  { name: "Julia", role: "Post-Op Specialist", avatar: "J", description: "Follow-up calls, recovery tracking, and wound care." },
  { name: "Sam", role: "Intake Assistant", avatar: "S", description: "Gathers symptoms, allergies, and medical history." },
  { name: "Nora", role: "Referral Manager", avatar: "N", description: "Finds specialists and prepares referral documents." },
  { name: "Max", role: "Medication Coach", avatar: "M", description: "Explains dosage, schedules, and sends reminders." },
  { name: "Ava", role: "Admin Support", avatar: "A", description: "Handles forms, booking, and insurance queries." },
];

const features = [
  { icon: <Bot className="w-8 h-8 text-primary" />, title: "AI-Powered Consultations", description: "Engage with advanced AI agents for intake, follow-ups, and more, available 24/7." },
  { icon: <Users className="w-8 h-8 text-primary" />, title: "Human Doctor Oversight", description: "AI consults are reviewed by human doctors who can intervene when necessary." },
  { icon: <ShieldCheck className="w-8 h-8 text-primary" />, title: "Safe & Secure", description: "Your data is encrypted and handled with the highest standards of privacy and security." },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    The Future of Healthcare is Here
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    AIDoctor provides intelligent, compassionate AI-powered healthcare consultations, automating clinical tasks to support patients and providers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="transition-transform transform hover:scale-105">
                    <a href="/register">Book AI Consultation</a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="transition-transform transform hover:scale-105">
                    <a href="/login">Doctor & Admin Login</a>
                  </Button>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                 <Image
                  src="https://placehold.co/650x400.png"
                  alt="AI Doctor in consultation"
                  width={650}
                  height={400}
                  data-ai-hint="doctor computer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
                   <div className="p-4 rounded-full bg-background/30 backdrop-blur-sm cursor-pointer">
                     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A New Standard of Care</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform seamlessly integrates AI and human expertise to deliver efficient, personalized healthcare.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              {features.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-col items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground">
                    {feature.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="agents" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our AI Team</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Meet Our AI Agents</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Dedicated AI personas designed for specific clinical and administrative tasks, ensuring you get the right support.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mt-12">
              {agents.map((agent) => (
                <div key={agent.name} className="flex flex-col items-center text-center space-y-2">
                  <Avatar className="w-20 h-20 text-2xl">
                     <AvatarFallback className="bg-primary text-primary-foreground">{agent.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold font-headline">{agent.name}</h3>
                    <p className="text-sm text-primary">{agent.role}</p>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="use-cases" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Use Cases</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Automating Care Pathways</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                From pre-op to post-op and beyond, AIDoctor agents handle routine interactions, freeing up human staff for critical-thinking tasks.
              </p>
              <ul className="grid gap-2 py-4">
                <li className="flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-primary" /> Post-Operative Check-ins
                </li>
                <li className="flex items-center gap-2">
                  <ClipboardPlus className="w-5 h-5 text-primary" /> Pre-Op Preparation Calls
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Patient Triage and Intake
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://placehold.co/550x310.png"
                width="550"
                height="310"
                alt="Use Case Diagram"
                data-ai-hint="medical chart"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              />
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
