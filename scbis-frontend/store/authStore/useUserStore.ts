import {create} from "zustand";
import {persist} from "zustand/middleware";

export type userType = {
    _id: string,
    fullname: string,
    email: string,
    phoneNumber: string,
    city: string,
    country: string,
    zone: string,
    kebele: string,
    subcity: string,
    otp: string,
    otpAttempts: number,
    otpExpiration: string,
    password: string,
    role: string[],
    accessToken: string,
    refreshToken: string,
}

export type userStoreType = {
    user: userType | null,
    setUser: (user: userType) => void,
    resetUser: () => void,
}

export const useUserStore = create<userStoreType>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({user}),
            resetUser: () => set({user: null}),
        }),
        {
            name: "SCBIS-user-storage",
            partialize: (state) => ({user: state.user}),
        }
    )
);