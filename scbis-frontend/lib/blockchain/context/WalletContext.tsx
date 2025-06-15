'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  connectWallet: async () => {},
  isConnected: false,
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
    }
  };

  useEffect(() => {
    (async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const address = await accounts[0].getAddress();
          setWalletAddress(address);
        }
      }
    })();
  }, []);

  return (
    <WalletContext.Provider
      value={{ walletAddress, connectWallet, isConnected: !!walletAddress }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
