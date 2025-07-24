
import { create } from 'zustand';
import type { Doctor } from './patient-data-store';

interface BookingDetails {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    patient: string;
    symptoms?: string;
}

interface BookingState {
    isBookingModalOpen: boolean;
    currentStep: number;
    doctor: Doctor | null;
    services: string[];
    appointmentType: string;
    clinic: string;
    appointmentDate?: Date;
    appointmentTime: string;
    bookingDetails: Partial<BookingDetails>;

    openBookingModal: (doctor: Doctor) => void;
    closeBookingModal: () => void;
    nextStep: () => void;
    prevStep: () => void;
    resetBooking: () => void;
    
    setServices: (services: string[]) => void;
    setAppointmentType: (type: string) => void;
    setClinic: (clinic: string) => void;
    setAppointmentDate: (date?: Date) => void;
    setAppointmentTime: (time: string) => void;
    setBookingDetails: (details: Partial<BookingDetails>) => void;
}

const initialState = {
    isBookingModalOpen: false,
    currentStep: 1,
    doctor: null,
    services: [],
    appointmentType: "clinic",
    clinic: "",
    appointmentDate: new Date(),
    appointmentTime: "",
    bookingDetails: {},
};


export const useBookingStore = create<BookingState>((set, get) => ({
    ...initialState,
    
    openBookingModal: (doctor) => set({ 
        ...initialState, // Reset all fields on new booking
        isBookingModalOpen: true, 
        doctor: doctor,
        appointmentType: doctor.clinics && doctor.clinics.length > 0 ? "clinic" : "video",
    }),
    closeBookingModal: () => set({ isBookingModalOpen: false }),
    nextStep: () => set(state => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
    prevStep: () => set(state => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
    resetBooking: () => {
        const currentDoctor = get().doctor;
        set({ ...initialState, doctor: currentDoctor, isBookingModalOpen: true });
    },
    
    setServices: (services) => set({ services }),
    setAppointmentType: (appointmentType) => set({ appointmentType, clinic: "" }), // Reset clinic when type changes
    setClinic: (clinic) => set({ clinic }),
    setAppointmentDate: (appointmentDate) => set({ appointmentDate }),
    setAppointmentTime: (appointmentTime) => set({ appointmentTime }),
    setBookingDetails: (details) => set(state => ({ bookingDetails: {...state.bookingDetails, ...details} })),
}));
