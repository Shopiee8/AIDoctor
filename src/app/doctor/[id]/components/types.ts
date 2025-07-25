export interface DoctorProfileProps {
  // Define the props for the DoctorProfile component
  doctor?: {
    id: string;
    name: string;
    specialty: string | string[];
    // Add other doctor properties as needed
  };
  // Add other props as needed
}

export interface Experience {
  id?: string;
  title?: string;
  hospital?: string;
  clinic?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  jobDescription?: string;
  yearOfExperience?: number;
}

export interface Education {
  degree: string;
  university: string;
  year: number;
}

export interface DoctorData {
  id: string;
  name: string;
  specialty: string | string[];
  isAI?: boolean;
  bio?: string;
  experience?: Experience | Experience[];
  rating?: number;
  reviewsCount?: number;
  price?: number;
  languages?: string[];
  location?: string;
  hospital?: string;
  imageUrl?: string;
  availability?: {
    days: string[];
    hours: string;
  };
  education?: Education[];
  certifications?: string[];
}
