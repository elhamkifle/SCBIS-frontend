'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';

const vehicles = [
    {
        title: 'Vehicle 1',
        plateNo: '1122',
        purpose: 'Private',
        yearOfManufacture: '1999',
    },
    {
        title: 'Vehicle 2',
        plateNo: '3344',
        purpose: 'Commercial',
        yearOfManufacture: '2005',
    },
    {
        title: 'Vehicle 3',
        plateNo: '5566',
        purpose: 'Private',
        yearOfManufacture: '2010',
    },
];

export default function VehicleSelection() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<{ title: string; plateNo: string; purpose: string; yearOfManufacture: string } | null>(null);
    const [selectedPolicy, setSelectedPolicy] = useState('');
    const [error, setError] = useState('');

    const handleSelect = (policy: string) => {
        setSelectedPolicy(policy);
        setError('');
    };


    const handleNext = () => {
        if (!selectedPolicy) {
            setError('Please select a vehicle.');
            return;
        }
        console.log('Selected Vehicle:', selectedPolicy);
        router.push('/policy-purchase/purchase/policyDuration'); 
    };

    return (
        <div className="flex flex-col items-center px-4 mb-10">
            <div className="w-full flex justify-between items-center mt-2 mb-10">
                <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission </h2>
                <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
            </div>
            <div className="w-full flex-col justify-between items-center mt-2 md:ml-12 md:mb-12">
                <p className='text-[#3AA4FF] font-bold text-start text-[22px] mb-2'>Which of your vehicles was involved in the incident? </p>
                <p className='text-[18px]'> Please select the correct vehicle by clicking the card. </p>

                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle, index) => (
                    <div
                        key={index}
                        className={`bg-white px-16 py-8 rounded-2xl shadow-lg flex flex-col justify-around space-y-4 text-center md:mb-[20px] cursor-pointer ${selectedPolicy === vehicle.title ? 'border-2 border-green-500' : 'border border-gray-300'
                            }`}
                        style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}
                        onClick={() => handleSelect(vehicle.title)}
                    >
                        <h3 className="text-xl font-semibold">{vehicle.title}</h3>
                        <p className="text-md"><span className='text-[#3AA4FF] font-bold'> Plate No.: </span> {vehicle.plateNo}</p>
                        <p className="text-md"><span className='text-[#3AA4FF] font-bold'>  Purpose: </span> {vehicle.purpose}</p>
                        <p className="text-md"> <span className='text-[#3AA4FF] font-bold'>  Year of Manufacture: </span> {vehicle.yearOfManufacture}</p>
                    </div>
                ))}
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
                                <p>Plate No.: {selectedVehicle?.plateNo}</p>
                                <p>Purpose: {selectedVehicle?.purpose}</p>
                                <p>Year of Manufacture: {selectedVehicle?.yearOfManufacture}</p>
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

            <div className="flex justify-end mt-2 w-full">
                <button
                    onClick={handleNext}
                    className="bg-blue-500 text-white p-5 md:px-10 py-2 rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
}