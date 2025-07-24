
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { LandingHeader } from '@/components/landing-header';
import { Footer } from "@/components/home/footer";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MapPin,
  Heart,
  Share2,
  Link as LinkIcon,
  ThumbsUp,
  CheckCircle,
  MessageCircle,
  Phone,
  Video,
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Building,
  Watch,
  User as UserIcon,
  Circle,
  Reply,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useBookingStore } from '@/store/booking-store';

// Helper to join array or fallback to string
const joinOrString = (val: any, sep = ', ') => {
    if (Array.isArray(val)) {
      // Check if array contains objects with a 'value' property
      if (val.length > 0 && typeof val[0] === 'object' && val[0] !== null && 'value' in val[0]) {
        return val.map(item => item.value).join(sep);
      }
      return val.join(sep);
    }
    return val || '';
};

// Helper for slider arrows
const SliderArrow = ({ className, onClick, children, isNext = false }: any) => (
  <div
    className={cn("absolute top-1/2 -translate-y-1/2 z-10", isNext ? 'right-0' : 'left-0', className)}
    onClick={onClick}
  >
    <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
      {children}
    </Button>
  </div>
);

// Navigation links for sticky nav
const navLinks = [
    { href: "#doc_bio", label: "Doctor Bio" },
    { href: "#experience", label: "Experience" },
    { href: "#insurance", label: "Insurances" },
    { href: "#services", label: "Treatments" },
    { href: "#speciality", label: "Speciality" },
    { href: "#availability", label: "Availability" },
    { href: "#clinic", label: "Clinics" },
    { href: "#membership", label: "Memberships" },
    { href: "#awards", label: "Awards" },
    { href: "#business_hours", label: "Business Hours" },
    { href: "#review", label: "Review" },
];


const DoctorProfile = ({ doctorId }: { doctorId?: string }) => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openBookingModal } = useBookingStore();

  const handleBookNow = () => {
    if (doctor) {
      openBookingModal(doctor);
    }
  };


  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError(null);
      try {
        const id = doctorId;
        if (!id) throw new Error('No doctor ID provided');
        const docRef = doc(db, 'doctors', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDoctor({id: docSnap.id, ...docSnap.data()});
        } else {
          setError('Doctor not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);


  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SliderArrow isNext><ChevronRight className="h-4 w-4" /></SliderArrow>,
    prevArrow: <SliderArrow><ChevronLeft className="h-4 w-4" /></SliderArrow>,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };
  
    const availabilitySettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1,
        nextArrow: <SliderArrow isNext><ChevronRight className="h-4 w-4" /></SliderArrow>,
        prevArrow: <SliderArrow><ChevronLeft className="h-4 w-4" /></SliderArrow>,
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 7 } },
            { breakpoint: 1300, settings: { slidesToShow: 6 } },
            { breakpoint: 1000, settings: { slidesToShow: 5 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 480, settings: { slidesToShow: 2 } },
        ],
    };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-destructive">{error}</div>;
  if (!doctor) return <div className="min-h-screen flex items-center justify-center">No doctor data available.</div>;
  
  return (
    <div className="main-wrapper">
      <LandingHeader />
      <div className="breadcrumb-bar py-4 bg-muted/20">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb justify-center bg-transparent p-0 m-0 text-sm">
                  <li className="breadcrumb-item"><Link href="/" className="text-muted-foreground">Home</Link></li>
                  <li className="breadcrumb-item text-primary" aria-current="page">Doctor Profile</li>
                </ol>
                <h2 className="breadcrumb-title text-2xl font-bold mt-2">Doctor Profile</h2>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      <div className="content py-8">
        <div className="container">
           <Card className="doc-profile-card">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 flex flex-col sm:flex-row gap-4">
                     <div className="flex-shrink-0">
                        <Image
                          src={doctor.image || "https://placehold.co/150x150.png"}
                          className="rounded-lg object-cover w-32 h-32"
                          alt={doctor.name}
                          width={150}
                          height={150}
                        />
                     </div>
                      <div className="flex-1">
                        {doctor.available && <Badge className="bg-green-100 text-green-700 mb-2"><Circle className="w-2 h-2 mr-1.5 fill-current" /> Available</Badge>}
                        <h4 className="text-2xl font-bold flex items-center gap-2">
                          {doctor.name}
                          {doctor.isVerified && <CheckCircle className="w-5 h-5 text-green-500" />}
                          <Badge variant="outline">{joinOrString(doctor.specialization) || doctor.specialty}</Badge>
                        </h4>
                        <p className="text-muted-foreground">{joinOrString(doctor.degree)}</p>
                        <p className="text-sm text-muted-foreground">Speaks: {joinOrString(doctor.languages)}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4" /> {doctor.location}
                        </p>
                      </div>
                  </div>
                  <div className="lg:col-span-4">
                     <div className="space-y-3">
                       <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><ThumbsUp className="w-4 h-4" /> Recommended</span> <strong>{doctor.recommendation || '94%'}</strong></div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2"><Star className="w-4 h-4" /> Rating</div>
                            <div className="flex items-center gap-1 font-bold">{doctor.rating} <span className="text-xs text-muted-foreground font-normal">({doctor.reviewsCount || 0} reviews)</span></div>
                        </div>
                       <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><Watch className="w-4 h-4" /> Availability</span> <strong>{doctor.employmentType || 'Full Time'}</strong></div>
                     </div>
                     <Separator className="my-4" />
                      <div className="flex items-center justify-center gap-2">
                           <Button variant="outline" size="icon"><Heart className="w-4 h-4" /></Button>
                           <Button variant="outline" size="icon"><Share2 className="w-4 h-4" /></Button>
                           <Button variant="outline" size="icon"><LinkIcon className="w-4 h-4" /></Button>
                           <Button variant="outline"><Phone className="w-4 h-4 mr-2" /> Audio Call</Button>
                           <Button><Video className="w-4 h-4 mr-2" /> Video Call</Button>
                      </div>
                  </div>
                </div>
                 <Separator className="my-6" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                       <span className="bg-blue-100 text-blue-600 p-2 rounded-lg flex items-center gap-1.5 text-xs"><Calendar className="w-4 h-4"/> 200+ Appointments</span>
                       <span className="bg-green-100 text-green-600 p-2 rounded-lg flex items-center gap-1.5 text-xs"><Award className="w-4 h-4"/> 15+ Awards</span>
                       <span className="bg-purple-100 text-purple-600 p-2 rounded-lg flex items-center gap-1.5 text-xs"><Building className="w-4 h-4"/> 21+ Years in Practice</span>
                    </div>
                    <p><strong>Price:</strong> ${doctor.fees || '100'} - $500 for a session</p>
                    <Button size="lg" className="w-full md:w-auto" onClick={handleBookNow}>Book Appointment</Button>
                </div>
              </CardContent>
           </Card>

          {/* Sticky Nav */}
           <Card className="mt-6 sticky top-20 z-30">
                <CardContent className="p-2">
                    <ul className="flex items-center justify-center flex-wrap gap-4">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary p-2">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

          {/* Detailed Info */}
          <div className="mt-8">
            <Card id="doc_bio">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>{doctor.bio || "No biography available."}</p>
              </CardContent>
            </Card>

            {doctor.experience && Array.isArray(doctor.experience) && doctor.experience.length > 0 && (
              <Card className="mt-6" id="experience">
                <CardHeader><CardTitle>Practice Experience</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {doctor.experience.map((exp: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                         <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h5 className="font-semibold">{exp.hospital}</h5>
                        <p className="text-sm text-muted-foreground">{exp.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - {exp.currentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                        </p>
                        <p className="text-sm mt-1">{exp.jobDescription}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="mt-6" id="insurance">
                <CardHeader>
                    <CardTitle>Insurance Accepted ({doctor.insurance?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Slider {...sliderSettings}>
                        {(doctor.insurance || []).map((ins: any, index: number) => (
                            <div key={index} className="px-2">
                                <div className="p-4 border rounded-lg flex items-center justify-center h-20">
                                    <Image src={ins.logo || `https://placehold.co/100x40.png?text=${ins.value}`} alt={ins.value} width={100} height={40} data-ai-hint="insurance logo" />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </CardContent>
            </Card>

            {doctor.services && Array.isArray(doctor.services) && doctor.services.length > 0 && (
                <Card className="mt-6" id="services">
                    <CardHeader><CardTitle>Services &amp; Pricing</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {doctor.services.map((service: any, index: number) => (
                                <li key={index} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted">
                                    <span className='flex items-center gap-2'><CheckCircle className="w-4 h-4 text-primary" /> {service.value || service}</span>
                                    <span className="font-bold">${Math.floor(Math.random() * (100 - 20 + 1)) + 20}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
            
            {doctor.specialization && Array.isArray(doctor.specialization) && doctor.specialization.length > 0 && (
                 <Card className="mt-6" id="speciality">
                    <CardHeader><CardTitle>Specializations</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                           {doctor.specialization.map((spec: any, index: number) => (
                                <li key={index} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-primary" /> {spec.value || spec}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
            
            <Card className="mt-6" id="availability">
                <CardHeader>
                    <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                     <Slider {...availabilitySettings}>
                        {[...Array(14)].map((_, i) => {
                             const date = new Date();
                             date.setDate(date.getDate() + i);
                             const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                             const dayOfMonth = date.getDate();
                             return (
                                <div key={i} className="px-2">
                                    <div className="p-4 border rounded-lg text-center cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                                        <p className="font-semibold">{day}</p>
                                        <p className="text-sm">{dayOfMonth}</p>
                                    </div>
                                </div>
                            )
                        })}
                     </Slider>
                </CardContent>
            </Card>

            <Card className="mt-6" id="clinic">
                 <CardHeader><CardTitle>Clinics &amp; Locations</CardTitle></CardHeader>
                 <CardContent className="space-y-6">
                    {(doctor.clinics || []).map((clinic: any, index: number) => (
                        <div key={index} className="grid md:grid-cols-2 gap-6 items-center">
                            <div>
                                <div className="flex items-center gap-4">
                                    <Image src={clinic.logo || "https://placehold.co/80x80.png"} alt={clinic.name} width={80} height={80} className="rounded-lg object-cover" />
                                    <div>
                                        <h5 className="font-bold">{clinic.name}</h5>
                                        <p className="text-sm text-muted-foreground">{clinic.address}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-48 w-full">
                               <iframe
                                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.7301009561315!2d-76.13077892422932!3d36.82498697224007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89bae976cfe9f8af%3A0xa61eac05156fbdb9!2sBeachStreet%20USA!5e0!3m2!1sen!2sin!4v1669777904208!5m2!1sen!2sin"
                                   className="w-full h-full border-0 rounded-lg"
                                   allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                />
                           </div>
                        </div>
                    ))}
                 </CardContent>
            </Card>

            <Card className="mt-6" id="membership">
                <CardHeader><CardTitle>Memberships</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {(doctor.memberships || []).map((mem: any, index: number) => (
                        <p key={index} className="text-sm flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />{mem.value || mem}</p>
                    ))}
                </CardContent>
            </Card>

            {doctor.awards && Array.isArray(doctor.awards) && doctor.awards.length > 0 && (
              <Card className="mt-6" id="awards">
                 <CardHeader><CardTitle>Awards</CardTitle></CardHeader>
                 <CardContent>
                    <Slider {...sliderSettings}>
                      {doctor.awards.map((award: any, index: number) => (
                        <div key={index} className="px-2">
                           <div className="border rounded-lg p-4 text-center">
                              <Award className="w-8 h-8 mx-auto text-primary mb-2" />
                              <h5 className="font-semibold">{award.value} ({award.year})</h5>
                              <p className="text-xs text-muted-foreground">{award.description}</p>
                           </div>
                        </div>
                      ))}
                    </Slider>
                 </CardContent>
              </Card>
            )}

            <Card className="mt-6" id="business_hours">
                <CardHeader><CardTitle>Business Hours</CardTitle></CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                            <li key={day} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{day}</span>
                                <span className="text-muted-foreground">07:00 AM - 09:00 PM</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

             <Card className="mt-6" id="review">
                <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Placeholder for reviews */}
                    <div className="border p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <UserIcon className="w-8 h-8 rounded-full bg-muted p-1" />
                                <div>
                                    <p className="font-semibold">John Doe</p>
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Excellent care and attention to detail. Dr. {doctor.name} was thorough and compassionate.</p>
                    </div>
                </CardContent>
             </Card>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorProfile;
