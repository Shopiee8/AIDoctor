
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Send, Stethoscope } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
    const footerLinks = {
        "For Patients": [
            { href: "#", text: "Find an AI Doctor" },
            { href: "#", text: "Find a Human Doctor" },
            { href: "#", text: "Book Appointment" },
            { href: "#", text: "Patient Dashboard" },
            { href: "/#faq", text: "Patient FAQs" },
        ],
        "For Doctors": [
            { href: "#", text: "Join as a Doctor" },
            { href: "#", text: "Doctor Dashboard" },
            { href: "#", text: "AI Collaboration" },
            { href: "#", text: "Our Technology" },
            { href: "#", text: "Doctor FAQs" },
        ],
        "Company": [
            { href: "/about-us", text: "About Us" },
            { href: "#", text: "Our Mission" },
            { href: "#", text: "Careers" },
            { href: "/blog", text: "Blog" },
            { href: "/contact", text: "Contact Us" },
        ],
    };

    const socialLinks = [
        { name: "facebook", href: "#", icon: <Facebook className="h-4 w-4" /> },
        { name: "twitter", href: "#", icon: <Twitter className="h-4 w-4" /> },
        { name: "instagram", href: "#", icon: <Instagram className="h-4 w-4" /> },
        { name: "linkedin", href: "#", icon: <Linkedin className="h-4 w-4" /> },
    ];


    return (
        <footer className="bg-card border-t">
            <div className="container mx-auto px-4">
                <div className="py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-3">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <Stethoscope className="w-8 h-8 text-primary" />
                                <span className="text-2xl font-bold font-headline">AIDoctor</span>
                            </Link>
                            <p className="text-sm text-muted-foreground mb-4">
                                The future of healthcare, combining AI efficiency with human expertise.
                            </p>
                             <div className="flex space-x-3">
                                {socialLinks.map((social) => (
                                    <Link key={social.name} href={social.href} className="text-muted-foreground hover:text-primary transition-colors">
                                       {social.icon}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                {Object.entries(footerLinks).map(([title, links]) => (
                                    <div key={title}>
                                        <h6 className="font-headline font-semibold text-base mb-4">{title}</h6>
                                        <ul className="space-y-3">
                                            {links.map((link) => (
                                                <li key={link.text}>
                                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                                        {link.text}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-3">
                            <h6 className="font-headline font-semibold text-base mb-4">Newsletter</h6>
                            <p className="text-sm text-muted-foreground mb-4">
                                Subscribe to get the latest updates on AI healthcare.
                            </p>
                            <form className="flex gap-2">
                                <Input type="email" placeholder="Your Email" className="flex-1 h-10 text-sm bg-background" />
                                <Button type="submit" size="default">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="border-t py-6 flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-xs text-muted-foreground mb-4 sm:mb-0">
                        Copyright © {new Date().getFullYear()} AIDoctor. All Rights Reserved.
                    </p>
                     <div className="flex items-center gap-4">
                        <Link href="#" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</Link>
                        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
