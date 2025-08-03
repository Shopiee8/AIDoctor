"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Search, 
  Star, 
  Bot, 
  User, 
  MessageSquarePlus, 
  Sparkles,
  Shield,
  Clock,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

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

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Patients", color: "text-blue-600" },
    { icon: Bot, value: "10K+", label: "AI Consultations", color: "text-purple-600" },
    { icon: User, value: "500+", label: "Expert Doctors", color: "text-teal-600" },
    { icon: Award, value: "99.9%", label: "Accuracy Rate", color: "text-green-600" }
  ];

  const features = [
    { icon: Shield, text: "HIPAA Compliant & Secure" },
    { icon: Clock, text: "24/7 Instant Responses" },
    { icon: CheckCircle, text: "Clinically Validated AI" }
  ];

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Enhanced Background with Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10"></div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full"></div>
      </div>

      {/* Abstract Medical Background */}
      <div className="absolute inset-0 z-0 opacity-5">
        <Image
          src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="abstract medical background"
          fill
          className="object-cover pointer-events-none"
          priority
        />
      </div>

      <div className="container-modern relative z-10 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content - Enhanced */}
          <div className="flex flex-col justify-center space-y-8 animate-slide-in-left">
            {/* Trust Indicators - Smaller */}
            <div className="flex items-center gap-3 p-2.5 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-md w-fit">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="relative">
                    <Image 
                      width={32} 
                      height={32}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-background shadow" 
                      src={`https://images.unsplash.com/photo-${1559757148 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&q=80`}
                      alt={`Doctor ${i}`}
                    />
                  </div>
                ))}
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white text-xs font-bold ring-2 ring-background shadow">
                  +5K
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-medium">5.0</span>
              </div>
              <Badge variant="secondary" className="h-6 text-xs px-1.5 py-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0">
                <TrendingUp className="h-2.5 w-2.5 mr-1" />
                Growing Fast
              </Badge>
            </div>

            {/* Main Headline - Enhanced */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary animate-pulse-soft" />
                <span className="text-sm font-medium text-primary">Next-Generation Healthcare AI</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight leading-tight">
                <span className="block">Intelligent</span>
                <span className="relative inline-block">
                  <span className="text-gradient">healthcare</span>
                  <span className="text-foreground">, </span>
                  <span className="text-gradient">instantly</span>
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"></div>
                </span>
              </h1>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold tracking-tight leading-tight text-foreground/90">
                Talk to our{" "}
                <span className="relative inline-block">
                  <span className="text-gradient">AI Doctor</span>
                  <div className="absolute -top-1 -right-3">
                    <div className="w-3 h-3 bg-primary rounded-full animate-ping"></div>
                    <div className="absolute top-0 w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                </span>{" "}
                <span className="text-foreground/80">now</span>.
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Get immediate, confidential, and intelligent answers to your health questions. 
                Connect with our AI or human specialists. Your health, your choice.
              </p>
            </div>

            {/* Feature Highlights - Compact Side by Side */}
            <div className="grid grid-cols-3 gap-2 max-w-2xl">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-card/60 backdrop-blur-sm rounded-lg border border-border/30">
                  <feature.icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span className="text-xs font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Enhanced Search Form */}
            <div className="glass-card rounded-2xl p-6 shadow-2xl border border-border/50">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Start Your Health Journey</h3>
                <p className="text-sm text-muted-foreground">AI-powered search to find the perfect healthcare solution</p>
              </div>
              
              <form onSubmit={handleSearch} className="space-y-4" id="search-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10" />
                    <Input
                      type="text"
                      placeholder="Describe your symptoms or condition..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-12 h-14 text-base bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                    <Input
                      type="text"
                      placeholder="Your location (optional)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-12 h-14 text-base bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          type="submit" 
                          className="flex-1 h-14 text-base btn-modern shadow-lg hover:shadow-xl"
                          form="search-form"
                        >
                          <Search className="mr-2 h-5 w-5" /> 
                          AI-Powered Search
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-center text-sm">
                          Our AI analyzes your symptoms and finds the best healthcare providers based on expertise, experience, and patient reviews.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button asChild variant="outline" className="h-14 px-6 hover:bg-primary/10 border-primary/30">
                    <Link href="/dashboard/consultation">
                      <MessageSquarePlus className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Content - Enhanced */}
          <div className="relative hidden lg:block animate-slide-in-right">
            <div className="relative">
              {/* Main Image with Enhanced Styling */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/assets/img/ai doctor.png"
                  alt="AI Doctor attending to a patient"
                  width={600}
                  height={700}
                  className="object-cover animate-float h-auto"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating Stats Cards - Enhanced */}
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={cn(
                    "absolute glass-card p-4 rounded-2xl shadow-xl border border-border/50 animate-float",
                    index === 0 && "-bottom-6 -left-6",
                    index === 1 && "-top-6 -right-6",
                    index === 2 && "top-1/2 -left-8",
                    index === 3 && "bottom-1/4 -right-8"
                  )}
                  style={{ 
                    animationDelay: `${index * 0.2}s`, 
                    animationDuration: `${6 + index}s` 
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-xl", 
                      index === 0 && "bg-blue-100 dark:bg-blue-900/30",
                      index === 1 && "bg-purple-100 dark:bg-purple-900/30",
                      index === 2 && "bg-teal-100 dark:bg-teal-900/30",
                      index === 3 && "bg-green-100 dark:bg-green-900/30"
                    )}>
                      <stat.icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                    <div>
                      <h6 className="text-2xl font-bold text-foreground">{stat.value}</h6>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse-soft"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar - Enhanced */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center lg:hidden">
                <div className="flex justify-center mb-2">
                  <div className={cn("p-3 rounded-xl",
                    index === 0 && "bg-blue-100 dark:bg-blue-900/30",
                    index === 1 && "bg-purple-100 dark:bg-purple-900/30",
                    index === 2 && "bg-teal-100 dark:bg-teal-900/30",
                    index === 3 && "bg-green-100 dark:bg-green-900/30"
                  )}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
                <h6 className="text-2xl font-bold text-foreground">{stat.value}</h6>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}