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
    <section className="w-full py-20 md:py-32 lg:py-40 relative overflow-hidden bg-gray-50/50">
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
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                <Image className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://placehold.co/48x48.png" alt="Doctor 1" data-ai-hint="doctor portrait" />
                <Image className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://placehold.co/48x48.png" alt="Doctor 2" data-ai-hint="doctor portrait" />
                <Image className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://placehold.co/48x48.png" alt="Doctor 3" data-ai-hint="doctor portrait" />
              </div>
              <div>
                <h6 className="font-semibold">5K+ Appointments</h6>
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-muted-foreground ml-1">5.0 Ratings</span>
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
              SmartCare Access: Find Your{' '}
              <span className="relative inline-block">
                 <Video className="inline-block h-12 w-12 text-primary" />
              </span>{' '}
              <span className="text-primary">AI Doctors</span> Today
            </h1>
            <div className="rounded-lg bg-card p-4 shadow-lg">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                <div className="relative col-span-1 md:col-span-2">
                  <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search doctors, clinics, hospitals, etc"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
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
                 <Button type="submit" className="md:hidden">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </form>
               <Button type="submit" className="w-full mt-2 hidden md:flex" form="search-form" onClick={(e) => handleSearch(e as any)}>
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <Image
              src="https://placehold.co/600x700.png"
              alt="Doctor Banner"
              width={600}
              height={700}
              className="rounded-xl object-cover"
              data-ai-hint="doctor virtual"
            />
            <div className="absolute -bottom-8 -left-8 bg-card p-4 rounded-lg shadow-lg flex items-center gap-3">
               <h6 className="text-2xl font-bold text-primary">1K</h6>
                <p className="text-sm text-muted-foreground">Appointments<br/>Completed</p>
            </div>
             <div className="absolute -top-8 -right-8 bg-card p-4 rounded-lg shadow-lg flex items-center gap-3">
                 <div className="flex -space-x-2">
                    <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://placehold.co/32x32.png" alt="Patient 1" data-ai-hint="person portrait" />
                    <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://placehold.co/32x32.png" alt="Patient 2" data-ai-hint="person portrait" />
                    <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://placehold.co/32x32.png" alt="Patient 3" data-ai-hint="person portrait" />
                 </div>
                <div>
                  <p className="font-semibold">15K+</p>
                  <p className="text-sm text-muted-foreground">Satisfied Patients</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeBanner;
