"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChoosePurposeForm() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState('');
    const [error, setError] = useState('');

    const handleSelect = (type: string) => {
        setSelectedType(type);
        setError('');
    };

    const handleNext = () => {
        if (!selectedType) {
            setError('Please select an insurance type.');
            return;
        }
        console.log('Selected Insurance Type:', selectedType);
        router.push('/vehicleCategory');
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
                    <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">1</div>
                    <span className="ml-2 font-medium text-black text-xs sm:text-base">Purpose</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">2</div>
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

            <div className="w-full max-w-5xl flex justify-between items-center mt-3 md:ml-24">
                <h2 className="md:text-xl sm:text-lg font-semibold">Pick a card to choose Private or Commercial Use.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:px-12 mt-3">
                <div className={`px-12 py-8 border rounded-xl cursor-pointer shadow-lg ${selectedType === 'private' ? 'border-green-500' : 'border-gray-300'}`} onClick={() => handleSelect('private')} style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }} >
                    <h3 className="text-xl text-center font-bold text-blue-600 mb-6">Private </h3>
                    <h4 className='font-bold'> What's Included</h4>
                    <p className="mt-2">✅ Vehicles registered for private individuals.</p>
                    <p className="mt-1">✅ Non-commercial travel.</p> <br />

                    <h4 className='font-bold'> Exclusions(Not Covered Under Private Policy)</h4>
                    <p> ❌ Cargo-carrying vehicles used for business. </p>
                    <p> ❌ Racing, speed testing, or commercial driving school vehicles. </p>
                    <p> ❌ Vehicles rented or leased for income generation.</p>
                </div>
                <div className={`px-12 py-8 border rounded-xl cursor-pointer shadow-lg ${selectedType === 'commercial' ? 'border-green-500' : 'border-gray-300'}`} onClick={() => handleSelect('commercial')} style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }} >
                    <h3 className="text-xl text-center font-bold text-blue-600 mb-6">Commercial</h3>
                    <h4 className='font-bold'> What's Included</h4> 
                    <p className="mt-2">✅ Vehicles registered for business transport.</p>
                    <p className="mt-1">✅ Includes taxis, buses, and cargo trucks.</p> <br />

                    <h4 className='font-bold'> Exclusions(Not Covered Under Private Policy)</h4>
                    <p> ❌ Privately owned cars used for personal purposes. </p>
                    <p> ❌ Motorcycles & scooters not registered for commercial delivery services. </p>
                </div>
            </div>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            <div className="w-full max-w-5xl flex justify-end my-6 pr-4">
                <button onClick={handleNext} className="bg-[#1A73E8] text-white px-6 py-2 rounded">Next</button>
            </div>
        </div>


    );
}
