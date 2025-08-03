export interface AIDoctor {
  id: string;
  name: string;
  gender: 'male' | 'female';
  specialty: string;
  specialtyId: string;
  avatar: string;
  rating: number;
  experience: number; // years of experience
  description: string;
  languages: string[];
  consultationFee: number;
}

export interface MedicalSpecialty {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const medicalSpecialties: MedicalSpecialty[] = [
  {
    id: 'general-practice',
    name: 'General Practice',
    icon: '👨‍⚕️',
    description: 'Comprehensive primary care for all ages and general health concerns.',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: '❤️',
    description: 'Specialized care for heart and cardiovascular conditions.',
    color: 'bg-red-100 text-red-800',
  },
  {
    id: 'neurology',
    name: 'Neurology',
    icon: '🧠',
    description: 'Expert care for brain and nervous system disorders.',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    icon: '👶',
    description: 'Healthcare for infants, children, and adolescents.',
    color: 'bg-pink-100 text-pink-800',
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    icon: '✨',
    description: 'Specialized care for skin, hair, and nail conditions.',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry',
    icon: '🧠',
    description: 'Mental health and behavioral disorder treatment.',
    color: 'bg-green-100 text-green-800',
  },
];

export const aiDoctors: AIDoctor[] = [
  // General Practice Doctors
  {
    id: 'gp-1',
    name: 'Dr. Sarah Johnson',
    gender: 'female',
    specialty: 'General Practice',
    specialtyId: 'general-practice',
    avatar: '/assets/doctors/dr-sarah-johnson.jpg',
    rating: 4.9,
    experience: 12,
    description: 'Board-certified family physician with extensive experience in primary care and preventive medicine.',
    languages: ['English', 'Spanish'],
    consultationFee: 99,
  },
  {
    id: 'gp-2',
    name: 'Dr. Michael Chen',
    gender: 'male',
    specialty: 'General Practice',
    specialtyId: 'general-practice',
    avatar: '/assets/doctors/dr-michael-chen.jpg',
    rating: 4.8,
    experience: 8,
    description: 'Primary care physician focused on patient-centered care and health education.',
    languages: ['English', 'Mandarin'],
    consultationFee: 89,
  },
  
  // Cardiology Doctors
  {
    id: 'cardio-1',
    name: 'Dr. Emily Rodriguez',
    gender: 'female',
    specialty: 'Cardiology',
    specialtyId: 'cardiology',
    avatar: '/assets/doctors/dr-emily-rodriguez.jpg',
    rating: 4.9,
    experience: 15,
    description: 'Cardiologist specializing in preventive cardiology and heart disease management.',
    languages: ['English', 'Spanish'],
    consultationFee: 149,
  },
  {
    id: 'cardio-2',
    name: 'Dr. James Wilson',
    gender: 'male',
    specialty: 'Cardiology',
    specialtyId: 'cardiology',
    avatar: '/assets/doctors/dr-james-wilson.jpg',
    rating: 4.7,
    experience: 10,
    description: 'Interventional cardiologist with expertise in complex coronary interventions.',
    languages: ['English'],
    consultationFee: 159,
  },
  
  // Add more doctors for other specialties...
  
  // Neurology Doctors
  {
    id: 'neuro-1',
    name: 'Dr. Olivia Park',
    gender: 'female',
    specialty: 'Neurology',
    specialtyId: 'neurology',
    avatar: '/assets/doctors/dr-olivia-park.jpg',
    rating: 4.8,
    experience: 9,
    description: 'Neurologist specializing in headaches, migraines, and neurological disorders.',
    languages: ['English', 'Korean'],
    consultationFee: 139,
  },
  {
    id: 'neuro-2',
    name: 'Dr. Robert Taylor',
    gender: 'male',
    specialty: 'Neurology',
    specialtyId: 'neurology',
    avatar: '/assets/doctors/dr-robert-taylor.jpg',
    rating: 4.9,
    experience: 14,
    description: 'Expert in movement disorders and neuro-degenerative diseases.',
    languages: ['English', 'French'],
    consultationFee: 149,
  },
  
  // Add more doctors for remaining specialties...
];

// Helper function to get doctors by specialty
export function getDoctorsBySpecialty(specialtyId: string): AIDoctor[] {
  try {
    if (!specialtyId) {
      console.error('No specialty ID provided to getDoctorsBySpecialty');
      return [];
    }
    
    const doctors = aiDoctors.filter(doctor => doctor.specialtyId === specialtyId);
    
    if (!doctors.length) {
      console.warn(`No doctors found for specialty ID: ${specialtyId}`);
    }
    
    return doctors;
  } catch (error) {
    console.error('Error in getDoctorsBySpecialty:', error);
    return [];
  }
}

// Helper function to get specialty by ID
export function getSpecialtyById(id: string): MedicalSpecialty | undefined {
  try {
    if (!id) {
      console.error('No ID provided to getSpecialtyById');
      return undefined;
    }
    
    const specialty = medicalSpecialties.find(specialty => specialty.id === id);
    
    if (!specialty) {
      console.warn(`No specialty found with ID: ${id}`);
    }
    
    return specialty;
  } catch (error) {
    console.error('Error in getSpecialtyById:', error);
    return undefined;
  }
}

// Function to get all specialties with error handling
export function getAllSpecialties(): MedicalSpecialty[] {
  try {
    return [...medicalSpecialties];
  } catch (error) {
    console.error('Error in getAllSpecialties:', error);
    return [];
  }
}

// Function to get doctor by ID with error handling
export function getAIDoctorById(id: string): AIDoctor | undefined {
  try {
    if (!id) {
      console.error('No ID provided to getAIDoctorById');
      return undefined;
    }
    
    const doctor = aiDoctors.find(doc => doc.id === id);
    
    if (!doctor) {
      console.warn(`No AI doctor found with ID: ${id}`);
    }
    
    return doctor;
  } catch (error) {
    console.error('Error in getAIDoctorById:', error);
    return undefined;
  }
}
