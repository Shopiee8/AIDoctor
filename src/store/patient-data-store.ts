

import { create } from 'zustand';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LucideIcon } from 'lucide-react';
import { Heart, Thermometer, Brain, Droplets, LineChart, User, Calendar, Bell, Wallet, Hospital, Video, Scale, Wind } from "lucide-react";
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

interface PatientDataState {
    healthRecords: HealthRecord[];
    healthReport: HealthReport;
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
    healthReport: { percentage: 0, title: 'No report available', details: ''},
    analytics: { heartRate: [], bloodPressure: [] },
    favorites: [],
    appointmentDates: [],
    upcomingAppointments: [],
    notifications: [],
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
