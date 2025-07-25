
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
  LogIn,
  UserPlus,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Bot,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/#solution", label: "Our Solution" },
  { href: "/#features", label: "How It Works" },
  { href: "/search", label: "Find a Doctor" },
  { href: "/#faq", label: "FAQs" },
];

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userRole, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getDashboardHref = () => {
    switch (userRole) {
      case 'Patient':
        return '/dashboard';
      case 'Doctor':
        return '/doctor/dashboard';
      case 'Admin':
        return '/admin/dashboard';
      case 'AI Provider':
        return '/ai-provider/dashboard';
      default:
        return '/';
    }
  }

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
              <a href="mailto:info@aidoctor.com" className="flex items-center gap-1.5 hover:text-primary">
                <Mail className="h-3.5 w-3.5" />
                info@aidoctor.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-1.5 hover:text-primary">
                <Phone className="h-3.5 w-3.5" />
                +1 (234) 567-890
              </a>
            </div>
            <div className="flex items-center gap-4">
               <Link href="/ai-provider-register" className="flex items-center gap-1.5 hover:text-primary"><Bot className="h-3.5 w-3.5" /> For AI Providers</Link>
               <Link href="/doctor-register" className="flex items-center gap-1.5 hover:text-primary"><User className="h-3.5 w-3.5" /> For Doctors</Link>
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
              {user ? (
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={user.photoURL || undefined} />
                         <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
                       </Avatar>
                       {user.displayName || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardHref()}><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild variant="outline">
                      <Link href="/login"><LogIn className="mr-2 h-4 w-4" />Login</Link>
                  </Button>
                  <Button asChild>
                      <Link href="/register"><UserPlus className="mr-2 h-4 w-4" />Sign Up</Link>
                  </Button>
                </>
              )}
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
                     {user ? (
                       <>
                         <Button asChild>
                           <Link href={getDashboardHref()}>Dashboard</Link>
                         </Button>
                         <Button asChild variant="outline" onClick={signOut}>
                           <p>Logout</p>
                         </Button>
                       </>
                     ) : (
                       <>
                         <Button asChild>
                           <Link href="/login">Login</Link>
                         </Button>
                         <Button asChild variant="outline">
                           <Link href="/register">Sign Up</Link>
                         </Button>
                       </>
                     )}
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
