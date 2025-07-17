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
import { Bell } from 'lucide-react';

const notifications = [
    {
        id: 1,
        image: "https://placehold.co/40x40.png",
        imageHint: "person portrait",
        alt: "Travis Tremble",
        author: "Travis Tremble",
        time: "18.30 PM",
        message: "Sent an amount of $210 for his Appointment",
        target: "Dr.Ruby perin"
    },
    {
        id: 2,
        image: "https://placehold.co/40x40.png",
        imageHint: "person portrait",
        alt: "Hendry Watt",
        author: "Travis Tremble",
        time: "12 Min Ago",
        message: "has booked her appointment to",
        target: "Dr. Hendry Watt"
    },
    {
        id: 3,
        image: "https://placehold.co/40x40.png",
        imageHint: "person portrait",
        alt: "Maria Dyen",
        author: "Travis Tremble",
        time: "6 Min Ago",
        message: "Sent a amount $210 for his Appointment",
        target: "Dr.Maria Dyen"
    },
    {
        id: 4,
        image: "https://placehold.co/40x40.png",
        imageHint: "person portrait",
        alt: "client-image",
        author: "Travis Tremble",
        time: "8.30 AM",
        message: "Send a message to his doctor",
        target: ""
    }
];


export function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
          </span>
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96 p-0">
        <div className="p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
        </div>
        <ScrollArea className="h-80">
          <div className="p-2">
            <ul className="space-y-1">
              {notifications.map((item) => (
                <li key={item.id}>
                    <Link href="#" className="block rounded-md hover:bg-muted/50">
                        <div className="p-2 flex items-start gap-3">
                            <Image
                                src={item.image}
                                alt={item.alt}
                                width={40}
                                height={40}
                                className="rounded-full"
                                data-ai-hint={item.imageHint}
                            />
                            <div className="flex-1 text-sm">
                                <p className="text-foreground">
                                    {item.author} 
                                    <span className="text-xs text-muted-foreground ml-2">{item.time}</span>
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {item.message} 
                                    {item.target && <span className="text-primary font-medium ml-1">{item.target}</span>}
                                </p>
                            </div>
                        </div>
                    </Link>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
