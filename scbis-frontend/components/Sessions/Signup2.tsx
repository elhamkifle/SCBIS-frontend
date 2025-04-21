'use client'

import { userHook } from "@/context/userContextProvider"
import { fstat, truncate } from "fs"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Signup(){

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPass,setConfirmPass] = useState('')
    const [error,setError] = useState(false)
    const [backEndError,setBackEndError] = useState(false)
    const [loading,setLoading] = useState(false)
    const router = useRouter()
    const {user,dispatch} = userHook()
    console.log(user,"here is the user")

    const handleSubmit = async ()=>{
        
        setError(false)
        setBackEndError(false)
        setLoading(true)

        if(!email && !password && !confirmPass){
            setError(true)
            setLoading(false)
            setBackEndError(false)
            return
        }

        if (password!=confirmPass){
            setError(true)
            setBackEndError(false)
            setLoading(false)
            return
        }

        dispatch({type:'collect_user_info',payload:{email,password}})

        const res = await fetch('http://localhost:4000/auth/register',{
            method:"POST",
            body:JSON.stringify({...user,email:email,password:password}),
            headers:{
                'Content-Type':'application/json'
            }
        })

        const data = await res.json()
        
        if (!res.ok && data.message==="Failed to send OTP. Please try again later."){
            setBackEndError(false)
            setError(false)
            setLoading(false)
            setEmail('')
            setPassword('')
            setConfirmPass('')
            localStorage.setItem('userData',data)
            router.push('/policy-purchase/personal-information/personalDetails');
            return
        }

        setBackEndError(data.message)
        setError(false)
        setLoading(false)

        console.log('here is the data',data)





        
        
    }

    return(
        <div className="w-full h-full flex flex-col md:flex-row bg-gradient-to-r from-[#0F1D3F] to-[#3E99E7]">
            <div className="w-full md:w-1/3">
                <p className="text-white text-xl font-syne p-5 md:text-3xl md:p-10 text-center">SCBIS The Future of Insurance</p>
                <img className="hidden lg:block" src="/hand.svg" alt="Hand Image"/>
            </div>

            <div className="w-full border-none md:rounded-tl-[35px] md:rounded-bl-[35px] md:w-2/3 h-full flex justify-center items-center bg-gradient-to-b from-[#9ECCF3] to-[#3E99E7]">
                <div className="w-full md:w-4/5 flex flex-col gap-8 p-3 md:p-8 " style={{background:'linear-gradient(to top,rgba(197, 191, 191, 0.65), rgba(215, 209, 209, 0.3))'}}>
                    <p className="text-center text-[302F2F] text-2xl font-bold font-inter">Create Account</p>
                    
                    <div className="flex flex-col md:flex-row gap-3 md:gap-10">
                        <div className="w-full flex flex-col gap-3 md:gap-5">
                            <label htmlFor="email" className="text-[302F2F] text-xs font-medium font-inter">Email Address</label>
                            <input onChange={(e)=>setEmail(e.target.value)} className="p-2 rounded" type="email" id="email" name="email"/>
                        </div>
                        
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:gap-10">
                        <div className="w-full md:w-1/2 flex flex-col gap-3 md:gap-5">
                        <label htmlFor="password" className="text-[302F2F] text-xs font-medium font-inter">Password</label>
                        <input onChange={(e)=>setPassword(e.target.value)} className="p-2 rounded"  type="password" id="password" name="password"/>
                        </div>
                        
                        <div className="w-full md:w-1/2 flex flex-col gap-3 md:gap-5">
                        <label htmlFor="password" className="text-[302F2F] text-xs font-medium font-inter">Confirm Password</label>
                        <input onChange={(e)=>setConfirmPass(e.target.value)} className="p-2 rounded"  type="password" id="confirm-password" name="password"/>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-[110px] md:gap-[155px]">
                        <div className="flex items-center gap-3">
                            <p className="w-[30px] py-1 cursor-pointer text-center font-bold bg-[#2752D0]   font-inter text-sm text-white rounded">1</p>
                            <p className="w-[30px] py-1 cursor-pointer text-center font-bold bg-[#3E99E7]   font-inter text-sm text-white rounded">2</p>
                        </div>
                        <button onClick={handleSubmit} className="bg-[#23C140] w-1/6  font-inter text-sm text-white p-1 rounded">

                            {loading?<p className="text-xs">Loading <span className="loading loading-dots loading-xl"></span></p>:'Signup'}

                        </button>
                    </div>
                    
                    {error && <p className="text-center f0nt-bold text-sm text-red-500">{password!=confirmPass? 'Password not match. Please the passwords that you typed':'Please fill all the required fields.'}</p>}
                    
                    {backEndError && <p className="text-center f0nt-bold text-sm text-red-500">{backEndError}</p>}
                
                </div>
            </div>
        </div>
    )
}