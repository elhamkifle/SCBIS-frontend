'use client';

import { useEffect, useState } from 'react';
import { Edit, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePolicyStore } from '@/store/policyPurchase/policySelection';
import { usePolicyDurationStore } from '@/store/policyPurchase/policyDurationAndJurisdiction';
import { useVehicleInfoStore } from '@/store/policyPurchase/vehicleDetails';
import { useDriverInformationStore } from '@/store/policyPurchase/driverInformation';
import { useVehicleSelectionStore } from '@/store/vehicleSelection/vehicleSelectionStore';
import { policySelectionService, buildPolicySelectionPayload } from '@/utils/policyApi';

export default function PolicyPreview() {
  const router = useRouter();

  // Get all data from stores
  const { selectedPolicy } = usePolicyStore();
  const { policyDuration, jurisdiction, updateFormData: updateDuration } = usePolicyDurationStore();
  const { formData: vehicleData, updateFormData: updateVehicle } = useVehicleInfoStore();
  const { formData: driverData, updateFormData: updateDriver } = useDriverInformationStore();
  const { selectedVehicleId, vehicleData: selectedVehicleData } = useVehicleSelectionStore();

  // Local state for editable fields
  const [formData, setFormData] = useState({
    policyDuration,
    jurisdiction,
    ...vehicleData,
    ...driverData
  });

  // Loading state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Merge store data into local state
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      policyDuration,
      jurisdiction,
      ...vehicleData,
      ...driverData
    }));
  }, [policyDuration, jurisdiction, vehicleData, driverData]);

  const [isEditing, setIsEditing] = useState({
    policy: false,
    duration: false,
    vehicle: false,
    driver: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDriverChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedDrivers = [...formData.drivers];
    updatedDrivers[index] = { ...updatedDrivers[index], [name]: value };
    setFormData(prev => ({ ...prev, drivers: updatedDrivers }));
  };

  const toggleEdit = (section: keyof typeof isEditing) => {
    setIsEditing(prev => {
      const newState = { ...prev, [section]: !prev[section] };
      // Save changes when exiting edit mode
      if (!newState[section]) {
        saveChanges(section);
      }
      return newState;
    });
  };

  const saveChanges = (section: keyof typeof isEditing) => {
    switch (section) {
      case 'duration':
        updateDuration({
          policyDuration: formData.policyDuration,
          jurisdiction: formData.jurisdiction
        });
        break;
      case 'vehicle':
        updateVehicle({
          coverRequired: formData.coverRequired,
          make: formData.make,
          value: formData.value,
          vehicleInGoodRepair: formData.vehicleInGoodRepair,
          vehicleLeftOvernight: formData.vehicleLeftOvernight,
          soleProperty: formData.soleProperty,
          ownerName: formData.ownerName,
          ownerAddress: formData.ownerAddress,
          privateUse: formData.privateUse,
          otherUses: formData.otherUses,
          convicted: formData.convicted,
          convictionDetails: formData.convictionDetails,
          insuredBefore: formData.insuredBefore,
          insurerName: formData.insurerName,
          companyHistory: formData.companyHistory,
          hadAccidents: formData.hadAccidents,
          accidentDetails: formData.accidentDetails,
          claimsInjury: formData.claimsInjury,
          claimsInjuryDetails: formData.claimsInjuryDetails,
          claimsProperty: formData.claimsProperty,
          claimsPropertyDetails: formData.claimsPropertyDetails,
          personalAccident: formData.personalAccident,
          passengersInsured: formData.passengersInsured
        });
        break;
      case 'driver':
        updateDriver({
          employDriver: formData.employDriver,
          drivers: formData.drivers,
          employDriverUnder21: formData.employDriverUnder21,
          physicalInfirmity: formData.physicalInfirmity,
          lessThanSixMonthsExperience: formData.lessThanSixMonthsExperience,
          fullName: formData.fullName,
          signatureDate: formData.signatureDate,
          acceptTerms: formData.acceptTerms
        });
        break;
    }
  };

  // Styled Yes/No display component
  const YesNoDisplay = ({ value }: { value: string | boolean }) => {
    const displayValue = typeof value === 'boolean' ? (value ? 'yes' : 'no') : value;
    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${displayValue === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
        {displayValue === 'yes' ? 'Yes' : 'No'}
      </span>
    );
  };

  const handleSubmit = async () => {
    // Validation checks
    if (!selectedVehicleId && !selectedVehicleData?._id) {
      alert('Error: No vehicle selected. Please go back and select a vehicle.');
      return;
    }

    if (!selectedPolicy) {
      alert('Error: No policy selected. Please select a policy type.');
      return;
    }

    if (!formData.policyDuration || !formData.jurisdiction) {
      alert('Error: Please complete policy duration and jurisdiction information.');
      return;
    }

    if (!formData.acceptTerms) {
      alert('Error: Please accept the terms and conditions to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the vehicle ID (either from selected existing vehicle or newly created vehicle)
      const vehicleId = selectedVehicleId || selectedVehicleData?._id;
      
      if (!vehicleId) {
        throw new Error('Vehicle ID not found. Please complete vehicle information first.');
      }

      console.log('🔄 Submitting policy application with data:', {
        vehicleId,
        selectedPolicy,
        policyDuration: formData.policyDuration,
        jurisdiction: formData.jurisdiction,
        vehicleData: selectedVehicleData,
        driverData: {
          employDriver: formData.employDriver,
          drivers: formData.drivers,
          employDriverUnder21: formData.employDriverUnder21,
          physicalInfirmity: formData.physicalInfirmity,
          lessThanSixMonthsExperience: formData.lessThanSixMonthsExperience,
          fullName: formData.fullName,
          signatureDate: formData.signatureDate,
          acceptTerms: formData.acceptTerms
        }
      });

      // Build policy selection payload
      const policySelectionPayload = {
        vehicleId,
        selectedPolicy,
        policyDuration: formData.policyDuration,
        jurisdiction: formData.jurisdiction,
        vehicleData: selectedVehicleData || undefined,
        driverData: {
          employDriver: formData.employDriver,
          drivers: formData.drivers,
          employDriverUnder21: formData.employDriverUnder21,
          physicalInfirmity: formData.physicalInfirmity,
          lessThanSixMonthsExperience: formData.lessThanSixMonthsExperience,
          fullName: formData.fullName,
          signatureDate: formData.signatureDate,
          acceptTerms: formData.acceptTerms
        },
        vehicleInformation: {
          coverRequired: formData.coverRequired,
          make: formData.make,
          value: formData.value,
          vehicleInGoodRepair: formData.vehicleInGoodRepair,
          vehicleLeftOvernight: formData.vehicleLeftOvernight,
          soleProperty: formData.soleProperty,
          ownerName: formData.ownerName,
          ownerAddress: formData.ownerAddress,
          privateUse: formData.privateUse,
          otherUses: formData.otherUses,
          convicted: formData.convicted,
          convictionDetails: formData.convictionDetails,
          insuredBefore: formData.insuredBefore,
          insurerName: formData.insurerName,
          companyHistory: formData.companyHistory,
          hadAccidents: formData.hadAccidents,
          accidentDetails: formData.accidentDetails,
          claimsInjury: formData.claimsInjury,
          claimsInjuryDetails: formData.claimsInjuryDetails,
          claimsProperty: formData.claimsProperty,
          claimsPropertyDetails: formData.claimsPropertyDetails,
          personalAccident: formData.personalAccident,
          passengersInsured: formData.passengersInsured
        }
      };
      console.log('🔄 Policy selection payload:', policySelectionPayload);
      // Save policy selection
      const policyResponse = await policySelectionService.savePolicySelection(policySelectionPayload as any);
      
      console.log('✅ Policy created successfully:', policyResponse);
      
      // Show success message with policy details
      alert(`Policy application submitted successfully! 
      
Policy ID: ${policyResponse._id}
Policy Type: ${policyResponse.policyType}
Duration: ${policyResponse.duration}
Coverage Area: ${policyResponse.coverageArea}
Premium: $${policyResponse.premium}

You will be redirected to the next step.`);

      // Navigate to next step (you can change this route as needed)
      router.push('/claim-submission/vehicle-selection');
      
    } catch (error) {
      console.error('❌ Error submitting policy application:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert(`Failed to submit policy application: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handlePrevious = () => {
  //   router.push('/policy-purchase/purchase/driverInformation');
  // };

  return (
    <div className="px-4">
      <h2 className="text-2xl lg:ml-16 mb-4 font-bold">Policy Purchase Preview</h2>

      <div className="max-w-5xl mx-auto p-6 px-12 bg-white shadow-lg rounded-lg">

        {/* Policy Selection Section */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">1. Policy Selection</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 px-4">
            <div><strong>Selected Policy:</strong> <p> {selectedPolicy} </p> </div>
          </div>
        </div>

        {/* Duration & Jurisdiction Section */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">2. Duration & Jurisdiction</h2>
            <button onClick={() => toggleEdit('duration')} className="text-blue-500 hover:text-blue-700">
              {isEditing.duration ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>

          {isEditing.duration ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border rounded-lg">
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Policy Duration</label>
                <select
                  name="policyDuration"
                  value={formData.policyDuration}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="3 Days">3 Days</option>
                  <option value="1 Week">1 Week</option>
                  <option value="15 Days">15 Days</option>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year (Recommended)">1 Year (Recommended)</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Coverage Area</label>
                <select
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Ethiopia Only (Valid within Ethiopia's borders.)">Ethiopia Only</option>
                  <option value="Ethiopia & Moyale (Kenya Border)">Ethiopia & Moyale</option>
                  <option value="Ethiopia & Djibouti">Ethiopia & Djibouti</option>
                  <option value="Ethiopia & Metema (Sudan Border)">Ethiopia & Metema</option>
                  <option value="Ethiopia & Humera (Eritrea Border)">Ethiopia & Humera</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
              <div><strong>Policy Duration:</strong> <p>  {formData.policyDuration} </p></div>
              <div><strong>Coverage Area:</strong> <p> {formData.jurisdiction} </p></div>
            </div>
          )}
        </div>

        {/* Vehicle Information Section */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">3. Vehicle Information</h2>
            <button onClick={() => toggleEdit('vehicle')} className="text-blue-500 hover:text-blue-700">
              {isEditing.vehicle ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>

          {isEditing.vehicle ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Cover Required</label>
                  <input
                    type="text"
                    name="coverRequired"
                    value={formData.coverRequired}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Make</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Value</label>
                  <input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Vehicle in Good Repair?</label>
                  <select
                    name="vehicleInGoodRepair"
                    value={formData.vehicleInGoodRepair}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Vehicle Left Overnight?</label>
                  <select
                    name="vehicleLeftOvernight"
                    value={formData.vehicleLeftOvernight}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Sole Property?</label>
                  <select
                    name="soleProperty"
                    value={formData.soleProperty}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Owner Address</label>
                  <input
                    type="text"
                    name="ownerAddress"
                    value={formData.ownerAddress}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Private Use?</label>
                  <select
                    name="privateUse"
                    value={formData.privateUse}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Other Uses</label>
                  <input
                    type="text"
                    name="otherUses"
                    value={formData.otherUses}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Convicted of Motoring Offense?</label>
                  <select
                    name="convicted"
                    value={formData.convicted}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {formData.convicted === 'yes' && (
                  <div className="relative col-span-2">
                    <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Conviction Details</label>
                    <textarea
                      name="convictionDetails"
                      value={formData.convictionDetails}
                      onChange={handleChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                )}
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Insured Before?</label>
                  <select
                    name="insuredBefore"
                    value={formData.insuredBefore}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {formData.insuredBefore === 'yes' && (
                  <div className="relative">
                    <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Insurer Name</label>
                    <input
                      type="text"
                      name="insurerName"
                      value={formData.insurerName}
                      onChange={handleChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                )}
                <div className="relative col-span-2">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Company History</label>
                  <textarea
                    name="companyHistory"
                    value={formData.companyHistory?.join('\n') || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        companyHistory: e.target.value.split('\n')
                      }));
                    }}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Had Accidents?</label>
                  <select
                    name="hadAccidents"
                    value={formData.hadAccidents}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {formData.hadAccidents === 'yes' && (
                  <div className="relative col-span-2">
                    <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Accident Details</label>
                    <textarea
                      name="accidentDetails"
                      value={formData.accidentDetails}
                      onChange={handleChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                )}
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Claims for Injury?</label>
                  <select
                    name="claimsInjury"
                    value={formData.claimsInjury}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {formData.claimsInjury === 'yes' && (
                  <div className="relative col-span-2">
                    <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Injury Claim Details</label>
                    <textarea
                      name="claimsInjuryDetails"
                      value={formData.claimsInjuryDetails}
                      onChange={handleChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                )}
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Claims for Property Damage?</label>
                  <select
                    name="claimsProperty"
                    value={formData.claimsProperty}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {formData.claimsProperty === 'yes' && (
                  <div className="relative col-span-2">
                    <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Property Claim Details</label>
                    <textarea
                      name="claimsPropertyDetails"
                      value={formData.claimsPropertyDetails}
                      onChange={handleChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                )}
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Personal Accident Cover?</label>
                  <select
                    name="personalAccident"
                    value={formData.personalAccident}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Passengers Insured?</label>
                  <select
                    name="passengersInsured"
                    value={formData.passengersInsured}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
              <div><strong>Cover Required:</strong> <YesNoDisplay value={formData.coverRequired} /> </div>
              <div><strong>Make:</strong> <p>{formData.make}</p></div>
              <div><strong>Value:</strong> <p>{formData.value}</p></div>

              <div>
                <strong>Vehicle in Good Repair:</strong>
                <YesNoDisplay value={formData.vehicleInGoodRepair} />
              </div>

              <div>
                <strong>Vehicle Left Overnight:</strong>
                <YesNoDisplay value={formData.vehicleLeftOvernight} />
              </div>

              <div>
                <strong>Sole Property:</strong>
                <YesNoDisplay value={formData.soleProperty} />
              </div>

              <div><strong>Owner Name:</strong> <p>{formData.ownerName}</p></div>
              <div><strong>Owner Address:</strong> <p>{formData.ownerAddress}</p></div>

              <div>
                <strong>Private Use:</strong>
                <YesNoDisplay value={formData.privateUse} />
              </div>

              <div><strong>Other Uses:</strong> <p>{formData.otherUses}</p></div>

              <div>
                <strong>Convicted of Motoring Offense:</strong>
                <YesNoDisplay value={formData.convicted} />
              </div>

              {formData.convicted === 'yes' && (
                <div className="col-span-2">
                  <strong>Conviction Details:</strong>
                  <p className="whitespace-pre-line">{formData.convictionDetails}</p>
                </div>
              )}

              <div>
                <strong>Insured Before:</strong>
                <YesNoDisplay value={formData.insuredBefore} />
              </div>

              {formData.insuredBefore === 'yes' && (
                <div>
                  <strong>Insurer Name:</strong> <p>{formData.insurerName}</p>
                </div>
              )}

              <div className="col-span-2">
                <strong>Company History:</strong>
                <ul className="list-disc pl-5">
                  {formData.companyHistory?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Had Accidents:</strong>
                <YesNoDisplay value={formData.hadAccidents} />
              </div>

              {formData.hadAccidents === 'yes' && (
                <div className="col-span-2">
                  <strong>Accident Details:</strong>
                  <p className="whitespace-pre-line">{formData.accidentDetails}</p>
                </div>
              )}

              <div>
                <strong>Claims for Injury:</strong>
                <YesNoDisplay value={formData.claimsInjury} />
              </div>

              {formData.claimsInjury === 'yes' && (
                <div className="col-span-2">
                  <strong>Injury Claim Details:</strong>
                  <p className="whitespace-pre-line">{formData.claimsInjuryDetails}</p>
                </div>
              )}

              <div>
                <strong>Claims for Property Damage:</strong>
                <YesNoDisplay value={formData.claimsProperty} />
              </div>

              {formData.claimsProperty === 'yes' && (
                <div className="col-span-2">
                  <strong>Property Claim Details:</strong>
                  <p className="whitespace-pre-line">{formData.claimsPropertyDetails}</p>
                </div>
              )}

              <div>
                <strong>Personal Accident Cover:</strong>
                <YesNoDisplay value={formData.personalAccident} />
              </div>

              <div>
                <strong>Passengers Insured:</strong>
                <YesNoDisplay value={formData.passengersInsured} />
              </div>
            </div>

          )}
        </div>

        {/* Driver Information Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">4. Driver Information</h2>
            <button onClick={() => toggleEdit('driver')} className="text-blue-500 hover:text-blue-700">
              {isEditing.driver ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>

          {isEditing.driver ? (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Employ any driver?</label>
                  <select
                    name="employDriver"
                    value={formData.employDriver}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              {formData.employDriver === 'yes' && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-4">Driver Details</h3>
                  {formData.drivers.map((driver, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="relative">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">License Grade</label>
                        <input
                          type="text"
                          name="driverLicenseGrade"
                          value={driver.driverLicenseGrade}
                          onChange={(e) => handleDriverChange(index, e)}
                          className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div className="relative">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Driver Name</label>
                        <input
                          type="text"
                          name="driverName"
                          value={driver.driverName}
                          onChange={(e) => handleDriverChange(index, e)}
                          className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div className="relative">
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Experience (Years)</label>
                        <input
                          type="text"
                          name="drivingExperience"
                          value={driver.drivingExperience}
                          onChange={(e) => handleDriverChange(index, e)}
                          className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Employ drivers under 21?</label>
                  <select
                    name="employDriverUnder21"
                    value={formData.employDriverUnder21}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Physical infirmity?</label>
                  <select
                    name="physicalInfirmity"
                    value={formData.physicalInfirmity}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Less than 6 months experience?</label>
                  <select
                    name="lessThanSixMonthsExperience"
                    value={formData.lessThanSixMonthsExperience}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="relative">
                  <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Date</label>
                  <input
                    type="date"
                    name="signatureDate"
                    value={formData.signatureDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label>I Accept and Continue</label>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
              <div>
                <p className="font-medium">Employ any driver?</p>
                <p className="text-gray-700">
                  <YesNoDisplay value={formData.employDriver} />
                </p>
              </div>

              {formData.employDriver === 'yes' && formData.drivers.map((driver, index) => (
                <div key={index} className="col-span-2 border-t pt-4 mt-4">
                  <h3 className="font-medium">Driver {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <p className="font-medium">License Grade:</p>
                      <p className="text-gray-700">{driver.driverLicenseGrade}</p>
                    </div>
                    <div>
                      <p className="font-medium">Name:</p>
                      <p className="text-gray-700">{driver.driverName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Experience (years):</p>
                      <p>{driver.drivingExperience}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <p className="font-medium">Employ drivers under 21?</p>
                <p>
                  <YesNoDisplay value={formData.employDriverUnder21} />
                </p>
              </div>

              <div>
                <p className="font-medium">Physical infirmity?</p>
                <p className="text-gray-700">
                  <YesNoDisplay value={formData.physicalInfirmity} />
                </p>
              </div>

              <div>
                <p className="font-medium">Less than 6 months experience?</p>
                <p className="text-gray-700">
                  <YesNoDisplay value={formData.lessThanSixMonthsExperience} />
                </p>
              </div>

              <div className="col-span-2 border-t pt-4 mt-4">
                <h3 className="font-medium">Declaration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="font-medium">Full Name:</p>
                    <p className="text-gray-700">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Date:</p>
                    <p className="text-gray-700">{formData.signatureDate}</p>
                  </div>
                  <div>
                    <p className="font-medium">Terms Accepted:</p>
                    <p className="text-gray-700">
                      <YesNoDisplay value={formData.acceptTerms} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="w-full max-w-5xl flex items-center justify-end mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-10 py-2 rounded text-white font-medium transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
}