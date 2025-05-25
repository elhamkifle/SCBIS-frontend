"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { usePersonalDetailStore } from '@/store/customerInformationStore/personalDetails';
import { useUserStore } from '@/store/authStore/useUserStore';

export default function PersonalDetailForm() {
    const router = useRouter();
    const { formData, updateFormData, logFormData } = usePersonalDetailStore();
    const user = useUserStore(state => state.user);
    const dataLoadedRef = useRef(false);

    // Load user data when the component mounts, but only once
    useEffect(() => {
        // Skip if we've already loaded data or if there's no user
        if (dataLoadedRef.current || !user) return;

        // Extract name parts from fullname if available
        let firstName = '';
        let lastName = '';
        
        if (user.fullname) {
            const nameParts = user.fullname.split(' ');
            if (nameParts.length >= 2) {
                // Assume first part is firstName, rest is lastName
                firstName = nameParts[0];
                lastName = nameParts.slice(1).join(' ');
            } else if (nameParts.length === 1) {
                firstName = nameParts[0];
            }
        }

        // Merge user data with form data, prioritizing any existing form data
        // This prevents overwriting user-entered form data with profile data
        const userData = {
            firstName: formData.firstName || firstName,
            lastName: formData.lastName || lastName,
            email: formData.email || user.email,
            phone: formData.phone || user.phoneNumber,
            // Add other fields as needed
        };
        
        // Only update if we have data to update
        if (Object.values(userData).some(val => val)) {
            updateFormData(userData);
            // Mark as loaded so we don't try again
            dataLoadedRef.current = true;
        }
    }, [user, updateFormData]); // Removed formData from dependencies

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateFormData({ [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        logFormData(); // Log the current form data
        router.push('/policy-purchase/personal-information/address');
    };

    const handleSaveAsDraft = () => {
        logFormData();
        // alert('Your information has been saved as draft.');
    };

    return (
        <div className="flex flex-col items-center px-4">
            <div className="w-full max-w-5xl flex justify-between items-center mt-8">
                <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
                <button 
                    type="button"
                    onClick={handleSaveAsDraft} 
                    className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded"
                    aria-label="Save as draft"
                >
                    Save as draft
                </button>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-wrap sm:justify-start md:justify-center items-center gap-4 sm:gap-8 mt-6 mb-4">
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#1F4878] text-white rounded-full">1</div>
                    <span className="ml-2 font-medium text-black text-sm sm:text-base">Personal Detail</span>
                </div>
                <div className="w-16 sm:border-t-2 border-l-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-white rounded-full">2</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Address</span>
                </div>
                <div className="w-16 sm:border-t-2 border-l-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-white rounded-full">3</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Upload ID</span>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white mb-10 p-8 rounded-xl w-full max-w-5xl lg:min-h-[350px] xl:min-h-[480px] xl:p-6"
                style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }} >

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-16 xl:gap-20">
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1" htmlFor="title">Title *</label>
                        <select 
                            id="title"
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            required
                            aria-label="Title"
                        >
                            <option value="">Select</option>
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                        </select>
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1" htmlFor="firstName">
                            First Name *
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="First Name"
                            placeholder="Enter first name"
                        />
                    </div>



                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1" htmlFor="lastName">Last Name *</label>
                        <input 
                            id="lastName"
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            required 
                            aria-label="Last Name"
                            placeholder="Enter last name"
                        />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1" htmlFor="gender">Gender *</label>
                        <select 
                            id="gender"
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            required
                            aria-label="Gender"
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1" htmlFor="dateOfBirth">Date Of Birth *</label>
                        <input 
                            id="dateOfBirth"
                            type="date" 
                            name="dateOfBirth" 
                            value={formData.dateOfBirth} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            required 
                            aria-label="Date of Birth"
                        />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1" htmlFor="nationality">Nationality *</label>
                        <select 
                            id="nationality"
                            name="nationality" 
                            value={formData.nationality} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            required
                            aria-label="Nationality"
                        >
                            <option value="">Select</option>
                            <option value="Ethiopian">Ethiopian</option>
                        </select>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1" htmlFor="email">Email Address</label>
                        <input 
                            id="email"
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="Email Address" 
                            placeholder="Enter email address"
                        />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1" htmlFor="phone">Additional Phone No.</label>
                        <input 
                            id="phone"
                            type="text" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            aria-label="Additional Phone Number"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1" htmlFor="tin">TIN No.</label>
                        <input 
                            id="tin"
                            type="text" 
                            name="tin" 
                            value={formData.tin} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            aria-label="TIN Number"
                            placeholder="Enter TIN number"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-3 flex justify-end">
                        <button
                            type="submit"
                            className="bg-[#1A73E8] text-white p-7 py-2 rounded"
                            aria-label="Next"
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
