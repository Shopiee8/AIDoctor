
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from '@/components/ui/input';
import { Search, Printer, Download, FileText, Stethoscope } from 'lucide-react';
import Image from 'next/image';

const invoices = [
  {
    id: 'INV-2021',
    doctorName: 'Dr. Edalin Hendry',
    doctorImage: 'https://placehold.co/40x40.png',
    appointmentDate: '24 Mar 2025',
    bookedOn: '21 Mar 2025',
    amount: 300,
    status: 'Paid',
    billingFrom: { name: 'Dr. Edalin Hendry', address: '806 Twin Willow Lane, Newyork, USA' },
    billingTo: { name: 'Richard Wilson', address: '299 Star Trek Drive, Florida, 32405, USA' },
    paymentMethod: { type: 'Debit Card', last4: '2541', bank: 'HDFC Bank' },
    items: [{ desc: 'General Consultation', qty: 1, total: 150 }, { desc: 'Video Call', qty: 1, total: 150 }],
  },
  {
    id: 'INV-2022',
    doctorName: 'Dr. John Homes',
    doctorImage: 'https://placehold.co/40x40.png',
    appointmentDate: '17 Mar 2025',
    bookedOn: '14 Mar 2025',
    amount: 450,
    status: 'Paid'
  },
   {
    id: 'INV-2023',
    doctorName: 'Dr. Shanta Neill',
    doctorImage: 'https://placehold.co/40x40.png',
    appointmentDate: '11 Mar 2025',
    bookedOn: '07 Mar 2025',
    amount: 250,
    status: 'Pending'
  },
   {
    id: 'INV-2024',
    doctorName: 'Dr. Anthony Tran',
    doctorImage: 'https://placehold.co/40x40.png',
    appointmentDate: '26 Feb 2025',
    bookedOn: '23 Feb 2025',
    amount: 320,
    status: 'Paid'
  },
   {
    id: 'INV-2025',
    doctorName: 'Dr. Susan Lingo',
    doctorImage: 'https://placehold.co/40x40.png',
    appointmentDate: '18 Feb 2025',
    bookedOn: '15 Feb 2025',
    amount: 480,
    status: 'Cancelled'
  },
];

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0]);

  return (
    <div className="space-y-6">
       <div>
            <h1 className="text-3xl font-bold font-headline">Invoices</h1>
            <p className="text-muted-foreground">View and manage your billing history.</p>
        </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice List</CardTitle>
             <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by doctor or ID..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Appt. Date</TableHead>
                <TableHead>Booked on</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <DialogTrigger asChild>
                       <Button variant="link" className="p-0" onClick={() => setSelectedInvoice(invoice)}>
                        {invoice.id}
                      </Button>
                    </DialogTrigger>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={invoice.doctorImage} data-ai-hint="doctor portrait" />
                            <AvatarFallback>{invoice.doctorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{invoice.doctorName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.appointmentDate}</TableCell>
                  <TableCell>{invoice.bookedOn}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={
                        invoice.status === 'Paid' ? 'default' : 
                        invoice.status === 'Pending' ? 'secondary' : 'destructive'
                    }>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DialogTrigger asChild>
                       <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                          View
                        </Button>
                    </DialogTrigger>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Dialog Content defined outside the loop, but inside the main component render */}
      <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-headline">Invoice Details</DialogTitle>
               <div className="flex items-center gap-2">
                 <Button variant="outline" size="icon"><Printer className="h-4 w-4" /></Button>
                 <Button><Download className="h-4 w-4 mr-2" /> Download</Button>
               </div>
            </div>
          </DialogHeader>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
             <div className="p-8 border rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                       <div className="flex items-center gap-2 mb-4">
                            <Stethoscope className="w-8 h-8 text-primary" />
                            <span className="text-2xl font-bold font-headline">AIDoctor</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-lg">Invoice {selectedInvoice.id}</p>
                        <p className="text-sm text-muted-foreground">Issued: {selectedInvoice.bookedOn}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8 text-sm">
                    <div>
                        <p className="font-semibold mb-1">Billing From</p>
                        <address className="not-italic text-muted-foreground">
                            {selectedInvoice.billingFrom?.name || 'N/A'}<br/>
                            {selectedInvoice.billingFrom?.address.replace(/, /g, '<br/>')}
                        </address>
                    </div>
                     <div>
                        <p className="font-semibold mb-1">Billing To</p>
                        <address className="not-italic text-muted-foreground">
                            {selectedInvoice.billingTo?.name || 'N/A'}<br/>
                            {selectedInvoice.billingTo?.address.replace(/, /g, '<br/>')}
                        </address>
                    </div>
                     <div>
                        <p className="font-semibold mb-1">Payment Method</p>
                        <div className="text-muted-foreground">
                           <p>{selectedInvoice.paymentMethod?.type}</p>
                           <p>XXXX-XXXX-XXXX-{selectedInvoice.paymentMethod?.last4}</p>
                           <p>{selectedInvoice.paymentMethod?.bank}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedInvoice.items?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.desc}</TableCell>
                                    <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 
                <div className="flex justify-end">
                    <div className="w-full max-w-xs space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="font-medium">${selectedInvoice.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Discount:</span>
                            <span className="font-medium">-$0.00</span>
                        </div>
                         <div className="flex justify-between font-bold text-base border-t pt-2">
                            <span>Total:</span>
                            <span>${selectedInvoice.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                 <div className="mt-8 pt-4 border-t">
                     <h4 className="font-semibold mb-2">Other Information</h4>
                     <p className="text-xs text-muted-foreground">An account of the present illness, which includes the circumstances surrounding the onset of recent health changes and the chronology of subsequent events that have led the patient to seek medicine</p>
                 </div>
             </div>
          </div>
      </DialogContent>
    </div>
  );
}

// Wrap the main content in a Dialog component to manage state
export default function InvoicesPageWrapper() {
    return (
        <Dialog>
            <InvoicesPage />
        </Dialog>
    )
}
