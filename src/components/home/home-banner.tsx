
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Search, Star, Bot, User, MessageSquarePlus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';

export function HomeBanner() {
  const [date, setDate] = useState<Date | undefined>();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (location) params.set('location', location);
    if (date) params.set('date', format(date, 'yyyy-MM-dd'));
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="w-full py-12 md:py-20 lg:py-24 relative overflow-hidden bg-background">
       <div className="absolute inset-0 z-0 opacity-5">
            <Image
              src="https://placehold.co/1920x1080.png"
              alt="abstract background"
              fill
              className="object-cover pointer-events-none"
              priority
              data-ai-hint="abstract medical background"
            />
        </div>
        <div className="container px-4 md:px-6 relative z-10 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <Image width={24} height={24} className="inline-block h-6 w-6 rounded-full ring-2 ring-card" src="https://placehold.co/24x24.png" alt="Doctor 1" data-ai-hint="doctor portrait" />
                <Image width={24} height={24} className="inline-block h-6 w-6 rounded-full ring-2 ring-card" src="https://placehold.co/24x24.png" alt="Doctor 2" data-ai-hint="doctor portrait" />
                <Image width={24} height={24} className="inline-block h-6 w-6 rounded-full ring-2 ring-card" src="https://placehold.co/24x24.png" alt="Doctor 3" data-ai-hint="doctor portrait" />
              </div>
              <div>
                <h6 className="font-semibold text-xs">Trusted by 5K+ Patients</h6>
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none font-headline">
              Intelligent healthcare, instantly.
              Talk to our <span className="text-primary">AI Doctor</span> now.
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Get immediate answers to your health questions, or connect with a human specialist. Your health, your choice.
            </p>
            
             <div className="rounded-lg bg-card/80 backdrop-blur-sm p-4 shadow-lg border mt-4">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center" id="search-form">
                <div className="relative col-span-1 md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search specialists, clinics..."
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
                 <Button type="submit" className="md:hidden h-10 text-sm">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </form>
               <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                 <Button className="w-full h-10 text-sm" asChild>
                    <Link href="/dashboard/consultation"><MessageSquarePlus className="mr-2 h-4 w-4" /> Start AI Consultation</Link>
                 </Button>
                 <Button type="submit" className="w-full h-10 text-sm" form="search-form" variant="secondary">
                  <Search className="mr-2 h-4 w-4" /> Search Human Doctor
                 </Button>
               </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <Image
              src="/assets/img/ai doctor.png"
              alt="AI Doctor attending to a patient"
              width={500}
              height={600}
              className="rounded-xl object-cover shadow-2xl animate-float h-auto"
              priority
              data-ai-hint="futuristic doctor"
            />
            <div className="absolute -bottom-4 -left-4 bg-card p-3 rounded-lg shadow-lg flex items-center gap-3 border animate-float" style={{ animationDelay: '0.2s', animationDuration: '7s' }}>
               <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="h-6 w-6 text-primary"/>
               </div>
               <div>
                 <h6 className="text-lg font-bold text-primary">10K+</h6>
                  <p className="text-xs text-muted-foreground">AI Consults Monthly</p>
               </div>
            </div>
             <div className="absolute -top-4 -right-4 bg-card p-3 rounded-lg shadow-lg flex items-center gap-3 border animate-float" style={{ animationDelay: '0.4s', animationDuration: '8s' }}>
                 <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-6 w-6 text-primary"/>
                 </div>
                <div>
                  <p className="font-semibold text-lg text-primary">500+</p>
                  <p className="text-xs text-muted-foreground">Human Specialists</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
