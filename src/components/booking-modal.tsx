
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBookingStore } from "@/store/booking-store";
import { Step1Service } from "./booking-steps/step-1-service";
import { Step2Type } from "./booking-steps/step-2-type";
import { Step3DateTime } from "./booking-steps/step-3-datetime";
import { Step4Details } from "./booking-steps/step-4-details";
import { Step5Payment } from "./booking-steps/step-5-payment";
import { Step6Confirmation } from "./booking-steps/step-6-confirmation";
import { cn } from "@/lib/utils";

const steps = [
    { id: 1, title: "Specialty" },
    { id: 2, title: "Appointment Type" },
    { id: 3, title: "Date & Time" },
    { id: 4, title: "Basic Information" },
    { id: 5, title: "Payment" },
    { id: 6, title: "Confirmation" },
];

export function BookingModal() {
    const { isBookingModalOpen, closeBookingModal, currentStep } = useBookingStore();

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <Step1Service />;
            case 2:
                return <Step2Type />;
            case 3:
                return <Step3DateTime />;
            case 4:
                return <Step4Details />;
            case 5:
                return <Step5Payment />;
            case 6:
                return <Step6Confirmation />;
            default:
                return <Step1Service />;
        }
    };

    return (
        <Dialog open={isBookingModalOpen} onOpenChange={closeBookingModal}>
            <DialogContent className="max-w-4xl p-0">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="text-center font-headline text-2xl">Booking Appointment</DialogTitle>
                </DialogHeader>

                <div className="p-6 pt-0">
                    {/* Progress Bar */}
                    <div className="flex items-center justify-center mb-8">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center text-center">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all",
                                            currentStep > step.id ? "bg-primary border-primary text-primary-foreground" :
                                            currentStep === step.id ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"
                                        )}
                                    >
                                        {step.id}
                                    </div>
                                    <p className={cn(
                                        "text-xs mt-1 w-20 transition-all",
                                         currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                                        )}>{step.title}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={cn(
                                        "flex-1 h-0.5 mx-2 transition-all",
                                        currentStep > step.id ? "bg-primary" : "bg-muted"
                                    )} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    {renderStepContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}
