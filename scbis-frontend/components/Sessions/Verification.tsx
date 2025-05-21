'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import useOtpStore from "@/store/authStore/useOtpStore"
import useSignupStore from "@/store/authStore/useSignupStore"
import { useUserStore } from "@/store/authStore/useUserStore"

export default function Verification() {
    const { otp, setOtpField, resetOtp } = useOtpStore()
    const { pNo, email, clearSignupData } = useSignupStore()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const setUser = useUserStore((state) => state.setUser)

    const handleSubmit = async () => {
        setError('')
        setLoading(true)

        // Check if all OTP fields are filled
        if (!otp.one || !otp.two || !otp.three || !otp.four || !otp.five || !otp.six) {
            setError('Please fill all OTP fields')
            setLoading(false)
            return
        }

        const otpValue = `${otp.one}${otp.two}${otp.three}${otp.four}${otp.five}${otp.six}`
        console.log(otpValue, pNo, email)
        try {
            const response = await fetch(`https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: pNo,
                    otp: otpValue
                })
            })

            const data = await response.json()

            if (response.ok) {
                // OTP verification successful, now login the user
                try {
                    //     // Clear signup and OTP stores
                    resetOtp()
                    clearSignupData()
                    
                // Redirect to dashboard
                    router.push('/')

                } catch (err) {
                    setError('Error logging in after verification')
                }
            } else {
                setError(data.message || 'OTP verification failed')
            }
        } catch (err) {
            setError('Network error. Please check your connection.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Log OTP state on every render
        console.log('OTP State:', otp);
    }, [otp]);

    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-gradient-to-r from-[#0F1D3F] to-[#3E99E7]">
            <div className="w-full md:w-1/3">
                <p className="text-white text-xl font-syne p-5 md:text-3xl md:p-10 text-center">SCBIS The Future of Insurance</p>
                <img className="hidden lg:block" src="/hand.svg" alt="Hand Image"/>
            </div>

            <div className="w-full border-none md:rounded-tl-[35px] md:rounded-bl-[35px] md:w-2/3 h-full flex justify-center items-center bg-gradient-to-b from-[#9ECCF3] to-[#3E99E7]">
                <div className="w-full md:w-3/5 flex flex-col gap-8 p-3 md:p-8 " style={{background:'linear-gradient(to top,rgba(197, 191, 191, 0.65), rgba(215, 209, 209, 0.3))'}}>
                    <p className="text-center text-[#302F2F] text-2xl font-bold font-inter">Enter Code</p>
                    <p className="text-center mb-5 text-[#302f2fa9] text-sm font-bold font-inter">We have sent OTP code to your phone</p>
                    
                    <div className="w-full flex justify-between">
                        <input 
                            value={otp.one} 
                            onChange={(e) => setOtpField('one', e.target.value)} 
                            className="w-[50px] text-center py-2 px-0 text-2xl rounded" 
                            type="text" 
                            maxLength={1}
                        />
                        
                        <input 
                            value={otp.two} 
                            onChange={(e) => setOtpField('two', e.target.value)} 
                            className="w-[50px] text-center py-2 px-0 text-2xl  rounded"  
                            type="text"
                            maxLength={1}
                        />
                        
                        <input 
                            value={otp.three} 
                            onChange={(e) => setOtpField('three', e.target.value)} 
                            className="w-[50px] text-center py-2 px-0 text-2xl  rounded" 
                            type="text" 
                            maxLength={1}
                        />
                        
                        <input 
                            value={otp.four} 
                            onChange={(e) => setOtpField('four', e.target.value)} 
                            className="w-[50px] text-center py-2 px-0 text-2xl rounded"  
                            type="text" 
                            maxLength={1}
                        />
                        
                        <input 
                            value={otp.five} 
                            onChange={(e) => setOtpField('five', e.target.value)} 
                            className="w-[50px] text-center py-2 px-0 text-2xl rounded" 
                            type="text" 
                            maxLength={1}
                        />
                        
                        <input 
                            value={otp.six} 
                            onChange={(e) => setOtpField('six', e.target.value)} 
                            className="w-[50px] text-center py-2 px-0 text-2xl  rounded"  
                            type="text"
                            maxLength={1}
                        />
                    </div>

                    <button 
                        onClick={handleSubmit} 
                        className="bg-[#1F2168] mt-10 font-bold font-inter text-lg text-white p-3 rounded"
                    >
                        {loading ? <span className="loading loading-dots loading-lg"></span> : "Verify"}
                    </button>
        
                    {error && <p className="text-center font-bold text-base text-[red]">{error}</p>}
                </div>
            </div>
        </div>
    );
}
