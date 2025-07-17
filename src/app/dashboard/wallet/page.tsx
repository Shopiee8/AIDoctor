
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, addDoc, query, orderBy, setDoc } from 'firebase/firestore';
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
    id: string;
    bankName: string;
    accountNumber: string;
    branchName: string;
    accountName: string;
    isDefault?: boolean;
}

interface WalletData {
    totalBalance: number;
    totalTransaction: number;
    lastPayment: string;
    cards: BankDetails[];
    transactions: Transaction[];
    defaultCard?: BankDetails;
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
        }

        const walletDocRef = doc(db, 'users', user.uid);
        const cardsQuery = query(collection(db, 'users', user.uid, 'cards'), orderBy('isDefault', 'desc'));
        const transactionsQuery = query(collection(db, 'users', user.uid, 'transactions'), orderBy('date', 'desc'));

        const unsubWallet = onSnapshot(walletDocRef, (walletSnap) => {
            const walletInfo = walletSnap.data();

            const unsubCards = onSnapshot(cardsQuery, (cardsSnap) => {
                const cards: BankDetails[] = [];
                cardsSnap.forEach((doc) => {
                    cards.push({ id: doc.id, ...doc.data() } as BankDetails);
                });

                const unsubTransactions = onSnapshot(transactionsQuery, (transSnap) => {
                    const transactions: Transaction[] = [];
                    transSnap.forEach((doc) => {
                        transactions.push({ id: doc.id, ...doc.data() } as Transaction);
                    });
                    
                    const defaultCard = cards.find(c => c.isDefault);

                    setWalletData({
                        totalBalance: walletInfo?.wallet?.totalBalance || 0,
                        totalTransaction: walletInfo?.wallet?.totalTransaction || 0,
                        lastPayment: walletInfo?.wallet?.lastPayment || 'N/A',
                        cards: cards,
                        transactions: transactions,
                        defaultCard: defaultCard
                    });

                    if (isLoading) setIsLoading(false);
                });

                return () => unsubTransactions();
            });

            return () => unsubCards();
        }, (error) => {
            console.error("Error fetching wallet data:", error);
            toast({ title: "Error", description: "Could not fetch wallet data.", variant: "destructive" });
            setIsLoading(false);
        });

        return () => unsubWallet();
    }, [user, toast, isLoading]);


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
                    <p>Could not load wallet data. Please try again later.</p>
                </CardContent>
            </Card>
        )
    }
    
    const { totalBalance, totalTransaction, lastPayment, cards, transactions, defaultCard } = walletData;

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
                            <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
                        </div>
                        <div className="border p-4 rounded-lg">
                            <h3 className="text-sm text-muted-foreground flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-green-500" />
                            Total Transaction
                            </h3>
                             <p className="text-2xl font-bold">${totalTransaction.toFixed(2)}</p>
                        </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Last Payment: {lastPayment}</p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Add Payment</Button>
                            </DialogTrigger>
                            <AddPaymentDialog />
                        </Dialog>
                        </div>
                    </div>

                    {/* Right Side: Bank Details */}
                    {defaultCard ? (
                        <div className="border p-6 rounded-lg bg-secondary/30">
                            <h3 className="font-semibold mb-4">Bank Details</h3>
                            <ul className="space-y-3 text-sm">
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">Bank Name</span>
                                <span className="font-medium">{defaultCard.bankName}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">Account Number</span>
                                <span className="font-medium">{defaultCard.accountNumber}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">Branch Name</span>
                                <span className="font-medium">{defaultCard.branchName}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">Account Name</span>
                                <span className="font-medium">{defaultCard.accountName}</span>
                            </li>
                            </ul>
                            <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="link" className="p-0">Edit Details</Button>
                                        </DialogTrigger>
                                        <EditCardDialog bankDetails={defaultCard} />
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
                                    <OtherAccountsDialog accounts={cards} />
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
                    {transactions.map((item) => (
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
                     {transactions.length === 0 && (
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
    const [isDefault, setIsDefault] = useState(false);
    
    // This state is just for the form fields, not for the whole page
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [branch, setBranch] = useState('');
    const [bankName, setBankName] = useState('');

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
                accountName: cardHolder,
                accountNumber: cardNumber,
                expiryDate: format(date, 'MM/yy'),
                cvv: cvv,
                branchName: branch,
                bankName: bankName,
                isDefault: isDefault,
            };
            
            const cardsCollectionRef = collection(db, 'users', user.uid, 'cards');
            await addDoc(cardsCollectionRef, cardData);

            toast({ title: "Success", description: "New card added successfully." });
            document.getElementById('addCardClose')?.click();
        } catch (error) {
            console.error("Error adding card:", error);
            toast({ title: "Error", description: "Could not add the card.", variant: "destructive" });
        } finally {
            setIsLoading(false);
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
                        <Label htmlFor="bank-name">Bank Name <span className="text-destructive">*</span></Label>
                        <Input id="bank-name" placeholder="e.g., Citi Bank Inc" value={bankName} onChange={e => setBankName(e.target.value)} required />
                    </div>
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
                        <Select onValueChange={setBranch} value={branch} required>
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
                    <Label htmlFor="card-holder-edit">Bank Name</Label>
                    <Input id="card-holder-edit" defaultValue={bankDetails.bankName || ''} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="card-holder-edit">Card Holder Name</Label>
                    <Input id="card-holder-edit" defaultValue={bankDetails.accountName || ''} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="card-number-edit">Card Number</Label>
                    <Input id="card-number-edit" defaultValue={bankDetails.accountNumber || ''} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="grid gap-2">
                        <Label htmlFor="expiry-date-edit">Expire Date</Label>
                         <Input id="expiry-date-edit" defaultValue="12/28" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="cvv-edit">CVV</Label>
                        <Input id="cvv-edit" defaultValue="556" />
                    </div>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="branch-edit">Branch</Label>
                     <Select defaultValue={bankDetails.branchName?.toLowerCase() || ''}>
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
                    <Checkbox id="default-card-edit" defaultChecked={bankDetails.isDefault} />
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


function OtherAccountsDialog({ accounts }: { accounts: BankDetails[] }) {
    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Other Accounts</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
                {accounts.length > 0 ? accounts.map((account) => (
                    <div key={account.id} className="border p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 text-sm">
                            <div>
                                <p className="text-muted-foreground text-xs">Bank Name</p>
                                <p className="font-medium">{account.bankName || 'N/A'}</p> 
                            </div>
                             <div>
                                <p className="text-muted-foreground text-xs">Account No</p>
                                <p className="font-medium">{account.accountNumber}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground text-xs">Branch</p>
                                <p className="font-medium">{account.branchName}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground text-xs">Name on Card</p>
                                <p className="font-medium">{account.accountName}</p>
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

    