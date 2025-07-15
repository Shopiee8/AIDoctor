import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Stethoscope } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "#problem", label: "The Problem" },
  { href: "#solution", label: "The Solution" },
  { href: "#features", label: "How It Works" },
];

export function LandingHeader() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Stethoscope className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold font-headline">AIDoctor</span>
      </Link>
      <nav className="ml-auto hidden gap-4 sm:gap-6 lg:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
         <Button asChild variant="ghost" className="hidden lg:inline-flex">
           <Link href="/login">Log In</Link>
         </Button>
         <Button asChild className="hidden lg:inline-flex">
           <Link href="/register">Request a Demo</Link>
         </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="flex flex-col gap-4 p-4">
            <Link href="/" className="flex items-center justify-center mb-4" prefetch={false}>
              <Stethoscope className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-semibold font-headline">AIDoctor</span>
            </Link>
            <nav className="grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-4">
               <Button asChild>
                 <Link href="/login">Log In</Link>
               </Button>
               <Button asChild variant="outline">
                 <Link href="/register">Request a Demo</Link>
               </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      </div>
    </header>
  );
}
