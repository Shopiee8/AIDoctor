import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        id: "item-1",
        question: "What is the difference between an AI doctor and a human doctor on this platform?",
        answer: "AI doctors are advanced algorithms designed for initial consultations, quick check-ins, and managing health data. They provide instant, 24/7 support. Human doctors are board-certified specialists who provide in-depth diagnosis, personalized treatment plans, and empathetic care for more complex health concerns."
    },
    {
        id: "item-2",
        question: "How do I book an appointment?",
        answer: "Simply use the search bar to find a doctor (AI or human), view their profile, and select an available time slot. The process is quick, easy, and can be done in just a few clicks."
    },
    {
        id: "item-3",
        question: "Is my data safe with an AI doctor?",
        answer: "Absolutely. We use state-of-the-art encryption and adhere to strict privacy regulations to ensure all your personal and health information is kept secure and confidential, whether you're interacting with an AI or a human doctor."
    },
    {
        id: "item-4",
        question: "When should I choose an AI doctor versus a human doctor?",
        answer: "AI doctors are great for initial symptom checks, post-operative follow-ups, medication reminders, and general health questions. For complex symptoms, a new diagnosis, or if you prefer a personal connection, we recommend booking an appointment with one of our human specialists."
    },
    {
        id: "item-5",
        question: "Can an AI doctor prescribe medication?",
        answer: "Currently, our AI doctors can provide recommendations and manage existing prescriptions under the supervision of a human doctor. All new prescriptions must be issued by a licensed human healthcare provider on our platform."
    }
];


export function SectionFaq() {
    return (
        <section id="faq" className="py-16 md:py-20 bg-accent">
            <div className="container mx-auto px-4">
                <div className="section-header text-center mb-10">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">FAQ’S</span>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">Your Questions are Answered</h2>
                </div>
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                        {faqData.map((faq) => (
                             <AccordionItem key={faq.id} value={faq.id} className="bg-card border rounded-lg px-6 mb-2 shadow-sm">
                                <AccordionTrigger className="text-base text-left font-semibold hover:no-underline">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm pt-2">
                                   {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
