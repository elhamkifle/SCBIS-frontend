'use client'
import { useState } from "react";

export default function Payment (){

    interface PaymentInfo {
        first_name: string;
        last_name: string;
        email: string;
        currency: string;
        amount: number;
    }

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        first_name: '',
        last_name: '',
        email: '',
        currency: '',
        amount: 0
    });

    const [error,setError] = useState<string|boolean>(false)
    const [loading,setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPaymentInfo({ ...paymentInfo,[e.target.name]:e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        setError(false)

        e.preventDefault();
        const res = await fetch('http://localhost:4000/payment/initialize',{
            method:'POST',
            body:JSON.stringify(paymentInfo),
            headers:{
                'Content-Type':'application/json'
            }
        })

        const data = await res.json()
        console.log("Payment info here", data);
        if (res.ok){
            setLoading(false)
            setError("Redirecting to Chapa.co")
            window.location.href = data.data.checkout_url 
            return
        }

        setError(data.message)
        setLoading(false)


        
    };

    return (
        <>
            <div>
                <form action="" onSubmit={handleSubmit} className="flex flex-col rounded-lg items-center gap-4 shadow-xl px-2 py-5 mb-5">
                    <p className="text-center text-lg font-bold font-syne">Make Payment Using Chapa</p>

                    <div className="w-full md:w-1/2 flex flex-col gap-2">
                        <label htmlFor="" className="font-bold">First Name</label>
                        <input
                            name="first_name"
                            onChange={handleChange} 
                            value={paymentInfo.first_name}
                            type="text" 
                            placeholder="your first name" 
                            className="rounded-md bg-sky-50 text-black px-3 py-2 placeholder:font-inter text-sm"
                            required
                        />
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-2">
                        <label htmlFor="" className="font-bold">Last Name</label>
                        <input 
                            name="last_name"
                            onChange={handleChange} 
                            value={paymentInfo.last_name}
                            type="text" 
                            placeholder="your last name" 
                            className="rounded-md bg-sky-50 text-black px-3 py-2 placeholder:font-inter text-sm"
                            required
                        />
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-2">
                        <label htmlFor="" className="font-bold">Email Address</label>
                        <input 
                            name="email"
                            onChange={handleChange} 
                            value={paymentInfo.email}
                            type="email" 
                            placeholder="your email address" 
                            className="rounded-md bg-sky-50 text-black px-3 py-2 placeholder:font-inter text-sm"
                            required
                        />
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-2">
                        <label htmlFor="" className="font-bold">Currency</label>
                        <select 
                            name="currency" 
                            id="currency"
                            className="rounded-md bg-sky-50 text-black px-3 py-2 placeholder:font-inter text-sm"
                            value={paymentInfo.currency}
                            onChange={handleChange} 
                            required
                        >
                            <option value="">Select</option>
                            <option value="ETB">ETB</option>
                        </select>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-2">
                        <label htmlFor="" className="font-bold">Amount</label>
                        <input
                            name="amount"
                            onChange={handleChange}
                            value={paymentInfo.amount}  
                            type="number" 
                            placeholder="Amount in birr" 
                            className="rounded-md bg-sky-50 text-black px-3 py-2 placeholder:font-inter text-sm"
                            required
                        />
                    </div>

                    <button className="text-white bg-green-500 p-3 w-1/2 rounded-md mt-2 font-inter font-bold">{loading?<p className="text-xs"><span className="loading loading-dots loading-xl"></span></p>:'Make Payment'}</button>
                    {error && <p className="text-center ">{error}</p>}
                    
                </form>
            </div>
        </>
    )
}