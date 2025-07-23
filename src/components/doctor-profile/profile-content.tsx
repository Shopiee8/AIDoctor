
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MapPin } from 'lucide-react';
import type { Doctor } from '@/components/doctor-card'; // Assuming Doctor type is defined here

interface ProfileContentProps {
  doctor: Doctor;
}

// Mock data until dynamic data is fully wired up
const mockReviews = [
    { author: 'Richard Wilson', date: 'Reviewed 2 Days ago', rating: 5, content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Curabitur non nulla sit amet nisl tempus', image: 'https://placehold.co/40x40.png' },
    { author: 'Travis Trimble', date: 'Reviewed 4 Days ago', rating: 5, content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Curabitur non nulla sit amet nisl tempus', image: 'https://placehold.co/40x40.png' },
];

const mockClinics = [
    {
        name: 'Smile Cute Dental Care Center',
        specialty: 'MDS - Periodontology and Oral Implantology, BDS',
        rating: 4,
        location: '2286 Sundown Lane, Austin, Texas 78749, USA',
        images: Array(4).fill('https://placehold.co/80x80.png'),
        timings: [{ days: 'Mon - Sat', hours: '10:00 AM - 2:00 PM' }, { days: 'Sun', hours: '10:00 AM - 2:00 PM' }],
        price: 250
    },
    {
        name: 'The Family Dentistry Clinic',
        specialty: 'MDS - Periodontology and Oral Implantology, BDS',
        rating: 4,
        location: '2883 University Street, Seattle, Texas Washington, 98155',
        images: Array(4).fill('https://placehold.co/80x80.png'),
        timings: [{ days: 'Tue - Fri', hours: '11:00 AM - 1:00 PM' }, { days: 'Sat - Sun', hours: '8:00 AM - 10:00 AM' }],
        price: 350
    }
];

export function ProfileContent({ doctor }: ProfileContentProps) {
    return (
        <Card>
            <CardContent className="p-0">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 rounded-none border-b">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="locations">Locations</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        <TabsTrigger value="hours">Business Hours</TabsTrigger>
                    </TabsList>
                    
                    <div className="p-6">
                        <TabsContent value="overview">
                             <div className="space-y-8">
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">About Me</h4>
                                    <p className="text-muted-foreground">
                                        {doctor.bio || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
                                    </p>
                                </div>
                                <div className="widget education-widget">
                                    <h4 className="text-lg font-semibold mb-2">Education</h4>
                                    <div className="relative pl-6">
                                        <div className="absolute left-2.5 top-2 h-full border-l-2 border-border"></div>
                                        <ul className="space-y-6">
                                            {doctor.education?.map((edu: any, index: number) => (
                                                <li key={index} className="relative">
                                                    <div className="absolute -left-[29px] top-1.5 w-4 h-4 bg-background border-2 border-primary rounded-full"></div>
                                                    <p className="font-semibold">{edu.institution || `American Dental Medical University`}</p>
                                                    <p className="text-sm text-muted-foreground">{edu.course || 'BDS'}</p>
                                                    <p className="text-xs text-muted-foreground">{edu.startDate && edu.endDate ? `${new Date(edu.startDate).getFullYear()} - ${new Date(edu.endDate).getFullYear()}` : '1998 - 2003'}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="widget experience-widget">
                                    <h4 className="text-lg font-semibold mb-2">Work & Experience</h4>
                                    <div className="relative pl-6">
                                        <div className="absolute left-2.5 top-2 h-full border-l-2 border-border"></div>
                                        <ul className="space-y-6">
                                            {doctor.experience?.map((exp: any, index: number) => (
                                                <li key={index} className="relative">
                                                    <div className="absolute -left-[29px] top-1.5 w-4 h-4 bg-background border-2 border-primary rounded-full"></div>
                                                    <p className="font-semibold">{exp.hospital || 'Glowing Smiles Family Dental Clinic'}</p>
                                                    <p className="text-xs text-muted-foreground">{exp.startDate && exp.endDate ? `${new Date(exp.startDate).getFullYear()} - ${exp.currentlyWorking ? 'Present' : new Date(exp.endDate).getFullYear()}` : '2010 - Present'}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">Services</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.services?.map((service: string, index: number) => (
                                            <Badge key={index} variant="secondary">{service}</Badge>
                                        )) || ['Tooth cleaning', 'Root Canal Therapy', 'Implants'].map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">Specializations</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.specialization?.map((spec: string, index: number) => (
                                            <Badge key={index} variant="secondary">{spec}</Badge>
                                        )) || ['Dental Care', 'Orthodontist', 'Periodontist'].map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="locations">
                            <div className="space-y-6">
                                {mockClinics.map((clinic, index) => (
                                    <Card key={index} className="overflow-hidden">
                                        <CardContent className="p-4 grid md:grid-cols-12 gap-4">
                                            <div className="md:col-span-7 space-y-3">
                                                <h4 className="font-bold">{clinic.name}</h4>
                                                <p className="text-sm text-muted-foreground">{clinic.specialty}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < clinic.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                                                    <span className="text-xs text-muted-foreground ml-1">({clinic.rating})</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {clinic.location}</p>
                                                <div className="flex gap-2">
                                                    {clinic.images.map((img, i) => <Image key={i} src={img} alt="clinic" width={60} height={60} className="rounded-md" />)}
                                                </div>
                                            </div>
                                            <div className="md:col-span-5 space-y-2 border-l-0 md:border-l md:pl-4">
                                                {clinic.timings.map((time, i) => (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span className="font-medium">{time.days}</span>
                                                        <span className="text-muted-foreground">{time.hours}</span>
                                                    </div>
                                                ))}
                                                <div className="pt-2 text-2xl font-bold text-right text-primary">${clinic.price}</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews">
                            <div className="space-y-6">
                                {mockReviews.map((review, index) => (
                                    <div key={index} className="flex gap-4">
                                        <Avatar>
                                            <AvatarImage src={review.image} />
                                            <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h5 className="font-semibold">{review.author}</h5>
                                                    <p className="text-xs text-muted-foreground">{review.date}</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                     {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2">{review.content}</p>
                                        </div>
                                    </div>
                                ))}
                                <Button>Show all feedback ({mockReviews.length})</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="hours">
                            <div className="w-full max-w-md mx-auto">
                                <Card>
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex justify-between p-2 rounded-md bg-green-100 text-green-800">
                                            <p>Today <span className="font-semibold">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span></p>
                                            <Badge className="bg-green-600 text-white">Open Now</Badge>
                                        </div>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                            <div key={day} className="flex justify-between p-2">
                                                <p>{day}</p>
                                                <p className="text-muted-foreground">07:00 AM - 09:00 PM</p>
                                            </div>
                                        ))}
                                        <div className="flex justify-between p-2 rounded-md bg-red-100 text-red-800">
                                            <p>Sunday</p>
                                            <Badge variant="destructive">Closed</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}

export default ProfileContent;

    