"use client";
import { useSearchParams } from "next/navigation";
import { usePolicyStore } from "../store/policyStore";
import { useEffect } from "react";

export default function PolicyDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { fetchPolicyDetails, selectedPolicy, loading, error } = usePolicyStore();

  useEffect(() => {
    if (id) {
      fetchPolicyDetails(id);
    }
  }, [id, fetchPolicyDetails]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!selectedPolicy) return <div className="p-8">Policy not found.</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800">
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 flex items-center">
          <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          Policy Details
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 transform hover:scale-[1.01] transition-transform duration-200">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Certificate Information
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="font-bold text-blue-700">Certificate Number</div>
                <div className="text-gray-700">{selectedPolicy.certificateNumber}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Date of Issuance</div>
                <div className="text-gray-700">{selectedPolicy.dateOfIssuance}</div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Insured Information
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="font-bold text-blue-700">Name of Insured</div>
                <div className="text-gray-700">{selectedPolicy.nameOfInsured}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Phone Number</div>
                <div className="text-gray-700">{selectedPolicy.phoneNumber}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Region</div>
                <div className="text-gray-700">{selectedPolicy.addressRegion}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">City</div>
                <div className="text-gray-700">{selectedPolicy.city}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Sub City/Zone</div>
                <div className="text-gray-700">{selectedPolicy.subCityZone}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Wereda</div>
                <div className="text-gray-700">{selectedPolicy.wereda}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Kebele</div>
                <div className="text-gray-700">{selectedPolicy.kebele}</div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Vehicle Information
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="font-bold text-blue-700">Plate Number</div>
                <div className="text-gray-700">{selectedPolicy.plateNumber}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Engine Number</div>
                <div className="text-gray-700">{selectedPolicy.engineNumber}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Chassis Number</div>
                <div className="text-gray-700">{selectedPolicy.chassisNumber}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Vehicle Type</div>
                <div className="text-gray-700">{selectedPolicy.vehicleType}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Carrying Capacity</div>
                <div className="text-gray-700">{selectedPolicy.carryingCapacity}</div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Policy Information
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="font-bold text-blue-700">Insurer Policy No.</div>
                <div className="text-gray-700">{selectedPolicy.insurerPolicyNo}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Policy Period From</div>
                <div className="text-gray-700">{selectedPolicy.policyPeriodFrom}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Policy Period To</div>
                <div className="text-gray-700">{selectedPolicy.policyPeriodTo}</div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Other Details
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="font-bold text-blue-700">Conditions</div>
                <div className="text-gray-700">{selectedPolicy.conditions}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Entitled Persons</div>
                <div className="text-gray-700">{selectedPolicy.entitledPersons}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Name of Insurer</div>
                <div className="text-gray-700">{selectedPolicy.nameOfInsurer}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Premium Tariff</div>
                <div className="text-gray-700">{selectedPolicy.premiumTariff}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Authorized Person</div>
                <div className="text-gray-700">{selectedPolicy.authorizedPerson}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}