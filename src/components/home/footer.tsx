
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import Image from 'next/image';

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.5 12c0-2.3-1.4-5-4.5-5C5.1 7 3 9.4 3 12.3c0 2.2 1.3 3.9 3.2 3.9 1 0 1.8-.7 1.8-1.5 0-.9-.5-1.9-1-2.9-1-1.8.2-4.1 2.5-4.1 2.8 0 4.1 2 4.1 4.7 0 2.8-1.5 5.2-3.7 5.2-1.3 0-2.4-1.2-2.1-2.6.4-2 1.3-4 1.3-5.3 0-1.2-2-1-2-1-1.3 0-2.5 1.2-2.5 3.3 0 2.1 1.7 4.1 1.7 4.1l-1.4 6c-.3 1.1 1 2.3 2 1.5l7.3-4.1c1.3-.8 2.3-2.6 2.3-4.2.1-2.8-1.6-5.1-4.6-5.1-3.7 0-6.1 2.5-6.1 5.8 0 1.3.5 2.5 1.2 3.2" />
    </svg>
);


export function Footer() {
    const footerLinks = {
        Company: [
            { href: "/about-us", text: "About" },
            { href: "/features", text: "Features" },
            { href: "#", text: "Works" },
            { href: "#", text: "Careers" },
            { href: "#", text: "Locations" },
        ],
        Treatments: [
            { href: "/search", text: "Dental" },
            { href: "/search", text: "Cardiac" },
            { href: "/search", text: "Spinal Cord" },
            { href: "/search", text: "Hair Growth" },
            { href: "/search", text: "Anemia & Disorder" },
        ],
        Specialities: [
            { href: "/search", text: "Transplant" },
            { href: "/search", text: "Cardiologist" },
            { href: "/search", text: "Oncology" },
            { href: "/search", text: "Pediatrics" },
            { href: "/search", text: "Gynacology" },
        ],
        Utilities: [
            { href: "/pricing", text: "Pricing" },
            { href: "/contact", text: "Contact" },
            { href: "/contact", text: "Request A Quote" },
            { href: "#", text: "Premium Membership" },
            { href: "#", text: "Integrations" },
        ],
    };

    const socialLinks = [
        { name: "facebook", href: "#", icon: <Facebook className="h-4 w-4" /> },
        { name: "twitter", href: "#", icon: <Twitter className="h-4 w-4" /> },
        { name: "instagram", href: "#", icon: <Instagram className="h-4 w-4" /> },
        { name: "linkedin", href: "#", icon: <Linkedin className="h-4 w-4" /> },
        { name: "pinterest", href: "#", icon: <PinterestIcon className="h-4 w-4" /> },
    ];

    const paymentMethods = [
        { src: "https://placehold.co/32x20.png", alt: "Visa" },
        { src: "https://placehold.co/32x20.png", alt: "Mastercard" },
        { src: "https://placehold.co/32x20.png", alt: "American Express" },
        { src: "https://placehold.co/32x20.png", alt: "Discover" },
        { src: "https://placehold.co/32x20.png", alt: "PayPal" },
        { src: "https://placehold.co/32x20.png", alt: "Stripe" },
    ];

    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-4">
                <div className="py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {Object.entries(footerLinks).map(([title, links]) => (
                                    <div key={title}>
                                        <h6 className="font-headline font-semibold text-base mb-3">{title}</h6>
                                        <ul className="space-y-2">
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
                        <div className="lg:col-span-4">
                            <h6 className="font-headline font-semibold text-base mb-3">Newsletter</h6>
                            <p className="text-sm text-muted-foreground mb-3">
                                Subscribe & Stay Updated from the AIDoctor
                            </p>
                            <form className="flex gap-2 mb-5">
                                <Input type="email" placeholder="Enter Email Address" className="flex-1 h-9 text-sm" />
                                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
                                    <Send className="h-3.5 w-3.5 mr-2" />
                                    Send
                                </Button>
                            </form>
                            <div>
                                <h6 className="font-headline font-semibold text-base mb-3">Connect With Us</h6>
                                <div className="flex space-x-3">
                                    {socialLinks.map((social) => (
                                        <Link key={social.name} href={social.href} className="text-muted-foreground hover:text-primary transition-colors">
                                           {social.icon}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t py-5 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-xs text-muted-foreground mb-4 md:mb-0">
                        Copyright © {new Date().getFullYear()} AIDoctor. All Rights Reserved
                    </p>
                    <div className="flex items-center gap-5">
                         <div className="flex items-center gap-4">
                            <Link href="#" className="text-xs text-muted-foreground hover:text-primary">Legal Notice</Link>
                            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</Link>
                            <Link href="#" className="text-xs text-muted-foreground hover:text-primary">Refund Policy</Link>
                        </div>
                        <div className="flex items-center gap-2">
                            {paymentMethods.map((method) => (
                                <Image key={method.alt} src={method.src} alt={method.alt} width={32} height={20} data-ai-hint="payment card" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
