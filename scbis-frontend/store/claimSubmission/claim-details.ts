import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ClaimDetailsState {
    id: string;
    stage: "review" | "admin-approved" | "waiting-approval" | "in-person" | "under-review" | "winner-announced";
    adminImageUrl?: string;
    policeReportUrl?: string;
    proformaUrls?: string[];
    winnerProformaUrl?: string;
    setClaim: (claim: Partial<ClaimDetailsState>) => void;
    nextStage: () => void;
    clearAllData: () => void;
}

const initialClaim: ClaimDetailsState = {
    id: "",
    stage: "review",
    adminImageUrl: "",
    policeReportUrl: "",
    proformaUrls: [],
    winnerProformaUrl: "",
    setClaim: () => { },
    nextStage: () => { },
    clearAllData: () => { },
};

export const useClaimDetailsStore = create<ClaimDetailsState>()(
    persist(
        (set) => ({
            ...initialClaim,
            setClaim: (claim) => set((state) => ({ ...state, ...claim })),
            nextStage: () => set((state) => {
                const order: ClaimDetailsState["stage"][] = [
                    "review",
                    "admin-approved",
                    "waiting-approval",
                    "in-person",
                    "under-review",
                    "winner-announced",
                ];
                const idx = order.indexOf(state.stage);
                if (idx < order.length - 1) {
                    return { ...state, stage: order[idx + 1] };
                }
                return state;
            }),
            clearAllData: () => set(initialClaim),
        }),
        {
            name: 'claim-details-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
); 