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
    ArrowRight,
    Sparkles,
    Clock,
    Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const listItems = [
    {
        href: "/search",
        icon: CalendarPlus,
        text: "Book Appointment",
        description: "Schedule with top doctors",
        bgColor: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        borderColor: "border-blue-200 dark:border-blue-800/50",
        hoverColor: "hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30",
        badge: null
    },
    {
        href: "/search",
        icon: Bot,
        text: "AI Consultation",
        description: "Instant AI-powered diagnosis",
        bgColor: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
        iconColor: "text-purple-600 dark:text-purple-400",
        borderColor: "border-purple-200 dark:border-purple-800/50",
        hoverColor: "hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30",
        badge: { text: "Popular", variant: "default" as const }
    },
    {
        href: "/search",
        icon: User,
        text: "Human Doctor",
        description: "Connect with specialists",
        bgColor: "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
        iconColor: "text-teal-600 dark:text-teal-400",
        borderColor: "border-teal-200 dark:border-teal-800/50",
        hoverColor: "hover:from-teal-100 hover:to-teal-200 dark:hover:from-teal-800/30 dark:hover:to-teal-700/30",
        badge: null
    },
    {
        href: "/hospitals",
        icon: Hospital,
        text: "Hospitals & Clinics",
        description: "Find nearby facilities",
        bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
        iconColor: "text-indigo-600 dark:text-indigo-400",
        borderColor: "border-indigo-200 dark:border-indigo-800/50",
        hoverColor: "hover:from-indigo-100 hover:to-indigo-200 dark:hover:from-indigo-800/30 dark:hover:to-indigo-700/30",
        badge: null
    },
    {
        href: "#",
        icon: Pill,
        text: "Medicine & Supplies",
        description: "Order prescriptions online",
        bgColor: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
        iconColor: "text-pink-600 dark:text-pink-400",
        borderColor: "border-pink-200 dark:border-pink-800/50",
        hoverColor: "hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-800/30 dark:hover:to-pink-700/30",
        badge: { text: "Soon", variant: "secondary" as const }
    },
    {
        href: "#",
        icon: FlaskConical,
        text: "Lab Testing",
        description: "Book diagnostic tests",
        bgColor: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
        iconColor: "text-orange-600 dark:text-orange-400",
        borderColor: "border-orange-200 dark:border-orange-800/50",
        hoverColor: "hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/30 dark:hover:to-orange-700/30",
        badge: null
    },
    {
        href: "#",
        icon: HeartPulse,
        text: "Wellness Plans",
        description: "Personalized health programs",
        bgColor: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
        iconColor: "text-red-600 dark:text-red-400",
        borderColor: "border-red-200 dark:border-red-800/50",
        hoverColor: "hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/30 dark:hover:to-red-700/30",
        badge: { text: "New", variant: "destructive" as const }
    }
];

const quickFeatures = [
    { icon: Clock, text: "24/7 Available" },
    { icon: Shield, text: "HIPAA Compliant" },
    { icon: Sparkles, text: "AI-Powered" }
];

export function SectionList() {
    return (
        <section className="section-padding -mt-20 relative z-30">
            <div className="container-modern">
                {/* Enhanced Main Card */}
                <div className="glass-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-6 border-b border-border/30">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    Complete Healthcare Solutions
                                </h2>
                                <p className="text-muted-foreground">
                                    Everything you need for your health journey, powered by AI
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                {quickFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-background/60 backdrop-blur-sm rounded-full border border-border/30">
                                        <feature.icon className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium text-foreground">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {listItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Link 
                                        key={index} 
                                        href={item.href} 
                                        className="group relative overflow-hidden"
                                    >
                                        <div className={`
                                            relative p-6 rounded-2xl border transition-all duration-300 ease-out
                                            ${item.bgColor} ${item.borderColor} ${item.hoverColor}
                                            card-hover group-hover:shadow-xl group-hover:border-opacity-60
                                            backdrop-blur-sm
                                        `}>
                                            {/* Background Pattern */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
                                            </div>

                                            {/* Badge */}
                                            {item.badge && (
                                                <div className="absolute top-3 right-3">
                                                    <Badge variant={item.badge.variant} className="text-xs px-2 py-1">
                                                        {item.badge.text}
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Icon Container */}
                                            <div className="relative mb-4">
                                                <div className={`
                                                    w-16 h-16 rounded-2xl flex items-center justify-center 
                                                    bg-white/80 dark:bg-background/80 backdrop-blur-sm
                                                    shadow-lg group-hover:shadow-xl transition-all duration-300
                                                    group-hover:scale-110 group-hover:rotate-3
                                                `}>
                                                    <Icon className={`w-8 h-8 ${item.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                                                </div>
                                                
                                                {/* Glow Effect */}
                                                <div className={`
                                                    absolute inset-0 w-16 h-16 rounded-2xl opacity-0 group-hover:opacity-20 
                                                    transition-opacity duration-300 blur-xl ${item.bgColor}
                                                `}></div>
                                            </div>

                                            {/* Content */}
                                            <div className="relative space-y-2">
                                                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                                                    {item.text}
                                                </h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>

                                            {/* Arrow Icon */}
                                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <ArrowRight className="w-4 h-4 text-primary" />
                                                </div>
                                            </div>

                                            {/* Hover Border Effect */}
                                            <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-300"></div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="bg-gradient-to-r from-muted/30 to-muted/10 p-6 border-t border-border/30">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Need Help Choosing?</h4>
                                    <p className="text-sm text-muted-foreground">Our AI can recommend the best option for you</p>
                                </div>
                            </div>
                            <Link 
                                href="/dashboard/consultation"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Ask AI Assistant
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 glass-card rounded-2xl border border-border/30">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="font-bold text-xl text-foreground mb-1">2 min</h4>
                        <p className="text-sm text-muted-foreground">Average response time</p>
                    </div>
                    
                    <div className="text-center p-6 glass-card rounded-2xl border border-border/30">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h4 className="font-bold text-xl text-foreground mb-1">100%</h4>
                        <p className="text-sm text-muted-foreground">HIPAA compliant</p>
                    </div>
                    
                    <div className="text-center p-6 glass-card rounded-2xl border border-border/30">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-bold text-xl text-foreground mb-1">99.9%</h4>
                        <p className="text-sm text-muted-foreground">AI accuracy rate</p>
                    </div>
                </div>
            </div>
        </section>
    );
}