"use client";

import { useParams } from "next/navigation";
import { usePoliciesStore } from "@/store/dashboard/policies";
import { useUserStore } from "@/store/authStore/useUserStore";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import axios from "axios";

export default function PolicyDetails() {
  const { id } = useParams();
  const router = useRouter();
  const {
    policies,
    addPolicies,
    setSelectedPolicy,
  } = usePoliciesStore();
  const [selectedPolicy, setPolicy] = useState<any>(null);
const generalDetails = selectedPolicy?.privateVehicle?.generalDetails || 
                      selectedPolicy?.commercialVehicle?.generalDetails || {};
const vehicleType = selectedPolicy?.privateVehicle?.vehicleCategory || 
                   selectedPolicy?.commercialVehicle?.vehicleCategory || '';
  const user = useUserStore(state => state.user);

  const handlePrevious = () => router.push('/dashboard');




  const getAuthTokenFromCookie = (): string | null => {
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  };


  useEffect(() => {
    const fetchPolicy = async () => {
      if (id && typeof id === "string") {
        // Try to find the policy from localStorage-persisted Zustand store
        const existingPolicy = policies.find((p) => p._id === id);

        if (existingPolicy) {
          console.log(existingPolicy)
          setPolicy(existingPolicy);
          setSelectedPolicy(id);
        } else {
          try {
            const accessToken = getAuthTokenFromCookie();
            const response = await axios.get(
              `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/policy-details/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const policy = response.data;
            console.log(policy)
            addPolicies([policy]);
            setPolicy(policy);
            setSelectedPolicy(policy._id);

          } catch (error) {
            console.error("Error fetching policy:", error);
          }
        }
      }
    };

    fetchPolicy();
  }, [id]);

  if (!selectedPolicy) {
    return <div className="p-8 text-center">Loading...</div>;
  }



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
                <div className="text-gray-700">{selectedPolicy.policyId}</div>
              </div>
              <div>
                <div className="font-bold text-blue-700">Date of Issuance</div>
                <div className="text-gray-700">
                  {new Date(selectedPolicy.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

              </div>
            </div>
          </div>

          {/* Insured Information */}
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Insured Information
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><div className="font-bold text-blue-700">Name of Insured</div><div className="text-gray-700">{user?.fullname}</div></div>
              <div><div className="font-bold text-blue-700">Phone Number</div><div className="text-gray-700">{user?.phoneNumber}</div></div>
              <div><div className="font-bold text-blue-700">Country</div><div className="text-gray-700">{user?.country}</div></div>
              <div><div className="font-bold text-blue-700">City</div><div className="text-gray-700">{user?.city}</div></div>
              <div><div className="font-bold text-blue-700">Sub City/Zone</div><div className="text-gray-700">{user?.subcity}</div></div>
              <div><div className="font-bold text-blue-700">Wereda</div><div className="text-gray-700">{user?.wereda}</div></div>
              <div><div className="font-bold text-blue-700">Kebele</div><div className="text-gray-700">{user?.kebele}</div></div>
            </div>
          </div>

          {/* Vehicle Information */}
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Vehicle Information
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><div className="font-bold text-blue-700">Plate Number</div><div className="text-gray-700">{generalDetails.plateNumber}</div></div>
              <div><div className="font-bold text-blue-700">Engine Number</div><div className="text-gray-700">{generalDetails.engineNumber}</div></div>
              <div><div className="font-bold text-blue-700">Make/Model</div><div className="text-gray-700">{generalDetails.make}</div></div>
              <div><div className="font-bold text-blue-700">Vehicle Type</div><div className="text-gray-700">{vehicleType}</div></div>
              <div><div className="font-bold text-blue-700">Engine Capacity</div><div className="text-gray-700">{generalDetails.engineCapacity}</div></div>
            </div>
          </div>

          {/* Policy Information */}
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Policy Information
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><div className="font-bold text-blue-700">Policy Period From</div><div className="text-gray-700">                <div className="text-gray-700">
                {new Date(selectedPolicy.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div></div></div>
              <div><div className="font-bold text-blue-700">Policy Duration</div><div className="text-gray-700">{selectedPolicy.duration} days </div></div>
            </div>
          </div>

          <button
            type="button"
            className="bg-[#3AA4FF] text-white p-7 py-2 rounded"
            onClick={handlePrevious}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
