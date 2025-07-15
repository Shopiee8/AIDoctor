import Link from "next/link";
import {
    CalendarPlus,
    MessageSquare,
    Hospital,
    HeartPulse,
    Pill,
    FlaskConical,
    Home,
} from "lucide-react";

const listItems = [
    {
        href: "/booking",
        icon: CalendarPlus,
        text: "Book Appointment",
        bgColor: "bg-secondary",
        iconColor: "text-secondary-foreground"
    },
    {
        href: "/doctor-grid",
        icon: MessageSquare,
        text: "Talk to Doctors",
        bgColor: "bg-primary",
        iconColor: "text-primary-foreground"
    },
    {
        href: "/hospitals",
        icon: Hospital,
        text: "Hospitals & Clinics",
        bgColor: "bg-pink-500",
        iconColor: "text-white"
    },
    {
        href: "/home-3",
        icon: HeartPulse,
        text: "Healthcare",
        bgColor: "bg-cyan-500",
        iconColor: "text-white"
    },
    {
        href: "#",
        icon: Pill,
        text: "Medicine & Supplies",
        bgColor: "bg-purple-500",
        iconColor: "text-white"
    },
    {
        href: "#",
        icon: FlaskConical,
        text: "Lab Testing",
        bgColor: "bg-orange-500",
        iconColor: "text-white"
    },
    {
        href: "#",
        icon: Home,
        text: "Home Care",
        bgColor: "bg-teal-500",
        iconColor: "text-white"
    }
];

export function SectionList() {
    return (
        <section className="py-12">
            <div className="container">
                <div className="shadow-lg rounded-lg">
                    <div className="p-8">
                        <div className="flex items-center justify-center xl:justify-between flex-wrap gap-6">
                            {listItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={index} href={item.href} className="flex flex-col items-center gap-2 text-center group">
                                        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${item.bgColor}`}>
                                            <Icon className={`w-10 h-10 ${item.iconColor}`} />
                                        </div>
                                        <h6 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{item.text}</h6>
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
