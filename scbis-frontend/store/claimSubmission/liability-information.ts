import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LiabilityInformationState {
  responsibleParty: string;
  otherInsuredStatus: string;
  OtherInsuranceCompanyName: string;
  policeInvolved: string;
  policeOfficerName: string;
  policeStation: string;
  setResponsibleParty: (party: string) => void;
  setOtherInsuredStatus: (status: string) => void;
  setOtherInsuranceCompanyName: (name: string) => void;
  setPoliceInvolved: (involved: string) => void;
  setpoliceOfficerName: (name: string) => void;
  setPoliceStation: (station: string) => void;
  clearAllData: () => void;
}

export const useLiabilityInformationStore = create<LiabilityInformationState>()(
  persist(
    (set) => ({
      responsibleParty: '',
      otherInsuredStatus: '',
      OtherInsuranceCompanyName: '',
      policeInvolved: '',
      policeOfficerName: '',
      policeStation: '',
      setResponsibleParty: (party) => set({ responsibleParty: party }),
      setOtherInsuredStatus: (status) => set({ otherInsuredStatus: status }),
      setOtherInsuranceCompanyName: (name) => set({ OtherInsuranceCompanyName: name }),
      setPoliceInvolved: (involved) => set({ policeInvolved: involved }),
      setpoliceOfficerName: (name) => set({ policeOfficerName: name }),
      setPoliceStation: (station) => set({ policeStation: station }),
      clearAllData: () => set({ 
        responsibleParty: '',
        otherInsuredStatus: '',
        OtherInsuranceCompanyName: '',
        policeInvolved: '',
        policeOfficerName: '',
        policeStation: ''
      })
    }),
    {
      name: 'liability-information-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);