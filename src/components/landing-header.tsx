"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Stethoscope,
  Mail,
  Phone,
  Search,
  Lock,
  User,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.5 12c0-2.3-1.4-5-4.5-5C5.1 7 3 9.4 3 12.3c0 2.2 1.3 3.9 3.2 3.9 1 0 1.8-.7 1.8-1.5 0-.9-.5-1.9-1-2.9-1-1.8.2-4.1 2.5-4.1 2.8 0 4.1 2 4.1 4.7 0 2.8-1.5 5.2-3.7 5.2-1.3 0-2.4-1.2-2.1-2.6.4-2 1.3-4 1.3-5.3 0-1.2-2-1-2-1-1.3 0-2.5 1.2-2.5 3.3 0 2.1 1.7 4.1 1.7 4.1l-1.4 6c-.3 1.1 1 2.3 2 1.5l7.3-4.1c1.3-.8 2.3-2.6 2.3-4.2.1-2.8-1.6-5.1-4.6-5.1-3.7 0-6.1 2.5-6.1 5.8 0 1.3.5 2.5 1.2 3.2" />
    </svg>
);


const navLinks = [
  { href: "#problem", label: "The Problem" },
  { href: "#solution", label: "The Solution" },
  { href: "#features", label: "How It Works" },
];

export function LandingHeader() {
  const [searchField, setSearchField] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      setIsScrolled(scrollPosition > scrollThreshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSearch = () => {
    setSearchField(!searchField);
  };

  return (
    <header
      className={cn(
        "bg-background/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300",
        isScrolled && "shadow-md"
      )}
    >
      <div className="border-b hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <a href="mailto:info@example.com" className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-3 w-3" />
                info@example.com
              </a>
              <a href="tel:+16658914556" className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-3 w-3" />
                +1 66589 14556
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                 <Link href="#" className="hover:text-primary"><Facebook className="h-4 w-4" /></Link>
                 <Link href="#" className="hover:text-primary"><Twitter className="h-4 w-4" /></Link>
                 <Link href="#" className="hover:text-primary"><Instagram className="h-4 w-4" /></Link>
                 <Link href="#" className="hover:text-primary"><Linkedin className="h-4 w-4" /></Link>
                 <Link href="#" className="hover:text-primary"><PinterestIcon className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center justify-center"
            prefetch={false}
          >
            <Stethoscope className="h-7 w-7 text-primary" />
            <span className="ml-2 text-xl font-bold font-headline">AIDoctor</span>
          </Link>
          <nav className="ml-auto hidden gap-4 sm:gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors"
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleSearch}>
                <Search className="h-4 w-4" />
              </Button>
               {searchField && (
                  <form action="/search">
                    <div className="relative">
                      <Input type="text" placeholder="Search..." className="pr-10 h-9" />
                       <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-9 w-9">
                         <Search className="h-4 w-4" />
                       </Button>
                    </div>
                  </form>
                )}
              <Button asChild variant="default" size="sm" className="rounded-full">
                <Link href="/login"><Lock className="mr-2 h-4 w-4" />Login</Link>
              </Button>
              <Button asChild variant="secondary" size="sm" className="rounded-full bg-slate-800 text-white hover:bg-slate-700">
                <Link href="/register"><User className="mr-2 h-4 w-4" />Register</Link>
              </Button>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 p-4">
                  <Link
                    href="/"
                    className="flex items-center justify-center mb-4"
                    prefetch={false}
                  >
                    <Stethoscope className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-lg font-semibold font-headline">
                      AIDoctor
                    </span>
                  </Link>
                  <nav className="grid gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-base font-medium hover:underline underline-offset-4"
                        prefetch={false}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-2 mt-4">
                     <Button asChild size="sm">
                       <Link href="/login">Log In</Link>
                     </Button>
                     <Button asChild variant="outline" size="sm">
                       <Link href="/register">Register</Link>
                     </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
