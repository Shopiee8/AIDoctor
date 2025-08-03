import { Stethoscope } from "lucide-react";
import Link from "next/link";

export default function StepsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
            <footer className="py-4 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Not Too Late AI. All Rights Reserved.
            </footer>
        </div>
    );
}
