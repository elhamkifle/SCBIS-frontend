"use client";

import { User, AlertTriangle, MapPin, FileText } from "lucide-react";
import { useRouter } from "next/navigation";




interface ClaimData {
    driver: any;
    accidentDetails: any;
    liability: any;
    witness: any;
    damage: any;
}

interface UnderReviewCardProps {
    title: string;
    status: string;
    statusColor: string;
    description: string;
    note: string;
    buttonLabel: string;
    claimData?: ClaimData;
}

export function UnderReviewCard({
    title,
    status,
    statusColor,
    description,
    note,
    claimData,
}: UnderReviewCardProps) {
    const router = useRouter();
    
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
                            <p><strong>Age:</strong> {claimData.driver?.age || ''}</p>
                            <p><strong>License No:</strong> {claimData.driver?.licenseNo || ''}</p>
                            <p><strong>License Grade:</strong> {claimData.driver?.grade || ''}</p>
                            <p><strong>Expiration Date:</strong> {claimData.driver?.expirationDate || ''}</p>
                            <p><strong>Phone:</strong> {claimData.driver?.phoneNumber || ''}</p>
                        </div>
                    </div>

                    {/* Accident Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                            <AlertTriangle size={20} />
                            <h3 className="text-lg">Accident Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>Date:</strong> {claimData.accidentDetails?.dateOfAccident || ''}</p>
                            <p><strong>Time:</strong> {claimData.accidentDetails?.timeOfAccident || ''}</p>
                            <p><strong>Speed:</strong> {claimData.accidentDetails?.speed || ''} km/h</p>
                            <p><strong>Road Surface:</strong> {claimData.accidentDetails?.roadSurface || ''}</p>
                            <p><strong>Traffic Condition:</strong> {claimData.accidentDetails?.trafficCondition || ''}</p>
                            <p><strong>Time of Day:</strong> {claimData.accidentDetails?.timeOfDay || ''}</p>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                            <MapPin size={20} />
                            <h3 className="text-lg">Location Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>City:</strong> {claimData.accidentDetails?.location?.city || ''}</p>
                            <p><strong>Sub-City:</strong> {claimData.accidentDetails?.location?.subCity || ''}</p>
                            <p><strong>Kebele:</strong> {claimData.accidentDetails?.location?.kebele || ''}</p>
                            <p><strong>Sefer:</strong> {claimData.accidentDetails?.location?.sefer || ''}</p>
                        </div>
                    </div>

                    {/* Liability Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                            <FileText size={20} />
                            <h3 className="text-lg">Liability Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>Responsible Party:</strong> {claimData.liability?.responsibleParty || ''}</p>
                            <p><strong>Other Insurance:</strong> {claimData.liability?.otherInsuranceCompanyName || ''}</p>
                            <p><strong>Police Involved:</strong> {claimData.liability?.policeInvolved ? 'Yes' : 'No'}</p>
                            {claimData.liability?.policeInvolved && (
                                <>
                                    <p><strong>Police Officer:</strong> {claimData.liability?.policeOfficerName || ''}</p>
                                    <p><strong>Police Station:</strong> {claimData.liability?.policeStation || ''}</p>
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
                            <p><strong>Alone in Vehicle:</strong> {claimData.witness?.aloneInVehicle ? 'Yes' : 'No'}</p>
                            {claimData.witness?.vehicleOccupants?.length > 0 && (
                                <div>
                                    <p className="font-semibold">Vehicle Occupants:</p>
                                    {claimData.witness.vehicleOccupants.map((occupant: any, index: number) => (
                                        <p key={index} className="ml-4">• {occupant?.name || ''} - {occupant?.contact || ''}</p>
                                    ))}
                                </div>
                            )}
                            {claimData.witness?.independentWitnesses?.length > 0 && (
                                <div>
                                    <p className="font-semibold">Independent Witnesses:</p>
                                    {claimData.witness.independentWitnesses.map((witness: any, index: number) => (
                                        <p key={index} className="ml-4">• {witness?.name || ''} - {witness?.contact || ''}</p>
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
                            <p><strong>Vehicle Damage:</strong> {claimData.damage?.vehicleDamageDesc || ''}</p>
                            <p><strong>Third Party Damage:</strong> {claimData.damage?.thirdPartyDamageDesc || ''}</p>
                            {claimData.damage?.injuriesAny && claimData.damage?.injuredPersons?.length > 0 && (
                                <div>
                                    <p className="font-semibold">Injured Persons:</p>
                                    {claimData.damage.injuredPersons.map((person: any, index: number) => (
                                        <p key={index} className="ml-4">• {person?.name || ''} - {person?.address || ''}</p>
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

                <button className="mt-8 px-4 py-2 bg-blue-600 text-white rounded w-full" onClick={() => router.push("/dashboard")}>
                    Back to Dashboard 
                </button>
        </div>
    );
} 