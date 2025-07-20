
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Check, Dot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface HumanDoctorPromoModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function HumanDoctorPromoModal({ isOpen, onOpenChange }: HumanDoctorPromoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-0">
            <div className="relative">
                <Image
                    src="https://placehold.co/600x400.png"
                    width={600}
                    height={400}
                    alt="Doctor on video call"
                    className="w-full h-auto rounded-t-lg"
                    data-ai-hint="doctor video call"
                />
            </div>
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold font-headline mb-4">
                    Video Call with a <br /> <span className="bg-primary text-primary-foreground px-2">Human Doctor</span>
                </h2>
                
                <ul className="space-y-2 text-left mb-6">
                    <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span>$39 self pay or use your insurance</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span>Diagnosis, prescriptions, referrals & more</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span>Available 24/7 in all 50 states us</span>
                    </li>
                </ul>

                <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-center">
                         <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="ml-2 text-sm font-semibold">Doctors Available</span>
                    </div>
                    <Button asChild size="lg" className="w-full">
                        <Link href="/search">Book Appointment</Link>
                    </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                    Self pay with credit, debit, prepaid cards, and more. Or use major insurance providers like Aetna, Anthem, BC/BS, Cigna, United Healthcare.
                </p>
            </div>
        </DialogContent>
    </Dialog>
  );
}
