
import { create } from 'zustand';

interface Doctor {
    name: string;
    specialty: string;
    location: string;
    rating: number;
    image: string;
}

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
    doctor: Doctor;
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

const initialDoctor: Doctor = {
    name: "Dr. Michael Brown",
    specialty: "Cardiology",
    location: "5th Street - 1011 W 5th St, Austin, TX 78703",
    rating: 5.0,
    image: "https://placehold.co/100x100.png"
};

const initialState = {
    isBookingModalOpen: false,
    currentStep: 1,
    doctor: initialDoctor,
    services: ["s1"],
    appointmentType: "clinic",
    clinic: "c1",
    appointmentDate: new Date(),
    appointmentTime: "",
    bookingDetails: {},
};


export const useBookingStore = create<BookingState>((set, get) => ({
    ...initialState,
    
    openBookingModal: (doctor) => set({ isBookingModalOpen: true, doctor: doctor || initialDoctor, currentStep: 1 }),
    closeBookingModal: () => set({ isBookingModalOpen: false }),
    nextStep: () => set(state => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
    prevStep: () => set(state => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
    resetBooking: () => set({ ...initialState, isBookingModalOpen: true }),
    
    setServices: (services) => set({ services }),
    setAppointmentType: (appointmentType) => set({ appointmentType }),
    setClinic: (clinic) => set({ clinic }),
    setAppointmentDate: (appointmentDate) => set({ appointmentDate }),
    setAppointmentTime: (appointmentTime) => set({ appointmentTime }),
    setBookingDetails: (details) => set(state => ({ bookingDetails: {...state.bookingDetails, ...details} })),
}));
