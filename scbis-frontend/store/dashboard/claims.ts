"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Claim {
    id: string;
    plateNumber: string;
    claimReportedOn: string;
    policyId: string;
    coverageType: string;
    status: 'Under Review' | 'Approved' | 'Rejected';
    imageUrl: string;
}

interface ClaimsState {
    claims: Claim[];
    addClaim: (claim: Claim) => void;
    removeClaim: (id: string) => void;
    updateClaim: (id: string, claim: Partial<Claim>) => void;
    clearAllClaims: () => void;
}

const initialClaims: Claim[] = [
    {
        id: "1",
        plateNumber: "A 12345",
        claimReportedOn: "01/01/24",
        policyId: "P/12345",
        coverageType: "Comprehensive",
        status: "Under Review",
        imageUrl: "/Private.png"
    }
];

export const useClaimsStore = create<ClaimsState>()(
    persist(
        (set) => ({
            claims: initialClaims,
            addClaim: (claim) => set((state) => ({
                claims: [...state.claims, claim]
            })),
            removeClaim: (id) => set((state) => ({
                claims: state.claims.filter(c => c.id !== id)
            })),
            updateClaim: (id, claim) => set((state) => ({
                claims: state.claims.map(c =>
                    c.id === id ? { ...c, ...claim } : c
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