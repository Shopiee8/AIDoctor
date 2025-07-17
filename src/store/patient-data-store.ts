
import { create } from 'zustand';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LucideIcon } from 'lucide-react';
import { Heart, Thermometer, TestTube2, Droplets, LineChart, User, Calendar, Bell, Wallet, Hospital, Video } from "lucide-react";

// Types
interface HealthRecord {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  trend?: string;
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

interface Favorite {
    name: string;
    specialty: string;
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

interface ReportItem {
    id: string;
    doctor: string;
    image: string;
    date: string;
    type: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
}

interface MedicalRecordItem {
    id: string;
    name: string;
    date: string;
    comments: string;
}

interface PrescriptionItem {
    id: string;
    name: string;
    date: string;
    doctor: string;
    image: string;
}

interface InvoiceItem {
    id: string;
    doctor: string;
    image: string;
    date: string;
    amount: number;
}

interface Reports {
    appointments: ReportItem[];
    medicalRecords: MedicalRecordItem[];
    prescriptions: PrescriptionItem[];
    invoices: InvoiceItem[];
}

interface PersonalDetails {
    age?: number;
    gender?: 'male' | 'female';
}

interface PatientDataState {
    personalDetails: PersonalDetails;
    healthRecords: HealthRecord[];
    healthReport: HealthReport;
    analytics: AnalyticsData;
    favorites: Favorite[];
    appointmentDates: AppointmentDate[];
    upcomingAppointments: UpcomingAppointment[];
    notifications: Notification[];
    dependents: Dependent[];
    reports: Reports;
    isLoading: boolean;
    fetchPatientData: (userId: string) => () => void;
    clearPatientData: () => void;
}

const initialPatientDataState: Omit<PatientDataState, 'fetchPatientData' | 'clearPatientData'> = {
    personalDetails: {},
    healthRecords: [],
    healthReport: { percentage: 0, title: 'No report available', details: ''},
    analytics: { heartRate: [], bloodPressure: [] },
    favorites: [],
    appointmentDates: [],
    upcomingAppointments: [],
    notifications: [],
    dependents: [],
    reports: { appointments: [], medicalRecords: [], prescriptions: [], invoices: [] },
    isLoading: true,
};


export const usePatientDataStore = create<PatientDataState>((set) => ({
    ...initialPatientDataState,
    fetchPatientData: (userId: string) => {
        set({ isLoading: true });
        const userDocRef = doc(db, 'users', userId);

        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                // Use live data if it exists, otherwise use initial empty state.
                set({
                    personalDetails: data.personalDetails || initialPatientDataState.personalDetails,
                    healthRecords: data.dashboard?.healthRecords || initialPatientDataState.healthRecords,
                    healthReport: data.dashboard?.healthReport || initialPatientDataState.healthReport,
                    analytics: data.dashboard?.analytics || initialPatientDataState.analytics,
                    favorites: data.dashboard?.favorites || initialPatientDataState.favorites,
                    appointmentDates: data.dashboard?.appointmentDates || initialPatientDataState.appointmentDates,
                    upcomingAppointments: data.dashboard?.upcomingAppointments || initialPatientDataState.upcomingAppointments,
                    notifications: data.dashboard?.notifications || initialPatientDataState.notifications,
                    dependents: data.dashboard?.dependents || initialPatientDataState.dependents,
                    reports: data.dashboard?.reports || initialPatientDataState.reports,
                    isLoading: false,
                });
            } else {
                // If no user document exists, use initial empty state.
                console.warn(`No data found for user ${userId}. Displaying empty dashboard.`);
                set({ ...initialPatientDataState, isLoading: false });
            }
        }, (error) => {
            console.error("Error fetching patient data: ", error);
            // On error, reset to initial empty state
            set({ ...initialPatientDataState, isLoading: false });
        });

        return unsubscribe; // Return the unsubscribe function for cleanup
    },
    clearPatientData: () => set({...initialPatientDataState, isLoading: false}),
}));
