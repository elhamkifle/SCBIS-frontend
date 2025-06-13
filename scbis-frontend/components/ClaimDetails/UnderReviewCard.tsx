"use client";

import { User, AlertTriangle, MapPin, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/authStore/useUserStore";

interface ClaimData {
    _id: string;
    userId: string;
    policyId: string;
    status: string;
    location: {
        city: string;
        subCity: string;
        kebele: string;
        sefer: string;
    };
    dateOfAccident: string;
    timeOfAccident: string;
    speed: number;
    roadSurface: string;
    trafficCondition: string;
    timeOfDay: string;
    driver: {
        firstName: string;
        lastName: string;
        age: number;
        city: string;
        subCity: string;
        kebele: string;
        phoneNumber: string;
        licenseNo: string;
        grade: string;
        expirationDate: string;
    };
    responsibleParty: string;
    policeInvolved: boolean;
    policeOfficerName: string;
    policeStation: string;
    aloneInVehicle: boolean;
    vehicleOccupants: Array<{ _id: string }>;
    independentWitnessPresent: boolean;
    independentWitnesses: Array<{ _id: string }>;
    vehicleDamageDesc: string;
    thirdPartyDamageDesc: string;
    injuries: {
        anyInjuries: boolean;
        injuredPersons: Array<{
            name: string;
            address: string;
        }>;
    };
}

interface UnderReviewCardProps {
    title: string;
    status: string;
    statusColor: string;
    description: string;
    note: string;
    buttonLabel: string;
    claimId?: string;
}

export function UnderReviewCard({
    title,
    status,
    statusColor,
    description,
    note,
    buttonLabel,

}: UnderReviewCardProps) {
    const router = useRouter();
    const [claimData, setClaimData] = useState<ClaimData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

        const params = useParams();
        const claimId = params?.id as string;
        const userInfo = useUserStore();

    const getAuthTokenFromCookie = (): string | null => {
        const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
    };

    useEffect(() => {
        if (claimId) {
            const fetchClaimData = async () => {
                try {
                    setLoading(true);
                    const accessToken = getAuthTokenFromCookie();
                    console.log(claimId)
                    const response = await axios.get(
                        `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/claims/${claimId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    const data = response.data;

                    if (data.isDriverSameAsInsured) {
            data.driver = {
              firstName: userInfo.user?.fullname,
              city: userInfo.user?.city,
              subCity: userInfo.user?.subcity,
              kebele: userInfo.user?.kebele,
              phoneNumber: userInfo.user?.phoneNumber,
            };
          }

          setClaimData(data);
                    setClaimData(response.data);
                    console.log("Claim details:", response.data); // Logging claim details
                } catch (err) {
                    console.error("Error fetching claim data:", err);
                    setError("Failed to load claim data");
                } finally {
                    setLoading(false);
                }
            };

            fetchClaimData();
        }
    }, [claimId]);

if (loading) {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <p className="text-blue-600 text-lg font-semibold mb-4">Loading claim details...</p>
            <button
                type="button"
                disabled
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-blue-600 text-white opacity-75 cursor-not-allowed"
            >
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                </svg>
                Loading...
            </button>
        </div>
    );
}


    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-8" style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.06)' }}>
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-4" style={{ color: statusColor }}>{title}</h2>
                <p className="text-blue-600 font-semibold mb-4">
                    Status: <span style={{ color: statusColor }}>{status}</span>
                </p>
                <p className="text-blue-600">{description}</p>
            </div>

            {claimData && (
                <div className="space-y-6">
                    {/* Driver Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                            <User size={20} />
                            <h3 className="text-lg">Driver Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>Name:</strong> {claimData.driver?.firstName || ''} {claimData.driver?.lastName || ''}</p>
                            <p><strong>City:</strong> {claimData.driver?.city || ''}</p>
                            <p><strong>Phone Number:</strong> {claimData.driver?.phoneNumber || ''}</p>
                            <p><strong>Kebele:</strong> {claimData.driver?.kebele || ''}</p>
                        </div>
                    </div>

                    {/* Accident Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                            <AlertTriangle size={20} />
                            <h3 className="text-lg">Accident Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>Date:</strong> {new Date(claimData.dateOfAccident).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {claimData.timeOfAccident}</p>
                            <p><strong>Speed:</strong> {claimData.speed} km/h</p>
                            <p><strong>Road Surface:</strong> {claimData.roadSurface}</p>
                            <p><strong>Traffic Condition:</strong> {claimData.trafficCondition}</p>
                            <p><strong>Time of Day:</strong> {claimData.timeOfDay}</p>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                            <MapPin size={20} />
                            <h3 className="text-lg">Location Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>City:</strong> {claimData.location?.city || ''}</p>
                            <p><strong>Sub-City:</strong> {claimData.location?.subCity || ''}</p>
                            <p><strong>Kebele:</strong> {claimData.location?.kebele || ''}</p>
                            <p><strong>Sefer:</strong> {claimData.location?.sefer || ''}</p>
                        </div>
                    </div>

                    {/* Liability Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                            <FileText size={20} />
                            <h3 className="text-lg">Liability Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>Responsible Party:</strong> {claimData.responsibleParty}</p>
                            <p><strong>Police Involved:</strong> {claimData.policeInvolved ? 'Yes' : 'No'}</p>
                            {claimData.policeInvolved && (
                                <>
                                    <p><strong>Police Officer:</strong> {claimData.policeOfficerName || ''}</p>
                                    <p><strong>Police Station:</strong> {claimData.policeStation || ''}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Witness Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                            <User size={20} />
                            <h3 className="text-lg">Witness Information</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 text-sm">
                            <p><strong>Alone in Vehicle:</strong> {claimData.aloneInVehicle ? 'Yes' : 'No'}</p>
                            {claimData.vehicleOccupants?.length > 0 && (
                                <div>
                                    <p className="font-semibold">Vehicle Occupants:</p>
                                    {claimData.vehicleOccupants.map((occupant: any, index: number) => (
                                        <p key={index} className="ml-4">• {occupant?.name || 'Unnamed occupant'}</p>
                                    ))}
                                </div>
                            )}
                            {claimData.independentWitnesses?.length > 0 && (
                                <div>
                                    <p className="font-semibold">Independent Witnesses:</p>
                                    {claimData.independentWitnesses.map((witness: any, index: number) => (
                                        <p key={index} className="ml-4">• {witness?.name || 'Unnamed witness'}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Damage Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                            <AlertTriangle size={20} />
                            <h3 className="text-lg">Damage Information</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 text-sm">
                            <p><strong>Vehicle Damage:</strong> {claimData.vehicleDamageDesc || 'No description'}</p>
                            <p><strong>Third Party Damage:</strong> {claimData.thirdPartyDamageDesc || 'No description'}</p>
                            {claimData.injuries?.anyInjuries && claimData.injuries?.injuredPersons?.length > 0 && (
                                <div>
                                    <p className="font-semibold">Injured Persons:</p>
                                    {claimData.injuries.injuredPersons.map((person: any, index: number) => (
                                        <p key={index} className="ml-4">• {person?.name || 'Unnamed'} - {person?.address || 'No address'}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <p className="text-md mt-8">
                <span className="font-bold text-blue-700">N.B:</span> {note}
            </p>

            <button
                className="mt-8 px-4 py-2 bg-blue-600 text-white rounded w-full hover:bg-blue-700 transition-colors"
                onClick={() => router.push("/dashboard")}
            >
                Back to Dashboard
            </button>
        </div>
    );
}