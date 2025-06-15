import insuranceABI from "@/lib/abi/InsuranceContract.json"; // Replace with your ABI file

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!; // Replace with actual contract address

// Define the shape of a Policy if known (example below, adjust to your struct)

import { BrowserProvider, Contract } from "ethers";


// Define the policy interface (adjust fields as per your smart contract)
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
        status: string; // e.g., "Pending", "Approved", "Rejected"
        isApproved: boolean; // Assuming this is a boolean
        description: string; // Assuming this is a string 
        accidenteType: string; // Assuming this is a string
}

export const getMyPolicies = async (): Promise<Policy[] | undefined> => {
  try {
    if (!window.ethereum) {
      alert("MetaMask Account is required!");
      return;
    }

    

    // Create provider (Ethers v6 uses BrowserProvider)
    
    const provider = new BrowserProvider(window.ethereum);
    const code = await provider.getCode(CONTRACT_ADDRESS);
    const network = await provider.getNetwork();
    console.log("Connected to:", network.name);
    if (code === "0x") {
        console.error("No contract deployed at this address!");
        return;
    }

    const signer = await provider.getSigner(); // Await is required in v6
    console.log("Fetching policies from contract...",signer);

    // Create contract with signer as ContractRunner
    const contract = new Contract(CONTRACT_ADDRESS, insuranceABI.abi, signer);

    // Call the function
    const policies = await contract.getMyPolicies() as Policy[];

    console.log("My Policies are here you fanual:", policies);
    return policies;
  } catch (error) {
    console.error("Error fetching policies:", error);
  }
};

