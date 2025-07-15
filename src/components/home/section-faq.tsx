import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        id: "item-1",
        question: "How do I book an appointment with a doctor?",
        answer: "Yes, simply visit our website and log in or create an account. Search for a doctor based on specialization, location, or availability & confirm your booking."
    },
    {
        id: "item-2",
        question: "Can I request a specific doctor when booking my appointment?",
        answer: "Yes, you can usually request a specific doctor when booking your appointment, though availability may vary based on their schedule."
    },
    {
        id: "item-3",
        question: "What should I do if I need to cancel or reschedule my appointment?",
        answer: "If you need to cancel or reschedule your appointment, contact the doctor as soon as possible to inform them and to reschedule for another available time slot."
    },
    {
        id: "item-4",
        question: "What if I'm running late for my appointment?",
        answer: "If you know you will be late, it's courteous to call the doctor's office and inform them. Depending on their policy and schedule, they may be able to accommodate you or reschedule your appointment."
    },
    {
        id: "item-5",
        question: "Can I book appointments for family members or dependents?",
        answer: "Yes, in many cases, you can book appointments for family members or dependents. However, you may need to provide their personal information and consent to do so."
    }
];


export function SectionFaq() {
    return (
        <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
                <div className="section-header sec-header-one text-center mb-10">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold font-headline mb-2">FAQ’S</span>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">Your Questions are Answered</h2>
                </div>
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                        {faqData.map((faq, index) => (
                             <AccordionItem key={faq.id} value={faq.id}>
                                <AccordionTrigger className="text-base text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm">
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
