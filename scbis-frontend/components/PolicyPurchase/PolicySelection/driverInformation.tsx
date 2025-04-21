'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { policyHook } from '@/context/PolicyContextProvider';

interface DriverInfo {
  driverLicenseGrade: string;
  driverName: string;
  drivingExperience: string;
}

interface FormData {
  employDriver: string;
  drivers: DriverInfo[];
  employDriverUnder21: string;
  physicalInfirmity: string;
  lessThanSixMonthsExperience: string;
  fullName: string;
  signatureDate: string;
  acceptTerms: boolean;
}

interface Errors {
  employDriver?: string;
  drivers?: { driverLicenseGrade?: string; driverName?: string; drivingExperience?: string }[];
  employDriverUnder21?: string;
  physicalInfirmity?: string;
  lessThanSixMonthsExperience?: string;
  fullName?: string;
  signatureDate?: string;
  acceptTerms?: string;
}

export default function DriverInformation() {
  const {policy,dispatch} = policyHook()
  console.log('here is the policy',policy)
  const [formData, setFormData] = useState<FormData>({
    employDriver: '',
    drivers: [{ driverLicenseGrade: '', driverName: '', drivingExperience: '' }],
    employDriverUnder21: '',
    physicalInfirmity: '',
    lessThanSixMonthsExperience: '',
    fullName: '',
    signatureDate: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [backEndError,setBackEndErorr] = useState<boolean|string>(false)
  const {refreshToken,accessToken}= JSON.parse(localStorage.getItem('userData')!)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear errors when the user starts typing
    setErrors({ ...errors, [name]: '' });
  };

  const handleDriverChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedDrivers = [...formData.drivers];
    updatedDrivers[index] = { ...updatedDrivers[index], [name]: value };
    setFormData({ ...formData, drivers: updatedDrivers });
    // Clear errors for the specific driver field
    setErrors({ ...errors, drivers: undefined });
  };

  const addDriver = () => {
    setFormData({
      ...formData,
      drivers: [...formData.drivers, { driverLicenseGrade: '', driverName: '', drivingExperience: '' }],
    });
  };

  const removeDriver = (index: number) => {
    const updatedDrivers = formData.drivers.filter((_, i) => i !== index);
    setFormData({ ...formData, drivers: updatedDrivers });
  };

  const router = useRouter();

  const handlePrevious = () => {
    router.push('/policy-purchase/purchase/vehicleInformation');
  };

  const handleNext = async () => {
    const newErrors: Errors = {};
    setBackEndErorr(false)

    // Validate required fields
    if (!formData.employDriver) newErrors.employDriver = 'This field is required';
    if (formData.employDriver === 'yes') {
      formData.drivers.forEach((driver, index) => {
        if (!driver.driverLicenseGrade) {
          newErrors.drivers = newErrors.drivers || [];
          newErrors.drivers[index] = { driverLicenseGrade: 'This field is required' };
        }
        if (!driver.driverName) {
          newErrors.drivers = newErrors.drivers || [];
          newErrors.drivers[index] = { ...newErrors.drivers[index], driverName: 'This field is required' };
        }
        if (!driver.drivingExperience) {
          newErrors.drivers = newErrors.drivers || [];
          newErrors.drivers[index] = { ...newErrors.drivers[index], drivingExperience: 'This field is required' };
        }
      });
    }
    if (!formData.employDriverUnder21) newErrors.employDriverUnder21 = 'This field is required';
    if (!formData.physicalInfirmity) newErrors.physicalInfirmity = 'This field is required';
    if (!formData.lessThanSixMonthsExperience) newErrors.lessThanSixMonthsExperience = 'This field is required';
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.signatureDate) newErrors.signatureDate = 'Date is required';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms to continue';

    setErrors(newErrors);

    // If there are no errors, proceed to the next page
    if (Object.keys(newErrors).length === 0) {
      const res = await fetch("http://localhost:4000/policy/policy-selection",{
        method:"POST",
        body:JSON.stringify(policy),
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${refreshToken}`
        }
      })
  
      const data = await res.json()
      console.log(data)
      
      if (res.ok){
        setBackEndErorr('POlicy created successfuly')
        window.location.href = 'policy-purchase/purchase/payment';
        return
      }

      setBackEndErorr(data.message)

      
       // Replace with the actual next page route
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 rounded-lg">
      <div className="w-full flex justify-between items-center mt-2">
        <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
        <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">
          Save as draft
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-4 mt-6 mb-4">
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
          <span className="ml-2 font-medium text-black text-xs sm:text-base">Policy Selection </span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center text-white bg-green-500 rounded-full">2</div>
          <span className="ml-2 text-black text-xs sm:text-base">Duration & Jurisdiction </span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">3</div>
          <span className="ml-2 text-black text-sm sm:text-base">Vehicle Information</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">4</div>
          <span className="ml-2 text-black text-sm sm:text-base">Driver Information</span>
        </div>
      </div>

      {/* Question 1 */}
      <div className="mt-8 mb-8">
        <label className="font-semibold">
          1. Do you or will you employ any driver?
        </label>
        <div className="flex gap-4 mt-4">
          <label>
            <input type="radio" name="employDriver" value="yes" onChange={handleChange} /> Yes
          </label>
          <label>
            <input type="radio" name="employDriver" value="no" onChange={handleChange} /> No
          </label>
        </div>
        {errors.employDriver && <p className="text-red-500">{errors.employDriver}</p>}
        {formData.employDriver === 'yes' && (
          <div className="mt-4">
            <p>Please State the driver’s information</p>
            {formData.drivers.map((driver, index) => (
              <div key={index} className="flex flex-col lg:flex-row gap-4 mt-4">
                <div className="flex-1">
                <label className="block text-md font-medium text-black mb-2">Driver’s License Grade/Level</label>
                  <select name="make" className="border p-2 w-full" onChange={handleChange}>
                    <option value=""></option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                 </select>
                  {errors.drivers?.[index]?.driverLicenseGrade && (
                    <p className="text-red-500">{errors.drivers[index].driverLicenseGrade}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-md font-medium text-black mb-2">Driver’s Name</label>
                  <input
                    type="text"
                    name="driverName"
                    value={driver.driverName}
                    className="border p-2 w-full"
                    onChange={(e) => handleDriverChange(index, e)}
                  />
                  {errors.drivers?.[index]?.driverName && (
                    <p className="text-red-500">{errors.drivers[index].driverName}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-md font-medium text-black mb-2">Driving Experience (Years)</label>
                  <input
                    type="text"
                    name="drivingExperience"
                    value={driver.drivingExperience}
                    className="border p-2 w-full"
                    onChange={(e) => handleDriverChange(index, e)}
                  />
                  {errors.drivers?.[index]?.drivingExperience && (
                    <p className="text-red-500">{errors.drivers[index].drivingExperience}</p>
                  )}
                </div>

                {index === formData.drivers.length - 1 && (
                  <button
                    type="button"
                    className="bg-white text-blue-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center mt-0 lg:mt-8"
                    onClick={addDriver}
                  >
                    <span className="text-4xl">+</span>
                  </button>
                )}

                {index > 0 && (
                  <button
                    type="button"
                    className="bg-white text-red-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center mt-0 lg:mt-8"
                    onClick={() => removeDriver(index)} 
                  >
                    <span className="text-4xl">-</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Question 2 */}
      <div className="mb-8">
        <label className="font-semibold">2. Do you or will you employ any driver under the age of 21?</label>
        <div className="flex gap-4 mt-4">
          <label>
            <input type="radio" name="employDriverUnder21" value="yes" onChange={handleChange} /> Yes
          </label>
          <label>
            <input type="radio" name="employDriverUnder21" value="no" onChange={handleChange} /> No
          </label>
        </div>
        {errors.employDriverUnder21 && <p className="text-red-500">{errors.employDriverUnder21}</p>}
      </div>

      {/* Question 3 */}
      <div className="mb-8">
        <label className="font-semibold">3. Do you or any other person, who to your knowledge will drive, suffer from any physical infirmity or from defective vision or hearing?</label>
        <div className="flex gap-4 mt-4">
          <label>
            <input type="radio" name="physicalInfirmity" value="yes" onChange={handleChange} /> Yes
          </label>
          <label>
            <input type="radio" name="physicalInfirmity" value="no" onChange={handleChange} /> No
          </label>
        </div>
        {errors.physicalInfirmity && <p className="text-red-500">{errors.physicalInfirmity}</p>}
      </div>

      {/* Question 4 */}
      <div className="mb-8">
        <label className="font-semibold">4. Do you or any driver of the vehicle(s) have had less than six months’ experience?</label>
        <div className="flex gap-4 mt-4">
          <label>
            <input type="radio" name="lessThanSixMonthsExperience" value="yes" onChange={handleChange} /> Yes
          </label>
          <label>
            <input type="radio" name="lessThanSixMonthsExperience" value="no" onChange={handleChange} /> No
          </label>
        </div>
        {errors.lessThanSixMonthsExperience && <p className="text-red-500">{errors.lessThanSixMonthsExperience}</p>}
      </div>

      {/* Signature Section */}
      <div className="mt-8 mb-8">
        <label className="font-bold">Declaration:</label>
        <p className="mb-8">
          I, the undersigned, declare that the vehicle(s) described in this proposal are in good condition and will
          continue to be so maintained. I hereby warrant that the above statements and particulars are true. I hereby agree
          that these declarations shall be deemed to be of a promissory nature and effect and the basis of the contract between
          me and the company and that I have not withheld any important information which should be
          communicated to the company and that I am willing to accept a policy subject to the terms conditions and exceptions therein and to pay the premium agreed upon.
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-24 mt-4">
          <div className="flex-1">
            <label className="block text-md font-medium text-black mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="w-full border py-2 border-white border-b-black"
              onChange={handleChange}
            />
            {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
          </div>
          <div className="flex-1">
            <label className="block text-md font-medium text-black mb-2">Date</label>
            <input
              type="date"
              name="signatureDate"
              className="w-full border py-2 border-white border-b-black"
              onChange={handleChange}
            />
            {errors.signatureDate && <p className="text-red-500">{errors.signatureDate}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label>
            <input
              type="checkbox"
              name="acceptTerms"
              onChange={handleChange}
              checked={formData.acceptTerms}
            />{' '}
            I Accept and Continue
          </label>
          {errors.acceptTerms && <p className="text-red-500">{errors.acceptTerms}</p>}
        </div>
      </div>

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
          Submit
        </button>
      </div>

      {backEndError && <p className='text-red-600 text-xs'>{backEndError}</p>}
    </div>
  );
}