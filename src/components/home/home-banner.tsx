
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
    <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden bg-gray-50/50">
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
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <Image width={40} height={40} className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://placehold.co/40x40.png" alt="Doctor 1" data-ai-hint="doctor portrait" />
                <Image width={40} height={40} className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://placehold.co/40x40.png" alt="Doctor 2" data-ai-hint="doctor portrait" />
                <Image width={40} height={40} className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://placehold.co/40x40.png" alt="Doctor 3" data-ai-hint="doctor portrait" />
              </div>
              <div>
                <h6 className="font-semibold text-sm">5K+ Appointments</h6>
                <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-muted-foreground ml-1">5.0 Ratings</span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none font-headline">
              SmartCare Access: Find Your{' '}
              <span className="relative inline-block">
                 <Video className="inline-block h-10 w-10 text-primary" />
              </span>{' '}
              <span className="text-primary">AI Doctors</span> Today
            </h1>
            <div className="rounded-lg bg-card p-3 shadow-lg">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center" id="search-form">
                <div className="relative col-span-1 md:col-span-2">
                  <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search doctors, clinics, hospitals, etc"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 h-10 text-sm"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-9 h-10 text-sm"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal h-10 text-sm',
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
                 <Button type="submit" size="sm" className="md:hidden">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </form>
               <Button type="submit" size="sm" className="w-full mt-2 hidden md:flex" form="search-form">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <Image
              src="https://placehold.co/500x600.png"
              alt="Doctor Banner"
              width={500}
              height={600}
              className="rounded-xl object-cover"
              data-ai-hint="doctor virtual"
            />
            <div className="absolute -bottom-6 -left-6 bg-card p-3 rounded-lg shadow-lg flex items-center gap-3">
               <h6 className="text-xl font-bold text-primary">1K</h6>
                <p className="text-xs text-muted-foreground">Appointments<br/>Completed</p>
            </div>
             <div className="absolute -top-6 -right-6 bg-card p-3 rounded-lg shadow-lg flex items-center gap-3">
                 <div className="flex -space-x-2">
                    <Image width={28} height={28} className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src="https://placehold.co/28x28.png" alt="Patient 1" data-ai-hint="person portrait" />
                    <Image width={28} height={28} className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src="https://placehold.co/28x28.png" alt="Patient 2" data-ai-hint="person portrait" />
                    <Image width={28} height={28} className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src="https://placehold.co/28x28.png" alt="Patient 3" data-ai-hint="person portrait" />
                 </div>
                <div>
                  <p className="font-semibold text-sm">15K+</p>
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
