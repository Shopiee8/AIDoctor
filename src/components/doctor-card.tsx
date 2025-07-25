'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, Star, MapPin, Calendar, CheckCircle, Clock, 
  Languages, Award, ThumbsUp, Bot, User, Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBookingStore } from '@/store/booking-store';
import { usePatientDataStore } from '@/store/patient-data-store';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  image: string;
  imageHint?: string;
  isVerified?: boolean;
  isFavorited?: boolean;
  nextAvailable?: string;
  lastBooked?: string;
  degree?: string;
  languages?: string | string[];
  experience?: any;
  votes?: string;
  fees?: string;
  available?: boolean;
  type: 'AI' | 'Human';
  aiMatchScore?: number;
  specialization?: string | string[];
  education?: any;
  bio?: string;
  services?: string[];
  clinics?: any[];
}

interface DoctorCardProps {
  doctor: Doctor;
  viewMode?: 'list' | 'grid';
}

function getExperienceSummary(experience: any): string {
  if (!experience) return 'N/A';
  if (typeof experience === 'string') return experience;
  if (Array.isArray(experience)) {
    if (experience.length === 0) return 'N/A';
    const mostRecent = experience.find(exp => exp.currentlyWorking) || experience[0];
    if (mostRecent.yearOfExperience) return `${mostRecent.yearOfExperience} years`;
    if (mostRecent.title && mostRecent.hospital) return `${mostRecent.title} at ${mostRecent.hospital}`;
    return mostRecent.title || mostRecent.hospital || 'N/A';
  }
  return 'N/A';
}

function getSpecialty(doctor: Doctor): string {
  if (Array.isArray(doctor.specialization) && doctor.specialization.length > 0) {
    return doctor.specialization.join(', ');
  }
  if (typeof doctor.specialty === 'string') {
    return doctor.specialty;
  }
  return 'Specialty';
}

function getDegree(education: any): string {
  if (Array.isArray(education) && education.length > 0) {
    const mostRecent = education[0];
    return mostRecent.course || mostRecent.degree || 'Degree';
  }
  return education || 'Degree';
}

function getLanguages(languages: any): string {
  if (Array.isArray(languages)) {
    return languages.join(', ');
  }
  return languages || 'Languages';
}

function getCurrentFacility(doctor: any): string {
  if (Array.isArray(doctor.experience)) {
    const current = doctor.experience.find((exp: any) => exp.currentlyWorking && (exp.hospital || exp.clinic));
    if (current) return current.hospital || current.clinic || '';
  }
  if (Array.isArray(doctor.clinics)) {
    const currentClinic = doctor.clinics.find((c: any) => c.isCurrent || c.currentlyWorking);
    if (currentClinic) return currentClinic.name || '';
  }
  return doctor.location || 'Facility';
}

function getAiMatch(aiMatchScore: any): string {
  if (typeof aiMatchScore === 'number') {
    return `${aiMatchScore}% AI Match`;
  }
  return '';
}

function GridViewCard({
  doctor,
  isFavorited,
  handleFavoriteClick,
  handleBookNow,
  isAuthLoading,
  isAuthenticated,
}: {
  doctor: Doctor;
  isFavorited: boolean;
  handleFavoriteClick: (e: React.MouseEvent) => void;
  handleBookNow: () => void;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
}) {
  const experienceText = typeof doctor.experience === 'string' ? doctor.experience : 'N/A';

  return (
    <div
      className={cn(
        "doctor-card-container card h-full doctor-list-card border rounded-lg bg-card text-card-foreground shadow-sm transition-all hover:shadow-xl hover:-translate-y-1",
        doctor.type === 'AI' && "ai-doctor-card"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="card-img card-img-hover relative w-full h-56 flex-shrink-0">
          <Link href={`/doctor-profile/${doctor.id}`}>
            <Image
              src={doctor.image}
              alt={doctor.name}
              width={300}
              height={220}
              className="w-full h-full object-cover rounded-t-lg"
              data-ai-hint={doctor.imageHint || "doctor portrait"}
            />
          </Link>
          <div className="absolute top-3 right-3 z-10">
            <span className="badge bg-background/80 backdrop-blur-sm text-primary px-2 py-1 flex items-center gap-1 shadow">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {doctor.rating}
            </span>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 left-3 z-10 p-1.5 bg-background/60 backdrop-blur-sm rounded-full text-destructive transition-colors hover:bg-destructive/10"
          >
            <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
          </button>
          <Badge variant={doctor.type === 'AI' ? 'default' : 'secondary'} className="shadow-md">
            {doctor.type === 'AI' ? <Bot className="w-3.5 h-3.5 mr-1" /> : <User className="w-3.5 h-3.5 mr-1" />}
            {doctor.type}
          </Badge>
        </div>
        <div className="card-body p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-xs text-primary">{getSpecialty(doctor)}</span>
            {doctor.available ? (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>Available
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-red-100 text-red-700">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>Unavailable
              </Badge>
            )}
          </div>
          <h6 className="flex items-center text-lg font-bold font-headline mt-2">
            <Link href={`/doctor-profile/${doctor.id}`}>{doctor.name}</Link>
            {doctor.isVerified && <CheckCircle className="w-4 h-4 text-green-500 ms-2" />}
          </h6>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">{getDegree(doctor.education)}</p>
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <MapPin className="w-3 h-3 mr-1.5" />
            {getCurrentFacility(doctor)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{getLanguages(doctor.languages)}</p>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ThumbsUp className="w-3 h-3 mr-1.5 text-primary" />
            {doctor.votes || 'Votes'}
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Award className="w-3 h-3 mr-1.5 text-primary" />
            {getExperienceSummary(doctor.experience)}
          </div>
          {getAiMatch(doctor.aiMatchScore) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Sparkles className="w-3 h-3 mr-1.5 text-primary" />
                    {getAiMatch(doctor.aiMatchScore)}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-semibold">AI Match Score: {doctor.aiMatchScore}%</p>
                    <p className="text-xs text-muted-foreground">
                      This score is calculated based on multiple factors:
                    </p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Specialty Relevance:</span>
                        <span className="text-primary">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Education & Training:</span>
                        <span className="text-primary">Excellent</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Awards & Recognition:</span>
                        <span className="text-primary">Outstanding</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conference Attendance:</span>
                        <span className="text-primary">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Patient Reviews:</span>
                        <span className="text-primary">{doctor.rating || 0}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span className="text-primary">{getExperienceSummary(doctor.experience)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Availability:</span>
                        <span className="text-primary">{doctor.available ? 'Available' : 'Busy'}</span>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="font-bold">Consultation Fees</span>
            <span className="ml-2 text-primary">{doctor.fees ? `$${doctor.fees}` : '$0'}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Clock className="w-3 h-3 mr-1.5 text-primary" />
            Next available at {doctor.nextAvailable || 'N/A'}
          </div>
          <Button
            size="sm"
            onClick={handleBookNow}
            disabled={isAuthLoading || !isAuthenticated}
            className="mt-3"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {isAuthLoading
              ? 'Loading...'
              : !isAuthenticated
              ? 'Login to Book'
              : doctor.type === 'AI'
              ? 'Consult Now'
              : 'Book'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ListViewCard({
  doctor,
  isFavorited,
  handleFavoriteClick,
  handleBookNow,
  isAuthLoading,
  isAuthenticated,
}: {
  doctor: Doctor;
  isFavorited: boolean;
  handleFavoriteClick: (e: React.MouseEvent) => void;
  handleBookNow: () => void;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
}) {
  const experienceSummary = getExperienceSummary(doctor.experience);

  return (
    <div
      className={cn(
        "doctor-card-container card doctor-list-card border rounded-lg bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg",
        doctor.type === 'AI' && "ai-doctor-card"
      )}
    >
      <div className="p-4 md:flex md:items-center gap-4">
        <div className="card-img card-img-hover relative w-full md:w-52 h-56 flex-shrink-0">
          <Link href={`/doctor-profile/${doctor.id}`}>
            <Image
              src={doctor.image}
              alt={doctor.name}
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-lg"
              data-ai-hint={doctor.imageHint || "doctor portrait"}
            />
          </Link>
          <div className="absolute top-2 right-2 z-10">
            <span className="badge bg-background/80 backdrop-blur-sm text-primary px-2 py-1 flex items-center gap-1 shadow">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {doctor.rating}
            </span>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 left-2 z-10 p-1.5 bg-background/60 backdrop-blur-sm rounded-full text-destructive transition-colors hover:bg-destructive/10"
          >
            <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
          </button>
          <div className="absolute bottom-2 left-2 z-10">
            <Badge variant={doctor.type === 'AI' ? 'default' : 'secondary'} className="shadow-md">
              {doctor.type === 'AI' ? <Bot className="w-3.5 h-3.5 mr-1" /> : <User className="w-3.5 h-3.5 mr-1" />}
              {doctor.type}
            </Badge>
          </div>
        </div>
        <div className="card-body p-0 mt-4 md:mt-0 flex-1">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="font-medium text-sm text-primary">{getSpecialty(doctor)}</span>
            {doctor.available ? (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>Available
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-red-100 text-red-700">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>Unavailable
              </Badge>
            )}
          </div>
          <h6 className="flex items-center text-xl font-bold font-headline mt-2">
            <Link href={`/doctor-profile/${doctor.id}`}>{doctor.name}</Link>
            {doctor.isVerified && <CheckCircle className="w-4 h-4 text-green-500 ms-2" />}
          </h6>
          <p className="text-sm text-muted-foreground mt-2">{getDegree(doctor.education)}</p>
          <p className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 mr-1.5" />
            {getCurrentFacility(doctor)}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <p className="d-flex align-items-center mb-0">
              <Languages className="w-4 h-4 mr-1.5 text-primary" />
              {getLanguages(doctor.languages)}
            </p>
            <p className="d-flex align-items-center mb-0">
              <ThumbsUp className="w-4 h-4 mr-1.5 text-primary" />
              {doctor.votes || 'Votes'} Votes
            </p>
            <p className="d-flex align-items-center mb-0">
              <Award className="w-4 h-4 mr-1.5 text-primary" />
              {experienceSummary}
            </p>
            {getAiMatch(doctor.aiMatchScore) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-1.5 text-primary" />
                      {getAiMatch(doctor.aiMatchScore)}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      This score is calculated based on factors like specialty relevance, patient reviews, successful consultations, and availability.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2 mt-auto border-t pt-3">
            <div>
              <p className="text-sm text-muted-foreground">Fees</p>
              <h3 className="text-lg font-bold text-primary">{doctor.fees ? `$${doctor.fees}` : '$0'}</h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Next available at
              </p>
              <p className="text-sm font-semibold">{doctor.nextAvailable || 'N/A'}</p>
            </div>
            <Button size="default" onClick={handleBookNow} disabled={isAuthLoading}>
              <Calendar className="w-4 h-4 mr-2" />
              {isAuthLoading
                ? 'Loading...'
                : !isAuthenticated
                ? 'Login to Book'
                : doctor.type === 'AI'
                ? 'Consult Now'
                : 'Book Appointment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DoctorCard({ doctor, viewMode = 'list' }: DoctorCardProps) {
  const { favorites } = usePatientDataStore();
  const { user, loading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [isFavorited, setIsFavorited] = useState(favorites.some(fav => fav.name === doctor.name));

  const { openBookingModal } = useBookingStore();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorited(!isFavorited);
  };

  const handleBookNow = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    openBookingModal(doctor);
  };

  if (viewMode === 'grid') {
    return (
      <GridViewCard
        doctor={doctor}
        isFavorited={isFavorited}
        handleFavoriteClick={handleFavoriteClick}
        handleBookNow={handleBookNow}
        isAuthLoading={isAuthLoading}
        isAuthenticated={!!user}
      />
    );
  }

  return (
    <ListViewCard
      doctor={doctor}
      isFavorited={isFavorited}
      handleFavoriteClick={handleFavoriteClick}
      handleBookNow={handleBookNow}
      isAuthLoading={isAuthLoading}
      isAuthenticated={!!user}
    />
  );
}
