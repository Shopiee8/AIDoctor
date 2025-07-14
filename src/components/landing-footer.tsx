import Link from "next/link";
import { Stethoscope } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <div className="flex items-center">
        <Stethoscope className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold font-headline">AIDoctor</span>
      </div>
      <p className="text-xs text-muted-foreground sm:ml-auto">
        &copy; {new Date().getFullYear()} AIDoctor. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          Terms of Service
        </Link>
        <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          Privacy
        </Link>
      </nav>
    </footer>
  );
}
