'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, X } from 'lucide-react';

const cartItems = [
  {
    id: 1,
    name: 'Benzaxapine Croplex',
    price: 849.99,
    quantity: 1,
    image: 'https://placehold.co/80x80.png',
    imageHint: 'medicine product',
  },
  {
    id: 2,
    name: 'Ombinazol Bonibamol',
    price: 1249.99,
    quantity: 1,
    image: 'https://placehold.co/80x80.png',
    imageHint: 'medicine product',
  },
  {
    id: 3,
    name: 'Dantotate Dantodazole',
    price: 129.99,
    quantity: 1,
    image: 'https://placehold.co/80x80.png',
    imageHint: 'medicine product',
  },
];

const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const shipping = 25.00;
const tax = 0.00;
const total = subtotal + shipping + tax;

export function ShoppingCartDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs">
            {cartItems.length}
          </span>
          <span className="sr-only">Toggle shopping cart</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4">
          <h4 className="font-semibold">Shopping Cart</h4>
        </div>
        <ScrollArea className="h-64">
          <div className="p-4 pt-0">
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-start gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-md"
                    data-ai-hint={item.imageHint}
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium hover:text-primary">
                      <Link href="#">{item.name}</Link>
                    </p>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Qty: {item.quantity}</span>
                      <span className="font-semibold text-foreground">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
        <Separator />
        <div className="p-4 space-y-4">
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                    <Link href="#">View Cart</Link>
                </Button>
                 <Button asChild>
                    <Link href="#">Checkout</Link>
                </Button>
            </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
