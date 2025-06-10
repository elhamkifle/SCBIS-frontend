'use client'
import { useRouter } from "next/navigation"
import useSignupStore from "@/store/authStore/useSignupStore"
import { useState } from "react"

export default function Signup() {
    const { fName, lName, dob, pNo, setFName, setLName, setDob, setPNo } = useSignupStore()
    const [error, setError] = useState(false)
    const router = useRouter()

    const handleSubmit = () => {
        setError(false)
        if (!fName || !lName || !dob || !pNo) {
            setError(true)
            return
        }

        router.push('/signup/page2')
    }

    const Login = () => {
        router.push('/login')
    }

    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-gradient-to-r from-[#0F1D3F] to-[#3E99E7]">
            <div className="w-full md:w-1/3">
                <p className="text-white text-xl font-syne p-5 md:text-3xl md:p-10 text-center">SCBIS The Future of Insurance</p>
                <img className="hidden lg:block" src="/hand.svg" alt="Hand Image" />
            </div>

            <div className="w-full border-none md:rounded-tl-[35px] md:rounded-bl-[35px] md:w-2/3 h-full flex justify-center items-center bg-gradient-to-b from-[#9ECCF3] to-[#3E99E7]">
                <div className="w-full md:w-4/5 flex flex-col gap-8 p-3 md:p-8 " style={{ background: 'linear-gradient(to top,rgba(197, 191, 191, 0.65), rgba(215, 209, 209, 0.3))' }}>
                    <p className="text-center text-[302F2F] text-2xl font-bold font-inter">Create Account</p>

                    <div className="flex flex-col md:flex-row gap-3 md:gap-10">
                        <div className="w-full md:w-1/2 flex flex-col gap-3 md:gap-5">
                            <label htmlFor="fname" className="text-[302F2F] text-sm font-bold font-inter">First Name</label>
                            <input value={fName} onChange={(e) => setFName(e.target.value)} className="p-2 rounded placeholder:text-black placeholder:font-semibold placeholder:italic" type="text" id="fname" name="fname" />
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col gap-3 md:gap-5">
                            <label htmlFor="lname" className="text-[302F2F] text-sm font-bold font-inter">Last Name</label>
                            <input value={lName} onChange={(e) => setLName(e.target.value)} className="p-2 rounded placeholder:text-black placeholder:font-semibold placeholder:italic" type="text" id="lname" name="lname" />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:gap-10">
                        <div className="w-full md:w-1/2 flex flex-col gap-3 md:gap-5">
                            <label htmlFor="dob" className="text-[302F2F] text-sm font-bold font-inter">Date Of Birth</label>
                            <input value={dob} onChange={(e) => setDob(e.target.value)} className="p-2 rounded placeholder:text-black placeholder:font-semibold placeholder:italic" type="date" id="dob" name="dob" />
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col gap-3 md:gap-5">
                            <label htmlFor="phone" className="text-[302F2F] text-sm font-bold font-inter">Phone Number</label>
                            <input value={pNo} onChange={(e) => setPNo(e.target.value)} className="p-2 rounded placeholder:text-black placeholder:font-semibold placeholder:italic" type="tel" id="phone" name="phone" />
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-[110px] md:gap-[155px]">
                        <div className="flex items-center gap-3">
                            <p onClick={()=>router.push('/signup')} className="w-[30px] py-1 cursor-pointer text-center font-bold bg-[#2752D0]  font-inter text-sm text-white rounded">1</p>
                            <p onClick={handleSubmit} className="w-[30px] py-1 cursor-pointer text-center font-bold bg-[#3E99E7]  font-inter text-sm text-white rounded">2</p>
                        </div>
                        <button onClick={handleSubmit} className="bg-[#1F2168] w-1/6  font-inter text-sm text-white p-1 rounded">Next</button>
                    </div>

                    <p className="text-center text-sm text-slate-900 font-bold font-syne">Already have an account? <span onClick={Login} className="text-orange-600 cursor-pointer hover:text-blue-800">Login</span> here</p>
                    {error && <p className="text-center font-bold text-base text-[red]">Please fill all the required fields.</p>}
                </div>
            </div>
        </div>
    )
}
