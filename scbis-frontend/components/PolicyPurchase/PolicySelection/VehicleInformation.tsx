'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { policyHook } from '@/context/PolicyContextProvider';

interface FormData {
  isCoverRequiredForRadios: string,
  make: string,
  valueBirr: string,
  isVehicleInGoodStateOfRepair: string,
  whereVehicleUsuallyLeftOvernight: string,
  areVehiclesSoleAndAbsoluteProperty: string,
  ownerName: string,
  ownerAddress: string,
  willBeUSedSolelyForPrivatePurpose: string,
  otherUsesIfNotPrivate: string,
  hasDriverBeenConvictedOfOffense: string,
  convictionParticualrs: string,
  hasBeenInsuredForAnyMotorVehicle: string,
  insurerNameIfApplicable: string,
  hasCompanyEver: string[],
  hasHadAccidentsInPastTwoYears: string,
  accidentDetails: string,
  claimsInjury: string,
  claimsInjuryDetails: string,
  hasClaimsByOtherPartiesInPastTwoYearsProperty: string,
  claimsDetails: string,
  doYouWishToInsureForPersonalAccidentBenefit: string,
  doYouWishToInsurePassengersAgainstPersonalAccident: string,
}

interface Errors {
  isCoverRequiredForRadios?: string,
  make?: string,
  valueBirr?: string,
  isVehicleInGoodStateOfRepair?: string,
  whereVehicleUsuallyLeftOvernight?: string,
  areVehiclesSoleAndAbsoluteProperty?: string,
  ownerName?: string,
  ownerAddress?: string,
  willBeUSedSolelyForPrivatePurpose?: string,
  otherUsesIfNotPrivate?: string,
  hasDriverBeenConvictedOfOffense?: string,
  convictionParticualrs?: string,
  hasBeenInsuredForAnyMotorVehicle?: string,
  insurerNameIfApplicable?: string,
  hasCompanyEver?: string,
  hasHadAccidentsInPastTwoYears?: string,
  accidentDetails?: string,
  claimsInjury?: string,
  claimsInjuryDetails?: string,
  hasClaimsByOtherPartiesInPastTwoYearsProperty?: string,
  claimsDetails?: string,
  doYouWishToInsureForPersonalAccidentBenefit?: string,
  doYouWishToInsurePassengersAgainstPersonalAccident?: string,
}

export default function VehicleInformation() {
  const [formData, setFormData] = useState<FormData>({
    isCoverRequiredForRadios: '',
    make: '',
    valueBirr: '',
    isVehicleInGoodStateOfRepair: '',
    whereVehicleUsuallyLeftOvernight: '',
    areVehiclesSoleAndAbsoluteProperty: '',
    ownerName: '',
    ownerAddress: '',
    willBeUSedSolelyForPrivatePurpose: '',
    otherUsesIfNotPrivate: '',
    hasDriverBeenConvictedOfOffense: '',
    convictionParticualrs: '',
    hasBeenInsuredForAnyMotorVehicle: '',
    insurerNameIfApplicable: '',
    hasCompanyEver: [],
    hasHadAccidentsInPastTwoYears: '',
    accidentDetails: '',
    claimsInjury: '',
    claimsInjuryDetails: '',
    hasClaimsByOtherPartiesInPastTwoYearsProperty: '',
    claimsDetails: '',
    doYouWishToInsureForPersonalAccidentBenefit: '',
    doYouWishToInsurePassengersAgainstPersonalAccident: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const {dispatch} = policyHook()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valueChanger = ()=>{
      if (value==='yes'){
        return true
      }

      else if(value==='no'){
        return false
      }

      else return value
    }
    setFormData({ ...formData, [name]: value });
    // Clear errors when the user starts typing
    setErrors({ ...errors, [name]: '' });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      hasCompanyEver: checked
        ? [...prevData.hasCompanyEver, value]
        : prevData.hasCompanyEver.filter((item) => item !== value),
    }));
    // Clear errors when the user selects a checkbox
    setErrors({ ...errors, hasCompanyEver: '' });
  };

  const router = useRouter();

  const handlePrevious = () => {
    router.push('/policy-purchase/purchase/policyDuration');
  };

  const handleNext = () => {
    const newErrors: Errors = {};

    // Validate required fields
    if (!formData.isCoverRequiredForRadios) newErrors.isCoverRequiredForRadios = 'This field is required';
    if (formData.isCoverRequiredForRadios === 'yes' && !formData.make) newErrors.make = 'This field is required';
    if (formData.isCoverRequiredForRadios === 'yes' && !formData.valueBirr) newErrors.valueBirr = 'This field is required';
    if (!formData.isVehicleInGoodStateOfRepair) newErrors.isVehicleInGoodStateOfRepair = 'This field is required';
    if (!formData.whereVehicleUsuallyLeftOvernight) newErrors.whereVehicleUsuallyLeftOvernight = 'This field is required';
    if (!formData.areVehiclesSoleAndAbsoluteProperty) newErrors.areVehiclesSoleAndAbsoluteProperty = 'This field is required';
    if (formData.areVehiclesSoleAndAbsoluteProperty === 'no' && !formData.ownerName) newErrors.ownerName = 'This field is required';
    if (formData.areVehiclesSoleAndAbsoluteProperty === 'no' && !formData.ownerAddress) newErrors.ownerAddress = 'This field is required';
    if (!formData.willBeUSedSolelyForPrivatePurpose) newErrors.willBeUSedSolelyForPrivatePurpose = 'This field is required';
    if (formData.willBeUSedSolelyForPrivatePurpose === 'no' && !formData.otherUsesIfNotPrivate) newErrors.otherUsesIfNotPrivate = 'This field is required';
    if (!formData.convictionParticualrs) newErrors.convictionParticualrs = 'This field is required';
    if (formData.convictionParticualrs === 'yes' && !formData.convictionParticualrs) newErrors.convictionParticualrs = 'This field is required';
    if (!formData.hasBeenInsuredForAnyMotorVehicle) newErrors.hasBeenInsuredForAnyMotorVehicle = 'This field is required';
    if (formData.hasBeenInsuredForAnyMotorVehicle === 'yes' && !formData.insurerNameIfApplicable) newErrors.insurerNameIfApplicable = 'This field is required';
    if (formData.hasCompanyEver.length === 0) newErrors.hasCompanyEver = 'This field is required'; // Validation for Question 8
    if (!formData.hasHadAccidentsInPastTwoYears) newErrors.hasHadAccidentsInPastTwoYears = 'This field is required';
    if (formData.hasHadAccidentsInPastTwoYears === 'yes' && !formData.accidentDetails) newErrors.accidentDetails = 'This field is required';
    if (!formData.claimsInjury) newErrors.claimsInjury = 'This field is required';
    if (formData.claimsInjury === 'yes' && !formData.claimsInjuryDetails) newErrors.claimsInjuryDetails = 'This field is required';
    if (!formData.hasClaimsByOtherPartiesInPastTwoYearsProperty) newErrors.hasClaimsByOtherPartiesInPastTwoYearsProperty = 'This field is required';
    if (formData.hasClaimsByOtherPartiesInPastTwoYearsProperty === 'yes' && !formData.claimsDetails) newErrors.claimsDetails = 'This field is required';
    if (!formData.doYouWishToInsureForPersonalAccidentBenefit) newErrors.doYouWishToInsureForPersonalAccidentBenefit = 'This field is required';
    if (!formData.doYouWishToInsurePassengersAgainstPersonalAccident) newErrors.doYouWishToInsurePassengersAgainstPersonalAccident = 'This field is required';

    setErrors(newErrors);

    // If there are no errors, proceed to the next page
    if (Object.keys(newErrors).length === 0) {
      const pd: { [key: string]: boolean | string |string[] } = {}
      for (let key in formData){
        if (formData[key as keyof FormData] === 'yes'){
          pd[key] = true
        }

        else if (formData[key as keyof FormData] === 'no'){
          pd[key] = false
        }

        else {
          pd[key] = formData[key as keyof FormData]
        }
      }
      dispatch({type:'collect_policy_info',payload:pd})
      router.push('/policy-purchase/purchase/driverInformation');
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
        <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">3</div>
        <span className="ml-2 text-black text-sm sm:text-base">Vehicle Information</span>
      </div>
      <div className="w-7 sm:border-t-2 border-gray-400"></div>
      <div className="flex items-center">
        <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">4</div>
        <span className="ml-2 text-black text-sm sm:text-base">Driver Information</span>
      </div>
    </div>
        {/* Question 1 */}
        <div className="mt-8 mb-8">
        <label className="font-semibold">
          1. Is cover required for Radios, tape recorders, and Record players fitted to the vehicle(s)?
        </label>
        <div className="flex gap-4 mt-4">
          <label>
            <input type="radio" name="isCoverRequiredForRadios" value="yes" onChange={handleChange} /> Yes
          </label>
          <label>
            <input type="radio" name="isCoverRequiredForRadios" value="no" onChange={handleChange} /> No
          </label>
        </div>
        {errors. isCoverRequiredForRadios && <p className="text-red-500">{errors.isCoverRequiredForRadios}</p>}
        {formData. isCoverRequiredForRadios === 'yes' && (
          <div className="mt-4">
            <p>Please State.</p>
            <div className="flex gap-4 mt-2">
              <select name="make" className="border p-2 w-full" onChange={handleChange}>
                <option value="">Select Make</option>
                <option value="Sony">Sony</option>
                <option value="Pioneer">Pioneer</option>
                <option value="Kenwood">Kenwood</option>
              </select>
              {errors.make && <p className="text-red-500">{errors.make}</p>}
              <input type="text" name="valueBirr" placeholder="Value (Birr)" className="border p-2 w-full" onChange={handleChange} />
              {errors.valueBirr && <p className="text-red-500">{errors.valueBirr}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Question 2 */}
      <div className="mb-8">
        <label className="font-semibold">2. Is the vehicle(s) in good state of repair?</label>
        <div className="flex gap-4 mt-4">
          <label>
            <input type="radio" name="isVehicleInGoodStateOfRepair" value="yes" onChange={handleChange} /> Yes
          </label>
          <label>
            <input type="radio" name="isVehicleInGoodStateOfRepair" value="no" onChange={handleChange} /> No
          </label>
        </div>
        {errors.isVehicleInGoodStateOfRepair && <p className="text-red-500">{errors.isVehicleInGoodStateOfRepair}</p>}
      </div>

      {/* Question 3 */}
      <div className="mb-8">
        <label className="font-semibold">3. Is the vehicle(s) usually left overnight?</label>
        <div className="flex gap-4 mt-4">
          <label>
            <input type="radio" name="whereVehicleUsuallyLeftOvernight" value="garage" onChange={handleChange} /> In a Garage
          </label>
          <label>
            <input type="radio" name="whereVehicleUsuallyLeftOvernight" value="open" onChange={handleChange} /> In the Open but on your premises
          </label>
          <label>
            <input type="radio" name="whereVehicleUsuallyLeftOvernight" value="elsewhere" onChange={handleChange} /> Elsewhere
          </label>
        </div>
        {errors.whereVehicleUsuallyLeftOvernight && <p className="text-red-500">{errors.whereVehicleUsuallyLeftOvernight}</p>}
      </div>

      {/* Question 4 */}
      <div className="mb-8">
        <label className="font-semibold">4. Is the vehicle(s) your sole and absolute property?</label>
        <div className="flex gap-4 mt-4">
          <label>
            <input type="radio" name="areVehiclesSoleAndAbsoluteProperty" value="yes" onChange={handleChange} /> Yes
          </label>
          <label>
            <input type="radio" name="areVehiclesSoleAndAbsoluteProperty" value="no" onChange={handleChange} /> No
          </label>
        </div>
        {errors.areVehiclesSoleAndAbsoluteProperty && <p className="text-red-500">{errors.areVehiclesSoleAndAbsoluteProperty}</p>}
        {formData.areVehiclesSoleAndAbsoluteProperty === 'no' && (
          <div className="mt-4">
            <p>Please State.</p>
            <div className="flex gap-4 mt-2">
              <input
                type="text"
                name="ownerName"
                placeholder="Name of the owner"
                className="border p-2 w-full"
                onChange={handleChange}
              />
              {errors.ownerName && <p className="text-red-500">{errors.ownerName}</p>}
              <input
                type="text"
                name="ownerAddress"
                placeholder="Address of the owner"
                className="border p-2 w-full"
                onChange={handleChange}
              />
              {errors.ownerAddress && <p className="text-red-500">{errors.ownerAddress}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Question 5 */}
      <div className="mb-8">
        <label className="font-semibold">Will the vehicle(s) be used solely for private purposes as described below: If not, please state other uses.</label>
        <p className="text-gray-600 mt-2"> Private purpose: the term "private purposes" means social domestic, pleasure, Professional purposes or business calls of the insured. The term "private Purposes" does not include use for hiring, racing, pace making, speed testing. The carriage of goods in connection with any trade or business or use for any Purpose in connection with Motor trade. </p>
        <div className="flex gap-4 mt-4">
          <label>
            <input type="radio" name="willBeUSedSolelyForPrivatePurpose" value="yes" onChange={handleChange} /> Yes
          </label>
          <label>
            <input type="radio" name="willBeUSedSolelyForPrivatePurpose" value="no" onChange={handleChange} /> No
          </label>
        </div>
        {errors.willBeUSedSolelyForPrivatePurpose && <p className="text-red-500">{errors.willBeUSedSolelyForPrivatePurpose}</p>}
        {formData.willBeUSedSolelyForPrivatePurpose === 'no' && (
          <div className="mt-4">
            <p>Please State other uses.</p>
            <textarea
              name="otherUses"
              placeholder="State other uses"
              className="border p-2 w-full mt-2"
              onChange={handleChange}
            ></textarea>
            {errors.otherUsesIfNotPrivate && <p className="text-red-500">{errors.otherUsesIfNotPrivate}</p>}
          </div>
        )}
      </div>

      {/* Question 6 */}
      <div className="mb-8">
        <label className="font-semibold">6, Have you or any other person, who to your knowledge will drive been convicted of any offence in connection with the driving of any motor Vehicle?</label>
        <div className="flex gap-4 mt-4">
          <label>
            <input type="radio" name="hasDriverBeenConvictedOfOffense" value="yes" onChange={handleChange} /> Yes
          </label>
          <label>
            <input type="radio" name="hasDriverBeenConvictedOfOffense" value="no" onChange={handleChange} /> No
          </label>
        </div>
        {errors.hasDriverBeenConvictedOfOffense && <p className="text-red-500">{errors.hasDriverBeenConvictedOfOffense}</p>}
        {formData.hasDriverBeenConvictedOfOffense === 'yes' && (
          <div className="mt-4">
            <p>If so, give particulars.</p>
            <textarea
              name="convictionParticualrs"
              placeholder="Give particulars"
              className="border p-2 w-full mt-2"
              onChange={handleChange}
            ></textarea>
            {errors.convictionParticualrs && <p className="text-red-500">{errors.convictionParticualrs}</p>}
          </div>
        )}
      </div>

      {/* Question 7 */}
      <div className="mb-8">
        <label className="font-semibold">Are you now or have you been insured in respect of any motor vehicle?</label>
        <div className="flex gap-4 mt-4">
          <label><input type="radio" name="hasBeenInsuredForAnyMotorVehicle" value="yes" onChange={handleChange} /> Yes</label>
          <label><input type="radio" name="hasBeenInsuredForAnyMotorVehicle" value="no" onChange={handleChange} /> No</label>
        </div>
        {errors.hasBeenInsuredForAnyMotorVehicle && <p className="text-red-500">{errors.hasBeenInsuredForAnyMotorVehicle}</p>}
        {formData.hasBeenInsuredForAnyMotorVehicle === 'yes' && (
          <div className="mt-4">
            <p>Please State other uses.</p>
            <input type="text" name="insurerNameIfApplicable" placeholder="Name of the insurer" className="border p-2 w-full mt-2" onChange={handleChange} />
            {errors.insurerNameIfApplicable && <p className="text-red-500">{errors.insurerNameIfApplicable}</p>}
          </div>
        )}
      </div>
   

      {/* Question 8 */}
      <div className="mb-8">
        <label className="font-semibold">Has any company ever:</label>
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
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                onChange={handleCheckboxChange}
                checked={formData.hasCompanyEver.includes(option)}
              />{' '}
              {option}
            </label>
          ))}
        </div>
        {errors.hasCompanyEver && <p className="text-red-500">{errors.hasCompanyEver}</p>}
      </div>

      {/* Question 9 */}
      <div className="mb-8">
        <label className="font-semibold">Have you or any driver had any accidents in the past 2 years?</label>
        <div className="flex gap-4 mt-4">
          <label><input type="radio" name="hasHadAccidentsInPastTwoYears" value="yes" onChange={handleChange} /> Yes</label>
          <label><input type="radio" name="hasHadAccidentsInPastTwoYears" value="no" onChange={handleChange} /> No</label>
        </div>
        {errors.hasHadAccidentsInPastTwoYears && <p className="text-red-500">{errors.hasHadAccidentsInPastTwoYears}</p>}
        {formData.hasHadAccidentsInPastTwoYears === 'yes' && (
          <div className="mt-4">
            <p>If so, please provide details briefly: </p>
            <textarea name="accidentDetails" placeholder="Provide details of the accidents" className="border p-2 w-full mt-2" onChange={handleChange}></textarea>
            {errors.accidentDetails && <p className="text-red-500">{errors.accidentDetails}</p>}
          </div>
        )}
      </div>

      {/* Question 10 */}
      <div className="mb-8">
        <label className="font-semibold">Have there been any claims against you by other parties for personal injury related to vehicle accidents in the past 2 years?</label>
        <div className="flex gap-4 mt-4">
          <label><input type="radio" name="claimsInjury" value="yes" onChange={handleChange} /> Yes</label>
          <label><input type="radio" name="claimsInjury" value="no" onChange={handleChange} /> No</label>
        </div>
        {errors.claimsInjury && <p className="text-red-500">{errors.claimsInjury}</p>}
        {formData.claimsInjury === 'yes' && (
          <div className="mt-4">
            <p>If so, please provide details briefly: </p>
            <textarea name="claimsInjuryDetails" placeholder="Provide details" className="border p-2 w-full mt-2" onChange={handleChange}></textarea>
            {errors.claimsInjuryDetails && <p className="text-red-500">{errors.claimsInjuryDetails}</p>}
          </div>
        )}
      </div>

      {/* Question 11 */}
      <div className="mb-8">
        <label className="font-semibold">Have there been any claims against you by other parties for property damage related to vehicle accidents in the past 2 years?</label>
        <div className="flex gap-4 mt-4">
          <label><input type="radio" name="hasClaimsByOtherPartiesInPastTwoYearsProperty" value="yes" onChange={handleChange} /> Yes</label>
          <label><input type="radio" name="hasClaimsByOtherPartiesInPastTwoYearsProperty" value="no" onChange={handleChange} /> No</label>
        </div>
        {errors.hasClaimsByOtherPartiesInPastTwoYearsProperty && <p className="text-red-500">{errors.hasClaimsByOtherPartiesInPastTwoYearsProperty}</p>}
        {formData.hasClaimsByOtherPartiesInPastTwoYearsProperty === 'yes' && (
          <div className="mt-4">
            <p>If so, please provide details briefly: </p>
            <textarea name="claimsDetails" placeholder="Provide details" className="border p-2 w-full mt-2" onChange={handleChange}></textarea>
            {errors.claimsDetails && <p className="text-red-500">{errors.claimsDetails}</p>}
          </div>
        )}
      </div>

      {/* Question 12 */}
      <div className="mb-8">
        <label className="font-semibold">Do you wish to insure for personal Accident Benefit?</label>
        <div className="flex gap-4 mt-4">
          <label><input type="radio" name="doYouWishToInsureForPersonalAccidentBenefit" value="yes" onChange={handleChange} /> Yes</label>
          <label><input type="radio" name="doYouWishToInsureForPersonalAccidentBenefit" value="no" onChange={handleChange} /> No</label>
        </div>
        {errors.doYouWishToInsureForPersonalAccidentBenefit && <p className="text-red-500">{errors.doYouWishToInsureForPersonalAccidentBenefit}</p>}
      </div>

      {/* Question 13 */}
      <div className="mb-8">
        <label className="font-semibold">Are passengers to be insured against personal Accident?</label>
        <div className="flex gap-4 mt-4">
          <label><input type="radio" name="doYouWishToInsurePassengersAgainstPersonalAccident" value="yes" onChange={handleChange} /> Yes</label>
          <label><input type="radio" name="doYouWishToInsurePassengersAgainstPersonalAccident" value="no" onChange={handleChange} /> No</label>
        </div>
        {errors.doYouWishToInsurePassengersAgainstPersonalAccident && <p className="text-red-500">{errors.doYouWishToInsurePassengersAgainstPersonalAccident}</p>}
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