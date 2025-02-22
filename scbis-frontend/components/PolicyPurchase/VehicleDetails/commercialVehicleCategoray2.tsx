'use client'
import React from 'react'
import { useRouter } from 'next/navigation';

export default function CommercialVehicleCategory2()  {
    const router = useRouter()
    const handlePrevious = () => {
        router.push('/purpose');
    };

    const handleForward = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        router.push('/commercialVehicleCategory2');
    };

    const handleBackward = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        router.push('/commercialVehicleCategory');
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



    <div className="bg-white mb-10 p-2 lg:p-8 rounded-lg w-full max-w-5xl" style={{ boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)' }}>

        <form  className="grid grid-cols-1 md:grid-cols-3 gap-10 xl:gap-16">
            
            <div className='col-span-1 md:col-span-3 flex flex-col gap-5'>

                <p className='font-syne text-sm md:text-base lg:text-lg font-semibold'>Select one category that best describes your vehicle. (Required)</p>

                <div className='flex flex-col flex-wrap  sm:flex-row  gap-8 lg:flex-nowrap gap-5'>
                    <div className='w-full flex flex-col md:block md:w-1/2'>
                        <p className='font-syne text-sm text-[#1A73E8] text-center font-bold'>Good Carrying Vehicles (GCV)</p>
                        <p className='font-syne text-sm font-semibold mt-2'>Liqiud Cargo Carrying Vehicles</p>
                        <div className='flex flex-col justify-between md:flex-row'>
                            <div>
                                <div className='p-2 flex flex-col gap-3'>
                            
                                    <p className='font-syne text-xs font-semibold text-[#1A73E8]'>Own Goods</p>
                            
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Tanker Trailers</label>
                                    </div>
                            
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Small Liquid Carrying</label>
                                    </div>
                                    
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Medium Liquid Carrying</label>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Large Liquid Carrying</label>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Semi Trailers</label>
                                    </div>

                                </div>
                            </div>

                            <div>
                                <div className='p-2 flex flex-col gap-3'>
                            
                                    <p className='font-syne text-xs font-semibold text-[#1A73E8]'>General Cartage</p>
                                
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Tanker Trailers</label>
                                    </div>
                            
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Small Liquid Carrying</label>
                                    </div>
                                    
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Medium Liquid Carrying</label>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Large Liquid Carrying</label>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Semi Trailers</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-full md:w-1/2'>
                        <p className='font-syne text-sm text-center text-[#1A73E8] font-bold'>Learner/Tour Operators/Hire Cars</p>
                        <p className='font-syne text-sm font-semibold mt-2'>Passenger Carrying Vehicles</p>
                        <div className='flex flex-col'>
                            <div className='flex'>
                                <div className='p-2 flex flex-col gap-3'>
                            
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Small Sized Buses</label>
                                    </div>
                            
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Medium Sized Buses</label>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Large Sized Buses</label>
                                    </div>

                                </div>

                                <div className='p-2 flex flex-col gap-3'>
                            
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Automobile, Station, Wagons</label>
                                    </div>
                            
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Mini Buses</label>
                                    </div>


                                </div>
                               
                            </div>

                            <p className='font-syne text-sm font-semibold mt-2'>Good Carrying Vehicles</p>

                            <div className='flex'>
                                <div className='p-2 flex flex-col gap-3'>
                            
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Pick-Ups</label>
                                    </div>
                            
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Small Cargo</label>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Small Liquid Carrying</label>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Medium Goods</label>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Medium Liquid Carrying</label>
                                    </div>
                                </div>

                                <div className='p-2 flex flex-col gap-3'>
                            
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Large Goods</label>
                                    </div>
                            
                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Large Liquid Carrying</label>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Trailers</label>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Semi Trailers</label>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <input type="checkbox" />
                                        <label htmlFor="" className='font-inter text-sm md:text-xs lg:text-xs'>Vehicles of Special Construction</label>
                                    </div>
                                </div>
                              
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>

            <div className="col-span-1 md:col-span-3 flex justify-between">
                <button type="button" className="bg-[#3AA4FF] text-white p-3 md:px-7 py-2 rounded" onClick={handlePrevious}>Previous</button>
                <div className='flex gap-3'>
                    <button onClick={(e)=>handleBackward(e)}><img src="/backward1.svg" alt="" width={25} height={25} /></button>
                    <button onClick={(e)=>handleForward(e)}><img src="/forward.svg" alt="" width={25} height={25} /></button>
                </div>
                <button type="submit" className="bg-blue-500 text-white p-5 md:px-10 py-2 rounded">Next</button>
            </div>
        </form>
    </div>
</div>
  )
}


