'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ForgotPasswordSchema,ForgotPasswordSchemaType } from '@/schema/zodSchema'


const ForgotPassword = () => {

    const navigate = useRouter()
    const [formData, setFormData] = React.useState<ForgotPasswordSchemaType>({
        email: '',
        Phone:''
    })

    const [errors, setErrors] = React.useState<ForgotPasswordSchemaType>({
        email: '',
        Phone:''
    })

    const [isSubmitting, setIsSubmitting] = React.useState(false)
    // const [isSuccess, setIsSuccess] = React.useState(false)

       const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }))
        } 

    const HandleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        console.log("Clicked more than once")

        e.preventDefault()
        setIsSubmitting(true)
        setErrors({
            email: '',
            Phone:''          
        })

        const result = ForgotPasswordSchema.safeParse(formData)

        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors
            setErrors({
                email: fieldErrors.email ? fieldErrors.email[0] : '',
                Phone:fieldErrors.Phone ? fieldErrors.Phone[0] : ''
            })
            setIsSubmitting(false)
            return
        }
        
        const serverResponse = await fetch('https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/auth/request-password-reset',{
            method:'POST',
            body:JSON.stringify({ email: formData.email,phoneNumber:formData.Phone }),
            headers:{
                'Content-Type':'application/json'
            }
        })

        if (serverResponse.ok) {
            
            // setIsSuccess(true)
            navigate.push(`/verification?page=forgot-password&email=${formData.email}&phone=${formData.Phone}`)
            setFormData({
                email: '',
                Phone:''
            })

            setErrors({
                email: '',
                Phone:''
            })
            
            

            
        } else {
            
            
            setErrors({
                email: '',
                Phone:'Something went wrong, please try again later'
            })
        }

        setIsSubmitting(false)

        console.log(await serverResponse.json(),"here is the server reposonse")

    }

  return (

    <div className="w-full h-full flex flex-col md:flex-row bg-gradient-to-r from-[#0F1D3F] to-[#3E99E7]">
        <div className="w-full md:w-1/3">
            <p className="text-white text-xl font-syne p-5 md:text-3xl md:p-10 text-center">SCBIS The Future of Insurance</p>
            <img className="hidden lg:block" src="/hand.svg" alt="Hand Image"/>
        </div>
        <div className="w-full border-none md:rounded-tl-[35px] md:rounded-bl-[35px] md:w-2/3 h-full flex justify-center items-center bg-gradient-to-b from-[#9ECCF3] to-[#3E99E7]">
            <div className="w-full md:w-3/5 flex flex-col gap-8 p-3 md:p-8 " style={{background:'linear-gradient(to top,rgba(197, 191, 191, 0.65), rgba(215, 209, 209, 0.3))'}}>
                <div className='flex justify-center'>
                    <form action="" className='w-full flex p-5 lg:p-10 flex-col  gap-3'>
                            
                        <p className='text-black text-center text-2xl font-bold mb-5'>Forgot Password?</p>
                        <p className='text-[#232323]  text-center font-semibold -mt-6 text-sm'>No worries we&apos;ll send you reset instructions</p>
                        <label htmlFor="email" className='text-black text-sm font-sans italic font-bold text-start'>Email</label>
                        <input
                            onChange={HandleChange}
                            value={formData.email}
                            name='email'
                            type="email"
                            placeholder='Type email address...'
                            className='text-black bg-gray-200 w-full  font-sans shadow-accent rounded-lg p-3 text-xs placeholder:text-black placeholder:font-semibold placeholder:italic' 
                        />

                        {errors.email && <p className='text-red-600 font-bold text-xs'>{errors.email}</p>}

                        <label htmlFor="phone" className='text-black text-sm font-sans italic font-bold text-start'>Phone Number</label>
                        <input
                            onChange={HandleChange}
                            value={formData.Phone}
                            name='Phone'
                            type="text"
                            placeholder='Type phone number'
                            className='text-black bg-gray-200 w-full  font-sans shadow-accent rounded-lg p-3 text-xs placeholder:text-black placeholder:font-semibold placeholder:italic' 
                        />

                        {errors.Phone && <p className='text-red-600 font-bold text-xs'>{errors.Phone}</p>}

                        <button
                            onClick={HandleSubmit}
                            type='submit'
                            className='py-2 text-base   rounded-lg w-full hover:bg-[#1e2d66] bg-[#1F2168] text-white mt-5  font-bold'
                        >

                            {isSubmitting ? <span className='loading loading-dots loading-lg'></span> : 'Send OTP'}

                        </button>

                        <p className='flex mt-5'>
                            
                            <Link href='/login' className='hover:bg-gray-300 w-auto rounded-md shadow-sm p-2 bg-gray-200 shadow-gray-600 flex justify-center items-center gap-1 text-black text-sm '>
                                <ArrowLeft size={16} className='text-gray-900'/>
                                Back to login
                            </Link>
                        </p>
                        </form>
                    </div>
            </div>
        </div>

        
    </div>
    
  )
}

export default ForgotPassword
