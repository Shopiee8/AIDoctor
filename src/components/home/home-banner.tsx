
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Search, Star, Hospital, Video } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function HomeBanner() {
  const [date, setDate] = useState<Date | undefined>();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dateStr = date ? format(date, 'yyyy-MM-dd') : '';
    router.push(`/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&date=${encodeURIComponent(dateStr)}`);
  };

  return (
    <section className="w-full py-16 md:py-24 lg:py-28 relative overflow-hidden bg-gray-50/50">
       <div className="container px-4 md:px-6 relative z-10 mx-auto">
        <div className="absolute inset-0 z-0 opacity-50">
            <Image
              src="https://placehold.co/1920x1080.png"
              alt="background"
              layout="fill"
              objectFit="cover"
              className="pointer-events-none"
              data-ai-hint="abstract background"
            />
        </div>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <Image width={32} height={32} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://placehold.co/32x32.png" alt="Doctor 1" data-ai-hint="doctor portrait" />
                <Image width={32} height={32} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://placehold.co/32x32.png" alt="Doctor 2" data-ai-hint="doctor portrait" />
                <Image width={32} height={32} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://placehold.co/32x32.png" alt="Doctor 3" data-ai-hint="doctor portrait" />
              </div>
              <div>
                <h6 className="font-semibold text-xs">5K+ Appointments</h6>
                <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-muted-foreground ml-1">5.0 Ratings</span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none font-headline">
              SmartCare Access: Find Your{' '}
              <span className="relative inline-block">
                 <Video className="inline-block h-8 w-8 text-primary" />
              </span>{' '}
              <span className="text-primary">AI Doctors</span> Today
            </h1>
            <div className="rounded-lg bg-card/80 backdrop-blur-sm p-3 shadow-lg border">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center" id="search-form">
                <div className="relative col-span-1 md:col-span-2">
                  <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search doctors, clinics, hospitals, etc"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal h-9 text-xs',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
                 <Button type="submit" size="sm" className="md:hidden h-9 text-xs">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </form>
               <Button type="submit" size="sm" className="w-full mt-2 hidden md:flex h-9 text-xs" form="search-form">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <Image
              src="https://storage.googleapis.com/project-r-assets/1199589/hero-banner-1.png"
              alt="AI Doctor attending to a patient"
              width={500}
              height={600}
              className="rounded-xl object-cover shadow-2xl"
              data-ai-hint="robot doctor"
              priority
            />
            <div className="absolute -bottom-4 -left-4 bg-card p-2 rounded-lg shadow-lg flex items-center gap-2 border">
               <h6 className="text-lg font-bold text-primary">1K</h6>
                <p className="text-xs text-muted-foreground">Appointments<br/>Completed</p>
            </div>
             <div className="absolute -top-4 -right-4 bg-card p-2 rounded-lg shadow-lg flex items-center gap-2 border">
                 <div className="flex -space-x-2">
                    <Image width={24} height={24} className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://placehold.co/24x24.png" alt="Patient 1" data-ai-hint="person portrait" />
                    <Image width={24} height={24} className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://placehold.co/24x24.png" alt="Patient 2" data-ai-hint="person portrait" />
                    <Image width={24} height={24} className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://placehold.co/24x24.png" alt="Patient 3" data-ai-hint="person portrait" />
                 </div>
                <div>
                  <p className="font-semibold text-xs">15K+</p>
                  <p className="text-xs text-muted-foreground">Satisfied Patients</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeBanner;
