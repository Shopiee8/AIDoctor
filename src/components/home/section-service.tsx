"use client"

import Link from "next/link";

const services = [
    "Multi Speciality Treatments & Doctors",
    "Lab Testing Services",
    "Medecines & Supplies",
    "Hospitals & Clinics",
    "Health Care Services",
    "Talk to Doctors",
    "Home Care Services"
];

export function SectionService() {
    return (
        <>
            <section className="py-6 bg-background overflow-hidden">
                <div className="relative flex marquee">
                    <div className="marquee-group flex-shrink-0 flex items-center justify-around min-w-full gap-6">
                        {services.map((service, index) => (
                            <h6 key={index} className="text-lg font-semibold whitespace-nowrap">
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    {service}
                                </Link>
                            </h6>
                        ))}
                    </div>
                     <div aria-hidden="true" className="marquee-group flex-shrink-0 flex items-center justify-around min-w-full gap-6">
                        {services.map((service, index) => (
                            <h6 key={index} className="text-lg font-semibold whitespace-nowrap">
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    {service}
                                </Link>
                            </h6>
                        ))}
                    </div>
                </div>
            </section>
            <style jsx>{`
                .marquee {
                    -webkit-mask-image: linear-gradient(to right, hsl(0 0% 0% / 0), hsl(0 0% 0% / 1) 10%, hsl(0 0% 0% / 1) 90%, hsl(0 0% 0% / 0));
                }
                .marquee-group {
                    animation: marquee 30s linear infinite;
                }
                @keyframes marquee {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-100%);
                    }
                }
            `}</style>
        </>
    );
}
