

import { create } from 'zustand';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LucideIcon } from 'lucide-react';
import { Heart, Thermometer, Brain, Droplets, LineChart, User, Calendar, Bell, Wallet, Hospital, Video, Scale, Wind, FileText } from "lucide-react";
import type { Appointment } from '@/types';


// Types
export interface HealthRecord {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

interface VitalsSummaryData {
    heartRate?: number;
    temperature?: number;
    glucoseLevel?: number;
    bloodPressure?: string;
    bmi?: number;
    spo2?: number;
}

interface HealthReport {
    percentage: number;
    title: string;
    details: string;
}

interface AnalyticsData {
    heartRate: { month: string; desktop: number }[];
    bloodPressure: { month: string; systolic: number; diastolic: number }[];
}

export interface Doctor {
    name: string;
    specialty: string;
    location: string;
    rating: number;
    image: string;
}

interface AppointmentDate {
    day: string;
    weekday: string;
    available: boolean;
}

interface UpcomingAppointment {
    doctor: string;
    specialty: string;
    image: string;
    typeIcon: LucideIcon;
    dateTime: string;
}

interface Notification {
    id: string;
    icon: LucideIcon;
    color: string;
    message: string;
    time: string;
}

interface Dependent {
    name: string;
    relation: string;
    age: number;
    image: string;
}

interface RelaxationData {
    timeOfRelaxation: { date: string; relaxation: number }[];
    relaxationVsMood: { day: string; Relaxation: number; Mood: number }[];
    relaxationDistribution: { activity: string; value: number }[];
    bestTimeOfDay: { name: string; minutes: number; color: string }[];
    audioTherapy: { name: string; duration: string; progress: number }[];
}

interface PatientDataState {
    healthRecords: HealthRecord[];
    healthReport: HealthReport;
    relaxationData: RelaxationData;
    analytics: AnalyticsData;
    favorites: Doctor[];
    appointmentDates: AppointmentDate[];
    upcomingAppointments: UpcomingAppointment[];
    notifications: Notification[];
    dependents: Dependent[];
    isLoading: boolean;
    fetchPatientData: (userId: string) => () => void;
    clearPatientData: () => void;
}

const initialPatientDataState: Omit<PatientDataState, 'fetchPatientData' | 'clearPatientData'> = {
    healthRecords: [],
    healthReport: { percentage: 95, title: 'Your Health is Normal', details: 'Keep up the good work to maintain your excellent health status. Your biological age is well-managed.'},
    relaxationData: {
        timeOfRelaxation: [
            { date: '21', relaxation: 20 }, { date: '22', relaxation: 40 }, { date: '23', relaxation: 35 },
            { date: '24', relaxation: 60 }, { date: '25', relaxation: 50 }, { date: '26', relaxation: 90 },
            { date: '27', relaxation: 45 }, { date: '28', relaxation: 55 }, { date: '29', relaxation: 70 },
            { date: '30', relaxation: 65 },
        ],
        relaxationVsMood: [
            { day: 'Mon', Relaxation: 45, Mood: 30 }, { day: 'Tue', Relaxation: 50, Mood: 40 },
            { day: 'Wed', Relaxation: 65, Mood: 45 }, { day: 'Thu', Relaxation: 55, Mood: 35 },
            { day: 'Fri', Relaxation: 70, Mood: 50 }, { day: 'Sat', Relaxation: 80, Mood: 60 },
            { day: 'Sun', Relaxation: 75, Mood: 55 },
        ],
        relaxationDistribution: [
            { activity: 'Napping', value: 80 }, { activity: 'Meditation', value: 90 },
            { activity: 'Watch TV', value: 40 }, { activity: 'Walking Outdoors', value: 70 },
            { activity: 'Music', value: 60 }, { activity: 'Reading', value: 75 },
        ],
        bestTimeOfDay: [
            { name: 'Morning', minutes: 58, color: 'var(--color-chart-1)' },
            { name: 'Afternoon', minutes: 42, color: 'var(--color-chart-2)' },
            { name: 'Evening', minutes: 29, color: 'var(--color-chart-4)' },
        ],
        audioTherapy: [
            { name: 'Delta (0.5-4Hz)', duration: '54m', progress: 90 },
            { name: 'Alpha (8-12 Hz)', duration: '43m', progress: 70 },
            { name: 'Beta (12-30 Hz)', duration: '8m', progress: 15 },
        ],
    },
    analytics: { heartRate: [], bloodPressure: [] },
    favorites: [],
    appointmentDates: [],
    upcomingAppointments: [],
    notifications: [
        { id: '1', icon: Bell, color: 'bg-blue-100 text-blue-600', message: "Your appointment with Dr. Smith is confirmed for tomorrow.", time: "2 hours ago" },
        { id: '2', icon: FileText, color: 'bg-green-100 text-green-600', message: "New care plan available from your AI Doctor.", time: "1 day ago" },
    ],
    dependents: [],
    isLoading: true,
};

// This function transforms raw vitals data into the structure the UI needs
const transformVitalsToHealthRecords = (vitals?: VitalsSummaryData): HealthRecord[] => {
    if (!vitals) return [];
    
    const records: HealthRecord[] = [];

    if (vitals.bloodPressure) {
        records.push({ title: "Blood Pressure", value: `${vitals.bloodPressure} mmHg`, icon: Droplets, color: "text-red-500" });
    }
    if (vitals.heartRate) {
        records.push({ title: "Heart Rate", value: `${vitals.heartRate} Bpm`, icon: Heart, color: "text-orange-500", trend: "+2%" });
    }
    if (vitals.glucoseLevel) {
        records.push({ title: "Glucose Level", value: `${vitals.glucoseLevel} mg/dL`, icon: Brain, color: "text-blue-700" });
    }
    if (vitals.temperature) {
        records.push({ title: "Body Temperature", value: `${vitals.temperature} °C`, icon: Thermometer, color: "text-amber-500" });
    }
    if (vitals.bmi) {
        records.push({ title: "BMI", value: `${vitals.bmi} kg/m²`, icon: Scale, color: "text-purple-500" });
    }
    if (vitals.spo2) {
        records.push({ title: "SPO2", value: `${vitals.spo2}%`, icon: Wind, color: "text-cyan-500" });
    }

    return records;
};


export const usePatientDataStore = create<PatientDataState>((set, get) => ({
    ...initialPatientDataState,
    fetchPatientData: (userId: string) => {
        set({ isLoading: true });
        
        const userDocRef = doc(db, 'users', userId);
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                
                set({
                    healthRecords: transformVitalsToHealthRecords(data.dashboard?.vitalsSummary),
                    healthReport: data.dashboard?.healthReport || initialPatientDataState.healthReport,
                    analytics: data.dashboard?.analytics || initialPatientDataState.analytics,
                    favorites: data.dashboard?.favorites || initialPatientDataState.favorites,
                    appointmentDates: data.dashboard?.appointmentDates || initialPatientDataState.appointmentDates,
                    upcomingAppointments: data.dashboard?.upcomingAppointments || initialPatientDataState.upcomingAppointments,
                    notifications: data.dashboard?.notifications || initialPatientDataState.notifications,
                    dependents: data.dashboard?.dependents || initialPatientDataState.dependents,
                    // Relaxation data can also be made dynamic later
                    relaxationData: data.dashboard?.relaxationData || initialPatientDataState.relaxationData,
                    isLoading: false,
                });
            } else {
                console.warn(`No data found for user ${userId}. Displaying empty dashboard.`);
                set({ ...initialPatientDataState, isLoading: false });
            }
        }, (error) => {
            console.error("Error fetching patient data: ", error);
            set({ ...initialPatientDataState, isLoading: false });
        });

        return unsubscribe;
    },
    clearPatientData: () => set({...initialPatientDataState, isLoading: false}),
}));
