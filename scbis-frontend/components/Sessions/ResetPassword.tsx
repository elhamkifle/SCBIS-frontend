'use client'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOffIcon } from 'lucide-react'
import { ResetPasswordSchema, ResetPasswordSchemaType } from '@/schema/zodSchema'


const ResetPassword = () => {

    const navigate = useRouter()
    const params = useSearchParams()
    const email = params?.get('email')
    const otp = params?.get('otp')
    const [isVisible,setIsVisible] = React.useState({
        password:false,
        confirmPassword:false
    })
    const [formData, setFormData] = React.useState<ResetPasswordSchemaType>({
        password:'',
        confirmPassword:''
    })

    const [errors, setErrors] = React.useState<ResetPasswordSchemaType>({
        password:'',
        confirmPassword:''
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
            password:'',
            confirmPassword:''           
        })

        if (formData.password!==formData.confirmPassword){
            setErrors({...errors,confirmPassword:"Please make sure password and confirm password matches."})
            return
        }

        const result = ResetPasswordSchema.safeParse(formData)

        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors
            setErrors({
                confirmPassword: fieldErrors.confirmPassword ? fieldErrors.confirmPassword[0] : '',
                password:fieldErrors.password ? fieldErrors.password[0] : ''
            })
            setIsSubmitting(false)
            return
        }
        
        const serverResponse = await fetch('https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/auth/request-password-reset',{
            method:'POST',
            body:JSON.stringify({ email, otp, password: formData.password }),
            headers:{
                'Content-Type':'application/json'
            }
        })

        if (serverResponse.ok) {
            
            // setIsSuccess(true)
            
            setFormData({
                password: '',
                confirmPassword:''
            })

            setErrors({
                password: '',
                confirmPassword:''
            })
            
            navigate.push('/')

            
        } else {
            
            
            setErrors({
                confirmPassword: 'Something went wrong, please try again later',
                password:''
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
                            
                        <p className='text-black text-center text-2xl font-bold mb-5'>Reset Password</p>
                        <p className='text-[#232323]  text-center font-semibold -mt-6 text-sm'>You can reset your password here</p>
                        <label htmlFor="" className='text-black text-sm font-sans italic font-bold text-start'>New Password</label>
                        <div className='relative flex items-center'>
                            <input
                                onChange={HandleChange}
                                value={formData.password}
                                name='password'
                                type={isVisible.password ? 'text' : 'password'}
                                placeholder='Type new password'
                                className='text-black bg-gray-200 w-full  font-sans shadow-accent rounded-lg p-3 text-sm placeholder:text-black placeholder:text-xs placeholder:font-semibold placeholder:italic'
                            />

                            {isVisible.password? <Eye onClick={()=>setIsVisible({...isVisible,password:false})} className='absolute right-2' size={14}/>: <EyeOffIcon onClick={()=>setIsVisible({...isVisible,password:true})} className='absolute right-2' size={14}/>}
                        </div>

                        {errors.password && <p className='text-red-600 font-bold text-xs'>{errors.password}</p>}

                        <label htmlFor="" className='text-black text-sm font-sans italic font-bold text-start'>Confirm Password</label>
                        <div className='relative flex items-center'>
                            <input
                                onChange={HandleChange}
                                value={formData.confirmPassword}
                                name='confirmPassword'
                                type={isVisible.confirmPassword ? 'text' : 'password'}
                                placeholder='Confirm password'
                                className='text-black bg-gray-200 w-full  font-sans shadow-accent rounded-lg p-3 text-sm placeholder:text-black placeholder:text-xs placeholder:font-semibold placeholder:italic'
                            />

                            {isVisible.confirmPassword? <Eye onClick={()=>setIsVisible({...isVisible,confirmPassword:false})} className='absolute right-2' size={14}/>: <EyeOffIcon onClick={()=>setIsVisible({...isVisible,confirmPassword:true})} className='absolute right-2' size={14}/>}
                        </div>

                        {errors.password && <p className='text-red-600 font-bold text-xs'>{errors.password}</p>}

                        <button
                            onClick={HandleSubmit}
                            type='submit'
                            className='py-2 text-base   rounded-lg w-full hover:bg-[#1e2d66] bg-[#1F2168] text-white mt-5  font-bold'
                        >

                            {isSubmitting ? <span className='loading loading-dots loading-lg'></span> : 'Reset Password'}

                        </button>

                        <p className='flex mt-5'>
                            
                            <Link href='/' className='hover:bg-gray-300 w-auto rounded-md shadow-sm p-2 bg-gray-200 shadow-gray-600 flex justify-center items-center gap-1 text-black text-sm '>
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

export default ResetPassword
