"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function PrivateVehicleCategory() {
    
    const router = useRouter();
    const [carType,setCarType] = useState('')
    const [error,setError] = useState(false)

    const [formData, setFormData] = useState({
        make: '',
        model: '',
        mfgYear: '',
        engineCapacity: '',
        chassisNo: '',
        engineNo: '',
        plateNo: '',
        bodyType: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false)
        console.log(formData);
        
        if(!carType){
            setError(true)
            return
        }

        router.push("/policy-purchase/vehicle-information/generalVehicleDetails");


    };


    const handlePrevious = () => {
        router.push("/policy-purchase/vehicle-information/purpose");
    };

    return (
        <div className="flex flex-col items-center px-4">

            <div className="w-full max-w-5xl flex justify-between items-center mt-8">
                <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
                <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-2 mt-6 mb-4">
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
                    <span className="ml-2 font-medium text-black text-xs sm:text-base">Purpose</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center text-white bg-[#1F4878] rounded-full">2</div>
                    <span className="ml-2 text-black text-xs sm:text-base">Vehicle Category</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">3</div>
                    <span className="ml-2 text-black text-sm sm:text-base">General Vehicle Details</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">4</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Ownership and Usage</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">5</div>
                    <span className="ml-2 text-black text-xs sm:text-base">Upload Docs</span>
                </div>
            </div>



            <div className="bg-white mb-10 lg:p-8 rounded-xl w-full max-w-5xl">

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10 xl:gap-16">
                    
                    <div className='col-span-1 md:col-span-3 flex flex-col gap-5'>
                        <div className='flex flex-col gap-3'>
                            <p className='text-sm md:text-base lg:text-lg font-syne mb-2 font-semibold'>Private Vehicles</p>
                            <div className='flex gap-2 items-center '>
                                <input type="checkbox" name='private-type' id='personal'/>
                                <label htmlFor="personal" className='font-inter text-sm md:text-xs lg:text-xs'>Private or Personal Use</label>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <input type="checkbox" name='private-type' id='Business'/>
                                <label htmlFor="personal" className='font-inter text-sm md:text-xs lg:text-xs'>Private Business Use</label>
                            </div>
                        </div>

                        <p className='font-syne text-sm md:text-base lg:text-lg font-semibold'>Select one category that best describes your vehicle. (Required)</p>

                        <div className='flex flex-col flex-wrap  sm:flex-row  justify-center gap-8 lg:flex-nowrap gap-5'>
                            
                            <div onClick={(e)=>setCarType('passenger')} className={`w-full border  ${carType==='passenger' ? 'border-green-500':'border-gray-300'} cursor-pointer  sm:w-[45%] lg:w-1/4 rounded-2xl flex flex-col items-center py-5`} style={{ boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)' }}>

                                <img className='' style={{marginTop:'-25px'}} src="/passengercars.svg" alt=""  />
                                <p className='h-[45px] text-center px-5 mb-[15px] text-sm md:text-base lg:text-lg font-syne mb-2 font-semibold'>Passenger Cars </p>
                                <p className='text-center px-5 font-inter text-sm md:text-xs lg:text-xs'>For personal & family transport, daily use, and business calls</p>

                            </div>

                            <div onClick={(e)=>setCarType('suvs')} className={`w-full border ${carType==='suvs' ? 'border-green-500':'border-gray-300'} cursor-pointer  sm:w-[45%] lg:w-1/4 rounded-2xl flex flex-col items-center py-5`}  style={{ boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)' }}>

                                <img className='' style={{marginTop:'-25px'}} src="/suvs.svg" alt=""  />
                                <p className='h-[45px] text-center px-5 mb-[15px] text-sm md:text-base lg:text-lg font-syne mb-2 font-semibold'>SUVs & Off-Road Vehicles </p>
                                <p className='text-center px-5 font-inter text-sm md:text-xs lg:text-xs'> For rugged terrain, long-distance travel, and city use</p>

                            </div>

                            <div onClick={(e)=>setCarType('pickup')} className={`w-full border ${carType==='pickup'? 'border-green-500':'border-gray-300'} cursor-pointer sm:w-[45%] lg:w-1/4 rounded-2xl flex flex-col items-center py-5`} style={{ boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)' }}>

                                <img className='' style={{marginTop:'-25px'}} src="/pickup.svg" alt=""  />
                                <p className='h-[45px] text-center px-5 mb-[15px] text-sm md:text-base lg:text-lg font-syne mb-2 font-semibold'>Pickup Trucks & Utility Vehicles </p>
                                <p className='text-center px-5 font-inter text-sm md:text-xs lg:text-xs'>For personal goods transport, not commercial delivery</p>

                            </div>

                            <div onClick={(e)=>setCarType('minivan')} className={`w-full border ${carType==='minivan' ? 'border-green-500':'border-gray-300'} cursor-pointer  sm:w-[45%] lg:w-1/4 rounded-2xl flex flex-col items-center py-5`} style={{ boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)' }}>

                                <img className='' style={{marginTop:'-25px'}} src="/minivan.svg" alt=""  />
                                <p className='h-[45px] text-center px-5 mb-[15px] text-sm md:text-base lg:text-lg font-syne mb-2 font-semibold'>Vans & Mini-Buses   </p>
                                <p className='text-center px-5 font-inter text-sm md:text-xs lg:text-xs'>For private family/group transport, non-commercial use</p>

                            </div>

                            
                        </div>
                        {error && !carType && <p className='font-bold text-center text-sm text-red-600 font-inter'>Please select your vehicle category</p>}
                    </div>
                   

                    <div className="col-span-1 md:col-span-3 flex justify-between">
                        <button type="button" className="bg-[#3AA4FF] text-white p-7 py-2 rounded" onClick={handlePrevious}>Previous</button>
                        <button type="submit" className="bg-blue-500 text-white p-10 py-2 rounded">Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
