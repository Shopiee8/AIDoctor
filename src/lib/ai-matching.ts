// AI Matching Algorithm for Doctor-Patient Matching
// This is the core algorithm that calculates dynamic AI match scores
import { clinicalSpecialties } from "./specialties";

export interface PatientQuery {
  symptoms?: string[];
  condition?: string;
  specialty?: string;
  location?: string;
  urgency?: 'low' | 'medium' | 'high';
  preferredLanguage?: string;
  budget?: number;
  consultationType?: 'video' | 'audio' | 'chat' | 'in-person';
}

export interface DoctorData {
  id: string;
  name: string;
  specialization?: string[];
  specialty?: string;
  location?: string;
  rating?: number;
  reviews?: number;
  experience?: any[];
  education?: any[];
  awards?: any[];
  conferences?: any[];
  languages?: string[];
  fees?: number;
  available?: boolean;
  type: 'AI' | 'Human';
  consultationSuccessRate?: number;
  responseTime?: number; // in minutes
  totalConsultations?: number;
  recentConsultations?: number; // last 30 days
  verified?: boolean;
  onlineTherapy?: boolean;
  nextAvailable?: string;
}

export interface MatchScore {
  doctorId: string;
  doctorName: string;
  totalScore: number;
  breakdown: {
    specialtyMatch: number;
    educationScore: number;
    awardsScore: number;
    conferenceScore: number;
    reviewScore: number;
    experienceScore: number;
    availabilityScore: number;
    locationScore: number;
    languageScore: number;
    budgetScore: number;
    urgencyScore: number;
    consultationTypeScore: number;
  };
  aiMatchPercentage: number;
}

// Specialty matching keywords
const SPECIALTY_KEYWORDS = clinicalSpecialties.reduce((acc, spec) => {
    acc[spec.name] = spec.keywords;
    return acc;
}, {} as Record<string, string[]>);


// Education scoring
function calculateEducationScore(education: any[]): number {
    if (!education || !Array.isArray(education) || education.length === 0) return 0;
    
    let score = 0;
    education.forEach(edu => {
        if (!edu || typeof edu !== 'object') return;
        
        // Medical degrees get higher scores
        if (edu.course?.toLowerCase().includes('mbbs') || edu.course?.toLowerCase().includes('md')) {
            score += 25;
        } else if (edu.course?.toLowerCase().includes('ms') || edu.course?.toLowerCase().includes('mch')) {
            score += 20;
        } else if (edu.course?.toLowerCase().includes('phd')) {
            score += 15;
        } else if (edu.course?.toLowerCase().includes('bachelor') || edu.course?.toLowerCase().includes('master')) {
            score += 10;
        }
        
        // Prestigious institutions get bonus points
        const prestigiousInstitutions = ['harvard', 'stanford', 'oxford', 'cambridge', 'johns hopkins', 'mayo clinic'];
        if (prestigiousInstitutions.some(inst => edu.institution?.toLowerCase().includes(inst))) {
            score += 10;
        }
    });
    
    return Math.min(score, 50); // Cap at 50 points
}

// Awards and recognition scoring
function calculateAwardsScore(awards: any[]): number {
    if (!awards || !Array.isArray(awards) || awards.length === 0) return 0;
    
    let score = 0;
    awards.forEach(award => {
        if (!award || typeof award !== 'object') return;
        
        // National/international awards get higher scores
        if (award.value?.toLowerCase().includes('national') || award.value?.toLowerCase().includes('international')) {
            score += 15;
        } else if (award.value?.toLowerCase().includes('best') || award.value?.toLowerCase().includes('excellence')) {
            score += 10;
        } else {
            score += 5;
        }
        
        // Recent awards (last 5 years) get bonus
        if (award.year && parseInt(award.year) >= new Date().getFullYear() - 5) {
            score += 5;
        }
    });
    
    return Math.min(score, 40); // Cap at 40 points
}

// Conference attendance scoring
function calculateConferenceScore(conferences: any[]): number {
    if (!conferences || !Array.isArray(conferences) || conferences.length === 0) return 0;
    
    let score = 0;
    conferences.forEach(conf => {
        if (!conf || typeof conf !== 'object') return;
        
        // International conferences get higher scores
        if (conf.value?.toLowerCase().includes('international') || conf.value?.toLowerCase().includes('world')) {
            score += 12;
        } else if (conf.value?.toLowerCase().includes('national') || conf.value?.toLowerCase().includes('annual')) {
            score += 8;
        } else {
            score += 5;
        }
        
        // Recent conferences (last 2 years) get bonus
        if (conf.year && parseInt(conf.year) >= new Date().getFullYear() - 2) {
            score += 3;
        }
    });
    
    return Math.min(score, 35); // Cap at 35 points
}

// Specialty matching based on symptoms
function calculateSpecialtyMatch(symptoms: string[], doctorSpecialization: string[]): number {
    if (!symptoms || symptoms.length === 0) return 50; // Default score if no symptoms
    if (!doctorSpecialization || !Array.isArray(doctorSpecialization) || doctorSpecialization.length === 0) return 25;
    
    let maxMatchScore = 0;
    
    symptoms.forEach(symptom => {
        Object.entries(SPECIALTY_KEYWORDS).forEach(([specialty, keywords]) => {
            if (keywords.some(keyword => symptom.toLowerCase().includes(keyword))) {
                // Check if doctor has this specialty
                const hasSpecialty = doctorSpecialization.some(spec => 
                    spec && typeof spec === 'string' && (
                        spec.toLowerCase().includes(specialty.toLowerCase()) ||
                        specialty.toLowerCase().includes(spec.toLowerCase())
                    )
                );
                
                if (hasSpecialty) {
                    maxMatchScore = Math.max(maxMatchScore, 100);
                }
            }
        });
    });
    
    return maxMatchScore;
}

// Review and rating scoring
function calculateReviewScore(rating: number, reviews: number): number {
  if (!rating || rating === 0) return 0;
  
  let score = rating * 10; // Base score from rating (0-50)
  
  // Bonus for number of reviews (more reviews = more reliable)
  if (reviews >= 100) score += 20;
  else if (reviews >= 50) score += 15;
  else if (reviews >= 20) score += 10;
  else if (reviews >= 10) score += 5;
  
  return Math.min(score, 50); // Cap at 50 points
}

// Experience scoring
function calculateExperienceScore(experience: any[]): number {
    if (!experience || !Array.isArray(experience) || experience.length === 0) return 0;
    
    let totalYears = 0;
    experience.forEach(exp => {
        if (exp && typeof exp === 'object' && exp.years) {
            totalYears += parseInt(exp.years) || 0;
        }
    });
    
    // Score based on years of experience
    if (totalYears >= 20) return 40;
    else if (totalYears >= 15) return 35;
    else if (totalYears >= 10) return 30;
    else if (totalYears >= 5) return 25;
    else if (totalYears >= 2) return 20;
    else return 10;
}

// Availability scoring
function calculateAvailabilityScore(doctor: DoctorData, urgency: string): number {
  if (!doctor.available) return 0;
  
  let score = 30; // Base score for being available
  
  // Higher urgency gets higher availability score
  if (urgency === 'high') score += 20;
  else if (urgency === 'medium') score += 10;
  
  // Bonus for immediate availability
  if (doctor.nextAvailable && doctor.nextAvailable.includes('Today')) {
    score += 15;
  } else if (doctor.nextAvailable && doctor.nextAvailable.includes('Tomorrow')) {
    score += 10;
  }
  
  return Math.min(score, 50);
}

// Location scoring
function calculateLocationScore(patientLocation: string, doctorLocation: string): number {
  if (!patientLocation || !doctorLocation) return 25; // Default score
  
  const patientLoc = patientLocation.toLowerCase();
  const doctorLoc = doctorLocation.toLowerCase();
  
  // Exact match
  if (patientLoc === doctorLoc) return 50;
  
  // Same city/region
  if (patientLoc.includes(doctorLoc) || doctorLoc.includes(patientLoc)) return 40;
  
  // Same state/country
  const patientWords = patientLoc.split(' ');
  const doctorWords = doctorLoc.split(' ');
  const commonWords = patientWords.filter(word => doctorWords.includes(word));
  
  if (commonWords.length > 0) return 30;
  
  return 20; // Different location
}

// Language scoring
function calculateLanguageScore(patientLanguage: string, doctorLanguages: string[]): number {
  if (!patientLanguage || !doctorLanguages || doctorLanguages.length === 0) return 25;
  
  const patientLang = patientLanguage.toLowerCase();
  
  if (doctorLanguages.some(lang => lang.toLowerCase().includes(patientLang))) {
    return 50;
  }
  
  return 25; // No language match
}

// Budget scoring
function calculateBudgetScore(patientBudget: number, doctorFees: number): number {
  if (!patientBudget || !doctorFees) return 25;
  
  if (doctorFees <= patientBudget) return 50;
  else if (doctorFees <= patientBudget * 1.2) return 40;
  else if (doctorFees <= patientBudget * 1.5) return 30;
  else return 10;
}

// Urgency scoring
function calculateUrgencyScore(urgency: string, doctorType: string): number {
  if (urgency === 'high' && doctorType === 'AI') return 50; // AI doctors for urgent cases
  else if (urgency === 'low' && doctorType === 'Human') return 50; // Human doctors for non-urgent
  else if (urgency === 'medium') return 40;
  else return 30;
}

// Consultation type scoring
function calculateConsultationTypeScore(patientType: string, doctorData: DoctorData): number {
  if (!patientType) return 25;
  
  if (patientType === 'video' && doctorData.onlineTherapy) return 50;
  else if (patientType === 'in-person' && !doctorData.onlineTherapy) return 50;
  else if (patientType === 'chat' && doctorData.type === 'AI') return 50;
  else return 30;
}

// Main AI matching function
export function calculateAIMatchScore(patientQuery: PatientQuery, doctor: DoctorData): MatchScore {
    const breakdown = {
        specialtyMatch: calculateSpecialtyMatch(patientQuery.symptoms || [], doctor.specialization || []),
        educationScore: calculateEducationScore(doctor.education || []),
        awardsScore: calculateAwardsScore(doctor.awards || []),
        conferenceScore: calculateConferenceScore(doctor.conferences || []),
        reviewScore: calculateReviewScore(doctor.rating || 0, doctor.reviews || 0),
        experienceScore: calculateExperienceScore(doctor.experience || []),
        availabilityScore: calculateAvailabilityScore(doctor, patientQuery.urgency || 'medium'),
        locationScore: calculateLocationScore(patientQuery.location || '', doctor.location || ''),
        languageScore: calculateLanguageScore(patientQuery.preferredLanguage || '', doctor.languages || []),
        budgetScore: calculateBudgetScore(patientQuery.budget || 0, doctor.fees || 0),
        urgencyScore: calculateUrgencyScore(patientQuery.urgency || 'medium', doctor.type),
        consultationTypeScore: calculateConsultationTypeScore(patientQuery.consultationType || '', doctor)
    };
    
    // Calculate total score (weighted average)
    const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
    const aiMatchPercentage = Math.round((totalScore / 600) * 100); // 600 is max possible score
    
    return {
        doctorId: doctor.id,
        doctorName: doctor.name,
        totalScore,
        breakdown,
        aiMatchPercentage: Math.min(aiMatchPercentage, 100)
    };
}

// Sort doctors by AI match score
export function sortDoctorsByAIMatch(patientQuery: PatientQuery, doctors: DoctorData[]): MatchScore[] {
  const matchScores = doctors.map(doctor => calculateAIMatchScore(patientQuery, doctor));
  
  return matchScores.sort((a, b) => b.aiMatchPercentage - a.aiMatchPercentage);
}

// Get top matches
export function getTopMatches(patientQuery: PatientQuery, doctors: DoctorData[], limit: number = 10): MatchScore[] {
  const sortedMatches = sortDoctorsByAIMatch(patientQuery, doctors);
  return sortedMatches.slice(0, limit);
}

// Update doctor's AI match score in Firestore
export async function updateDoctorAIMatchScore(doctorId: string, aiMatchScore: number) {
  // This would be called after successful consultations to update the doctor's score
  // Implementation depends on your Firestore structure
  console.log(`Updating AI match score for doctor ${doctorId}: ${aiMatchScore}%`);
} 
