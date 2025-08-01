"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
    id: string;
    name: string;
    description?: string;
    link?: string;
    isActive?: boolean;
    order?: number;
}

// Fallback services in case Firestore is empty
const fallbackServices: Service[] = [
    { id: "1", name: "Multi Speciality Treatments & Doctors", link: "/search", isActive: true },
    { id: "2", name: "Lab Testing Services", link: "/dashboard/pharmacy", isActive: true },
    { id: "3", name: "Medicines & Supplies", link: "/dashboard/pharmacy", isActive: true },
    { id: "4", name: "Hospitals & Clinics", link: "/search", isActive: true },
    { id: "5", name: "Health Care Services", link: "/dashboard", isActive: true },
    { id: "6", name: "Talk to Doctors", link: "/dashboard/consultation", isActive: true },
    { id: "7", name: "Home Care Services", link: "/dashboard", isActive: true },
    { id: "8", name: "AI Health Assistant", link: "/dashboard/consultation", isActive: true },
    { id: "9", name: "24/7 Medical Support", link: "/dashboard", isActive: true },
    { id: "10", name: "Prescription Management", link: "/dashboard/pharmacy", isActive: true },
];

export function SectionService() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const servicesRef = collection(db, 'services');
                const servicesQuery = query(servicesRef, orderBy('order', 'asc'));
                const servicesSnapshot = await getDocs(servicesQuery);
                const fetchedServices: Service[] = [];
                
                servicesSnapshot.forEach((doc) => {
                    const serviceData = { id: doc.id, ...doc.data() } as Service;
                    if (serviceData.isActive !== false) { // Include if isActive is true or undefined
                        fetchedServices.push(serviceData);
                    }
                });

                // Use fetched data or fallback
                setServices(fetchedServices.length > 0 ? fetchedServices : fallbackServices);

            } catch (error) {
                console.error("Error fetching services: ", error);
                // Use fallback data on error
                setServices(fallbackServices);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();

        // Set up real-time listener for live updates
        const servicesRef = collection(db, 'services');
        const servicesQuery = query(servicesRef, orderBy('order', 'asc'));
        const unsubscribe = onSnapshot(servicesQuery, (snapshot) => {
            const updatedServices: Service[] = [];
            snapshot.forEach((doc) => {
                const serviceData = { id: doc.id, ...doc.data() } as Service;
                if (serviceData.isActive !== false) {
                    updatedServices.push(serviceData);
                }
            });
            if (updatedServices.length > 0) {
                setServices(updatedServices);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <section className="py-6 bg-background overflow-hidden">
                <div className="relative flex marquee">
                    <div className="marquee-group flex-shrink-0 flex items-center justify-around min-w-full gap-6">
                        {[...Array(7)].map((_, index) => (
                            <Skeleton key={index} className="h-6 w-48" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-6 bg-background overflow-hidden">
                <div className="relative flex marquee">
                    <div className="marquee-group flex-shrink-0 flex items-center justify-around min-w-full gap-6">
                        {services.map((service) => (
                            <h6 key={service.id} className="text-lg font-semibold whitespace-nowrap">
                                <Link 
                                    href={service.link || "#"} 
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    title={service.description}
                                >
                                    {service.name}
                                </Link>
                            </h6>
                        ))}
                    </div>
                    <div aria-hidden="true" className="marquee-group flex-shrink-0 flex items-center justify-around min-w-full gap-6">
                        {services.map((service) => (
                            <h6 key={`duplicate-${service.id}`} className="text-lg font-semibold whitespace-nowrap">
                                <Link 
                                    href={service.link || "#"} 
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    title={service.description}
                                >
                                    {service.name}
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