'use client'
import React, { useEffect } from 'react'
import { baseAPI } from '@/utils/axiosInstance'
import { useState } from 'react'
import { toast } from 'sonner'
import { useUserStore } from '@/store/authStore/useUserStore'
import { useParams } from 'next/navigation'
import { fetchUserData } from '@/utils/userUtils'
import axios from 'axios'

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
    premiumAmount: number;
    
}

export default function PaymentPage() {
  const [form, setForm] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const [loading, setLoading] = useState(false)
  const [ policies, setPolicies ] = useState<Policy>();
  const pID = useParams().id as string;

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
          axios.get(`https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/user-policies`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
      
        ]);

        setPolicies(policiesRes.data.find((policy: Policy) => policy._id === pID));
        console.log('Policies fetched:', policiesRes.data);
        
      } catch (error) {
        console.error('Error fetching policy data data:', error);
      } finally {
       
      }
    };

    fetchData();
    console.log(policies)
  }, [setPolicies,user?.userVerified]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setForm({ ...form, [e.target.name]: e.target.value })
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  

    setLoading(true)
    toast.loading('Processing payment...')

    const serverResponse = await baseAPI.post('/payment/initialize',{
        "amount":"100.00",
        "currency":"ETB",
        "email":"asfawfanual2003@gmail.com",
        "first_name":`${user?.fullname.split(' ')[0]}`,
        "last_name":`${user?.fullname.split(' ')[1] || ''}`,
        "callback_url":"https://scbis-frontend-4p0p446l9-elham-mulugetas-projects.vercel.app/",
        "return_url":`https://2803-196-188-252-125.ngrok-free.app/payment/${pID}?tx_ref=true`
    })

    console.log(serverResponse)

   if (serverResponse.status === 201) {
      toast.success('Payment initialized successfully!')
      // Redirect to payment gateway or handle further logic
      window.location.href = serverResponse.data.data.checkout_url
      localStorage.setItem('tx_ref', serverResponse.data.data.tx_ref)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center   text-white px-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-3xl text-white font-bold mb-6 text-center">Policy Payment</h1>

        <div className="mb-4 text-sm text-slate-400 text-center">
          <p className='text-white text-lg'>Policy Type: <span className="text-base text-white">{policies?.policyType}</span></p>
          <p className='text-white text-lg'>Amount Due: <span className="text-base text-green-400">{policies?.premiumAmount}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 rounded-md mt-4"
          >
            {loading ? <span className='loading loading-dots loading-xl'>Processing...</span> : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  )
}
