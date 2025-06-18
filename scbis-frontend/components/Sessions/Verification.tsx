'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import verificationNumSchema from '@/schema/VerificationNum'
import { VerificationNumSchemaType } from '@/schema/VerificationNum'
import { useRouter, useSearchParams } from 'next/navigation'

const Verification = () => {

    const naivgate = useRouter()
    const [iseResending,setIsResending] = useState<boolean>(false)
    const [timeLeft,setTimeLeft] = React.useState<number>(60*10)
    const searchParams = useSearchParams()
    const page = searchParams.get('page')
    const email = searchParams.get('email') || 'asfawfanual2003@gmail.com'
    const phone = searchParams.get('phone') || '0965168741'

    useEffect(()=>{
        const interval = setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft((prev) => prev - 1)

            } else {
                clearInterval(interval)
            }
        }, 1000)

        return () => clearInterval(interval)    
    },[timeLeft])

    const formatTime = (seconds:number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
      };
    
    const [verifcationNumbers, setVerifcationNumbers] = React.useState<Record<string, string|number>>({
        one: '',
        two: '',
        three: '',
        four: '',
        five: '',
        six: ''    
    })

    const numArray = ['one','two','three','four','five','six']

    const [errors, setErrors] = React.useState<VerificationNumSchemaType>({
        verificationNum: ''
    })

    const [isSubmitting, setIsSubmitting] = React.useState(false)
    // const [isSuccess, setIsSuccess] = React.useState(false)

    const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value,id } = e.target
        setVerifcationNumbers((prev) => ({
            ...prev,
            [name]: value
        }))

        if (id<'5' && value.length === 1) {
            const nextInput = numArray[numArray.indexOf(name) + 1]
            if (nextInput) {
                const nextInputElement = document.querySelector(`input[name="${nextInput}"]`) as HTMLInputElement
                nextInputElement.focus()
            }
        }
    }

    const ResendCode = async()=>{
        setIsResending(true)
        const serverResponse = await fetch('https://localhost:3001/auth/request-password-reset',{
            method:'POST',
            body:JSON.stringify({ email,phoneNumber:phone }),
            headers:{
                'Content-Type':'application/json'
            }
        })

        if (serverResponse.ok){
            window.location.reload()
        }

        setIsResending(false)
    }

    const HandleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        setErrors({
            verificationNum: ''
        })

        setIsSubmitting(false)
        setIsSubmitting(true)
        const verificationNum = Object.values(verifcationNumbers).join('')
        const result = verificationNumSchema.safeParse({ verificationNum })

        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors
            setErrors({
                verificationNum: fieldErrors.verificationNum ? fieldErrors.verificationNum[0] : ''
            })
            setIsSubmitting(false)
            return
        }
        const serverResponse = await fetch('https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ 
                identifier: email,
                otp: verificationNum
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!serverResponse.ok) {
            const errorText = await serverResponse.text();
            console.error('Server response:', errorText);
        }



        // const data = await serverResponse.json()

        if (serverResponse.ok) {
            // setIsSuccess(true)
            setIsSubmitting(false)
            // const timeOutID = setTimeout(() => {
            //     setIsSuccess(false)
            // }, 3000
          
            if (page && page==="page2"){naivgate.push('/login')}
            else if (page && page==="forgot-password") {naivgate.push(`/reset-password?otp=${verificationNum}&email=${email}`)}

        
        } else {
            setErrors({
                verificationNum: 'Invalid verification code'
            })
            setIsSubmitting(false)
        }



        
    }


    

    return (
        <div className="w-full h-full flex flex-col justify-center items-center md:flex-row bg-gradient-to-r from-[#0F1D3F] to-[#3E99E7]">
            <div className=" w-full hidden lg:block lg:w-1/3">
                <p className="text-white text-xl font-syne p-5 md:text-3xl md:p-10 text-center">SCBIS The Future of Insurance</p>
                <img className="hidden lg:block" src="/hand.svg" alt="Hand Image" />
            </div>

            <div className="w-full border-none md:rounded-tl-[35px] md:rounded-bl-[35px] sm:w-3/4 lg:2/3 h-full flex justify-center items-center bg-gradient-to-b from-[#9ECCF3] to-[#3E99E7]">
                <div className="w-full md:w-5/6 xl:w-3/5 flex flex-col gap-8 p-3 xl:p-8 " style={{background:'linear-gradient(to top,rgba(197, 191, 191, 0.65), rgba(215, 209, 209, 0.3))'}}>
                    <div className='flex justify-center py-5'>
                        <form action="" className='flex flex-col gap-5 items-center justify-center w-full  p-5'>
                            <h1 className='text-black text-3xl font-bold'>Verification</h1>
                            <p className='text-black text-sm font-semibold'>Please enter the verification code sent to your email.</p>
                            <div className='grid grid-cols-6 gap-3 md:gap-10   justify-center  w-full md: lg:p-5'>

                                {numArray.map((item,index) => (
                                    
                                    <input
                                        type="text"
                                        key={index}
                                        name={item}
                                        autoFocus={index === 0}
                                        id={index.toString()}
                                        value={verifcationNumbers[item]}
                                        onChange={HandleChange} 
                                        maxLength={1} 
                                        className='bg-gray-200 sm:w-12 sm:h-12  border-none rounded-md text-black text-center sm:text-2xl font-semibold p-2  sm:px-2 sm:py-3'
                                    />
                                ))}          
                            
                            </div>
                            {errors.verificationNum && <span className='text-red-600 -mt-6  text-xs font-bold'>{errors.verificationNum}</span>}

                            {timeLeft > 0 ? <span className='text-[#232323]  text-center font-semibold'>{formatTime(timeLeft)}</span> : <Link onClick={ResendCode} href='/verification' className='text-black p-3 bg-gray-200 shadow-gray-500 shadow-md rounded-md font-bold text-sm'>{iseResending ? 'Resending otp...' : 'Resend code?'}</Link>}
                            
                            <button
                                onClick={HandleSubmit}
                                // disabled={isSubmitting}
                                type="submit" 
                                className='text-base py-2  rounded-lg w-full sm:w-1/2 hover:bg-[#1e2d66] bg-[#1F2168] text-white mt-3 font-bold'
                                >
                                    {isSubmitting ? <span className='loading loading-dots loading-lg'></span> : 'Verify'}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Verification
