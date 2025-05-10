'use client';

import { useRouter } from 'next/navigation';
import { useDriverDetailsStore } from '@/store/claimSubmission/driver-details';
import { useState } from 'react';

const ethiopianCities = [
  'Addis Ababa', 'Adama', 'Hawassa', 'Mekelle', 'Dire Dawa', 'Jimma', 'Bahir Dar',
  'Gondar', 'Dessie', 'Jijiga', 'Nazret', 'Ambo', 'Awassa', 'Arba Minch', 'Asella',
  'Debre Birhan', 'Kombolcha', 'Woldiya', 'Shashemene', 'Goba', 'Debre Markos', 'Mizan Teferi',
  'Harar', 'Assosa', 'Nejo', 'Bedele', 'Bahir Dar', 'Fiche', 'Buta Jirra', 'Finote Selam',
  'Bahir Dar', 'Kochere', 'Kebri Dehar', 'Dilla', 'Lalibela'
];

export default function ClaimDriverDetails() {
  const router = useRouter();
  const {
    isDriverSameAsInsured,
    agreed,
    formData,
    setDriverSame,
    updateFormData,
    clearAllData
  } = useDriverDetailsStore();

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handlePrevious = () => router.push('/claim-submission/claim-disclaimer');

  const handleNext = () => {

    // Only validate form if driver is not the same
    if (isDriverSameAsInsured === false) {
      const requiredFields = [
        'firstName',
        'lastName',
        'age',
        'city',
        'subCity',
        'kebele',
        'phoneNumber',
        'licenseNo',
        'grade',
        'expirationDate'
      ];
    
      const isFormValid = requiredFields.every(field => {
        const value = formData[field as keyof typeof formData];
        return String(value).trim() !== '';
      });
    
      if (!isFormValid) {
        setError('All fields are required when driver is not the insured customer.');
        return;
      }
    }
    

    console.log('Form Data:', formData);
    router.push('/claim-submission/accident-details');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <div className="w-full flex justify-between items-center mt-2 mb-10">
        <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission</h2>
        <div className="flex gap-2">
          <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">
            Save as draft
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-4 mt-6 mb-4">
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">1</div>
          <span className="ml-2 font-medium text-black text-xs sm:text-base">Driver's Details</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center text-white bg-gray-300 rounded-full">2</div>
          <span className="ml-2 text-black text-xs sm:text-base">Accident Details</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">3</div>
          <span className="ml-2 text-black text-sm sm:text-base">Liability & Insurance Information</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">4</div>
          <span className="ml-2 text-black text-sm sm:text-base">Witness Information</span>
        </div>
      </div>

      <div className="mt-6 p-4">
        <h3 className="text-lg">1. Was the driver at the moment of accident the same as the insured customer?</h3>
        <div className="mt-2 flex space-x-6">
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              name="driver" 
              checked={isDriverSameAsInsured === true}
              onChange={() => setDriverSame(true)} 
            />
            <p>Yes</p>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              name="driver" 
              checked={isDriverSameAsInsured === false}
              onChange={() => setDriverSame(false)} 
            />
            <p>No</p>
          </label>
        </div>
      </div>

      {isDriverSameAsInsured === false && (
        <div className="mt-2 p-4">
          <h3 className="text-lg">Please State the Driver's</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="relative w-full">
              <label className="absolute left-4 -top-2 text-black text-md bg-white px-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="relative w-full">
              <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="relative w-full">
              <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Age</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <h3 className="mt-6 text-blue-600 font-semibold">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="relative w-full">
              <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value=""></option>
                {ethiopianCities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="relative w-full">
              <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Subcity</label>
              <input
                type="text"
                name="subCity"
                value={formData.subCity}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="relative w-full">
              <label className="absolute left-4 -top-2 text-black text-md bg-white px-1">Kebele</label>
              <input
                type="text"
                name="kebele"
                value={formData.kebele}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div className="relative max-w-xs md:mt-6 mt-2">
            <label className="absolute left-4 -top-2 text-black text-md bg-white px-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <h3 className="mt-6 text-blue-600 font-semibold">Driver's License</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="relative w-full">
              <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">License No.</label>
              <input
                type="text"
                name="licenseNo"
                value={formData.licenseNo}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="relative w-full">
              <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Grade</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value=""></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div className="relative w-full">
              <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Expiration Date</label>
              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>
        </div>
      )}

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