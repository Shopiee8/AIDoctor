import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Search, UserCheck, Calendar, Lightbulb, ChevronRight } from "lucide-react";

const bookingSteps = [
    {
        icon: Search,
        title: "Search For Doctors",
        description: "Search for a doctor based on specialization, location, or availability for your Treatements",
        bgColor: "bg-primary"
    },
    {
        icon: UserCheck,
        title: "Check Doctor Profile",
        description: "Explore detailed doctor profiles on our platform to make informed healthcare decisions.",
        bgColor: "bg-orange-500"
    },
    {
        icon: Calendar,
        title: "Schedule Appointment",
        description: "After choose your preferred doctor, select a convenient time slot, & confirm your appointment.",
        bgColor: "bg-cyan-500"
    },
    {
        icon: Lightbulb,
        title: "Get Your Solution",
        description: "Discuss your health concerns with the doctor and receive the personalized advice & with solution.",
        bgColor: "bg-indigo-500"
    }
];

export function SectionBook() {
    return (
        <section className="bookus-section bg-slate-900 text-white py-16 md:py-20">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div className="bookus-img">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <Image
                                    src="https://placehold.co/500x275.png"
                                    alt="Doctor with patient"
                                    width={500}
                                    height={275}
                                    className="img-fluid rounded-lg object-cover w-full"
                                    data-ai-hint="doctor patient"
                                />
                            </div>
                            <div>
                                <Image
                                    src="https://placehold.co/240x240.png"
                                    alt="Medical equipment"
                                    width={240}
                                    height={240}
                                    className="img-fluid rounded-lg object-cover w-full aspect-square"
                                    data-ai-hint="medical equipment"
                                />
                            </div>
                            <div>
                                <Image
                                    src="https://placehold.co/240x240.png"
                                    alt="Hospital hallway"
                                    width={240}
                                    height={240}
                                    className="img-fluid rounded-lg object-cover w-full aspect-square"
                                    data-ai-hint="hospital hallway"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="section-header mb-4">
                            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">Why Book With Us</span>
                            <h2 className="text-2xl md:text-3xl font-bold font-headline mb-3">
                                We are committed to understanding your{" "}
                                <span className="text-primary">
                                    unique needs and delivering care.
                                </span>
                            </h2>
                        </div>
                        <p className="text-slate-300 mb-5 text-sm">
                            As a trusted healthcare provider in our community, we are passionate about promoting health and wellness beyond the clinic. We actively engage in community outreach programs, health fairs, and educational workshops.
                        </p>
                        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                            <AccordionItem value="item-1" className="border-slate-700">
                                <AccordionTrigger className="hover:no-underline text-base">01. Our Vision</AccordionTrigger>
                                <AccordionContent className="text-slate-300 text-sm">
                                    We envision a community where everyone has access to high-quality healthcare and the resources they need to lead healthy, fulfilling lives.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-slate-700">
                                <AccordionTrigger className="hover:no-underline text-base">02. Our Mission</AccordionTrigger>
                                <AccordionContent className="text-slate-300 text-sm">
                                    To provide compassionate, patient-centered care through innovative technology and a dedicated team of professionals, ensuring positive health outcomes.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div className="mt-16">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {bookingSteps.map((step, index) => (
                             <div key={index} className="book-item relative bg-slate-800 p-5 rounded-lg transition-transform hover:-translate-y-1.5">
                                <div className={`book-icon w-10 h-10 rounded-full flex items-center justify-center ${step.bgColor}`}>
                                    <step.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="book-info mt-3">
                                    <h6 className="text-white font-semibold mb-2 text-base">{step.title}</h6>
                                    <p className="text-xs text-slate-300">
                                        {step.description}
                                    </p>
                                </div>
                                {index < bookingSteps.length - 1 && (
                                     <div className="way-icon absolute top-1/2 -right-3 -translate-y-1/2 hidden lg:block">
                                        <ChevronRight className="w-7 h-7 text-slate-600" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
