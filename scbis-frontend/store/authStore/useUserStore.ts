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
    roles: string[],
    accessToken: string,
    refreshToken: string,
    title?: string,
    tinNumber?: string,
    regionOrState?: string,
    nationality?: string,
    gender?: string,
    dateOfBirth?: string,
    wereda?: string,
    houseNumber?: string,
    language?: string,
    timezone?: string,
    isPhoneVerified?: boolean,
    status?: string,
    lastActive?: string,
    updatedAt?: string,
    __v?: number,
    idDocumentUrls?: string[],
}

type userStoreType = {
    user: userType | null,
    setUser: (user: userType) => void,
    resetUser: () => void,
    logout: () => void,
}

export const useUserStore = create<userStoreType>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({user}),
            resetUser: () => set({user: null}),
            logout: () => {
                // Clear cookies
                if (typeof document !== 'undefined') {
                    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
                    document.cookie = 'refresh_token=; path=/; max-age=0; SameSite=Lax';
                }
                // Reset user state
                set({user: null});
            }
        }),
        {
            name: "SCBIS-user-storage",
            partialize: (state) => ({user: state.user}),
        }
    )
);