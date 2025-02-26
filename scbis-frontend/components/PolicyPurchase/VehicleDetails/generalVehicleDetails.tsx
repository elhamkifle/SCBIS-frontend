"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GeneralVehicleDetailForm() {
    const router = useRouter();

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
        console.log(formData);
        router.push('/ownershipAndUsage');
    };


    const handlePrevious = () => {
        router.back();
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
                    <div className="w-7 h-7 flex items-center justify-center text-white bg-green-500 rounded-full">2</div>
                    <span className="ml-2 text-black text-xs sm:text-base">Vehicle Category</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">3</div>
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



            <div className="bg-white mb-10 p-8 rounded-xl w-full max-w-5xl"
                style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10 xl:gap-16">
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Make *</label>
                        <select name="make" value={formData.make} onChange={handleChange} className="w-full p-2 border border-black rounded" required>
                            <option value="">Select</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                            <option value="Ford">Ford</option>
                        </select>
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Model *</label>
                        <input type="text" name="model" value={formData.model} onChange={handleChange} className="w-full p-2 border border-black rounded" required/>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Mfg Year *</label>
                        <select name="mfgYear" value={formData.mfgYear} onChange={handleChange} className="w-full p-2 border border-black rounded" required>
                            <option value="">Select</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                        </select>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">CC (Engine Capacity) *</label>
                        <input type="text" name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} className="w-full p-2 border border-black rounded" required/>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Chassis No. *</label>
                        <input type="text" name="chassisNo" value={formData.chassisNo} onChange={handleChange} className="w-full p-2 border border-black rounded" required/>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Engine No. *</label>
                        <input type="text" name="engineNo" value={formData.engineNo} onChange={handleChange} className="w-full p-2 border border-black rounded" required/>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Plate No. * </label>
                        <input type="text" name="plateNo" value={formData.plateNo} onChange={handleChange} className="w-full p-2 border border-black rounded" required/>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Body Type *</label>
                        <select name="bodyType" value={formData.bodyType} onChange={handleChange} className="w-full p-2 border border-black rounded" required>
                            <option value="">Select</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Truck">Truck</option>
                        </select>
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
