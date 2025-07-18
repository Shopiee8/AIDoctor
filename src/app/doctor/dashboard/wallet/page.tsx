
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Settings, CircleDot } from 'lucide-react';
import Image from 'next/image';

const payouts = [
  { date: '24 Mar 2025', method: 'Paypal', amount: 300, status: 'Completed' },
  { date: '24 Mar 2025', method: 'Paypal', amount: 200, status: 'Completed' },
  { date: '25 Mar 2025', method: 'Paypal', amount: 300, status: 'Completed' },
  { date: '24 Mar 2025', method: 'Stripe', amount: 300, status: 'Completed' },
  { date: '29 Mar 2025', method: 'Paypal', amount: 350, status: 'Completed' },
  { date: '04 Apr 2025', method: 'Stripe', amount: 180, status: 'Completed' },
];

export default function DoctorWalletPage() {
    const [activeMethod, setActiveMethod] = useState('paypal');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Payout Settings</h1>
                <p className="text-muted-foreground">Manage your payout methods and view your earnings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payout Method</CardTitle>
                    <CardDescription>All earnings will be sent to the selected payout method.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            className={`flex-1 p-4 border rounded-lg flex items-center justify-between transition-all ${activeMethod === 'stripe' ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`}
                            onClick={() => setActiveMethod('stripe')}
                        >
                            <Image src="https://placehold.co/100x32.png" alt="Stripe" width={100} height={32} data-ai-hint="stripe logo" />
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm"><Settings className="mr-2 h-4 w-4" /> Configure</Button>
                                </DialogTrigger>
                                <PayoutConfigurationDialog method="Stripe" />
                            </Dialog>
                        </button>
                         <button 
                            className={`flex-1 p-4 border rounded-lg flex items-center justify-between transition-all ${activeMethod === 'paypal' ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`}
                            onClick={() => setActiveMethod('paypal')}
                        >
                            <Image src="https://placehold.co/100x32.png" alt="Paypal" width={100} height={32} data-ai-hint="paypal logo" />
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm"><Settings className="mr-2 h-4 w-4" /> Configure</Button>
                                </DialogTrigger>
                                <PayoutConfigurationDialog method="Paypal" />
                            </Dialog>
                        </button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payout History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payouts.map((payout, index) => (
                                <TableRow key={index}>
                                    <TableCell>{payout.date}</TableCell>
                                    <TableCell>{payout.method}</TableCell>
                                    <TableCell>${payout.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant="default" className="bg-green-100 text-green-700">
                                            <CircleDot className="mr-1 h-3 w-3" />
                                            {payout.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}


function PayoutConfigurationDialog({ method }: { method: string }) {
    return (
         <DialogContent>
            <DialogHeader>
                <DialogTitle>{method} Configuration</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Your {method} Email Address</Label>
                    <Input id="email" type="email" placeholder={`your-email@${method.toLowerCase()}.com`} />
                </div>
                 <div className="flex justify-end gap-2">
                    <Button variant="ghost">Cancel</Button>
                    <Button>Save Changes</Button>
                 </div>
            </div>
        </DialogContent>
    );
}
