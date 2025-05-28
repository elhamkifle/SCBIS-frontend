"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Policy {
    id: string;
    plateNumber: string;
    policyType: string;
    purpose: string;
    passengers: string;
    policyPeriod: {
        start: string;
        end: string;
    };
    status: 'Active' | 'Renewal' | 'Expired';
    imageUrl: string;
}

interface PoliciesState {
    policies: Policy[];
    addPolicy: (policy: Policy) => void;
    removePolicy: (id: string) => void;
    updatePolicy: (id: string, policy: Partial<Policy>) => void;
    clearAllPolicies: () => void;
}

const initialPolicies: Policy[] = [
    {
        id: "1",
        plateNumber: "A 12345",
        policyType: "Comprehensive",
        purpose: "Private",
        passengers: "5 Seater",
        policyPeriod: {
            start: "01/01/24",
            end: "01/01/25"
        },
        status: "Active",
        imageUrl: "/Private.png"
    },
    {
        id: "2",
        plateNumber: "B 67890",
        policyType: "Comprehensive",
        purpose: "Commercial",
        passengers: "3 Seater",
        policyPeriod: {
            start: "01/01/24",
            end: "01/01/25"
        },
        status: "Renewal",
        imageUrl: "/Commercial.png"
    }
];

export const usePoliciesStore = create<PoliciesState>()(
    persist(
        (set) => ({
            policies: initialPolicies,
            addPolicy: (policy) => set((state) => ({
                policies: [...state.policies, policy]
            })),
            removePolicy: (id) => set((state) => ({
                policies: state.policies.filter(p => p.id !== id)
            })),
            updatePolicy: (id, policy) => set((state) => ({
                policies: state.policies.map(p =>
                    p.id === id ? { ...p, ...policy } : p
                )
            })),
            clearAllPolicies: () => set({ policies: [] })
        }),
        {
            name: 'dashboard-policies-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
); 