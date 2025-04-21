'use client'


import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Login(){

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState(false)
    const [backEndError,setBackEndError] = useState(false)
    const [loading,setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async()=>{
        
        setError(false)
        setLoading(true)
        setBackEndError(false)

        if(!email && !password){
            setError(true)
            setLoading(false)
            setBackEndError(false)
            return
        }

        const res = await fetch('http://localhost:4000/auth/login',{
            method:"POST",
            body:JSON.stringify({ identifier : email, password : password }),
            headers:{
                'Content-Type':'application/json'
            }
        })

        const data = await res.json()

        console.log('here is the data',data)

        if (res.ok){
            setError(false)
            setLoading(false)
            setBackEndError(false)
            setEmail('')
            setPassword('')
            // localStorage.clear()
            localStorage.setItem('userData',JSON.stringify(data))
            router.push('/policy-purchase/personal-information/personalDetails');
            return
        }

        setError(false)
        setBackEndError(data.message)
        setLoading(false)

      
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

                    <button onClick={handleSubmit} className="bg-[#1F2168] font-bold font-inter text-lg text-white p-3 rounded">

                        {loading?<p className="text-xs"><span className="loading loading-dots loading-xl"></span></p>:'Login'}

                    </button>
                    
                    <p className="text-center text-sm text-slate-900 font-bold font-syne">Don't have an account yet? <span onClick={signUp} className="text-orange-600 cursor-pointer hover:text-blue-800 underline">Signup</span> here</p>
                    {error && <p className="text-center f0nt-bold text-base text-red-500">Please fill all the required fields.</p>}
                    {backEndError && <p className="text-center f0nt-bold text-base text-red-500">{backEndError}</p>}
                </div>
            </div>
        </div>
    )
}