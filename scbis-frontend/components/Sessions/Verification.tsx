'use client'


import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Verification(){

    const [one,setOne] = useState('')
    const [two,setTwo] = useState('')
    const [three,setThree] = useState('')
    const [four,setFour] = useState('')
    const [five,setFive] = useState('')
    const [six,setSix] = useState('')
    const [error,setError] = useState(false)
    const router = useRouter()

    const handleSubmit = ()=>{
        
        setError(false)

        if(!one && !two && !three && !four && !five && !six){
            setError(true)
            return
        }

        setOne('')
        setTwo('')
        setThree('')
        setFour('')
        setFive('')
        setSix('')
        router.push('/personalDetails')
    }

    return(
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
                        
                        <input onChange={(e)=>setOne(e.target.value)} className="w-[50px] text-center py-2 px-0 text-2xl rounded" type="text"/>
                        
                        <input onChange={(e)=>setTwo(e.target.value)} className="w-[50px] text-center py-2 px-0 text-2xl  rounded"  type="text"/>
                        
                        <input onChange={(e)=>setThree(e.target.value)} className="w-[50px] text-center py-2 px-0 text-2xl  rounded" type="text"/>
                        
                        <input onChange={(e)=>setFour(e.target.value)} className="w-[50px] text-center py-2 px-0 text-2xl rounded"  type="text" />
                        
                        <input onChange={(e)=>setFive(e.target.value)} className="w-[50px] text-center py-2 px-0 text-2xl rounded" type="text"/>
                        
                        <input onChange={(e)=>setSix(e.target.value)} className="w-[50px] text-center py-2 px-0 text-2xl  rounded"  type="text"/>
                    </div>

                    <button onClick={handleSubmit} className="bg-[#1F2168] mt-10 font-bold font-inter text-lg text-white p-3 rounded">Verify</button>
        
                    {error && <p className="text-center f0nt-bold text-base text-[red]">Please fill all the required fields.</p>}
                </div>
            </div>
        </div>
    )
}