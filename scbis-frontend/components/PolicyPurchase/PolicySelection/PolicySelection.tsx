'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

const covers = [
    {
        title: 'Compulsory Third-Party Cover',
        description: 'Legal requirement for all vehicles',
        benefits: [
            'Covers injuries, death, and property damage to third parties.',
            'Mandatory by Ethiopian law for all vehicle owners',
        ],
        info: `
This mandatory insurance covers your legal responsibility for death, bodily injury, or property damage to others arising from the use of your vehicle on public roads.

📌 Mandatory by Ethiopian law for all vehicle owners.

📌 Covers injuries, death, and property damage caused to third parties.

📌 Does NOT cover damages to your own vehicle.`,
        icon: '🚗💥',
    },
    {
        title: 'Own Damage Cover',
        description: 'Protects your vehicle from specific risks',
        benefits: [
            "Covers your car’s damages, fire, and theft.",
            "Ideal if you're seeking coverage for your vehicle without the full extent of a comprehensive policy.",
        ],
        info: `
Protects your vehicle from specific risks, covering damages caused by accidents, fire, or theft. It's ideal if you're seeking coverage for your vehicle without the full extent of a comprehensive policy.

📌 Covers damages to your own vehicle from accidents, fire, and theft.
📌 Does NOT cover third-party liability, natural disasters, or vandalism.
📌 More affordable than comprehensive insurance.`,
        icon: '🚘🔥',
    },
    {
        title: 'Comprehensive Cover',
        description: 'Full protection for you and others',
        benefits: [
            'Covers your vehicle, theft, fire, and third-party liabilities.',
            'Ideal for maximum protection against accidents and losses.',
        ],
        info: `
Provides extensive protection for your vehicle and third-party liabilities. This policy offers broad coverage, including protection against loss or damage to your vehicle due to accidents, theft, fire, and natural disasters, in addition to third-party liability coverage.

📌 Provides full protection for your vehicle and third parties.
📌 Covers accidents, theft, fire, and natural disasters.
📌 Higher premium, but best for expensive vehicles & full security.`,
        icon: '🛡️🚗',
    },
];

export default function PolicySelection() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedCover, setSelectedCover] = useState<{ title: string; info: string } | null>(null);
    const [selectedPolicy, setSelectedPolicy] = useState('');
    const [error, setError] = useState('');

    const handleSelect = (policy: string) => {
        setSelectedPolicy(policy);
        setError('');
    };

    const handleOpen = (title: string, info: string) => {
        setSelectedCover({ title, info });
        setOpen(true);
    };

    const handleNext = () => {
        if (!selectedPolicy) {
            setError('Please select a policy type.');
            return;
        }
        console.log('Selected Policy:', selectedPolicy);
        router.push('/policy-purchase/purchase/policyDuration'); 
    };

    const formatInfo = (info: string) => {
        return info.split('\n').map((line, index) => (
            <p key={index} className={line.startsWith('📌') ? 'ml-4 mt-2' : ''}>
                {line}
            </p>
        ));
    };

    return (
        <div className="flex flex-col items-center px-4 mb-10">
            <div className="w-full flex justify-between items-center mt-2">
                <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
                <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
            </div>
            {/* Progress Bar */}
            <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-4 mt-6 mb-4">
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">1</div>
                    <span className="ml-2 font-medium text-black text-xs sm:text-base">Policy Selection </span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center text-white bg-gray-300 rounded-full">2</div>
                    <span className="ml-2 text-black text-xs sm:text-base">Duration & Jurisdiction </span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">3</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Vehicle Information</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">4</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Driver Information</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {covers.map((cover, index) => (
                    <div
                        key={index}
                        className={`bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between space-y-4 text-center md:mb-[20px] md:min-h-[400px] cursor-pointer ${selectedPolicy === cover.title ? 'border-2 border-green-500' : 'border border-gray-300'
                            }`}
                        style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}
                        onClick={() => handleSelect(cover.title)}
                    >
                        <div className="text-4xl">{cover.icon}</div>
                        <h3 className="text-xl font-semibold">{cover.title}</h3>
                        <p className="text-md">{cover.description}</p>
                        <ul className="text-left space-y-2">
                            {cover.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start space-x-2 block">
                                    ✅<ul>{benefit}</ul>
                                </li>
                            ))}
                        </ul>
                        <button
                            className="flex items-end justify-end text-blue-500 hover:text-blue-700"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                handleOpen(cover.title, cover.info);
                            }}
                        >
                            <Info size={20} />
                        </button>
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
                                {selectedCover?.title}
                            </Dialog.Title>
                            <div className="mt-4">
                                {selectedCover && formatInfo(selectedCover.info)}
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

            <div className="flex justify-between w-full">
                <button className="border border-black px-4 py-2 rounded-lg">Learn More</button>
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