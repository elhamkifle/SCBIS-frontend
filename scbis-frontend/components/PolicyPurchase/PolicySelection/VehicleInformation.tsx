'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useVehicleInfoStore } from '@/store/policyPurchase/vehicleDetails';

// interface FormData {
//   coverRequired: string;
//   make: string;
//   value: string;
//   vehicleInGoodRepair: string;
//   vehicleLeftOvernight: string;
//   soleProperty: string;
//   ownerName: string;
//   ownerAddress: string;
//   privateUse: string;
//   otherUses: string;
//   convicted: string;
//   convictionDetails: string;
//   insuredBefore: string;
//   insurerName: string;
//   companyHistory: string[];
//   hadAccidents: string;
//   accidentDetails: string;
//   claimsInjury: string;
//   claimsInjuryDetails: string;
//   claimsProperty: string;
//   claimsPropertyDetails: string;
//   personalAccident: string;
//   passengersInsured: string;
// }

interface Errors {
  coverRequired?: string;
  make?: string;
  value?: string;
  vehicleInGoodRepair?: string;
  vehicleLeftOvernight?: string;
  soleProperty?: string;
  ownerName?: string;
  ownerAddress?: string;
  privateUse?: string;
  otherUses?: string;
  convicted?: string;
  convictionDetails?: string;
  insuredBefore?: string;
  insurerName?: string;
  companyHistory?: string; // Error message for companyHistory
  hadAccidents?: string;
  accidentDetails?: string;
  claimsInjury?: string;
  claimsInjuryDetails?: string;
  claimsProperty?: string;
  claimsPropertyDetails?: string;
  personalAccident?: string;
  passengersInsured?: string;
}

export default function VehicleInformation() {
  const router = useRouter();
  const {
    formData,
    updateFormData,
    updateCompanyHistory,
    // clearStorage
  } = useVehicleInfoStore();

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    updateCompanyHistory(value, checked);
    setErrors({ ...errors, companyHistory: '' });
  };

  const handlePrevious = () => {
    router.push('/policy-purchase/purchase/policyDuration');
  };

  const handleNext = () => {
    const newErrors: Errors = {};

    // Validate required fields
    if (!formData.coverRequired) newErrors.coverRequired = 'This field is required';
    if (formData.coverRequired === 'yes' && !formData.make) newErrors.make = 'This field is required';
    if (formData.coverRequired === 'yes' && !formData.value) newErrors.value = 'This field is required';
    if (!formData.vehicleInGoodRepair) newErrors.vehicleInGoodRepair = 'This field is required';
    if (!formData.vehicleLeftOvernight) newErrors.vehicleLeftOvernight = 'This field is required';
    if (!formData.soleProperty) newErrors.soleProperty = 'This field is required';
    if (formData.soleProperty === 'no' && !formData.ownerName) newErrors.ownerName = 'This field is required';
    if (formData.soleProperty === 'no' && !formData.ownerAddress) newErrors.ownerAddress = 'This field is required';
    if (!formData.privateUse) newErrors.privateUse = 'This field is required';
    if (formData.privateUse === 'no' && !formData.otherUses) newErrors.otherUses = 'This field is required';
    if (!formData.convicted) newErrors.convicted = 'This field is required';
    if (formData.convicted === 'yes' && !formData.convictionDetails) newErrors.convictionDetails = 'This field is required';
    if (!formData.insuredBefore) newErrors.insuredBefore = 'This field is required';
    if (formData.insuredBefore === 'yes' && !formData.insurerName) newErrors.insurerName = 'This field is required';
    if (formData.companyHistory.length === 0) newErrors.companyHistory = 'This field is required'; // Validation for Question 8
    if (!formData.hadAccidents) newErrors.hadAccidents = 'This field is required';
    if (formData.hadAccidents === 'yes' && !formData.accidentDetails) newErrors.accidentDetails = 'This field is required';
    if (!formData.claimsInjury) newErrors.claimsInjury = 'This field is required';
    if (formData.claimsInjury === 'yes' && !formData.claimsInjuryDetails) newErrors.claimsInjuryDetails = 'This field is required';
    if (!formData.claimsProperty) newErrors.claimsProperty = 'This field is required';
    if (formData.claimsProperty === 'yes' && !formData.claimsPropertyDetails) newErrors.claimsPropertyDetails = 'This field is required';
    if (!formData.personalAccident) newErrors.personalAccident = 'This field is required';
    if (!formData.passengersInsured) newErrors.passengersInsured = 'This field is required';

    setErrors(newErrors);

    // If there are no errors, proceed to the next page
    if (Object.keys(newErrors).length === 0) {
      router.push('/policy-purchase/purchase/driverInformation');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      router.push('/policy-purchase/purchase/driverInformation');
    }
  };

  // const handleSubmitDraft = () => {
  //   alert('Draft saved successfully!');
  // };


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
        <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">3</div>
        <span className="ml-2 text-black text-sm sm:text-base">Vehicle Information</span>
      </div>
      <div className="w-7 sm:border-t-2 border-gray-400"></div>
      <div className="flex items-center">
        <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">4</div>
        <span className="ml-2 text-black text-sm sm:text-base">Driver Information</span>
      </div>
    </div>
<div className="mt-8 mb-8">
  <label className="font-semibold">
    1. Is cover required for Radios, tape recorders, and Record players fitted to the vehicle(s)?
  </label>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="coverRequired" 
        value="yes" 
        checked={formData.coverRequired === 'yes'}
        onChange={handleChange} 
      /> Yes
    </label>
    <label>
      <input 
        type="radio" 
        name="coverRequired" 
        value="no" 
        checked={formData.coverRequired === 'no'}
        onChange={handleChange} 
      /> No
    </label>
  </div>
  {errors.coverRequired && <p className="text-red-500">{errors.coverRequired}</p>}
  {formData.coverRequired === 'yes' && (
    <div className="mt-4">
      <p>Please State.</p>
      <div className="flex gap-4 mt-2">
        <select 
          name="make" 
          value={formData.make}
          className="border p-2 w-full" 
          onChange={handleChange}
        >
          <option value="">Select Make</option>
          <option value="Sony">Sony</option>
          <option value="Pioneer">Pioneer</option>
          <option value="Kenwood">Kenwood</option>
        </select>
        {errors.make && <p className="text-red-500">{errors.make}</p>}
        <input 
          type="text" 
          name="value" 
          value={formData.value}
          placeholder="Value (Birr)" 
          className="border p-2 w-full" 
          onChange={handleChange} 
        />
        {errors.value && <p className="text-red-500">{errors.value}</p>}
      </div>
    </div>
  )}
</div>

<div className="mb-8">
  <label className="font-semibold">2. Is the vehicle(s) in good state of repair?</label>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="vehicleInGoodRepair" 
        value="yes" 
        checked={formData.vehicleInGoodRepair === 'yes'}
        onChange={handleChange} 
      /> Yes
    </label>
    <label>
      <input 
        type="radio" 
        name="vehicleInGoodRepair" 
        value="no" 
        checked={formData.vehicleInGoodRepair === 'no'}
        onChange={handleChange} 
      /> No
    </label>
  </div>
  {errors.vehicleInGoodRepair && <p className="text-red-500">{errors.vehicleInGoodRepair}</p>}
</div>

<div className="mb-8">
  <label className="font-semibold">3. Is the vehicle(s) usually left overnight?</label>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="vehicleLeftOvernight" 
        value="garage" 
        checked={formData.vehicleLeftOvernight === 'garage'}
        onChange={handleChange} 
      /> In a Garage
    </label>
    <label>
      <input 
        type="radio" 
        name="vehicleLeftOvernight" 
        value="open" 
        checked={formData.vehicleLeftOvernight === 'open'}
        onChange={handleChange} 
      /> In the Open but on your premises
    </label>
    <label>
      <input 
        type="radio" 
        name="vehicleLeftOvernight" 
        value="elsewhere" 
        checked={formData.vehicleLeftOvernight === 'elsewhere'}
        onChange={handleChange} 
      /> Elsewhere
    </label>
  </div>
  {errors.vehicleLeftOvernight && <p className="text-red-500">{errors.vehicleLeftOvernight}</p>}
</div>

<div className="mb-8">
  <label className="font-semibold">4. Is the vehicle(s) your sole and absolute property?</label>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="soleProperty" 
        value="yes" 
        checked={formData.soleProperty === 'yes'}
        onChange={handleChange} 
      /> Yes
    </label>
    <label>
      <input 
        type="radio" 
        name="soleProperty" 
        value="no" 
        checked={formData.soleProperty === 'no'}
        onChange={handleChange} 
      /> No
    </label>
  </div>
  {errors.soleProperty && <p className="text-red-500">{errors.soleProperty}</p>}
  {formData.soleProperty === 'no' && (
    <div className="mt-4">
      <p>Please State.</p>
      <div className="flex gap-4 mt-2">
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          placeholder="Name of the owner"
          className="border p-2 w-full"
          onChange={handleChange}
        />
        {errors.ownerName && <p className="text-red-500">{errors.ownerName}</p>}
        <input
          type="text"
          name="ownerAddress"
          value={formData.ownerAddress}
          placeholder="Address of the owner"
          className="border p-2 w-full"
          onChange={handleChange}
        />
        {errors.ownerAddress && <p className="text-red-500">{errors.ownerAddress}</p>}
      </div>
    </div>
  )}
</div>

<div className="mb-8">
  <label className="font-semibold">Will the vehicle(s) be used solely for private purposes as described below: If not, please state other uses.</label>
  <p className="text-gray-600 mt-2">Private purpose: the term &apos;private purposes&apos; means social domestic, pleasure, Professional purposes or business calls of the insured.</p>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="privateUse" 
        value="yes" 
        checked={formData.privateUse === 'yes'}
        onChange={handleChange} 
      /> Yes
    </label>
    <label>
      <input 
        type="radio" 
        name="privateUse" 
        value="no" 
        checked={formData.privateUse === 'no'}
        onChange={handleChange} 
      /> No
    </label>
  </div>
  {errors.privateUse && <p className="text-red-500">{errors.privateUse}</p>}
  {formData.privateUse === 'no' && (
    <div className="mt-4">
      <p>Please State other uses.</p>
      <textarea
        name="otherUses"
        value={formData.otherUses}
        placeholder="State other uses"
        className="border p-2 w-full mt-2"
        onChange={handleChange}
      ></textarea>
      {errors.otherUses && <p className="text-red-500">{errors.otherUses}</p>}
    </div>
  )}
</div>

<div className="mb-8">
  <label className="font-semibold">6. Have you or any other person, who to your knowledge will drive been convicted of any offence in connection with the driving of any motor Vehicle?</label>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="convicted" 
        value="yes" 
        checked={formData.convicted === 'yes'}
        onChange={handleChange} 
      /> Yes
    </label>
    <label>
      <input 
        type="radio" 
        name="convicted" 
        value="no" 
        checked={formData.convicted === 'no'}
        onChange={handleChange} 
      /> No
    </label>
  </div>
  {errors.convicted && <p className="text-red-500">{errors.convicted}</p>}
  {formData.convicted === 'yes' && (
    <div className="mt-4">
      <p>If so, give particulars.</p>
      <textarea
        name="convictionDetails"
        value={formData.convictionDetails}
        placeholder="Give particulars"
        className="border p-2 w-full mt-2"
        onChange={handleChange}
      ></textarea>
      {errors.convictionDetails && <p className="text-red-500">{errors.convictionDetails}</p>}
    </div>
  )}
</div>

<div className="mb-8">
  <label className="font-semibold">7. Are you now or have you been insured in respect of any motor vehicle?</label>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="insuredBefore" 
        value="yes" 
        checked={formData.insuredBefore === 'yes'}
        onChange={handleChange} 
      /> Yes
    </label>
    <label>
      <input 
        type="radio" 
        name="insuredBefore" 
        value="no" 
        checked={formData.insuredBefore === 'no'}
        onChange={handleChange} 
      /> No
    </label>
  </div>
  {errors.insuredBefore && <p className="text-red-500">{errors.insuredBefore}</p>}
  {formData.insuredBefore === 'yes' && (
    <div className="mt-4">
      <p>Name of the insurer</p>
      <input 
        type="text" 
        name="insurerName" 
        value={formData.insurerName}
        placeholder="Name of the insurer" 
        className="border p-2 w-full mt-2" 
        onChange={handleChange} 
      />
      {errors.insurerName && <p className="text-red-500">{errors.insurerName}</p>}
    </div>
  )}
</div>

<div className="mb-8">
  <label className="font-semibold">8. Has any company ever:</label>
  <div className="flex flex-col gap-2 mt-4">
    {[
      'None',
      'Declined your proposal',
      'Refused to renew your policy',
      'Canceled your policy',
      'Required an increase of premium',
      'Required you to carry the first portion of any loss',
      'Imposed special conditions',
    ].map((option) => (
      <label key={option} className="flex items-center gap-2">
        <input
          type="checkbox"
          value={option}
          onChange={handleCheckboxChange}
          checked={formData.companyHistory.includes(option)}
          className="h-4 w-4"
        />
        <span>{option}</span>
      </label>
    ))}
  </div>
  {errors.companyHistory && <p className="text-red-500">{errors.companyHistory}</p>}
</div>

<div className="mb-8">
  <label className="font-semibold">9. Have you or any driver had any accidents in the past 2 years?</label>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="hadAccidents" 
        value="yes" 
        checked={formData.hadAccidents === 'yes'}
        onChange={handleChange} 
      /> Yes
    </label>
    <label>
      <input 
        type="radio" 
        name="hadAccidents" 
        value="no" 
        checked={formData.hadAccidents === 'no'}
        onChange={handleChange} 
      /> No
    </label>
  </div>
  {errors.hadAccidents && <p className="text-red-500">{errors.hadAccidents}</p>}
  {formData.hadAccidents === 'yes' && (
    <div className="mt-4">
      <p>If so, please provide details briefly: </p>
      <textarea 
        name="accidentDetails" 
        value={formData.accidentDetails}
        placeholder="Provide details of the accidents" 
        className="border p-2 w-full mt-2" 
        onChange={handleChange}
      ></textarea>
      {errors.accidentDetails && <p className="text-red-500">{errors.accidentDetails}</p>}
    </div>
  )}
</div>

<div className="mb-8">
  <label className="font-semibold">10. Have there been any claims against you by other parties for personal injury related to vehicle accidents in the past 2 years?</label>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="claimsInjury" 
        value="yes" 
        checked={formData.claimsInjury === 'yes'}
        onChange={handleChange} 
      /> Yes
    </label>
    <label>
      <input 
        type="radio" 
        name="claimsInjury" 
        value="no" 
        checked={formData.claimsInjury === 'no'}
        onChange={handleChange} 
      /> No
    </label>
  </div>
  {errors.claimsInjury && <p className="text-red-500">{errors.claimsInjury}</p>}
  {formData.claimsInjury === 'yes' && (
    <div className="mt-4">
      <p>If so, please provide details briefly: </p>
      <textarea 
        name="claimsInjuryDetails" 
        value={formData.claimsInjuryDetails}
        placeholder="Provide details" 
        className="border p-2 w-full mt-2" 
        onChange={handleChange}
      ></textarea>
      {errors.claimsInjuryDetails && <p className="text-red-500">{errors.claimsInjuryDetails}</p>}
    </div>
  )}
</div>

<div className="mb-8">
  <label className="font-semibold">11. Have there been any claims against you by other parties for property damage related to vehicle accidents in the past 2 years?</label>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="claimsProperty" 
        value="yes" 
        checked={formData.claimsProperty === 'yes'}
        onChange={handleChange} 
      /> Yes
    </label>
    <label>
      <input 
        type="radio" 
        name="claimsProperty" 
        value="no" 
        checked={formData.claimsProperty === 'no'}
        onChange={handleChange} 
      /> No
    </label>
  </div>
  {errors.claimsProperty && <p className="text-red-500">{errors.claimsProperty}</p>}
  {formData.claimsProperty === 'yes' && (
    <div className="mt-4">
      <p>If so, please provide details briefly: </p>
      <textarea 
        name="claimsPropertyDetails" 
        value={formData.claimsPropertyDetails}
        placeholder="Provide details" 
        className="border p-2 w-full mt-2" 
        onChange={handleChange}
      ></textarea>
      {errors.claimsPropertyDetails && <p className="text-red-500">{errors.claimsPropertyDetails}</p>}
    </div>
  )}
</div>

<div className="mb-8">
  <label className="font-semibold">12. Do you wish to insure for personal Accident Benefit?</label>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="personalAccident" 
        value="yes" 
        checked={formData.personalAccident === 'yes'}
        onChange={handleChange} 
      /> Yes
    </label>
    <label>
      <input 
        type="radio" 
        name="personalAccident" 
        value="no" 
        checked={formData.personalAccident === 'no'}
        onChange={handleChange} 
      /> No
    </label>
  </div>
  {errors.personalAccident && <p className="text-red-500">{errors.personalAccident}</p>}
</div>

<div className="mb-8">
  <label className="font-semibold">13. Are passengers to be insured against personal Accident?</label>
  <div className="flex gap-4 mt-4">
    <label>
      <input 
        type="radio" 
        name="passengersInsured" 
        value="yes" 
        checked={formData.passengersInsured === 'yes'}
        onChange={handleChange} 
      /> Yes
    </label>
    <label>
      <input 
        type="radio" 
        name="passengersInsured" 
        value="no" 
        checked={formData.passengersInsured === 'no'}
        onChange={handleChange} 
      /> No
    </label>
  </div>
  {errors.passengersInsured && <p className="text-red-500">{errors.passengersInsured}</p>}
</div>

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