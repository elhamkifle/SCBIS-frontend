"use client";

import { useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { usePoliciesStore } from "@/store/dashboard/policies";
import { useClaimsStore } from "@/store/dashboard/claims";
import { useUserStore } from "@/store/authStore/useUserStore";
import { useRouter } from "next/navigation";

const actionImages: Record<string, string> = {
  "New Policy Purchase": "/purchase.png",
  "Submit a Claim": "/Claim.png",
  "Renew Policy": "/Renew.png",
};

const actionLabels = [
  "New Policy Purchase",
  "Submit a Claim",
  "Renew Policy",
] as const;

const actionLinks: Record<typeof actionLabels[number], string> = {
  "New Policy Purchase": "/policy-purchase/personal-information/personalDetails",
  "Submit a Claim": "/claim-submission/claim-policy-selection",
  "Renew Policy": "/renew-policy",
};

export default function Dashboard() {
  const { policies, addPolicies } = usePoliciesStore();
  const { claims, setClaims } = useClaimsStore();
  const user = useUserStore((state) => state.user);
  const profileName = user?.fullname.split(' ') || [];
  const router = useRouter();

  const getAuthTokenFromCookie = (): string | null => {
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const accessToken = getAuthTokenFromCookie();
        const response = await axios.get(
          'https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/user-policies',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log('Fetched policies:', response.data);
        addPolicies(response.data);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    fetchPolicies();
  }, [addPolicies]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const accessToken = getAuthTokenFromCookie();
        const response = await axios.get(
          'https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/claims',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log('Claims:', response.data);
        setClaims(response.data);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    };

    fetchClaims();
  }, [setClaims]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
      case "submitted":
      case "premiumdecided":
        return "text-green-600";
      case "renewal":
      case "pending":
      case "under review":
        return "text-yellow-500";
      case "rejected":
      case "documentreuploadrequest":
      case "reject":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        <h1 className="text-lg font-syne md:text-4xl font-bold text-blue-500 mb-10 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Hello {`${profileName[0]} ${profileName[1]?.[0] || ''}.`}
        </h1>

        <div className="flex flex-row flex-wrap justify-between items-center gap-8 mb-14">
          {actionLabels.map((label) => (
            <Link key={label} href={actionLinks[label]} className="flex-1 min-w-[220px] max-w-[350px]">
              <div className="bg-blue-100 rounded-xl shadow-lg shadow-blue-100 h-28 flex flex-col justify-center items-center hover:shadow-xl transition cursor-pointer">
                <img src={actionImages[label]} alt={label} className="w-8 h-8 mb-2" />
                <p className="text-center text-base font-semibold">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        <section className="mb-14">
          <h2 className="text-xl font-semibold text-blue-500 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your Policies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 justify-items-center">
            {policies.map((policy) => {
              const generalDetails =
                policy.privateVehicle?.generalDetails ||
                policy.commercialVehicle?.generalDetails;
              const formattedDate = new Date(policy.createdAt).toLocaleDateString("en-KE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              const imageUrl = policy.vehicleType === "Private" ? "/Private.png" : "/Commercial.png";
              const handleViewDetails = () => {
                if (policy.status?.value === "documentReuploadRequest") {
                  router.push(`/purchaseRequestDeclined/${policy._id}`);
                } else if (policy.status?.value === "premiumDecided") {
                  router.push(`/purchaseRequestApproved/${policy._id}`);
                } else {
                  router.push(`/policydetails/${policy._id}`);
                }
              };

              const isAboutToExpire = () => {
                if (!policy.createdAt || !policy.duration) return false;
                const expiryDate = new Date(policy.createdAt);
                expiryDate.setDate(expiryDate.getDate() + policy.duration);
                const today = new Date();
                const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
              };

              const isExpired = () => {
                if (!policy.createdAt || !policy.duration) return false;
                const expiryDate = new Date(policy.createdAt);
                expiryDate.setDate(expiryDate.getDate() + policy.duration);
                return new Date() > expiryDate;
              };

              const handleRenew = () => {
                router.push(`/renew-policy/policy-selection?policyId=${policy._id}`);
              };

              return (
                <div key={policy._id} className="bg-white border rounded-xl shadow-lg shadow-blue-100 w-full max-w-[400px] p-8">
                  <div className="flex justify-between items-center mb-3">
                    <img src={imageUrl} alt={policy.vehicleType} className="w-6 h-6" />
                    <span className={`text-xs font-semibold ${getStatusColor(policy.status?.value)}`}>
                      {policy.status?.value}
                    </span>
                  </div>
                  <div className="text-base leading-7">
                    <p><span className="text-gray-500">Title:</span> <span className="font-bold">{policy.policyType}</span></p>
                    <p><span className="text-gray-500">Plate No.:</span> <span className="font-bold">{generalDetails?.plateNumber}</span></p>
                    <p><span className="text-gray-500">Duration:</span> <span className="font-bold">{policy.duration} days</span></p>
                    <p><span className="text-gray-500">Issued On:</span> <span className="font-bold">{formattedDate}</span></p>
                    <p><span className="text-gray-500">Policy Duration:</span> <span className="font-bold">{policy.duration} days </span></p>
                  </div>
                  <div className="mt-5 space-y-2">
                    {(isAboutToExpire() || isExpired()) && (
                      <button
                        onClick={handleRenew}
                        className="w-full text-base text-white bg-blue-600 rounded py-2 hover:bg-blue-700 font-semibold"
                      >
                        Renew Policy
                      </button>
                    )}
                    <button
                      onClick={handleViewDetails}
                      className="w-full text-base text-blue-600 border border-blue-600 rounded py-2 hover:bg-blue-50 font-semibold"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-500 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your claims </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 justify-items-center">
            {claims.map((claim) => {
              const formattedDate = formatDate(claim.dateSubmitted || claim.createdAt);

              return (
                <div key={claim._id} className="bg-white border rounded-xl shadow-lg shadow-blue-100 w-full max-w-[400px] p-8">
                  <div className="flex justify-between items-center mb-3">
                    <img src="/Claim.png" alt="Claim" className="w-6 h-6" />
                    <span className={`text-xs font-semibold ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </div>
                  <div className="text-base leading-7">
                    <p><span className="text-gray-500">Policy ID:</span> <span className="font-bold">{claim.policyId}</span></p>
                    <p><span className="text-gray-500">Claim Submitted:</span> <span className="font-bold">{formattedDate}</span></p>
                    <p><span className="text-gray-500">Coverage Amount:</span> <span className="font-bold">{claim.coverageAmount?.toLocaleString()} ETB</span></p>
                    <p><span className="text-gray-500">Garage:</span> <span className="font-bold">{claim.garage}</span></p>
                    <p><span className="text-gray-500">Fix Type:</span> <span className="font-bold">{claim.fixType}</span></p>
                  </div>
                  <Link href={`/claim-details/${claim._id}`}>
                    <button className="mt-5 w-full text-base text-blue-600 border border-blue-600 rounded py-2 hover:bg-blue-50 font-semibold">
                      View Details
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}