'use client'

import { baseAPI } from '@/utils/axiosInstance'
import { useState } from 'react'
import { toast } from 'sonner'
import { usePoliciesStore } from '@/store/dashboard/policies'
import { useParams } from 'next/navigation'

export default function PaymentPage() {
  const [form, setForm] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const [loading, setLoading] = useState(false)
  const { policies, addPolicies } = usePoliciesStore();
  const pID = useParams().id as string;

  const currentPolicy = policies.find(policy => policy._id ===  pID);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    

    const { name, cardNumber, expiry, cvv } = form
    if (!name || !cardNumber || !expiry || !cvv) {
      toast.error('Please fill in all fields')
      setLoading(false)
      return
    }

    setLoading(true)
    toast.loading('Processing payment...')

    const serverResponse = await baseAPI.post('/payment/initialize',{
        "amount":"100.00",
        "currency":"ETB",
        "email":"asfawfanual2003@gmail.com",
        "first_name":"Fanual",
        "last_name":"Asfaw",
        "callback_url":"https://scbis-frontend-4p0p446l9-elham-mulugetas-projects.vercel.app/",
        "return_url":"https://scbis-frontend-4p0p446l9-elham-mulugetas-projects.vercel.app/?pid=9559049540954095"
    })

    console.log(serverResponse)

   if (serverResponse.status === 201) {
      toast.success('Payment initialized successfully!')
      // Redirect to payment gateway or handle further logic
      window.location.href = serverResponse.data.data.checkout_url
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center   text-white px-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-3xl text-white font-bold mb-6 text-center">Policy Payment</h1>

        <div className="mb-4 text-sm text-slate-400 text-center">
          <p className='text-white text-lg'>Policy Type: <span className="text-base text-white">{currentPolicy?.policyType}</span></p>
          <p className='text-white text-lg'>Amount Due: <span className="text-base text-green-400">{currentPolicy?.policyType}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm">Cardholder Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              maxLength={19}
              value={currentPolicy?._id || form.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Expiry</label>
              <input
                type="text"
                name="expiry"
                maxLength={5}
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">CVV</label>
              <input
                type="password"
                name="cvv"
                maxLength={4}
                value={form.cvv}
                onChange={handleChange}
                placeholder="123"
                className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

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
