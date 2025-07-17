
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

const initialPatientDataState = {
    personalDetails: {},
    healthRecords: [],
    healthReport: { percentage: 0, title: '', details: ''},
    analytics: { heartRate: [], bloodPressure: [] },
    favorites: [],
    appointmentDates: [],
    upcomingAppointments: [],
    notifications: [],
    dependents: [],
    reports: { appointments: [], medicalRecords: [], prescriptions: [], invoices: [] },
    isLoading: true,
};

// Mock data to be used when Firestore data is not available
const mockData = {
    personalDetails: { age: 32, gender: 'female' },
    healthRecords: [
        { title: "Heart Rate", value: "140 Bpm", icon: Heart, color: "text-orange-500", trend: "+2%" },
        { title: "Body Temperature", value: "37.5 C", icon: Thermometer, color: "text-amber-500" },
        { title: "Glucose Level", value: "70-90", icon: TestTube2, color: "text-blue-500", trend: "-6%" },
        { title: "Blood Pressure", value: "100/70", icon: Droplets, color: "text-red-500", trend: "+2%" },
        { title: "SPO2", value: "96%", icon: LineChart, color: "text-indigo-500" },
        { title: "BMI", value: "20.1 kg/m2", icon: User, color: "text-purple-500" },
    ],
    healthReport: {
        percentage: 95,
        title: "Your health is 95% Normal",
        details: "Report generated on last visit: 25 Mar 2025"
    },
    analytics: {
        heartRate: [
          { month: "Mon", desktop: 140 }, { month: "Tue", desktop: 100 }, { month: "Wed", desktop: 180 }, { month: "Thu", desktop: 130 }, { month: "Fri", desktop: 100 }, { month: "Sat", desktop: 130 }
        ],
        bloodPressure: [
          { month: "Mon", systolic: 110, diastolic: 90 }, { month: "Tue", systolic: 90, diastolic: 60 }, { month: "Wed", systolic: 40, diastolic: 30 }, { month: "Thu", systolic: 120, diastolic: 60 }, { month: "Fri", systolic: 130, diastolic: 90 }, { month: "Sat", systolic: 130, diastolic: 70 }, { month: "Sun", systolic: 130, diastolic: 70 }
        ]
    },
    favorites: [
        { name: "Dr. Edalin", specialty: "Endodontist", image: "https://placehold.co/40x40.png" },
        { name: "Dr. Maloney", specialty: "Cardiologist", image: "https://placehold.co/40x40.png" },
        { name: "Dr. Wayne", specialty: "Dental Specialist", image: "https://placehold.co/40x40.png" },
        { name: "Dr. Marla", specialty: "Endodontist", image: "https://placehold.co/40x40.png" },
    ],
    appointmentDates: [
        { day: "19", weekday: "Mon", available: false },
        { day: "20", weekday: "Mon", available: false },
        { day: "21", weekday: "Tue", available: true },
        { day: "22", weekday: "Wed", available: true },
        { day: "23", weekday: "Thu", available: false },
        { day: "24", weekday: "Fri", available: false },
        { day: "25", weekday: "Sat", available: false },
    ],
    upcomingAppointments: [
      { id: '1', doctor: "Dr. Edalin Hendry", specialty: "Dentist", image: "https://placehold.co/40x40.png", typeIcon: Hospital, dateTime: "21 Mar 2025 - 10:30 PM" },
      { id: '2', doctor: "Dr. Juliet Gabriel", specialty: "Cardiologist", image: "https://placehold.co/40x40.png", typeIcon: Video, dateTime: "22 Mar 2025 - 10:30 PM" },
    ],
    notifications: [
        { id: '1', icon: Calendar, color: "bg-purple-100 text-purple-600", message: "Booking Confirmed on 21 Mar 2025 10:30 AM", time: "Just Now" },
        { id: '2', icon: Bell, color: "bg-blue-100 text-blue-600", message: "You have a New Review for your Appointment", time: "5 Days ago" },
        { id: '3', icon: Calendar, color: "bg-red-100 text-red-600", message: "You have Appointment with Ahmed by 01:20 PM", time: "12:55 PM" },
        { id: '4', icon: Wallet, color: "bg-yellow-100 text-yellow-600", message: "Sent an amount of $200 for an Appointment", time: "2 Days ago" },
    ],
    dependents: [
        { name: "Laura", relation: "Mother", age: 58, image: "https://placehold.co/40x40.png" },
        { name: "Mathew", relation: "Father", age: 59, image: "https://placehold.co/40x40.png" },
    ],
    reports: {
        appointments: [
            { id: "#AP1236", doctor: "Dr. Robert Womack", image: "https://placehold.co/40x40.png", date: "21 Mar 2025, 10:30 AM", type: "Video call", status: "Upcoming" },
            { id: "#AP3656", doctor: "Dr. Patricia Cassidy", image: "https://placehold.co/40x40.png", date: "28 Mar 2025, 11:40 AM", type: "Clinic Visit", status: "Completed" },
            { id: "#AP1246", doctor: "Dr. Kevin Evans", image: "https://placehold.co/40x40.png", date: "02 Apr 2025, 09:20 AM", type: "Audio Call", status: "Completed" },
            { id: "#AP6985", doctor: "Dr. Lisa Keating", image: "https://placehold.co/40x40.png", date: "15 Apr 2025, 04:10 PM", type: "Clinic Visit", status: "Cancelled" },
        ],
        medicalRecords: [
            { id: "#MR1236", name: "Electrocardiography", date: "24 Mar 2025", comments: "Take Good Rest" },
            { id: "#MR3656", name: "Complete Blood Count", date: "10 Apr 2025", comments: "Stable, no change" },
        ],
        prescriptions: [
            { id: "#P1236", name: "Prescription", date: "21 Mar 2025", doctor: "Edalin Hendry", image: "https://placehold.co/40x40.png" },
            { id: "#P3656", name: "Prescription", date: "28 Mar 2025", doctor: "John Homes", image: "https://placehold.co/40x40.png" },
        ],
        invoices: [
            { id: "#INV1236", doctor: "Edalin Hendry", image: "https://placehold.co/40x40.png", date: "24 Mar 2025", amount: 300 },
            { id: "#INV3656", doctor: "John Homes", image: "https://placehold.co/40x40.png", date: "17 Mar 2025", amount: 450 },
        ],
    },
}

export const usePatientDataStore = create<PatientDataState>((set) => ({
    ...initialPatientDataState,
    fetchPatientData: (userId: string) => {
        set({ isLoading: true });
        const userDocRef = doc(db, 'users', userId);

        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                set({
                    personalDetails: data.personalDetails || mockData.personalDetails,
                    healthRecords: data.healthRecords || mockData.healthRecords,
                    healthReport: data.healthReport || mockData.healthReport,
                    analytics: data.analytics || mockData.analytics,
                    favorites: data.favorites || mockData.favorites,
                    appointmentDates: data.appointmentDates || mockData.appointmentDates,
                    upcomingAppointments: data.upcomingAppointments || mockData.upcomingAppointments,
                    notifications: data.notifications || mockData.notifications,
                    dependents: data.dependents || mockData.dependents,
                    reports: data.reports || mockData.reports,
                    isLoading: false,
                });
            } else {
                // If no data exists, use mock data as a fallback
                console.warn(`No data found for user ${userId}. Using mock data.`);
                set({ ...mockData, isLoading: false });
            }
        }, (error) => {
            console.error("Error fetching patient data: ", error);
            // On error, also use mock data
            set({ ...mockData, isLoading: false });
        });

        return unsubscribe; // Return the unsubscribe function for cleanup
    },
    clearPatientData: () => set(initialPatientDataState),
}));
