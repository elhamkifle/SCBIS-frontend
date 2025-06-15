import { ethers } from "ethers";
import InsuranceABI from "../abi/InsuranceContract.json"; // Adjust path as needed

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export function getInsuranceContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, InsuranceABI.abi, signerOrProvider);
}
