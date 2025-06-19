'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAddressStore } from '@/store/customerInformationStore/addressStore';
import { useUserStore } from '@/store/authStore/useUserStore';

export default function AddressForm() {
    const router = useRouter();
    const { 
        address, 
        updateAddress,
        setOriginalAddress,
        isDataModified
    } = useAddressStore();
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);
    const dataLoadedRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load user address data when the component mounts, but only once
    useEffect(() => {
        // Skip if we've already loaded data or if there's no user
        if (dataLoadedRef.current || !user) return;

        // Create address data object from backend response
        const addressData = {
            country: user.country || '',
            state: user.regionOrState || '', // Map regionOrState to state
            city: user.city || '',
            subcity: user.subcity || '',
            zone: user.zone || '',
            wereda: user.wereda || '',
            kebele: user.kebele || '',
            houseNo: user.houseNumber || '', // Map houseNumber to houseNo
        };
        
        // Set this as the original data and current address data
        setOriginalAddress(addressData);
        // Mark as loaded so we don't try again
        dataLoadedRef.current = true;
    }, [user, setOriginalAddress]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (isDataModified) {
            // If data is modified, submit to backend
            setIsSubmitting(true);
            try {
                // Update user address data in backend
                const updateData = {
                    country: address.country,
                    regionOrState: address.state, // Map state back to regionOrState
                    city: address.city,
                    subcity: address.subcity,
                    zone: address.zone,
                    wereda: address.wereda,
                    kebele: address.kebele,
                    houseNumber: address.houseNo, // Map houseNo back to houseNumber
                };

                // Here you would call your API to update user data
                // For now, I'll update the local user store
                if (user) {
                    const updatedUser = {
                        ...user,
                        ...updateData,
                    };
                    setUser(updatedUser);
                }

                console.log('Address updated:', updateData);
                
                // Update the original data to reflect the new saved state
                setOriginalAddress(address);
                
            } catch (error) {
                console.error('Error updating address:', error);
                // Handle error appropriately
            } finally {
                setIsSubmitting(false);
            }
        }
        
        router.push('/policy-purchase/personal-information/uploadID');
    };

    const handlePrevious = () => {
        router.push('/policy-purchase/personal-information/personalDetails');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateAddress({ [e.target.name]: e.target.value });
    };

    const countries = ['Ethiopia'];
    const ethiopianRegions = [
        'Addis Ababa', 'Afder', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa',
        'Gambela', 'Harari', 'Oromia', 'Sidama', 'Southern Nations, Nationalities, and Peoples\' Region (SNNPR)',
        'Somali', 'Tigray'
    ];
    const ethiopianCities = [
        'Addis Ababa', 'Adama', 'Hawassa', 'Mekelle', 'Dire Dawa', 'Jimma', 'Bahir Dar',
        'Gondar', 'Dessie', 'Jijiga', 'Nazret', 'Ambo', 'Awassa', 'Arba Minch', 'Asella',
        'Debre Birhan', 'Kombolcha', 'Woldiya', 'Shashemene', 'Goba', 'Debre Markos', 'Mizan Teferi',
        'Harar', 'Assosa', 'Nejo', 'Bedele', 'Bahir Dar', 'Fiche', 'Buta Jirra', 'Finote Selam',
        'Bahir Dar', 'Kochere', 'Kebri Dehar', 'Dilla', 'Lalibela'
    ];

    return (
        <div className="flex flex-col items-center px-4">
            <div className="w-full max-w-5xl flex justify-between items-center mt-8">
                <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-wrap sm:justify-start md:justify-center items-center gap-4 sm:gap-8 mt-6 mb-4">
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
                    <span className="ml-2 font-medium text-black text-sm sm:text-base">Personal Detail</span>
                </div>
                <div className="w-16 sm:border-t-2 border-l-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#1F4878] text-white rounded-full">2</div>
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
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 sm:gap- gap-12 xl:gap-20">
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Country *</label>
                        <select
                            name="country"
                            value={address.country}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="Country"
                        >
                            <option value="">Select a country</option>
                            {countries.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Region *</label>
                        <select
                            name="state"
                            value={address.state}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="Region"
                        >
                            <option value="">State/Region</option>
                            {ethiopianRegions.map((region, index) => (
                                <option key={index} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">City *</label>
                        <select
                            name="city"
                            value={address.city}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="City"
                        >
                            <option value="">Select a city</option>
                            {ethiopianCities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Subcity *</label>
                        <input
                            type="text"
                            name="subcity"
                            value={address.subcity}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="Subcity"
                            placeholder="Enter subcity"
                        />
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Zone/Sefer *</label>
                        <input
                            type="text"
                            name="zone"
                            value={address.zone}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="Zone"
                            placeholder="Enter zone"
                        />
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Wereda *</label>
                        <input
                            type="text"
                            name="wereda"
                            value={address.wereda}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="Wereda"
                            placeholder="Enter wereda"
                        />
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Kebele *</label>
                        <input
                            type="text"
                            name="kebele"
                            value={address.kebele}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="Kebele"
                            placeholder="Enter kebele"
                        />
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">House No.</label>
                        <input
                            type="text"
                            name="houseNo"
                            value={address.houseNo}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="House Number"
                            placeholder="Enter house number"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-3 flex justify-between mt-4">
                        <button type="button" onClick={handlePrevious} className="bg-[#3AA4FF] text-white p-7 py-2 rounded">Previous</button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`${
                                isDataModified 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } text-white p-7 py-2 rounded transition-colors ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Submitting...' : (isDataModified ? 'Submit' : 'Next')}
                        </button>
                    </div>
                </form>
            </div>
        </div>    
    );
}
