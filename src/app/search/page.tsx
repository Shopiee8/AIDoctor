
'use client';

import React from 'react';
import { LandingHeader } from "@/components/landing-header";
import { Footer } from "@/components/home/footer";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, MapPin, Search } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';


function SearchBar() {
  const router = useRouter();
  const [date, setDate] = React.useState<Date | undefined>();
  const [query, setQuery] = React.useState('');
  const [location, setLocation] = React.useState('');
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (location) params.set('location', location);
    if (date) params.set('date', format(date, 'yyyy-MM-dd'));
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-primary/5 rounded-lg">
        <form onSubmit={handleSearch}>
            <div className="grid md:grid-cols-4 items-center gap-1 p-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search Doctors, Clinics..."
                        className="pl-9 h-12 bg-background border-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Location"
                        className="pl-9 h-12 bg-background border-none"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div className="relative">
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal h-12 bg-background border-none',
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
                </div>
                <div className="form-search-btn">
                    <Button
                        className="w-full h-12 d-inline-flex align-items-center"
                        type="submit"
                    >
                        <Search className="h-4 w-4 me-2" />
                        Search
                    </Button>
                </div>
            </div>
        </form>
    </div>
  )
}


export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1">
        {/* Breadcrumb and Search Bar Section */}
        <div className="relative py-12 bg-muted/30">
            <div className="absolute inset-0 z-0 opacity-5">
              <Image
                  src="https://placehold.co/1920x300.png"
                  alt="abstract background"
                  fill
                  className="object-cover"
                  data-ai-hint="abstract medical background"
              />
            </div>
           <div className="container relative z-10">
                <div className="text-center mb-6">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-center bg-transparent p-0 m-0 text-sm">
                            <li className="breadcrumb-item"><Link href="/" className="text-muted-foreground">Home</Link></li>
                            <li className="breadcrumb-item text-primary" aria-current="page">Search Doctors</li>
                        </ol>
                    </nav>
                    <h2 className="text-3xl font-bold font-headline mt-2">Find Your Doctor</h2>
                </div>
                <SearchBar />
           </div>
        </div>
        
        {/* Main Content */}
        <div className="py-8">
            <div className="container mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 xl:col-span-3">
                    <SearchFilters />
                </div>
                <div className="lg:col-span-8 xl:col-span-9">
                    <Suspense fallback={<div>Loading results...</div>}>
                        <SearchResults />
                    </Suspense>
                </div>
            </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
