
import { useEffect, useState } from "react";
import { useWallet } from "@/components/blockchain/hooks/useWallet";
import { BlockchainStore, useBlockchainStore } from "@/store/blockchain/useBlockchainStore";

import Cookies from "js-cookie";

export default function WalletConnector() {
  const { connectWallet } = useWallet();
  const walletAddress = useBlockchainStore((state: BlockchainStore) => state.walletAddress); 
  const [showPopup, setShowPopup] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(false);
  

  useEffect(()=>{
    const token = Cookies.get('auth_token') || ''

    if (token) {
      setShowConnectButton(true);
    } else {
      setShowConnectButton(false);
    }
  },[])

  const handleConnect = async () => {
    setShowPopup(true);
  };

  const confirmConnect = async () => {
    setShowPopup(false);
    await connectWallet();
    
  };

  

  return (
    <div>
      { showConnectButton &&      <div>
          {walletAddress ? (
            <p className="bg-blue-600 text-white text-xs w-32 py-2 px-3  rounded text-ellipsis overflow-hidden">{walletAddress}</p>
          ) : (
            <button onClick={handleConnect} className="bg-blue-600 text-white px-4 py-2 rounded">
              Connect Wallet
            </button>
          )}
          {showPopup && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <p>Do you want to connect your wallet?</p>
                <div className="mt-4 space-x-4">
                  <button onClick={confirmConnect} className="bg-green-600 text-white px-4 py-2 rounded">
                    Yes
                  </button>
                  <button onClick={() => setShowPopup(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    </div>
  );
}
