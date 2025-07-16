
"use client";

import { useState } from 'react';
import { DoctorRegisterStep1 } from '@/components/doctor-register-step1';
import { DoctorRegisterStep2 } from '@/components/doctor-register-step2';
import { DoctorRegisterStep3 } from '@/components/doctor-register-step3';
import { Progress } from '@/components/ui/progress';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function DoctorRegisterPage() {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const progressValue = (step / 3) * 100;

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                 <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4">
                        <Stethoscope className="h-10 w-10 text-primary mx-auto" />
                    </Link>
                    <h1 className="text-3xl font-bold font-headline">Doctor Registration</h1>
                    <p className="text-muted-foreground">Join our network of trusted AI and Human specialists.</p>
                </div>
                
                <Progress value={progressValue} className="mb-8 h-2" />

                <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg border animate-pop-in">
                    {step === 1 && <DoctorRegisterStep1 onNext={nextStep} />}
                    {step === 2 && <DoctorRegisterStep2 onNext={nextStep} onBack={prevStep} />}
                    {step === 3 && <DoctorRegisterStep3 onBack={prevStep} />}
                </div>
            </div>
        </div>
    );
}
