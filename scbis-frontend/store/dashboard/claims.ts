"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Driver {
    firstName: string;
    lastName: string;
    age: number;
    city: string;
    subCity: string;
    kebele: string;
    phoneNumber: string;
    licenseNo: string;
    grade: string;
    expirationDate: string;
}

interface Injuries {
    anyInjuries: boolean;
    injuredPersons: any[]; // You might want to define a proper type for injuredPersons
}

interface Claim {
    _id: string;
    userId: string;
    policyId: string;
    status: string;
    statusReason: string;
    coverageAmount: number;
    garage: string;
    sparePartsFrom: string;
    fixType: string;
    isDriverSameAsInsured: boolean;
    driver: Driver;
    injuries: Injuries;
    policeReport: string;
    proformaSubmitted: boolean;
    policeReportRequestLetter: string;
    damageImages: string[];
    evidenceDocuments: string[];
    sketchFiles: string;
    vehicleDamageFiles: string;
    thirdPartyDamageFiles: string;
    otherVehicles: any[]; // You might want to define a proper type
    vehicleOccupants: any[]; // You might want to define a proper type
    independentWitnesses: any[]; // You might want to define a proper type
    createdAt: string;
    updatedAt: string;
    dateSubmitted: string;
    declaration: boolean;
}

interface ClaimsState {
    claims: Claim[];
    setClaims: (claims: Claim[]) => void;
    addClaim: (claim: Claim) => void;
    removeClaim: (id: string) => void;
    updateClaim: (id: string, claim: Partial<Claim>) => void;
    clearAllClaims: () => void;
}

export const useClaimsStore = create<ClaimsState>()(
    persist(
        (set) => ({
            claims: [],
            setClaims: (claims) => set({ claims }),
            addClaim: (claim) => set((state) => ({
                claims: [...state.claims, claim]
            })),
            removeClaim: (id) => set((state) => ({
                claims: state.claims.filter(c => c._id !== id)
            })),
            updateClaim: (id, claim) => set((state) => ({
                claims: state.claims.map(c =>
                    c._id === id ? { ...c, ...claim } : c
                )
            })),
            clearAllClaims: () => set({ claims: [] })
        }),
        {
            name: 'dashboard-claims-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);