
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Search } from 'lucide-react';

export function BookAppointmentWidget() {
    return (
        <div className="px-4 lg:px-6">
            <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold font-headline text-primary">Find Your Doctor</h3>
                        <p className="text-muted-foreground mt-1">
                            Search for AI or human specialists and book an appointment today.
                        </p>
                    </div>
                    <Button asChild size="lg" className="w-full md:w-auto flex-shrink-0">
                        <Link href="/search">
                            <Search className="mr-2 h-5 w-5" />
                            Book an Appointment
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
