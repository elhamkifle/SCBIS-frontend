'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useClaimPolicyStore } from '@/store/claimSubmission/claim-policy-selection';
import axios from 'axios';

export default function ClaimPolicySelection() {
    const router = useRouter();
    const {
        policies,
        selectedPolicy,
        selectPolicy,
        addPolicies,
    } = useClaimPolicyStore();

    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const handleSelect = (policyId: string) => {
        selectPolicy(policyId);
        setError('');
    };

    const handlePrevious = () => router.push('/claim-submission/vehicle-selection');

    const handleNext = () => {
        if (!selectedPolicy) {
            setError('Please select an insurance coverage to continue.');
            return;
        }
        router.push('/claim-submission/claim-disclaimer');
    };

    const selectedPolicyDetails = policies.find(p => p.title === selectedPolicy);


    const getAuthTokenFromCookie = (): string | null => {
        const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
    };

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const accessToken = getAuthTokenFromCookie();
                const response = await axios.get(
                    'https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/user-policies',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log('Fetched policies:', response.data);
                addPolicies(response.data);
            } catch (error) {
                console.error('Error fetching policies:', error);
            }
        };

        fetchPolicies();
    }, [addPolicies]);

    return (
        <div className="flex flex-col items-center px-4 mb-10">
            <div className="w-full flex justify-between items-center mt-2 mb-10">
                <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission</h2>
                <div className="flex gap-2">
                    <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">
                        Save as draft
                    </button>
                </div>
            </div>

            <div className="w-full flex-col justify-between items-center mt-2 md:ml-12 md:mb-12">
                <p className='text-[#3AA4FF] font-bold text-start text-[22px] mb-2'>
                    Select the Relevant Insurance Policy for this Claim
                </p>
                <p className='text-[18px]'>Please select the insurance policy by clicking the card.</p>
            </div>

            <div className="flex justify-center w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                    {policies.map((policy) => {
                        const generalDetails =
                            policy.privateVehicle?.generalDetails ||
                            policy.commercialVehicle?.generalDetails;

                        return (
                            <div
                                key={policy._id}
                                className={`bg-white px-16 py-8 rounded-2xl shadow-lg flex flex-col justify-around space-y-4 text-center md:mb-[20px] cursor-pointer ${selectedPolicy === policy._id
                                        ? 'border-2 border-green-500'
                                        : 'border border-gray-300'
                                    }`}
                                style={{
                                    boxShadow:
                                        '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                                onClick={() => handleSelect(policy._id)}
                            >
                                <p className="text-sm text-gray-400">Policy ID: {policy._id}</p>
                                <h3 className="text-xl font-semibold">{policy.title}</h3>
                                <p className="text-md">
                                    <span className="text-[#3AA4FF] font-bold">Coverage End Date:</span>{' '}
                                    {policy.coverageEndDate}
                                </p>
                                <p className="text-md">
                                    <span className="text-[#3AA4FF] font-bold">Territory:</span>{' '}
                                    {policy.territory}
                                </p>

                                {generalDetails && (
                                    <>
                                        <p className="text-md">
                                            <span className="text-[#3AA4FF] font-bold">Make:</span>{' '}
                                            {generalDetails.make}
                                        </p>
                                        <p className="text-md">
                                            <span className="text-[#3AA4FF] font-bold">Model:</span>{' '}
                                            {generalDetails.model}
                                        </p>
                                        <p className="text-md">
                                            <span className="text-[#3AA4FF] font-bold">Plate Number:</span>{' '}
                                            {generalDetails.plateNumber}
                                        </p>
                                    </>
                                )}
                            </div>
                        );
                    })}


                </div>
            </div>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <Dialog.Title className="text-lg font-bold mb-8">
                                {selectedPolicyDetails?.title}
                            </Dialog.Title>
                            <div className="mt-4">
                                <p>Coverage End Date: {selectedPolicyDetails?.coverageEndDate}</p>
                                <p>Territory: {selectedPolicyDetails?.territory}</p>
                                <p>Duration: {selectedPolicyDetails?.duration}</p>
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
