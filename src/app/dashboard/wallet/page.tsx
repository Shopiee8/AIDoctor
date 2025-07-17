'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Wallet, Landmark, FileText, CalendarIcon, CircleDot, Loader2 } from 'lucide-react';

// Define types for our data
interface Transaction {
  id: string;
  accountNo: string;
  reason: string;
  date: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

interface BankDetails {
    bankName: string;
    accountNumber: string;
    branchName: string;
    accountName: string;
}

interface WalletData {
    totalBalance: number;
    totalTransaction: number;
    lastPayment: string;
    bankDetails?: BankDetails;
    transactions: Transaction[];
}


export default function WalletPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        };

        const walletDocRef = doc(db, 'users', user.uid);
        const transactionsQuery = query(collection(db, 'users', user.uid, 'transactions'), orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(walletDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                 onSnapshot(transactionsQuery, (querySnapshot) => {
                    const transactions: Transaction[] = [];
                    querySnapshot.forEach((doc) => {
                        transactions.push({ id: doc.id, ...doc.data() } as Transaction);
                    });
                     setWalletData({
                        totalBalance: data.wallet?.totalBalance || 0,
                        totalTransaction: data.wallet?.totalTransaction || 0,
                        lastPayment: data.wallet?.lastPayment || 'N/A',
                        bankDetails: data.wallet?.bankDetails,
                        transactions: transactions
                    });
                    setIsLoading(false);
                });
            } else {
                 setWalletData({
                    totalBalance: 0,
                    totalTransaction: 0,
                    lastPayment: 'N/A',
                    transactions: []
                });
                setIsLoading(false);
            }
        }, (error) => {
            console.error("Error fetching wallet data:", error);
            toast({ title: "Error", description: "Could not fetch wallet data.", variant: "destructive" });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, toast]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!walletData) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>No wallet data found. Please add a payment method to get started.</p>
                     <Dialog>
                        <DialogTrigger asChild>
                             <Button className="mt-4">Add Payment Details</Button>
                        </DialogTrigger>
                        <AddCardDialog />
                    </Dialog>
                </CardContent>
            </Card>
        )
    }

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
                            <p className="text-2xl font-bold">${walletData.totalBalance.toFixed(2)}</p>
                        </div>
                        <div className="border p-4 rounded-lg">
                            <h3 className="text-sm text-muted-foreground flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-green-500" />
                            Total Transaction
                            </h3>
                             <p className="text-2xl font-bold">${walletData.totalTransaction.toFixed(2)}</p>
                        </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Last Payment: {walletData.lastPayment}</p>
                        <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Add Payment</Button>
                                </DialogTrigger>
                                <AddPaymentDialog />
                            </Dialog>
                        </div>
                    </div>

                    {/* Right Side: Bank Details */}
                    {walletData.bankDetails ? (
                        <div className="border p-6 rounded-lg bg-secondary/30">
                            <h3 className="font-semibold mb-4">Bank Details</h3>
                            <ul className="space-y-3 text-sm">
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">Bank Name</span>
                                <span className="font-medium">{walletData.bankDetails.bankName}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">Account Number</span>
                                <span className="font-medium">{walletData.bankDetails.accountNumber}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">Branch Name</span>
                                <span className="font-medium">{walletData.bankDetails.branchName}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">Account Name</span>
                                <span className="font-medium">{walletData.bankDetails.accountName}</span>
                            </li>
                            </ul>
                            <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="link" className="p-0">Edit Details</Button>
                                        </DialogTrigger>
                                        <EditCardDialog bankDetails={walletData.bankDetails} />
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="link" className="p-0">Add Card</Button>
                                        </DialogTrigger>
                                        <AddCardDialog />
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
                     ) : (
                         <div className="border p-6 rounded-lg bg-secondary/30 flex flex-col items-center justify-center text-center">
                            <h3 className="font-semibold mb-2">No Bank Details Found</h3>
                            <p className="text-sm text-muted-foreground mb-4">Add a card to get started.</p>
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Add Card</Button>
                                </DialogTrigger>
                                <AddCardDialog />
                            </Dialog>
                         </div>
                     )}
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
                    {walletData.transactions.map((item) => (
                        <TableRow key={item.id}>
                        <TableCell className="font-medium text-primary">
                            <Link href="#">#{item.id.substring(0,6)}</Link>
                        </TableCell>
                        <TableCell>{item.accountNo}</TableCell>
                        <TableCell>{item.reason}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>
                            <Badge variant={item.status === 'Pending' ? 'secondary' : 'default'} className={item.status === 'Completed' ? 'bg-green-100 text-green-700' : item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                                <CircleDot className="w-3 h-3 mr-1" />
                                {item.status}
                            </Badge>
                        </TableCell>
                        </TableRow>
                    ))}
                     {walletData.transactions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                No transactions yet.
                            </TableCell>
                        </TableRow>
                    )}
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

function AddCardDialog() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState<Date>();
    
    // Simple form state
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [branch, setBranch] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ title: "Not Authenticated", description: "You must be logged in.", variant: "destructive" });
            return;
        }
        if (!date) {
            toast({ title: "Invalid Date", description: "Please select an expiry date.", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            const cardData = {
                cardHolderName: cardHolder,
                cardNumber: cardNumber,
                expiryDate: format(date, 'MM/yy'),
                cvv: cvv,
                branch: branch,
                isDefault: isDefault,
            };
            
            // In a real app, you would likely save this to a 'cards' sub-collection
            // For simplicity, we'll add it to a single doc for now, but this isn't ideal for multiple cards.
            const cardsCollectionRef = collection(db, 'users', user.uid, 'cards');
            await addDoc(cardsCollectionRef, cardData);

            toast({ title: "Success", description: "New card added successfully." });
            // Here you might trigger a re-fetch of the cards data on the main page
            // For now, we just close the dialog. The parent component's onSnapshot will handle the update.
        } catch (error) {
            console.error("Error adding card:", error);
            toast({ title: "Error", description: "Could not add the card.", variant: "destructive" });
        } finally {
            setIsLoading(false);
            // Manually trigger close, as DialogClose inside the button doesn't work well with async handlers.
            document.getElementById('addCardClose')?.click();
        }
    };

     return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Card</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCard}>
                <div className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="card-holder">Card Holder Name <span className="text-destructive">*</span></Label>
                        <Input id="card-holder" placeholder="John Doe" value={cardHolder} onChange={e => setCardHolder(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="card-number">Card Number <span className="text-destructive">*</span></Label>
                        <Input id="card-number" placeholder="**** **** **** 1234" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required />
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
                            <Input id="cvv" placeholder="123" value={cvv} onChange={e => setCvv(e.target.value)} required />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="branch">Branch <span className="text-destructive">*</span></Label>
                        <Select onValueChange={setBranch} value={branch}>
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
                        <Checkbox id="default-card" checked={isDefault} onCheckedChange={checked => setIsDefault(Boolean(checked))} />
                        <Label htmlFor="default-card">Mark as Default</Label>
                    </div>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button id="addCardClose" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Card
                        </Button>
                    </div>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

function EditCardDialog({ bankDetails }: { bankDetails: BankDetails }) {
    return (
         <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Card</DialogTitle>
            </DialogHeader>
             <div className="space-y-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="card-holder-edit">Card Holder Name <span className="text-destructive">*</span></Label>
                    <Input id="card-holder-edit" defaultValue={bankDetails.accountName} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="card-number-edit">Card Number <span className="text-destructive">*</span></Label>
                    <Input id="card-number-edit" defaultValue={bankDetails.accountNumber} />
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
                     <Select defaultValue={bankDetails.branchName.toLowerCase()}>
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


function OtherAccountsDialog() {
     const [accounts, setAccounts] = useState<any[]>([]);
     const { user } = useAuth();
     
     useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'users', user.uid, 'cards'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedAccounts: any[] = [];
            querySnapshot.forEach((doc) => {
                fetchedAccounts.push({ id: doc.id, ...doc.data() });
            });
            setAccounts(fetchedAccounts);
        });
        return () => unsubscribe();
     }, [user]);

    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Other Accounts</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
                {accounts.length > 0 ? accounts.map((account, index) => (
                    <div key={index} className="border p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 text-sm">
                            <div>
                                <p className="text-muted-foreground text-xs">Bank Name</p>
                                {/* This assumes branch is the bank name, adjust if needed */}
                                <p className="font-medium">{account.branch || 'N/A'}</p> 
                            </div>
                             <div>
                                <p className="text-muted-foreground text-xs">Account No</p>
                                <p className="font-medium">{account.cardNumber}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground text-xs">Branch</p>
                                <p className="font-medium">{account.branch}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground text-xs">Name on Card</p>
                                <p className="font-medium">{account.cardHolderName}</p>
                            </div>
                        </div>
                        <Button variant="link" className="p-0 h-auto self-start md:self-center" disabled={account.isDefault}>
                            {account.isDefault ? 'Current' : 'Set as Default'}
                        </Button>
                    </div>
                )) : (
                    <p className="text-center text-muted-foreground">No other accounts found.</p>
                )}
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}
    