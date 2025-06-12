"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GeneralDetails {
    make: string;
    model: string;
    engineCapacity?: number;
    plateNumber: string;
    bodyType?: string;
    engineNumber?: string;
}

interface PrivateVehicle {
    usageType: string[];
    vehicleCategory: string;
    generalDetails: GeneralDetails;
    ownershipUsage?: {
        ownerType?: string;
        purchasedValue?: number;
        dutyFree?: boolean;
        driverType?: string;
        seatingCapacity?: number;
    };
    _id: string;
}

interface CommercialVehicle {
    usageType: string[];
    vehicleCategory: string;
    generalDetails: GeneralDetails;
    ownershipUsage?: {
        companyName?: string;
        driverType?: string;
        purchasedValue?: number;
    };
    _id: string;
}

interface Policy {
    _id: string;
    policyType: string;
    coverageEndDate: string;
    territory: string;
    policyId: string;
    duration: number;
    policyPeriodFrom: string;
    policyPeriodTo: string;
    status: {
        value: "Active" | "Renewal" | "Expired" | string;
        _id: string;
    };
    createdAt: string;
    vehicleType: "Private" | "Commercial" | string;
    imageUrl?: string;
    privateVehicle?: PrivateVehicle;
    commercialVehicle?: CommercialVehicle;
}


interface PoliciesState {
    policies: Policy[];
    selectedPolicy: string | null;
    setSelectedPolicy: (policyId: string) => void;
    addPolicies: (policies: Policy[]) => void;
    setPolicies: (policies: Policy[]) => void;
    clearAllPolicies: () => void;
}

export const usePoliciesStore = create<PoliciesState>()(
    persist(
        (set) => ({
            policies: [],
            selectedPolicy: null,
            setSelectedPolicy: (policyId) => set({ selectedPolicy: policyId }),
            addPolicies: (newPolicies) =>
                set(() => ({ policies: newPolicies })),
            setPolicies: (policies) => set({ policies }),
            clearAllPolicies: () => set({ policies: [] }),
        }),
        {
            name: "dashboard-policies-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
