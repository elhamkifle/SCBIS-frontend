'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import useLoginStore from "@/store/authStore/useLoginStore";
import { AuthSchemaType, AuthSchema } from "@/schema/zodSchema";
import { useUserStore } from "@/store/authStore/useUserStore";

export default function Login() {
    const setUser = useUserStore((state) => state.setUser);
    const { email, password, error, setEmail, setPassword, setError, resetLogin } = useLoginStore();
    const [zodError, setZodError] = useState<AuthSchemaType>({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setZodError({
            email: '',
            password: ''
        });
        setIsLoading(true);
        setError(false);

        const validation = AuthSchema.safeParse({ email, password });
        if (!validation.success) {
            const errors = validation.error.flatten();
            setZodError({
                email: errors.fieldErrors.email ? errors.fieldErrors.email[0] : '',
                password: errors.fieldErrors.password ? errors.fieldErrors.password[0] : ''
            });
            setIsLoading(false);
            return;
        }

        try {
            const serverResponse = await fetch(`https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/auth/login`, {
                method: "POST",
                body: JSON.stringify({
                    identifier: email,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await serverResponse.json();

            if (serverResponse.ok) {
                resetLogin();
                setUser({
                    ...data.user,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                });
                router.push('/policy-purchase/personal-information/personalDetails');
            } else {
                setError(data.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = () => {
        router.push('/signup');
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-gradient-to-r from-[#0F1D3F] to-[#3E99E7]">
            <div className="w-full md:w-1/3">
                <p className="text-white text-xl font-syne p-5 md:text-3xl md:p-10 text-center">SCBIS The Future of Insurance</p>
                <img className="hidden lg:block" src="/hand.svg" alt="Hand Image"/>
            </div>

            <div className="w-full border-none md:rounded-tl-[35px] md:rounded-bl-[35px] md:w-2/3 h-full flex justify-center items-center bg-gradient-to-b from-[#9ECCF3] to-[#3E99E7]">
                <div className="w-full md:w-3/5 flex flex-col gap-8 p-3 md:p-8 " style={{background:'linear-gradient(to top,rgba(197, 191, 191, 0.65), rgba(215, 209, 209, 0.3))'}}>
                    <p className="text-center text-[#302F2F] text-2xl font-bold font-inter">Login</p>
                    
                    <div className="flex flex-col gap-3 md:gap-5">
                        <label htmlFor="email" className="text-[#302F2F] text-xs font-medium font-inter">Email Address / Phone Number</label>
                        <input 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            className="p-2 rounded" 
                            type="text" 
                            id="email" 
                            name="email"
                        />

                        {zodError.email && <p className="text-red-500 font-bold text-sm">{zodError.email}</p>}
                        
                        <label htmlFor="password" className="text-[#302F2F] text-xs font-medium font-inter">Password</label>
                        <input 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            className="p-2 rounded"  
                            type="password" 
                            id="password" 
                            name="password"
                        />

                        {zodError.password && <p className="text-red-500 font-bold text-sm">{zodError.password}</p>}
                    </div>

                    <button 
                        onClick={handleSubmit} 
                        className="bg-[#1F2168] font-bold font-inter text-lg text-white p-3 rounded"
                    >
                        {isLoading ? <span className="loading loading-dots loading-lg"></span> : 'Login'}
                    </button>
                    
                    <p className="text-center text-sm text-slate-900 font-bold font-syne">
                        Don't have an account yet? 
                        <span 
                            onClick={signUp} 
                            className="text-orange-600 cursor-pointer hover:text-blue-800 underline"
                        >
                            Signup
                        </span> 
                        here
                    </p>

                    {error && <p className="text-center font-bold text-base text-[red]">{error}</p>}
                </div>
            </div>
        </div>
    );
}
