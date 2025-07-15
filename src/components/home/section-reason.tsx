import { UserCheck, HeartHandshake, CalendarCheck } from 'lucide-react';

const reasons = [
    {
        icon: UserCheck,
        title: "Follow-Up Care",
        description: "We ensure continuity of care through regular follow-ups and communication, helping you stay on track with health goals.",
        iconColor: "text-orange-500"
    },
    {
        icon: HeartHandshake,
        title: "Patient-Centered Approach",
        description: "We prioritize your comfort and preferences, tailoring our services to meet your individual needs and Care from Our Experts.",
        iconColor: "text-purple-500"
    },
    {
        icon: CalendarCheck,
        title: "Convenient Access",
        description: "Easily book appointments online or through our dedicated customer service team, with flexible hours to fit your schedule.",
        iconColor: "text-cyan-500"
    }
];

export function SectionReason() {
    return (
        <section className="py-20 md:py-24">
            <div className="container">
                <div className="section-header sec-header-one text-center mb-12">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold font-headline mb-2">Why Book With Us</span>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Compelling Reasons to Choose</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    {reasons.map((reason, index) => (
                        <div key={index} className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                     <reason.icon className={`w-8 h-8 ${reason.iconColor}`} />
                                </div>
                                <div>
                                    <h6 className="font-semibold text-lg mb-2">{reason.title}</h6>
                                    <p className="text-sm text-muted-foreground mb-0">
                                        {reason.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
