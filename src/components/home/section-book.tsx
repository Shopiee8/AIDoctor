
import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Search, Bot, UserCheck, CalendarCheck, Sparkles, HeartHandshake, BrainCircuit } from "lucide-react";

const bookingSteps = [
    {
        icon: Search,
        title: "1. Search Doctor",
        description: "Find AI or Human specialists by name, condition, or location.",
    },
    {
        icon: UserCheck,
        title: "2. View Profile",
        description: "Review profiles, ratings, and expertise to choose the right doctor for you.",
    },
    {
        icon: CalendarCheck,
        title: "3. Book a Slot",
        description: "Select a convenient time and confirm your appointment instantly.",
    },
    {
        icon: Sparkles,
        title: "4. Get Care",
        description: "Connect with your doctor and receive personalized, high-quality care.",
    }
];

export function SectionBook() {
    return (
        <section id="features" className="bookus-section bg-background py-16 md:py-20">
            <div className="container mx-auto px-6 md:px-8">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div className="bookus-img" style={{ maxWidth: 500, maxHeight: 500, width: '100%' }}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Image
                                    src="https://placehold.co/500x275.png"
                                    alt="Doctor with patient"
                                    width={500}
                                    height={275}
                                    className="rounded-lg object-cover w-full shadow-lg"
                                    data-ai-hint="doctor patient"
                                />
                            </div>
                            <div>
                                <Image
                                    src="https://placehold.co/240x240.png"
                                    alt="Medical equipment"
                                    width={240}
                                    height={240}
                                    className="rounded-lg object-cover w-full aspect-square shadow-lg"
                                    data-ai-hint="medical equipment"
                                />
                            </div>
                            <div>
                                <Image
                                    src="https://placehold.co/240x240.png"
                                    alt="Hospital hallway"
                                    width={240}
                                    height={240}
                                    className="rounded-lg object-cover w-full aspect-square shadow-lg"
                                    data-ai-hint="hospital hallway"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="section-header mb-6">
                            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">How It Works</span>
                            <h2 className="text-2xl md:text-3xl font-bold font-headline mb-3">
                                Seamless Care in 4 Simple Steps
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                We've designed our platform to be intuitive and user-friendly, allowing you to access both AI and human healthcare professionals with ease.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {bookingSteps.map((step, index) => (
                                 <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-card border">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 flex-shrink-0">
                                        <step.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h6 className="text-card-foreground font-semibold mb-1 text-base">{step.title}</h6>
                                        <p className="text-xs text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div id="solution" className="mt-24 grid lg:grid-cols-2 gap-10 items-center">
                    <div className="lg:order-2">
                        <Image
                            src="/assets/img/ai-human.png"
                            alt="AI and Human doctors collaborating"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover w-full shadow-lg"
                            data-ai-hint="doctor collaboration"
                        />
                    </div>
                    <div className="lg:order-1">
                         <div className="section-header mb-6">
                            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">Our Solution</span>
                            <h2 className="text-2xl md:text-3xl font-bold font-headline mb-3">
                                The Best of Both Worlds: AI & Human Expertise
                            </h2>
                            <p className="text-muted-foreground mb-5 text-sm">
                                Our platform uniquely integrates advanced AI with the irreplaceable empathy of human doctors. This hybrid approach ensures you get fast, accurate, and compassionate healthcare anytime, anywhere.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 bg-purple-100 text-purple-600 rounded-full h-8 w-8 flex items-center justify-center">
                                    <BrainCircuit className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">AI-Powered Efficiency</h3>
                                    <p className="text-sm text-muted-foreground">Instant access to AI agents for preliminary diagnoses, follow-ups, and managing your care plan 24/7.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 bg-teal-100 text-teal-600 rounded-full h-8 w-8 flex items-center justify-center">
                                    <HeartHandshake className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Empathetic Human Care</h3>
                                    <p className="text-sm text-muted-foreground">Connect with board-certified specialists for complex conditions, in-depth consultations, and personalized treatment.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
