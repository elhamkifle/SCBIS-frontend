'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';

const vehicles = [
    {
        title: 'Third Party',
        coverageEndDate: '2023-12-31',
        territory: 'Ethiopia',
        duration: '1 Year',
    },
    {
        title: 'Own Damage',
        coverageEndDate: '2024-06-30',
        territory: 'Ethiopia',
        duration: '6 Months',
    },
];

export default function ClaimPolicySelection() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<{ title: string; coverageEndDate: string; territory: string; duration: string } | null>(null);
    const [selectedPolicy, setSelectedPolicy] = useState('');
    const [error, setError] = useState('');

    const handleSelect = (policy: string) => {
        setSelectedPolicy(policy);
        setError('');
    };

    const handlePrevious = () => router.push('/claim-submission/vehicle-selection');

    const handleNext = () => {
        if (!selectedPolicy) {
            setError('Please select an insurance coverage to continue.');
            return;
        }
        console.log('Selected Vehicle:', selectedPolicy);
        router.push('/claim-submission/claim-disclaimer');
    };

    return (
        <div className="flex flex-col items-center px-4 mb-10">
            <div className="w-full flex justify-between items-center mt-2 mb-10">
                <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission </h2>
                <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
            </div>
            <div className="w-full flex-col justify-between items-center mt-2 md:ml-12 md:mb-12">
                <p className='text-[#3AA4FF] font-bold text-start text-[22px] mb-2'>Select the Relevant Insurance Policy for this Claim. </p>
                <p className='text-[18px]'> Please select the insurance policy by clicking the card. </p>
            </div>

            {/* Centered Grid */}
            <div className="flex justify-center w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                    {vehicles.map((vehicle, index) => (
                        <div
                            key={index}
                            className={`bg-white px-16 py-8 rounded-2xl shadow-lg flex flex-col justify-around space-y-4 text-center md:mb-[20px] cursor-pointer ${selectedPolicy === vehicle.title ? 'border-2 border-green-500' : 'border border-gray-300'
                                }`}
                            style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}
                            onClick={() => handleSelect(vehicle.title)}
                        >
                            <h3 className="text-xl font-semibold">{vehicle.title}</h3>
                            <p className="text-md"><span className='text-[#3AA4FF] font-bold'>Coverage End Date:</span> {vehicle.coverageEndDate}</p>
                            <p className="text-md"><span className='text-[#3AA4FF] font-bold'>Territory:</span> {vehicle.territory}</p>
                            <p className="text-md"><span className='text-[#3AA4FF] font-bold'>Duration:</span> {vehicle.duration}</p>
                        </div>
                    ))}
                </div>
            </div>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <Dialog.Title className="text-lg font-bold mb-8">
                                {selectedVehicle?.title}
                            </Dialog.Title>
                            <div className="mt-4">
                                <p>Coverage End Date: {selectedVehicle?.coverageEndDate}</p>
                                <p>Territory: {selectedVehicle?.territory}</p>
                                <p>Duration: {selectedVehicle?.duration}</p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>

        {/* Navigation Buttons */}
        <div className="w-full max-w-5xl flex justify-between items-center mt-8">
        <button
          type="button"
          className="bg-[#3AA4FF] text-white p-7 py-2 rounded"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white p-10 py-2 rounded"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
        </div>
    );
}