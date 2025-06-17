'use client';
import { ethers } from "ethers";
// import { useBlockchainStore } from "@/store/blockchain/useBlockchainStore";
import { useState } from "react";
import { useInsurance } from "@/lib/blockchain/hooks/useInsurance";


declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
//   const {setWalletAddress} = useBlockchainStore();

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      console.warn(signer,"here is the signer")
    //   setWalletAddress(accounts[0]);
      setSigner(signer);
    //   console.log("Connected wallet address:", accounts[0],signer);
    } catch (err) {
      console.error("User rejected or connection failed:", err);
    }
  };

     
  const { policies, loading } = useInsurance(signer);

  console.log("Here is the policies",policies)

  return { connectWallet,signer };
}

// import { useState, useMemo, use } from "react";
// import { ethers } from "ethers";
// import { useBlockchainStore } from "@/store/blockchain/useBlockchainStore";


// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// export function useWallet() {
//   const [wallet,setWallet] = useState<string | null>(null);
//   const {setWalletAddress} = useBlockchainStore();
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  
//     const connectWallet = async () => {
//       if (typeof window.ethereum !== "undefined") {
//         const newProvider = new ethers.BrowserProvider(window.ethereum);
//         await newProvider.send("eth_requestAccounts", []);
//         const signer = await newProvider.getSigner();
//         const address = await signer.getAddress();

//         setProvider(newProvider);
//         setWalletAddress(address);
//         setWallet(address);
        
//       }
//     };

//     connectWallet();
  

//   // 🧠 Always derive signer from the latest provider
//   const signer = useMemo(() => {
//     if (provider && wallet) {
//       return provider.getSigner(wallet);
//     }
//     return null;
//   }, [provider, wallet]);

//   return { signer , connectWallet};
// }


