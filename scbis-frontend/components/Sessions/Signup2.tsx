'use client'


import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Signup(){

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPass,setConfirmPass] = useState('')
    const [error,setError] = useState(false)
    const router = useRouter()

    const handleSubmit = ()=>{
        
        setError(false)

        if(!email && !password && !confirmPass){
            setError(true)
            return
        }

        if (password!=confirmPass){
            setError(true)
            return
        }

        setEmail('')
        setPassword('')
        setConfirmPass('')
        router.push('/verification')
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
                        <input onChange={(e)=>setConfirmPass(e.target.value)} className="p-2 rounded"  type="password" id="password" name="password"/>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-[110px] md:gap-[155px]">
                        <div className="flex items-center gap-3">
                            <p className="w-[30px] py-1 cursor-pointer text-center font-bold bg-[#2752D0] w-1/6  font-inter text-sm text-white rounded">1</p>
                            <p className="w-[30px] py-1 cursor-pointer text-center font-bold bg-[#3E99E7] w-1/6  font-inter text-sm text-white rounded">2</p>
                        </div>
                        <button onClick={handleSubmit} className="bg-[#23C140] w-1/6  font-inter text-sm text-white p-1 rounded">Signup</button>
                    </div>
                    {error && <p className="text-center f0nt-bold text-base text-[red]">{password!=confirmPass? 'Password not match. Please the passwords that you typed':'Please fill all the required fields.'}</p>}
                </div>
            </div>
        </div>
    )
}