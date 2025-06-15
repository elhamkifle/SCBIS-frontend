import { ethers } from "ethers";
import {create} from "zustand";
import { persist } from "zustand/middleware";

export type BlockchainStore = {
    walletAddress: string | null;
    signer: string | null; // Assuming signer is an object, adjust type as needed
    setWalletAddress: (data: string) => void;
    setSigner: (signer: string | null) => void;
    removeWalletAddress: () => void;
}

export const useBlockchainStore = create<BlockchainStore>()(
    persist(
        (set) => ({
            walletAdress: '',
            signer: null,
            setSigner: (signer: string | null) => set((state: BlockchainStore) => ({
                ...state,signer: signer,
            })),

            setWalletAddress: (data: string | null) =>
                set((state:BlockchainStore) => ({
                    ...state,
                    walletAddress: data,
                    
                })),

            removeWalletAddress: () =>
                set((state:BlockchainStore) => ({...state, walletAdress: null})),
        }),
        {
            name: "User-Wallet-Storage",
            partialize: (state:any) => ({...state}),
        }
    )
)