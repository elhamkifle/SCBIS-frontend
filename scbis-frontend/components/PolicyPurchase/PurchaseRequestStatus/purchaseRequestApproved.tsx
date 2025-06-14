'use client';

import { CheckCircle, Car, Calculator } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { usePoliciesStore } from '@/store/dashboard/policies';
import { useRouter } from 'next/navigation';

interface Policy {
  _id: string;
  policyId: string;
  policyType: string;
  duration: number;
  premium: number;
  coverageArea: string;
  vehicleInformation: {
    coverRequired: string;
    vehicleInGoodRepair: string;
    vehicleLeftOvernight: string;
    soleProperty: string;
    privateUse: string;
    convicted: string;
    insuredBefore: string;
    companyHistory: string[];
    hadAccidents: string;
    claimsInjury: string;
    claimsProperty: string;
    personalAccident: string;
    passengersInsured: string;
  };
  driverInformation: {
    fullName: string;
    signatureDate: string;
    acceptTerms: boolean;
  };
  status: {
    value: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PurchaseRequestApproved() {
  const params = useParams();
  const policyId = params?.id as string;
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { policies } = usePoliciesStore();
  const router = useRouter();

  const getAuthTokenFromCookie = (): string | null => {
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);

        // Fetch from backend if not found locally
        const accessToken = getAuthTokenFromCookie();
        const response = await axios.get(
          `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/policy-details/${policyId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log(response.data)

        setPolicy(response.data);

      } catch (err) {
        console.error('Error fetching policy:', err);
        setError('Failed to load policy details');
      } finally {
        setLoading(false);
      }
    };

    if (policyId) {
      fetchPolicy();
    }
  }, [policyId, policies]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB'
    }).format(amount);
  };

  const handleAccept = async () => {
    // Implement accept logic
    console.log('Policy accepted');
  };

  const handleReject = async () => {
    // Implement reject logic
    console.log('Policy rejected');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-8 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading policy details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-8 text-center">
        <p>Policy not found</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl lg:ml-28 mb-4 font-bold">Policy Purchase</h2>

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-8" style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
        {/* Header Section */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="text-green-500" size={40} />
          <div>
            <h2 className="text-xl font-bold text-green-600">Policy Purchase Request is Approved</h2>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <p className="text-blue-600 font-semibold font-syne">
            Status: <span className="text-green-500">Approved - Pending Payment</span>
          </p>
        </div>

        {/* Vehicle & Policy Details */}
        <div className="pb-4 mb-4 px-16">
          <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold font-syne">
            <Car size={20} />
            <h3 className='text-lg'>Vehicle & Policy Details:</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-md">
            <p><strong>Policy ID:</strong> {policy.policyId}</p>
            <p><strong>Policy Type:</strong> {policy.policyType}</p>
            <p><strong>Coverage Area:</strong> {policy.coverageArea}</p>
            <p><strong>Created On:</strong> {formatDate(policy.createdAt)}</p>
            <p><strong>Private Use:</strong> {policy.vehicleInformation.privateUse === "true" ? "Yes" : "No"}</p>
            <p><strong>Insured Before:</strong> {policy.vehicleInformation.insuredBefore === "true" ? "Yes" : "No"}</p>
          </div>
        </div>

        {/* Premium Calculation */}
        <div className="pb-4 mb-4 px-16">
          <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold font-syne">
            <Calculator size={20} />
            <h3 className='text-lg'>Premium Calculation:</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-md">
            <p><strong>Premium Amount:</strong> {formatCurrency(policy.premium)}</p>
            <p><strong>Duration:</strong> {policy.duration} days</p>
            <p><strong>Policy Holder:</strong> {policy.driverInformation.fullName}</p>
            <p><strong>Agreement Date:</strong> {policy.driverInformation.signatureDate}</p>
          </div>
        </div>

        {/* Accept & Reject Buttons */}
        <div className="flex justify-between px-24 gap-4 mt-4">

          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-12 py-2 rounded-lg shadow hover:bg-red-600"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white px-12 py-2 rounded-lg shadow hover:bg-green-600"
          >
            Proceed to Payment
          </button>

        </div>

        <button className="mt-8 px-4 py-2 bg-blue-600 text-white rounded w-full" onClick={() => router.push("/dashboard")}>
          Back To Dashboard
        </button>

        {/* Notice */}
        <p className="text-md mt-8">
          <span className="font-bold text-blue-700">N.B:</span> Your policy will become active on the day of payment after approval.
        </p>
      </div>
    </>
  );
}