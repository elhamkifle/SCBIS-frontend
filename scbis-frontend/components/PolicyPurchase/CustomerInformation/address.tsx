'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddressForm() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        handleNext(); // Move to the next step after submitting
    };

    // Navigate to the previous step
    const handlePrevious = () => {
        router.push('/policy-purchase/personal-information/personalDetails');
    };

    // Navigate to the next step
    const handleNext = () => {
        router.push('/policy-purchase/personal-information/uploadID');
    };

    const [formData, setFormData] = useState({
        country: '',
        state: '',
        city: '',
        subcity: '',
        zone: '',
        wereda: '',
        kebele: '',
        houseNo: '',
    });

    const countries = [
        'Ethiopia'
    ];

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col items-center px-4">
            <div className="w-full max-w-5xl flex justify-between items-center mt-8">
                <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
                <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
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
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
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
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
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
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
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
                            value={formData.subcity}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Zone *</label>
                        <input
                            type="text"
                            name="zone"
                            value={formData.zone}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Wereda *</label>
                        <input
                            type="text"
                            name="wereda"
                            value={formData.wereda}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Kebele *</label>
                        <input
                            type="text"
                            name="kebele"
                            value={formData.kebele}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">House No.</label>
                        <input
                            type="text"
                            name="houseNo"
                            value={formData.houseNo}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-3 flex justify-between mt-4">
                        <button type="button" onClick={handlePrevious} className="bg-[#3AA4FF] text-white p-7 py-2 rounded">Previous</button>
                        <button type="submit" className="bg-blue-600 text-white p-7 py-2 rounded">Next</button>                    </div>
                </form>
            </div>
        </div>    
    );
}
