'use client'
import React, { useEffect } from 'react'
import { baseAPI } from '@/utils/axiosInstance'
import { useState } from 'react'
import { toast } from 'sonner'
import { useUserStore } from '@/store/authStore/useUserStore'
import { useParams, useSearchParams } from 'next/navigation'
import { fetchUserData } from '@/utils/userUtils'
import axios from 'axios'
import { useWallet } from "@/lib/blockchain/context/WalletContext";


interface Policy {
    _id: string;
    policyType: string;
    coverageEndDate: string;
    coverageArea: string;
    territory: string;
    policyId: string;
    duration: number;
    policyPeriodFrom: string;
    policyPeriodTo: string;
    status: {
        value: "Active" | "Renewal" | "Expired" | string;
        _id: string;
    };
    createdAt: string;
    vehicleType: "Private" | "Commercial" | string;
    imageUrl?: string;
    premium: number;
    
}

export default function PaymentPage() {

  const { walletAddress, connectWallet, isConnected } = useWallet();

  const [loading, setLoading] = useState(false)
  const [ policies, setPolicies ] = useState<Policy>();
  const pID = useParams().id as string;
  const tx_ref = useSearchParams().get('tx_ref')

  // const currentPolicy = policies.find(policy => policy._id ===  pID);
  const user = useUserStore((state) => state.user);

  const getAuthTokenFromCookie = (): string | null => {
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

    // Auto-refresh user data every 30 seconds to check verification status
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        const userData = await fetchUserData();
        if (userData === null) {
          console.log('User not authenticated - stopping auto-refresh');
          return;
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };

    refreshUserData(); // Initial fetch
    const interval = setInterval(refreshUserData, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userVerified) {
        
        return;
      }

      try {
        const accessToken = getAuthTokenFromCookie();

        const [policiesRes] = await Promise.all([
          axios.get(`https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/policy-details/${pID}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
      
        ]);

        const policyData = policiesRes.data

        setPolicies(policyData);
        if (policiesRes.status==200) {
          
          PolicyIssue(policyData?.policyId, policyData?.policyType, policyData?.coverageArea,policyData?.duration,policyData?.premium)
        }
        console.log('Policies fetched:', policiesRes.data);
        
      } catch (error) {
        console.error('Error fetching policy data data:', error);
      } finally {
       
      }
    };


    const PolicyIssue = async(policyId:string,policyType:string,coverageArea:string,duration:number,amount:number)=>{
      if (tx_ref && isConnected){
        // const approved = await baseAPI.get(`https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/payment/verify/${txValue}`)

        
          const toastId = toast.success('Payment Successful')

          const blockchainData = {
              user: walletAddress,
              policyId,
              policyType,
              issuerName: user?.fullname,
              plateNumber: policyId.slice(2),
              vehicleType: "private",
              premiumAmount: amount,
              coverageArea,
              durationInDays:duration
          }

          toast.loading('Policy issue in progress',{id:toastId})
          
          
          const issuedPOlicy = await axios.post('https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/blockchain/issue-policy',blockchainData)
          
         
          if (issuedPOlicy.data.success){
            toast.success(`Policy issued successfully ${issuedPOlicy.data.message}`)
            const accessToken = getAuthTokenFromCookie();

            const updatedPolicy = await axios.put(
                `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/update-policy-status/${pID}`,
                {
                  status: { value: 'active' },
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );
            if (updatedPolicy.status===200){
              window.location.href = "/dashboard"
            }
            

          }

          else{
            toast.error(`policy not issued successfully. ${issuedPOlicy.data.message}`,{id:toastId})
          }

          
        }

        
      
    }

    fetchData();

    console.log(policies)
  }, [setPolicies,user?.userVerified,tx_ref,isConnected]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  

    setLoading(true)
    toast.loading('Processing payment...')

    const serverResponse = await baseAPI.post('/payment/initialize',{
        "amount":`${policies?.premium}`,
        "currency":"ETB",
        "email":user?.email,
        "first_name":`${user?.fullname.split(' ')[0]}`,
        "last_name":`${user?.fullname.split(' ')[1] || ''}`,
        "callback_url":"https://scbis-frontend.vercel.app/",
        "return_url":`https://scbis-frontend.vercel.app/payment/${pID}?tx_ref=true`
    })

    console.log(serverResponse)

   if (serverResponse.status === 201) {
      toast.success('Payment initialized successfully!')
      // Redirect to payment gateway or handle further logic
      window.location.href = serverResponse.data.data.checkout_url
      console.log(serverResponse.data.tx_ref)
      localStorage.setItem('tx_ref', serverResponse.data.tx_ref)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center   text-white px-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-3xl text-white font-bold mb-6 text-center">Payment Page</h1>

        <div className="mb-4 text-sm text-slate-400 text-center">
          <p className='text-white text-base'>Policy Type: <span className="text-sm text-white">{policies?.policyType || "N/A"}</span></p>
          <p className='text-white text-base'>Amount Due: <span className="text-sm text-green-400">{policies?.premium?policies.premium + " ETB" : "N/A"}</span></p>
        </div>

        <form  className="space-y-5">

          { !isConnected ? (
            <div className="mt-4 mx-auto">
              <p className="text-red-500">Wallet not connected. To access this page you need to connect your Metamask account.</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                onClick={connectWallet}
              >
                Connect Wallet
              </button></div>):''
          }

          {isConnected && <button
            type="submit"
            onClick={handleSubmit}
            disabled={tx_ref==="true"}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 rounded-md mt-4"
          >
            {tx_ref? "Payment successful": (loading ? <span className='loading loading-dots loading-xl'>Processing...</span> : 'Pay Now')}
          </button>}
        </form>
      </div>
    </div>
  )
}
