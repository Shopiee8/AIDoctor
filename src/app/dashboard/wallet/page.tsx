
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Wallet, Landmark, FileText, CalendarIcon, CircleDot } from 'lucide-react';

const transactions = [
  {
    id: '#AC1234',
    accountNo: '5396 5250 1908 XXXX',
    reason: 'Appointment',
    date: '26 Mar 2025',
    amount: '$300',
    status: 'Completed',
  },
  {
    id: '#AC3656',
    accountNo: '6372 4902 4902 XXXX',
    reason: 'Appointment',
    date: '28 Mar 2025',
    amount: '$480',
    status: 'Completed',
  },
  {
    id: '#AC1246',
    accountNo: '4892 0204 4924 XXXX',
    reason: 'Appointment',
    date: '11 Apr 2025',
    amount: '$250',
    status: 'Completed',
  },
  {
    id: '#AC6985',
    accountNo: '5730 4892 0492 XXXX',
    reason: 'Refund',
    date: '18 Apr 2025',
    amount: '$220',
    status: 'Pending',
  },
  {
    id: '#AC3659',
    accountNo: '7922 9024 5824 XXXX',
    reason: 'Appointment',
    date: '29 Apr 2025',
    amount: '$350',
    status: 'Completed',
  },
];

export default function WalletPage() {
  const [date, setDate] = useState<Date>();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Side: Balances & Add Payment */}
              <div className="flex flex-col justify-between">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm text-muted-foreground flex items-center">
                      <Wallet className="w-4 h-4 mr-2 text-yellow-500" />
                      Total Balance
                    </h3>
                    <p className="text-2xl font-bold">$1200</p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm text-muted-foreground flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-green-500" />
                      Total Transaction
                    </h3>
                    <p className="text-2xl font-bold">$2300</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Last Payment: 24 Mar 2023</p>
                   <Dialog>
                        <DialogTrigger asChild>
                             <Button>Add Payment</Button>
                        </DialogTrigger>
                        <AddPaymentDialog />
                    </Dialog>
                </div>
              </div>

              {/* Right Side: Bank Details */}
              <div className="border p-6 rounded-lg bg-secondary/30">
                <h3 className="font-semibold mb-4">Bank Details</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Bank Name</span>
                    <span className="font-medium">Citi Bank Inc</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Account Number</span>
                    <span className="font-medium">5396 5250 1908 XXXX</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Branch Name</span>
                    <span className="font-medium">London</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Account Name</span>
                    <span className="font-medium">Hendrita</span>
                  </li>
                </ul>
                 <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                 <Button variant="link" className="p-0">Edit Details</Button>
                            </DialogTrigger>
                            <EditCardDialog />
                        </Dialog>
                         <Dialog>
                            <DialogTrigger asChild>
                                 <Button variant="link" className="p-0">Add Card</Button>
                            </DialogTrigger>
                            <AddCardDialog date={date} setDate={setDate} />
                        </Dialog>
                    </div>
                     <Dialog>
                        <DialogTrigger asChild>
                             <Button variant="link" className="p-0">Other Accounts</Button>
                        </DialogTrigger>
                        <OtherAccountsDialog />
                    </Dialog>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Account No</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Debited / Credited On</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-primary">
                    <Link href="#">{item.id}</Link>
                  </TableCell>
                  <TableCell>{item.accountNo}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Pending' ? 'secondary' : 'default'} className={item.status === 'Completed' ? 'bg-green-100 text-green-700' : item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}>
                        <CircleDot className="w-3 h-3 mr-1" />
                        {item.status}
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

// Dialog Components
function AddPaymentDialog() {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="amount">Enter Amount <span className="text-destructive">*</span></Label>
                    <Input id="amount" placeholder="$100.00" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="payment-gateway">Select Payment Gateway <span className="text-destructive">*</span></Label>
                     <Select>
                        <SelectTrigger id="payment-gateway">
                            <SelectValue placeholder="Select Gateway" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="paypal">Paypal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button>Add to Wallet</Button>
            </DialogFooter>
        </DialogContent>
    )
}

function AddCardDialog({ date, setDate }: { date?: Date, setDate: (date?: Date) => void}) {
     return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="card-holder">Card Holder Name <span className="text-destructive">*</span></Label>
                    <Input id="card-holder" placeholder="John Doe" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="card-number">Card Number <span className="text-destructive">*</span></Label>
                    <Input id="card-number" placeholder="**** **** **** 1234" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div className="grid gap-2">
                        <Label htmlFor="expiry-date">Expire Date <span className="text-destructive">*</span></Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, 'MM/yy') : <span>MM/YY</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="cvv">CVV <span className="text-destructive">*</span></Label>
                        <Input id="cvv" placeholder="123" />
                    </div>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="branch">Branch <span className="text-destructive">*</span></Label>
                     <Select>
                        <SelectTrigger id="branch">
                            <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="london">London</SelectItem>
                            <SelectItem value="newyork">New York</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter className="justify-between sm:justify-between">
                <div className="flex items-center space-x-2">
                    <Checkbox id="default-card" />
                    <Label htmlFor="default-card">Mark as Default</Label>
                </div>
                <div className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Add Card</Button>
                </div>
            </DialogFooter>
        </DialogContent>
    )
}

function EditCardDialog() {
    return (
         <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Card</DialogTitle>
            </DialogHeader>
             <div className="space-y-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="card-holder-edit">Card Holder Name <span className="text-destructive">*</span></Label>
                    <Input id="card-holder-edit" defaultValue="Hendrita" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="card-number-edit">Card Number <span className="text-destructive">*</span></Label>
                    <Input id="card-number-edit" defaultValue="5396 5250 1908 1647" />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="grid gap-2">
                        <Label htmlFor="expiry-date-edit">Expire Date <span className="text-destructive">*</span></Label>
                         <Input id="expiry-date-edit" defaultValue="12/28" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="cvv-edit">CVV <span className="text-destructive">*</span></Label>
                        <Input id="cvv-edit" defaultValue="556" />
                    </div>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="branch-edit">Branch <span className="text-destructive">*</span></Label>
                     <Select defaultValue="london">
                        <SelectTrigger id="branch-edit">
                            <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="london">London</SelectItem>
                            <SelectItem value="newyork">New York</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter className="justify-between sm:justify-between">
                <div className="flex items-center space-x-2">
                    <Checkbox id="default-card-edit" defaultChecked />
                    <Label htmlFor="default-card-edit">Mark as Default</Label>
                </div>
                 <div className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Save Changes</Button>
                </div>
            </DialogFooter>
        </DialogContent>
    )
}


const otherAccountsData = [
    { name: 'Citi Bank Inc', accountNo: '5396 5250 1908 XXXX', branch: 'London', status: 'Current' },
    { name: 'HDFC Bank Inc', accountNo: '7382 4924 4924 XXXX', branch: 'New York', status: 'Change to default' },
    { name: 'Union Bank Inc', accountNo: '8934 4902 9024 XXXX', branch: 'Chicago', status: 'Change to default' },
    { name: 'KVB Bank Inc', accountNo: '5892 4920 4829 XXXX', branch: 'Austin', status: 'Change to default' },
]

function OtherAccountsDialog() {
    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Other Accounts</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
                {otherAccountsData.map((account, index) => (
                    <div key={index} className="border p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 text-sm">
                            <div>
                                <p className="text-muted-foreground text-xs">Bank Name</p>
                                <p className="font-medium">{account.name}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground text-xs">Account No</p>
                                <p className="font-medium">{account.accountNo}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground text-xs">Branch</p>
                                <p className="font-medium">{account.branch}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground text-xs">Name on Card</p>
                                <p className="font-medium">Hendrita</p>
                            </div>
                        </div>
                        <Button variant="link" className="p-0 h-auto self-start md:self-center" disabled={account.status === 'Current'}>
                            {account.status}
                        </Button>
                    </div>
                ))}
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}
