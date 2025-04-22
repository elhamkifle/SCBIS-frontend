import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LiabilityInformationState {
  responsibleParty: string;
  otherInsuredStatus: string;
  insuranceCompanyName: string;
  policeInvolved: string;
  officerName: string;
  policeStation: string;
  setResponsibleParty: (party: string) => void;
  setOtherInsuredStatus: (status: string) => void;
  setInsuranceCompanyName: (name: string) => void;
  setPoliceInvolved: (involved: string) => void;
  setOfficerName: (name: string) => void;
  setPoliceStation: (station: string) => void;
  clearAllData: () => void;
}

export const useLiabilityInformationStore = create<LiabilityInformationState>()(
  persist(
    (set) => ({
      responsibleParty: '',
      otherInsuredStatus: '',
      insuranceCompanyName: '',
      policeInvolved: '',
      officerName: '',
      policeStation: '',
      setResponsibleParty: (party) => set({ responsibleParty: party }),
      setOtherInsuredStatus: (status) => set({ otherInsuredStatus: status }),
      setInsuranceCompanyName: (name) => set({ insuranceCompanyName: name }),
      setPoliceInvolved: (involved) => set({ policeInvolved: involved }),
      setOfficerName: (name) => set({ officerName: name }),
      setPoliceStation: (station) => set({ policeStation: station }),
      clearAllData: () => set({ 
        responsibleParty: '',
        otherInsuredStatus: '',
        insuranceCompanyName: '',
        policeInvolved: '',
        officerName: '',
        policeStation: ''
      })
    }),
    {
      name: 'liability-information-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);