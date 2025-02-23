'use client'


import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Login(){

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState(false)
    const router = useRouter()

    const handleSubmit = ()=>{
        
        setError(false)

        if(!email && !password){
            setError(true)
            return
        }

        setEmail('')
        setPassword('')
        router.push('/personalDetails')
    }

    const signUp = ()=>{
        router.push('/signup')
    }

    return(
        <div className="w-full h-full flex flex-col md:flex-row bg-gradient-to-r from-[#0F1D3F] to-[#3E99E7]">
            <div className="w-full md:w-1/3">
                <p className="text-white text-xl font-syne p-5 md:text-3xl md:p-10 text-center">SCBIS The Future of Insurance</p>
                <img className="hidden lg:block" src="/hand.svg" alt="Hand Image"/>
            </div>

            <div className="w-full border-none md:rounded-tl-[35px] md:rounded-bl-[35px] md:w-2/3 h-full flex justify-center items-center bg-gradient-to-b from-[#9ECCF3] to-[#3E99E7]">
                <div className="w-full md:w-3/5 flex flex-col gap-8 p-3 md:p-8 " style={{background:'linear-gradient(to top,rgba(197, 191, 191, 0.65), rgba(215, 209, 209, 0.3))'}}>
                    <p className="text-center text-[302F2F] text-2xl font-bold font-inter">Login</p>
                    
                    <div className="flex flex-col gap-3 md:gap-5">
                        <label htmlFor="email" className="text-[302F2F] text-xs font-medium font-inter">Email Address / Phone</label>
                        <input onChange={(e)=>setEmail(e.target.value)} className="p-2 rounded" type="email" id="email" name="email"/>
                        
                        <label htmlFor="password" className="text-[302F2F] text-xs font-medium font-inter">Password</label>
                        <input onChange={(e)=>setPassword(e.target.value)} className="p-2 rounded"  type="password" id="password" name="password"/>
                    </div>

                    <button onClick={handleSubmit} className="bg-[#1F2168] font-bold font-inter text-lg text-white p-3 rounded">Login</button>
                    <p className="text-center text-sm text-slate-900 font-bold font-syne">Don't have an account yet? <span onClick={signUp} className="text-orange-600 cursor-pointer hover:text-blue-800 underline">Signup</span> here</p>
                    {error && <p className="text-center f0nt-bold text-base text-[red]">Please fill all the required fields.</p>}
                </div>
            </div>
        </div>
    )
}