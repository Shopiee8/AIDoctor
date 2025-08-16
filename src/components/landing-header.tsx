"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
  Settings,
  Sparkles,
  Shield,
  Clock,
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
import { Badge } from "@/components/ui/badge";

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
        return '/dashboard';
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
        "bg-background/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-500 border-b border-border/50",
        isScrolled && "shadow-lg bg-background/95 backdrop-blur-3xl border-border"
      )}
    >
      {/* Top Bar - Enhanced with modern styling */}
      <div className="border-b border-border/30 hidden md:block bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container-modern">
          <div className="flex justify-between items-center py-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-6">
              <a 
                href="mailto:info@aidoctor.com" 
                className="flex items-center gap-2 hover:text-primary transition-colors duration-300 group"
              >
                <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Mail className="h-3 w-3" />
                </div>
                <span className="font-medium">info@aidoctor.com</span>
              </a>
              <a 
                href="tel:+1234567890" 
                className="flex items-center gap-2 hover:text-primary transition-colors duration-300 group"
              >
                <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Phone className="h-3 w-3" />
                </div>
                <span className="font-medium">+1 (234) 567-890</span>
              </a>
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-3 w-3" />
                <span className="font-medium">24/7 Available</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                href="/ai-provider-register" 
                className="flex items-center gap-2 hover:text-primary transition-colors duration-300 group"
              >
                <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors duration-300">
                  <Bot className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium">For AI Providers</span>
                <Badge variant="secondary" className="text-xs px-2 py-0.5">New</Badge>
              </Link>
              <Link 
                href="/doctor-register" 
                className="flex items-center gap-2 hover:text-primary transition-colors duration-300 group"
              >
                <div className="p-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors duration-300">
                  <User className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                </div>
                <span className="font-medium">For Doctors</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Enhanced with modern design */}
      <div className="container-modern">
        <div className="h-20 flex items-center justify-between">
          {/* Logo - Enhanced with modern styling */}
          <Link
            href="/"
            className="flex items-center justify-center group transition-transform duration-300 hover:scale-105"
            prefetch={false}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative p-2 bg-gradient-primary rounded-xl shadow-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <span className="text-2xl font-bold font-headline text-gradient">Not Too Late AI</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground font-medium">Trusted Healthcare AI</span>
              </div>
            </div>
          </Link>

          {/* Navigation - Enhanced with modern styling */}
          <nav className="ml-auto hidden gap-8 lg:flex">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300 group py-2"
                prefetch={false}
              >
                <span className="relative z-10">{link.label}</span>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="absolute inset-0 bg-primary/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* Action Buttons - Enhanced with modern styling */}
          <div className="ml-8 flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 h-12 px-4 hover:bg-primary/10 transition-all duration-300 group">
                      <Avatar className="h-9 w-9 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                        <AvatarImage src={user.photoURL || undefined} />
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                          {user.displayName?.[0] || user.email?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="font-medium text-sm">{user.displayName || user.email}</div>
                        <div className="text-xs text-muted-foreground">{userRole}</div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-card">
                    <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={getDashboardHref()} className="flex items-center">
                        <LayoutDashboard className="mr-3 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/settings" className="flex items-center">
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild variant="outline" className="h-11 px-6 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300">
                    <Link href="/login" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="h-11 px-6 btn-modern shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href="/register" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu - Enhanced */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden h-11 w-11 hover:bg-primary/10 transition-all duration-300">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass-card">
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-6">
                  {/* Mobile Logo */}
                  <Link
                    href="/"
                    className="flex items-center justify-center mb-6"
                    prefetch={false}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                      <div className="relative p-2 bg-gradient-primary rounded-xl">
                        <Stethoscope className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <span className="text-xl font-bold font-headline text-gradient">Not Too Late AI</span>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-primary" />
                        <span className="text-xs text-muted-foreground">Trusted Healthcare AI</span>
                      </div>
                    </div>
                  </Link>

                  {/* Mobile Navigation */}
                  <nav className="grid gap-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 text-base font-medium p-3 rounded-lg hover:bg-primary/10 transition-all duration-300"
                        prefetch={false}
                      >
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Action Buttons */}
                  <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border/50">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback className="bg-gradient-primary text-white">
                              {user.displayName?.[0] || user.email?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{user.displayName || user.email}</div>
                            <div className="text-xs text-muted-foreground">{userRole}</div>
                          </div>
                        </div>
                        <Button asChild className="w-full h-12">
                          <Link href={getDashboardHref()}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </Button>
                        <Button asChild variant="outline" onClick={signOut} className="w-full h-12">
                          <p className="flex items-center justify-center gap-2">
                            <LogOut className="h-4 w-4" />
                            Logout
                          </p>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild className="w-full h-12 btn-modern">
                          <Link href="/login" className="flex items-center gap-2">
                            <LogIn className="h-4 w-4" />
                            Login
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full h-12">
                          <Link href="/register" className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Sign Up
                          </Link>
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