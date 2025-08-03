
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, query, where, orderBy, startAt, endAt } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DoctorCard, type Doctor } from "@/components/doctor-card";
import { Button } from "@/components/ui/button";
import { Loader2, List, LayoutGrid, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { calculateAIMatchScore, sortDoctorsByAIMatch, type PatientQuery, type MatchScore } from '@/lib/ai-matching';
import type { DoctorData } from '@/lib/ai-matching';
import { getAIDoctorsByProvider } from '@/lib/firebase/providerService';
import { getCurrentUser } from '@/lib/session';

type ViewMode = 'list' | 'grid';

function ResultsComponent() {
    const searchParams = useSearchParams();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [matchScores, setMatchScores] = useState<MatchScore[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    useEffect(() => {
        const fetchDoctors = async () => {
            setIsLoading(true);
            try {
                // Fetch human doctors
                const doctorsRef = collection(db, 'doctors');
                const doctorsSnapshot = await getDocs(doctorsRef);
                
                // Fetch AI doctors
                const currentUser = await getCurrentUser();
                const aiDoctors = currentUser ? await getAIDoctorsByProvider(currentUser.id) : [];
                
                // Combine and map to Doctor type
                const allDoctors: Doctor[] = [];
                
                // Add human doctors
                doctorsSnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.name && data.specialty) {
                        const doctor: Doctor = {
                            id: doc.id,
                            type: 'Human',
                            name: data.name,
                            specialty: data.specialty,
                            specialization: Array.isArray(data.specialization) 
                                ? data.specialization 
                                : data.specialization ? [data.specialization] : [],
                            location: data.location || '',
                            rating: data.rating || 0,
                            experience: data.experience || [],
                            education: data.education || [],
                            languages: Array.isArray(data.languages) ? data.languages : [],
                            fees: data.fees || 0,
                            available: data.available || false,
                            isVerified: data.isVerified || false,
                            nextAvailable: data.nextAvailable || '',
                            image: data.image || '/default-avatar.png' // Add required image property
                        };
                        allDoctors.push(doctor);
                    }
                });
                
                // Add AI doctors
                aiDoctors.forEach((aiDoctor: any) => {
                    const doctor: Doctor = {
                        id: aiDoctor.id,
                        type: 'AI',
                        name: aiDoctor.name,
                        specialty: aiDoctor.specialty,
                        specialization: typeof aiDoctor.specialty === 'string' ? [aiDoctor.specialty] : [],
                        location: 'Online',
                        rating: aiDoctor.rating || 4.8,
                        experience: typeof aiDoctor.experience === 'number' 
                            ? [{ years: aiDoctor.experience }] 
                            : [],
                        education: aiDoctor.education || [],
                        languages: Array.isArray(aiDoctor.languages) ? aiDoctor.languages : ['English'],
                        fees: typeof aiDoctor.consultationFee === 'number' ? aiDoctor.consultationFee : 0,
                        available: aiDoctor.isActive !== false,
                        isVerified: true,
                        nextAvailable: 'Now',
                        aiMatchScore: 0, // Will be calculated below
                        image: aiDoctor.avatar || '/default-avatar.png' // Add required image property
                    };
                    allDoctors.push(doctor);
                });

                // Extract patient query from search parameters

                // Extract patient query from search parameters
                const patientQuery: PatientQuery = {
                    symptoms: searchParams.get('symptoms')?.split(',').map(s => s.trim()) || [],
                    condition: searchParams.get('condition') || '',
                    specialty: searchParams.get('specialty') || '',
                    location: searchParams.get('location') || '',
                    urgency: (searchParams.get('urgency') as 'low' | 'medium' | 'high') || 'medium',
                    preferredLanguage: searchParams.get('language') || '',
                    budget: parseInt(searchParams.get('budget') || '0'),
                    consultationType: (searchParams.get('type') as 'video' | 'audio' | 'chat' | 'in-person') || 'video'
                };

                // Apply basic filters first
                const searchQuery = searchParams.get('query')?.toLowerCase() || '';
                const locationQuery = searchParams.get('location')?.toLowerCase() || '';
                
                let filteredDoctors = allDoctors.filter(doc => {
                    const nameMatch = doc.name ? doc.name.toLowerCase().includes(searchQuery) : false;
                    const specialtyMatch = doc.specialty ? doc.specialty.toLowerCase().includes(searchQuery) : false;
                    const locationMatch = locationQuery 
                        ? (doc.location ? doc.location.toLowerCase().includes(locationQuery) : false)
                        : true;
                    
                    return (nameMatch || specialtyMatch) && locationMatch;
                });

                // Map Doctor to DoctorData for AI matching
                const doctorDataList = allDoctors.map(doctor => {
                    // Create a DoctorData object with required fields
                    const doctorData: DoctorData = {
                        id: doctor.id,
                        name: doctor.name,
                        specialty: doctor.specialty,
                        specialization: Array.isArray(doctor.specialization) 
                            ? doctor.specialization 
                            : doctor.specialization ? [doctor.specialization] : [],
                        location: doctor.location,
                        rating: doctor.rating || 0,
                        experience: Array.isArray(doctor.experience) 
                            ? doctor.experience 
                            : doctor.experience ? [{ years: Number(doctor.experience) }] : [],
                        education: [],
                        awards: [],
                        conferences: [],
                        languages: Array.isArray(doctor.languages) 
                            ? doctor.languages 
                            : doctor.languages ? [doctor.languages] : [],
                        fees: typeof doctor.fees === 'string' 
                            ? parseFloat(doctor.fees.replace(/[^0-9.]/g, '')) 
                            : Number(doctor.fees) || 0,
                        available: doctor.available || false,
                        type: doctor.type === 'AI' ? 'AI' : 'Human',
                        verified: (doctor as any).isVerified || false,
                        onlineTherapy: true,
                        nextAvailable: doctor.nextAvailable || ''
                    };
                    return doctorData;
                });
                
                // Calculate AI match scores using the mapped DoctorData
                const scores = sortDoctorsByAIMatch(patientQuery, doctorDataList);
                setMatchScores(scores);

                // Update doctors with their AI match scores
                const doctorsWithScores = allDoctors.map(doctor => {
                    const match = scores.find(score => score.doctorId === doctor.id);
                    return {
                        ...doctor,
                        aiMatchScore: match ? match.aiMatchPercentage : 0
                    };
                });

                setDoctors(doctorsWithScores);

            } catch (error) {
                console.error("Error fetching doctors: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
    }, [searchParams]);
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">
                        Showing <span className="text-primary">{doctors.length}</span> Results For You
                    </h3>
                    {matchScores.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                            <Sparkles className="w-4 h-4 inline mr-1" />
                            Results sorted by AI match score
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}>
                        <List className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}>
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {doctors.length === 0 ? (
                <Alert>
                    <AlertTitle>No Results Found</AlertTitle>
                    <AlertDescription>
                        No doctors, clinics, or hospitals matched your search criteria. Please try a different search.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className={cn(
                    viewMode === 'list' ? 'space-y-6' : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                )}>
                    {doctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} viewMode={viewMode} />
                    ))}
                </div>
            )}
            
            {doctors.length > 5 && (
                <div className="text-center mt-8">
                    <Button variant="outline">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Load More...
                    </Button>
                </div>
            )}
        </div>
    );
}

export function SearchResults() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ResultsComponent />
    </Suspense>
  );
}
