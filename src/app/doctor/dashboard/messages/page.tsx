
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import {
  Search, Paperclip, Mic, Send, MoreVertical, ThumbsUp, Heart, Smile, Video, Phone, PhoneOff, ArrowLeft, Ellipsis
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const onlinePatients = [
    { id: 1, name: 'Richard Wilson', image: 'https://placehold.co/40x40.png' },
    { id: 2, name: 'Charlene Reed', image: 'https://placehold.co/40x40.png' },
    { id: 3, name: 'Travis Trimble', image: 'https://placehold.co/40x40.png' },
    { id: 4, name: 'Carl Kelly', image: 'https://placehold.co/40x40.png' },
    { id: 5, name: 'Michelle Fairfax', image: 'https://placehold.co/40x40.png' },
    { id: 6, name: 'Gina Moore', image: 'https://placehold.co/40x40.png' },
];

const chatList = [
    { id: 1, name: 'Richard Wilson', message: 'Thank you for the prescription!', time: 'Just Now', unread: 0, pinned: true, status: 'online' as const, image: 'https://placehold.co/40x40.png' },
    { id: 2, name: 'Charlene Reed', message: 'Audio message', icon: <Mic className="w-4 h-4"/>, time: 'Yesterday', unread: 0, pinned: true, status: 'offline' as const, image: 'https://placehold.co/40x40.png' },
    { id: 3, name: 'Travis Trimble', message: 'lab_results.pdf', icon: <Paperclip className="w-4 h-4"/>, time: '10:20 PM', unread: 0, pinned: true, status: 'online' as const, image: 'https://placehold.co/40x40.png' },
    { id: 4, name: 'Carl Kelly', message: 'Is the new medication time correct?', time: 'Just Now', unread: 2, pinned: false, status: 'online' as const, image: 'https://placehold.co/40x40.png' },
    { id: 5, name: 'Michelle Fairfax', message: 'Video call recording', icon: <Video className="w-4 h-4" />, time: 'Yesterday', unread: 0, pinned: false, status: 'online' as const, image: 'https://placehold.co/40x40.png' },
    { id: 6, name: 'Gina Moore', message: 'Okay, I will follow the instructions.', time: '12:30 PM', unread: 0, pinned: false, status: 'online' as const, image: 'https://placehold.co/40x40.png' },
];

const messages = [
  { id: 1, text: 'Hello Doctor, I have a question about the prescription.', from: 'patient', time: '8:16 PM' },
  { id: 2, text: 'Of course, what is your question?', from: 'doctor', time: '9:45 AM' },
  { id: 3, text: 'Here is a photo of the rash I mentioned.', from: 'patient', time: '9:47 AM', type: 'image', images: ['https://placehold.co/150x150.png', 'https://placehold.co/150x150.png'] },
  { id: 4, text: 'Thank you. I have reviewed the images. Based on what I see, it looks like a mild allergic reaction. I am sending a prescription now.', from: 'doctor', time: '9:50 AM' },
  { id: 5, text: 'Thank you for your support', from: 'patient', time: '9:52 AM', isForwarded: true },
];

const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 640, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 4 } },
    ],
};


export default function DoctorMessagesPage() {
  const [activeChat, setActiveChat] = useState(chatList[0]);

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-card border rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r flex flex-col">
        <div className="p-4 border-b">
          <h4 className="font-bold text-lg">All Chats</h4>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search patients..." className="pl-9" />
          </div>
        </div>
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h6 className="font-semibold text-sm">Online Patients</h6>
            <Link href="#" className="text-xs text-primary font-semibold">View All</Link>
          </div>
          <Slider {...sliderSettings}>
             {onlinePatients.map(contact => (
                <div key={contact.id} className="px-1">
                    <Avatar className="w-12 h-12 border-2 border-green-500 p-0.5">
                        <AvatarImage src={contact.image} data-ai-hint="person portrait" />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            ))}
          </Slider>
        </div>
        <ScrollArea className="flex-1">
            <div className="p-4">
                <h6 className="font-semibold text-sm mb-2">Pinned Chat</h6>
                <ul className="space-y-1">
                    {chatList.filter(c => c.pinned).map(chat => (
                        <ChatItem key={chat.id} chat={chat} activeChat={activeChat} setActiveChat={setActiveChat} />
                    ))}
                </ul>
            </div>
             <div className="p-4 pt-0">
                <h6 className="font-semibold text-sm mb-2">Recent Chat</h6>
                <ul className="space-y-1">
                     {chatList.filter(c => !c.pinned).map(chat => (
                        <ChatItem key={chat.id} chat={chat} activeChat={activeChat} setActiveChat={setActiveChat} />
                    ))}
                </ul>
            </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center p-3 border-b">
          <Button variant="ghost" size="icon" className="md:hidden mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-10 h-10 border-2 border-green-500 p-0.5">
            <AvatarImage src={activeChat.image} />
            <AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h5 className="font-bold text-sm">{activeChat.name}</h5>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon"><Phone className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Patient Profile</DropdownMenuItem>
                <DropdownMenuItem>Delete Chat</DropdownMenuItem>
                <DropdownMenuItem>Block</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 bg-muted/30">
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex items-end gap-3", msg.from === 'doctor' && 'justify-end')}>
                {msg.from === 'patient' && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={activeChat.image} />
                    <AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("max-w-md p-3 rounded-lg", 
                    msg.from === 'doctor' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-background border rounded-bl-none'
                )}>
                  {msg.type === 'image' ? (
                     <div className="grid grid-cols-2 gap-2">
                         {msg.images?.map((img, i) => <Image key={i} src={img} width={100} height={100} alt="attachment" className="rounded-md" />)}
                     </div>
                  ) : (
                    <p className="text-sm">{msg.text}</p>
                  )}
                  <p className={cn("text-xs mt-1", msg.from === 'doctor' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {msg.time}
                  </p>
                </div>
                 {msg.from === 'doctor' && (
                   <Avatar className="w-8 h-8">
                    <AvatarImage src={'https://placehold.co/40x40.png'} />
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Footer */}
        <div className="p-4 border-t">
          <div className="relative">
            <Input placeholder="Type a message..." className="pr-28 pl-10" />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center">
               <Button variant="ghost" size="icon" className="w-8 h-8">
                 <Paperclip className="w-4 h-4" />
               </Button>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
               <Button variant="ghost" size="icon" className="w-8 h-8">
                 <Mic className="w-4 h-4" />
               </Button>
               <Button size="icon" className="w-8 h-8">
                 <Send className="w-4 h-4" />
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatItem({ chat, activeChat, setActiveChat }: { chat: any, activeChat: any, setActiveChat: any }) {
    return (
        <li>
            <button 
                className={cn(
                    "w-full text-left p-3 rounded-lg flex gap-3 items-start transition-colors",
                    activeChat.id === chat.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                )}
                onClick={() => setActiveChat(chat)}
            >
                <Avatar className={cn(
                    "w-12 h-12 border-2",
                    chat.status === 'online' ? 'border-green-500' : 'border-transparent'
                )}>
                    <AvatarImage src={chat.image} />
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h6 className="font-semibold text-sm">{chat.name}</h6>
                        <p className="text-xs text-muted-foreground">{chat.time}</p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            {chat.icon} {chat.message}
                        </p>
                        {chat.unread > 0 && (
                            <span className="w-5 h-5 bg-destructive text-destructive-foreground text-xs flex items-center justify-center rounded-full">
                                {chat.unread}
                            </span>
                        )}
                    </div>
                </div>
            </button>
        </li>
    );
}

// Add a new Play icon for the audio message
const Play = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M8 5v14l11-7z" />
  </svg>
);
