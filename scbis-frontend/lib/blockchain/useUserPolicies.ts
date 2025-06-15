// lib/blockchain/hooks/useInsurance.ts
'use client'
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import InsuranceABI from "@/lib/abi/InsuranceContract.json";
import { useWallet } from "./context/WalletContext";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export interface Policy {
    policyId: string;
    policyType: string;
    issuerName: string;
    plateNumber: string;
    vehicleType: string;
    premiumAmount: number; // Assuming this is in MATIC or another token
    coverageArea: string;
    policyStartDate: number; // Assuming this is a timestamp
    policyEndDate: number; // Assuming this is a timestamp
    isActive: boolean;
    claims: []; // Assuming claims are stored as an array of strings
}

export interface Claim {
    claimId: string;
    driverName: string;
    proforma: string; // Assuming this is a URL or IPFS hash
    plateNumber: string;
    medicalrecords: string; // Assuming this is a URL or IPFS hash
    amountClaimed: number; // Assuming this is in MATIC or another token
    amountApproved: number; // Assuming this is in MATIC or another token
    claimSubmissionDate: number; // Assuming this is a timestamp
    approvalDate: number; // Assuming this is a timestamp
    status: string; // e.g., "Pending", "Approved", "Rejected"
    isApproved: boolean; // Assuming this is a boolean
    description: string; // Assuming this is a string 
    accidenteType: string; // Assuming this is a string
}

export function useUserPolicies() {
  const { isConnected } = useWallet();
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPolicies = async () => {
    try {
      if (!window.ethereum || !isConnected) return;

      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, InsuranceABI.abi, signer);

      const rawPolicies = await contract.getMyPolicies() as Policy[];

      setPolicies(rawPolicies);
    } catch (err) {
      console.error("Failed to fetch user policies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchPolicies();
    }
  }, [isConnected]);

  return { policies, loading };
}
