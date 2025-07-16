
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define types for the store's state
interface PersonalDetails {
    gender: 'male' | 'female';
    weight?: number;
    height?: number;
    age?: number;
    bloodType?: string;
    allergies?: string;
    hasPreExistingConditions: boolean;
    isTakingMedication: boolean;
    isPregnant: boolean;
}

interface FamilyMembers {
    self: boolean;
    spouse: boolean;
    childCount: number;
    mother: boolean;
    father: boolean;
}

interface FamilyDetails {
    spouse_age?: number;
    child_ages?: number[];
    father_age?: number;
    mother_age?: number;
}

interface Location {
    city: string;
    state: string;
}

interface RegistrationState {
    personalDetails: PersonalDetails;
    familyMembers: FamilyMembers;
    familyDetails: FamilyDetails;
    location: Location;
    setPersonalDetails: (details: PersonalDetails) => void;
    setFamilyMembers: (members: FamilyMembers) => void;
    setFamilyDetails: (details: FamilyDetails) => void;
    setLocation: (location: Location) => void;
    clearStore: () => void;
}

const initialState = {
    personalDetails: {
        gender: 'male' as 'male',
        hasPreExistingConditions: false,
        isTakingMedication: false,
        isPregnant: false,
    },
    familyMembers: {
        self: true,
        spouse: false,
        childCount: 0,
        mother: false,
        father: false,
    },
    familyDetails: {},
    location: {
        city: '',
        state: '',
    },
};

export const useRegistrationStore = create<RegistrationState>()(
    persist(
        (set) => ({
            ...initialState,
            setPersonalDetails: (personalDetails) => set({ personalDetails }),
            setFamilyMembers: (familyMembers) => set({ familyMembers }),
            setFamilyDetails: (familyDetails) => set({ familyDetails }),
            setLocation: (location) => set({ location }),
            clearStore: () => set(initialState),
        }),
        {
            name: 'patient-registration-storage', // name of the item in storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
