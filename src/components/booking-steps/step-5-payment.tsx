
"use client";

import { useBookingStore } from "@/store/booking-store";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Star, MapPin, ArrowRight, ArrowLeft, User, CreditCard, Calendar } from "lucide-react";
import Image from "next/image";

const paymentMethods = [
    { id: "credit-card", name: "Credit Card", icon: "https://placehold.co/24x24.png" },
    { id: "paypal", name: "Paypal", icon: "https://placehold.co/24x24.png" },
    { id: "stripe", name: "Stripe", icon: "https://placehold.co/24x24.png" },
];

export function Step5Payment() {
    const { doctor, services, nextStep, prevStep } = useBookingStore();

    const bookingFee = 20;
    const tax = 18;
    const discount = 15;
    const servicesTotal = services.length > 0 ? 310 : 0; // Mock price
    const total = servicesTotal + bookingFee + tax - discount;


    return (
        <Card className="border-none shadow-none">
            <CardHeader className="bg-muted/50 rounded-t-lg">
                <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24 border-4 border-background">
                        <AvatarImage src={doctor.image} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <div>
                        <h4 className="text-xl font-bold flex items-center gap-2">{doctor.name} <Badge variant="secondary"><Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" />{doctor.rating}</Badge></h4>
                        <p className="text-primary font-semibold">{doctor.specialty}</p>
                        <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" /> {doctor.location}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h6 className="font-semibold">Payment Gateway</h6>
                        <Tabs defaultValue="credit-card">
                            <TabsList className="grid w-full grid-cols-3">
                                {paymentMethods.map(pm => <TabsTrigger key={pm.id} value={pm.id}>{pm.name}</TabsTrigger>)}
                            </TabsList>
                            <TabsContent value="credit-card" className="mt-4 space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="card-holder">Card Holder Name</Label>
                                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="card-holder" className="pl-9" /></div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <div className="relative"><CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="card-number" className="pl-9" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="expiry">Expire Date</Label>
                                        <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="expiry" placeholder="MM/YY" className="pl-9" /></div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input id="cvv" />
                                    </div>
                                </div>
                            </TabsContent>
                             <TabsContent value="paypal" className="mt-4">
                                <div className="text-center p-8 border rounded-lg">Paypal Integration coming soon.</div>
                             </TabsContent>
                            <TabsContent value="stripe" className="mt-4">
                                <div className="text-center p-8 border rounded-lg">Stripe Integration coming soon.</div>
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                        <h6 className="font-semibold">Payment Info</h6>
                        <div className="space-y-2 text-sm border-t pt-4">
                            <div className="flex justify-between"><p className="text-muted-foreground">Echocardiograms</p><p className="font-medium">${servicesTotal.toFixed(2)}</p></div>
                            <div className="flex justify-between"><p className="text-muted-foreground">Booking Fees</p><p className="font-medium">${bookingFee.toFixed(2)}</p></div>
                            <div className="flex justify-between"><p className="text-muted-foreground">Tax</p><p className="font-medium">${tax.toFixed(2)}</p></div>
                            <div className="flex justify-between"><p className="font-medium text-destructive">Discount</p><p className="font-medium text-destructive">-${discount.toFixed(2)}</p></div>
                        </div>
                         <div className="bg-primary text-primary-foreground p-3 rounded-md flex justify-between items-center">
                            <h6 className="font-semibold">Total</h6>
                            <h6 className="font-semibold">${total.toFixed(2)}</h6>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={nextStep}>
                    Confirm & Pay <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
