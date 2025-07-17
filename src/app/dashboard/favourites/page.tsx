'use client';

import { usePatientDataStore } from '@/store/patient-data-store';
import { DoctorCard } from '@/components/doctor-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FavouritesPage() {
    const { favorites, isLoading } = usePatientDataStore();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">My Favorite Doctors</h1>
                    <p className="text-muted-foreground">Manage your preferred AI and human specialists.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search favorites..." className="pl-9" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    [...Array(4)].map((_, i) => <Skeleton key={i} className="h-96" />)
                ) : favorites.length > 0 ? (
                    favorites.map((doctor, index) => (
                        <DoctorCard key={index} doctor={doctor} />
                    ))
                ) : (
                     <div className="col-span-full text-center py-16">
                        <p className="text-muted-foreground">You haven't added any favorite doctors yet.</p>
                    </div>
                )}
            </div>

            {favorites.length > 0 && (
                 <div className="text-center">
                    <Button variant="outline">Load More</Button>
                </div>
            )}
        </div>
    );
}
