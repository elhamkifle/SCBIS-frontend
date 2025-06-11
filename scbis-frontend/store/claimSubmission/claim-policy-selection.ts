import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GeneralDetails {
  make: string;
  model: string;
  manufacturingYear?: number;
  chassisNumber?: string;
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
  title: string;
  policyId: string;
  policyType: string;
  coverageArea: string;
  createdAt: string;
  privateVehicle?: PrivateVehicle;
  commercialVehicle?: CommercialVehicle;
}

interface ClaimPolicyState {
  policies: Policy[];
  selectedPolicy: string | null;
  addPolicies: (policies: Policy[]) => void;
  removePolicy: (policyId: string) => void;
  selectPolicy: (policyId: string) => void;
  clearSelection: () => void;
  clearAllData: () => void;
}

export const useClaimPolicyStore = create<ClaimPolicyState>()(
  persist(
    (set) => ({
      policies: [],
      selectedPolicy: null,

      addPolicies: (newPolicies) =>
        set(() => ({ policies: newPolicies })),

      removePolicy: (policyId) =>
        set((state) => ({
          policies: state.policies.filter((p) => p._id !== policyId),
          selectedPolicy: state.selectedPolicy === policyId ? null : state.selectedPolicy,
        })),

      selectPolicy: (policyId) => set({ selectedPolicy: policyId }),

      clearSelection: () => set({ selectedPolicy: null }),

      clearAllData: () => set({ policies: [], selectedPolicy: null }),
    }),
    {
      name: 'claim-policy-selection-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        policies: state.policies,
        selectedPolicy: state.selectedPolicy,
      }),
    }
  )
);
