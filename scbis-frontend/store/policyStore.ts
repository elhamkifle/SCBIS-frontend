import { create } from 'zustand';

interface Policy {
    id: string;
    certificateNumber: string;
    dateOfIssuance: string;
    nameOfInsured: string;
    addressRegion: string;
    city: string;
    subCityZone: string;
    wereda: string;
    kebele: string;
    phoneNumber: string;
    plateNumber: string;
    engineNumber: string;
    chassisNumber: string;
    vehicleType: string;
    carryingCapacity: string;
    insurerPolicyNo: string;
    policyPeriodFrom: string;
    policyPeriodTo: string;
    conditions: string;
    entitledPersons: string;
    nameOfInsurer: string;
    premiumTariff: string;
    authorizedPerson: string;
}

interface PolicyState {
    policies: Policy[];
    selectedPolicy: Policy | null;
    loading: boolean;
    error: string | null;
    setPolicies: (policies: Policy[]) => void;
    setSelectedPolicy: (policy: Policy | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    getPolicyById: (id: string) => Policy | undefined;
    fetchPolicyDetails: (id: string) => Promise<void>;
}

const mockPolicies: Policy[] = [
    {
        id: "1",
        certificateNumber: "CN-2589192547",
        dateOfIssuance: "17-Mar-2025",
        nameOfInsured: "JOHN DOE",
        addressRegion: "Addis Ababa",
        city: "Addis Ababa",
        subCityZone: "Bole",
        wereda: "15",
        kebele: "11",
        phoneNumber: "0911678721",
        plateNumber: "2AAA89483",
        engineNumber: "TSZ-0292157",
        chassisNumber: "SCP10-3152920",
        vehicleType: "Private vehicles",
        carryingCapacity: "4 persons",
        insurerPolicyNo: "PN-2502456547",
        policyPeriodFrom: "",
        policyPeriodTo: "",
        conditions: "Private Use Vehicle",
        entitledPersons: "Any Person With a Valid Driving License",
        nameOfInsurer: "Nile Insurance Company S.C.",
        premiumTariff: "3165",
        authorizedPerson: ""
    }
];

export const usePolicyStore = create<PolicyState>((set, get) => ({
    policies: mockPolicies,
    selectedPolicy: null,
    loading: false,
    error: null,
    setPolicies: (policies) => set({ policies }),
    setSelectedPolicy: (policy) => set({ selectedPolicy: policy }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    getPolicyById: (id) => {
        return get().policies.find((p) => p.id === id);
    },
    fetchPolicyDetails: async (id: string) => {
        try {
            set({ loading: true, error: null });
            // For now, using mock data
            const policy = get().getPolicyById(id);
            set({ selectedPolicy: policy || null });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch policy details' });
        } finally {
            set({ loading: false });
        }
    }
})); 