import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import Image from "next/image";
import { ArrowRight, CheckCircle, Bot, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";
import HomeBanner from "@/components/home/home-banner";

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
        <HomeBanner />

        <section id="problem" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
             <div className="flex flex-col items-center justify-center space-y-4">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-headline">The Problem</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Healthcare is facing a global staffing crisis.</h2>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
                  The World Health Organization projects a 10 million healthcare worker shortage by 2030, leading to clinician burnout and patient care delays.
                </p>
            </div>
             <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
                 <Card className="text-left">
                     <CardHeader>
                         <CardTitle className="font-headline">Widespread Burnout</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p className="text-muted-foreground">High workloads and emotional exhaustion are causing a mass exodus from the healthcare profession.</p>
                     </CardContent>
                 </Card>
                 <Card className="text-left">
                     <CardHeader>
                         <CardTitle className="font-headline">Patient Access Issues</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p className="text-muted-foreground">Staff shortages result in longer wait times, shorter appointments, and difficulty accessing specialized care.</p>
                     </CardContent>
                 </Card>
                 <Card className="text-left">
                     <CardHeader>
                         <CardTitle className="font-headline">Rising Costs</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p className="text-muted-foreground">Inefficiencies and the need for expensive temporary staff are driving up healthcare costs for everyone.</p>
                     </CardContent>
                 </Card>
             </div>
          </div>
        </section>

        <section id="solution" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50/50">
            <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
                <div className="flex items-center justify-center">
                    <Image
                        src="https://placehold.co/550x550.png"
                        width="550"
                        height="550"
                        alt="AI agents"
                        data-ai-hint="robot doctor"
                        className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center"
                    />
                </div>
                 <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-headline">The Solution</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Super-staffing with safe, helpful AI agents.</h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                        AIDoctor’s generative AI agents automate tasks, allowing clinicians to focus on patient care. We are setting the standard for safety in healthcare AI.
                    </p>
                    <ul className="grid gap-3 py-4">
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            <span>Trained on proprietary healthcare data</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            <span>Continuously monitored by human clinicians</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            <span>Reduces administrative burden and wait times</span>
                        </li>
                    </ul>
                     <Button asChild>
                        <Link href="#features">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-headline">How It Works</div>
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

      </main>
      <LandingFooter />
    </div>
  );
}
