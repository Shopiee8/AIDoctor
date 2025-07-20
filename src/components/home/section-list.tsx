
import Link from "next/link";
import {
    CalendarPlus,
    MessageSquare,
    Hospital,
    HeartPulse,
    Pill,
    FlaskConical,
    Bot,
    User,
} from "lucide-react";

const listItems = [
    {
        href: "/search",
        icon: CalendarPlus,
        text: "Book Appointment",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600"
    },
    {
        href: "/search",
        icon: Bot,
        text: "AI Consulation",
        bgColor: "bg-purple-100",
        iconColor: "text-purple-600"
    },
    {
        href: "/search",
        icon: User,
        text: "Human Doctor",
        bgColor: "bg-teal-100",
        iconColor: "text-teal-600"
    },
    {
        href: "/hospitals",
        icon: Hospital,
        text: "Hospitals & Clinics",
        bgColor: "bg-indigo-100",
        iconColor: "text-indigo-600"
    },
    {
        href: "#",
        icon: Pill,
        text: "Medicine & Supplies",
        bgColor: "bg-pink-100",
        iconColor: "text-pink-600"
    },
    {
        href: "#",
        icon: FlaskConical,
        text: "Lab Testing",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-600"
    },
    {
        href: "#",
        icon: HeartPulse,
        text: "Wellness Plans",
        bgColor: "bg-red-100",
        iconColor: "text-red-600"
    }
];

export function SectionList() {
    return (
        <section className="py-10 -mt-12 relative z-20">
            <div className="container mx-auto px-6 md:px-8">
                <div className="bg-card shadow-lg rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center justify-center xl:justify-between flex-wrap gap-4">
                            {listItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={index} href={item.href} className="flex flex-col items-center gap-2 text-center group w-24">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${item.bgColor}`}>
                                            <Icon className={`w-8 h-8 ${item.iconColor}`} />
                                        </div>
                                        <h6 className="font-semibold text-sm text-card-foreground group-hover:text-primary transition-colors leading-tight">{item.text}</h6>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
