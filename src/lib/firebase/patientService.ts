import { 
  collection, doc, getDoc, setDoc, updateDoc, onSnapshot, 
  query, where, orderBy, limit, addDoc, serverTimestamp, Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Core interfaces
export interface PatientProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HealthMetrics {
  id?: string;
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  temperature?: number;
  glucoseLevel?: number;
  bmi?: number;
  spo2?: number;
  weight?: number;
  height?: number;
  recordedAt: Timestamp;
  recordedBy?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage?: string;
  appointmentDate: Timestamp;
  duration: number;
  type: 'video' | 'clinic' | 'audio';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  prescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  type: 'lab-result' | 'imaging' | 'prescription' | 'diagnosis' | 'other';
  description?: string;
  doctorId?: string;
  doctorName?: string;
  fileUrl?: string;
  results?: any;
  createdAt: Timestamp;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'reminder' | 'result' | 'payment' | 'general';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Timestamp;
}

export interface Dependent {
  id: string;
  patientId: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  relation: string;
  photoURL?: string;
  medicalConditions?: string[];
  createdAt: Timestamp;
}

/**
 * Service for patient-related Firebase operations
 */
export class FirebasePatientService {
  // Patient Profile CRUD
  static async createPatientProfile(uid: string, profileData: Partial<PatientProfile>) {
    const patientRef = doc(db, 'patients', uid);
    await setDoc(patientRef, {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  static async getPatientProfile(uid: string): Promise<PatientProfile | null> {
    const docSnap = await getDoc(doc(db, 'patients', uid));
    return docSnap.exists() ? docSnap.data() as PatientProfile : null;
  }

  static async updatePatientProfile(uid: string, updates: Partial<PatientProfile>) {
    await updateDoc(doc(db, 'patients', uid), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  // Health Metrics
  static async addHealthMetrics(patientId: string, metrics: Omit<HealthMetrics, 'recordedAt'>) {
    await addDoc(collection(db, 'patients', patientId, 'healthMetrics'), {
      ...metrics,
      recordedAt: serverTimestamp()
    });
  }

  static subscribeToHealthMetrics(patientId: string, callback: (metrics: HealthMetrics[]) => void) {
    const q = query(
      collection(db, 'patients', patientId, 'healthMetrics'),
      orderBy('recordedAt', 'desc'),
      limit(10)
    );
    
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealthMetrics)));
    });
  }

  // Appointments
  static async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) {
    await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  static subscribeToPatientAppointments(patientId: string, callback: (appointments: Appointment[]) => void) {
    const q = query(
      collection(db, 'appointments'),
      where('patientId', '==', patientId),
      orderBy('appointmentDate', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment)));
    });
  }

  // Utility function to initialize sample data
  static async initializePatientDashboard(patientId: string) {
    await this.addHealthMetrics(patientId, {
      heartRate: 72,
      bloodPressure: { systolic: 120, diastolic: 80 },
      temperature: 36.5,
      glucoseLevel: 85,
      bmi: 22.5,
      spo2: 98,
      weight: 70,
      height: 175,
      recordedBy: 'self'
    });
  }
}

// UI Helper
export const transformHealthMetricsForUI = (metrics: HealthMetrics) => {
  return [
    { id: 'heart-rate', title: 'Heart Rate', value: `${metrics.heartRate || 0} Bpm` },
    { id: 'blood-pressure', title: 'Blood Pressure', 
      value: metrics.bloodPressure ? 
        `${metrics.bloodPressure.systolic}/${metrics.bloodPressure.diastolic} mmHg` : 'N/A' },
    { id: 'temperature', title: 'Temperature', value: `${metrics.temperature || 0}°C` },
    { id: 'glucose', title: 'Glucose', value: `${metrics.glucoseLevel || 0} mg/dL` },
    { id: 'bmi', title: 'BMI', value: `${metrics.bmi || 0} kg/m²` },
    { id: 'spo2', title: 'SPO2', value: `${metrics.spo2 || 0}%` }
  ];
};
