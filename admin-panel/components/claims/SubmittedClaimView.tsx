"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { claimsApi, type Claim } from "@/app/services/api";
import Image from "next/image";

interface SubmittedClaimViewProps {
  claimId: string;
}

export default function SubmittedClaimView({ claimId }: SubmittedClaimViewProps) {
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [note, setNote] = useState("");

  // Fetch claim details
  const fetchClaim = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await claimsApi.getClaimById(claimId);
      console.log('=== CLAIM DATA DEBUG ===');
      console.log('Full claim response:', response);
      console.log('Claim keys:', Object.keys(response));
      console.log('=== DETAILED FIELD CHECK ===');
      
      // Log each major field group
      console.log('Basic fields:', {
        id: response.id,
        claimId: response.claimId,
        claimantName: response.claimantName,
        policyNumber: response.policyNumber,
        status: response.status,
        vehicleInfo: response.vehicleInfo
      });
      
      console.log('Driver fields:', {
        driverName: response.driverName,
        driverFullName: response.driverFullName,
        isDriverSameAsInsured: response.isDriverSameAsInsured,
        driver: response.driver
      });
      
      console.log('Accident fields:', {
        accidentDate: response.accidentDate,
        dateOfAccident: response.dateOfAccident,
        timeOfAccident: response.timeOfAccident,
        location: response.location,
        locationDetails: response.locationDetails,
        speed: response.speed
      });
      
      console.log('Financial fields:', {
        claimAmount: response.claimAmount,
        coverageAmount: response.coverageAmount,
        approvedAmount: response.approvedAmount
      });
      
      console.log('Evidence fields:', {
        damageImages: response.damageImages,
        evidenceDocuments: response.evidenceDocuments,
        vehicleDamageFiles: response.vehicleDamageFiles,
        vehicleDamageDesc: response.vehicleDamageDesc,
        sketchFiles: response.sketchFiles
      });
      
      console.log('Police fields:', {
        policeInvolved: response.policeInvolved,
        policeOfficerName: response.policeOfficerName,
        policeStation: response.policeStation,
        policeReport: response.policeReport
      });
      
      console.log('Other fields:', {
        otherVehicles: response.otherVehicles,
        vehicleOccupants: response.vehicleOccupants,
        independentWitnesses: response.independentWitnesses,
        injuries: response.injuries,
        statusHistory: response.statusHistory
      });
      
      setClaim(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch claim details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (claimId) {
      fetchClaim();
    }
  }, [claimId]);

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Not specified";
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const formatLocation = (location: string | object) => {
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location !== null) {
      const loc = location as Record<string, unknown>;
      if (typeof loc.name === 'string') return loc.name;
      if (typeof loc.city === 'string') return loc.city;
      if (typeof loc.address === 'string') return loc.address;
      return "Location specified";
    }
    return "Not specified";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
      case "Submitted":
        return "bg-blue-100 text-blue-700";
      case "adminApproved":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleApprove = async () => {
    if (!claim) return;

    setUpdating(true);
    try {
      await claimsApi.approveSubmittedClaim(claimId, note || undefined);
      
      // Update local state
      setClaim({ ...claim, status: "adminApproved" });
      
      toast.success("Claim approved successfully! User will be notified to submit police report.");
      setIsDialogOpen(false);
      setNote("");
      setDialogAction(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to approve claim";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!claim || !note.trim()) return;

    setUpdating(true);
    try {
      await claimsApi.rejectSubmittedClaim(claimId, note);
      
      // Update local state
      setClaim({ ...claim, status: "rejected", rejectionReason: note });
      
      toast.success("Claim rejected successfully.");
      setIsDialogOpen(false);
      setNote("");
      setDialogAction(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reject claim";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const openDialog = (action: 'approve' | 'reject') => {
    setDialogAction(action);
    setNote("");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogAction(null);
    setNote("");
  };

  const handleRetry = () => {
    fetchClaim();
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardContent className="space-y-6 p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-3">
                <Skeleton className="h-36 w-36" />
                <Skeleton className="h-36 w-36" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Submitted Claim</h1>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-red-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-800 font-medium">Failed to load claim</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
              <Button onClick={handleRetry} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Submitted Claim</h1>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Claim not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Claim #{claim.claimId || claim.id}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(claim.status)}>
            {claim.status}
          </Badge>
          <Button 
            variant="outline" 
            onClick={handleRetry}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Data Availability Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Data Availability Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${claim.claimantName ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Basic Info</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${claim.driver || claim.driverName ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Driver Details</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${claim.locationDetails || claim.location ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Location Details</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${claim.damageImages?.length || claim.evidenceDocuments?.length ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Evidence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${claim.policeInvolved !== undefined || claim.policeReport ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Police Info</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${claim.independentWitnesses?.length || claim.whyNoWitness ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Witnesses</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${claim.injuries || claim.otherVehicles?.length ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Other Parties</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${claim.claimAmount || claim.coverageAmount ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Financial</span>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">🟢 Available • 🔴 Missing</p>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Claimant" value={claim.claimantName || claim.driverFullName || "N/A"} />
              <Detail label="Policy Number" value={claim.policyNumber} />
              <Detail label="Submitted" value={formatDate(claim.dateSubmitted)} />
              <Detail label="Vehicle Info" value={claim.vehicleInfo || "N/A"} />
            </div>
          </div>

          {/* Accident Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Accident Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Accident Date" value={formatDate(claim.accidentDate || claim.dateOfAccident)} />
              <Detail label="Time" value={claim.timeOfAccident || "N/A"} />
              <Detail label="Location" value={formatLocation(claim.location)} />
              <Detail label="Driver Name" value={claim.driverName || claim.driverFullName || "N/A"} />
              <Detail label="Speed at Accident" value={claim.speed ? `${claim.speed} km/h` : "N/A"} />
              <Detail label="Time of Day" value={claim.timeOfDay || "N/A"} />
            </div>
          </div>

          {/* Location Details */}
          {claim.locationDetails && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Detailed Location Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail label="City" value={claim.locationDetails.city || "N/A"} />
                <Detail label="Sub City" value={claim.locationDetails.subCity || "N/A"} />
                <Detail label="Kebele" value={claim.locationDetails.kebele || "N/A"} />
                <Detail label="Sefer" value={claim.locationDetails.sefer || "N/A"} />
              </div>
            </div>
          )}

          {/* Driver Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Driver Information</h2>
            <div className="mb-2">
              <Detail label="Is Driver Same as Insured?" value={claim.isDriverSameAsInsured ? "Yes" : "No"} />
            </div>
            {claim.driver && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail label="First Name" value={claim.driver.firstName || "N/A"} />
                <Detail label="Last Name" value={claim.driver.lastName || "N/A"} />
                <Detail label="Age" value={claim.driver.age?.toString() || "N/A"} />
                <Detail label="Phone Number" value={claim.driver.phoneNumber || "N/A"} />
                <Detail label="City" value={claim.driver.city || "N/A"} />
                <Detail label="Sub City" value={claim.driver.subCity || "N/A"} />
                <Detail label="Kebele" value={claim.driver.kebele || "N/A"} />
                <Detail label="License Number" value={claim.driver.licenseNo || "N/A"} />
                <Detail label="License Grade" value={claim.driver.grade || "N/A"} />
                <Detail label="License Expiry" value={formatDate(claim.driver.expirationDate)} />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Insured Full Name" value={claim.insuredFullName || "N/A"} />
            </div>
          </div>

          {/* Road and Traffic Conditions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Road and Traffic Conditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Position on Road" value={claim.positionOnRoad || "N/A"} />
              <Detail label="Road Surface" value={claim.roadSurface || "N/A"} />
              <Detail label="Traffic Condition" value={claim.trafficCondition || "N/A"} />
              <Detail label="Intersection Type" value={claim.intersectionType || "N/A"} />
              <Detail label="Visibility Obstructions" value={claim.visibilityObstructions || "N/A"} />
            </div>
          </div>

          {/* Vehicle Conditions at Time of Accident */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Vehicle Conditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Were you in vehicle?" value={claim.wereYouInVehicle !== undefined ? (claim.wereYouInVehicle ? "Yes" : "No") : "N/A"} />
              <Detail label="Horn Sounded?" value={claim.hornSounded !== undefined ? (claim.hornSounded ? "Yes" : "No") : "N/A"} />
              <Detail label="Headlights On?" value={claim.headlightsOn !== undefined ? (claim.headlightsOn ? "Yes" : "No") : "N/A"} />
              <Detail label="Alone in Vehicle?" value={claim.aloneInVehicle !== undefined ? (claim.aloneInVehicle ? "Yes" : "No") : "N/A"} />
            </div>
          </div>

          {/* Other Vehicles Involved */}
          {claim.otherVehicles && claim.otherVehicles.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Other Vehicles Involved</h2>
              {claim.otherVehicles.map((vehicle, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">Vehicle {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Detail label="Driver Name" value={vehicle.driverName || "N/A"} />
                    <Detail label="Driver Address" value={vehicle.driverAddress || "N/A"} />
                    <Detail label="Driver Phone" value={vehicle.driverPhone || "N/A"} />
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail label="Responsible Party" value={claim.responsibleParty || "N/A"} />
                <Detail label="Other Insured Status" value={claim.otherInsuredStatus || "N/A"} />
                <Detail label="Other Insurance Company" value={claim.otherInsuranceCompanyName || "N/A"} />
              </div>
            </div>
          )}

          {/* Vehicle Occupants */}
          {claim.vehicleOccupants && claim.vehicleOccupants.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Vehicle Occupants</h2>
              <div className="space-y-2">
                {claim.vehicleOccupants.map((occupant, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Detail label="Name" value={occupant.name || "N/A"} />
                      <Detail label="Contact" value={occupant.contact || "N/A"} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Police Involvement */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Police Involvement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Police Involved?" value={claim.policeInvolved !== undefined ? (claim.policeInvolved ? "Yes" : "No") : "N/A"} />
              <Detail label="Police Officer Name" value={claim.policeOfficerName || "N/A"} />
              <Detail label="Police Station" value={claim.policeStation || "N/A"} />
            </div>
            {claim.policeReport && (
              <div className="mt-4">
                <Detail label="Police Report" value="Available" />
                <a 
                  href={claim.policeReport} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  View Police Report
                </a>
              </div>
            )}
            {claim.policeReportRequestLetter && (
              <div className="mt-2">
                <Detail label="Police Report Request Letter" value="Available" />
                <a 
                  href={claim.policeReportRequestLetter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  View Request Letter
                </a>
              </div>
            )}
          </div>

          {/* Witnesses */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Witnesses</h2>
            <div className="mb-4">
              <Detail label="Independent Witness Present?" value={claim.independentWitnessPresent !== undefined ? (claim.independentWitnessPresent ? "Yes" : "No") : "N/A"} />
            </div>
            {claim.independentWitnesses && claim.independentWitnesses.length > 0 ? (
              <div className="space-y-2">
                {claim.independentWitnesses.map((witness, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <h3 className="font-medium mb-2">Witness {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Detail label="Name" value={witness.name || "N/A"} />
                      <Detail label="Contact" value={witness.contact || "N/A"} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <Detail label="Reason for No Witness" value={claim.whyNoWitness || "N/A"} />
              </div>
            )}
          </div>

          {/* Injuries */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Injuries</h2>
            <div className="mb-4">
              <Detail label="Any Injuries?" value={claim.injuries?.anyInjuries !== undefined ? (claim.injuries.anyInjuries ? "Yes" : "No") : "N/A"} />
            </div>
            {claim.injuries?.injuredPersons && claim.injuries.injuredPersons.length > 0 && (
              <div className="space-y-2">
                {claim.injuries.injuredPersons.map((person, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <h3 className="font-medium mb-2">Injured Person {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Detail label="Name" value={person.name || "N/A"} />
                      <Detail label="Address" value={person.address || "N/A"} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Financial Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Claim Amount" value={claim.claimAmount ? `ETB ${claim.claimAmount.toLocaleString()}` : "N/A"} />
              <Detail label="Coverage Amount" value={claim.coverageAmount ? `ETB ${claim.coverageAmount.toLocaleString()}` : "N/A"} />
              <Detail label="Approved Amount" value={claim.approvedAmount ? `ETB ${claim.approvedAmount.toLocaleString()}` : "N/A"} />
            </div>
          </div>

          {/* Repair Information */}
          {(claim.garage || claim.sparePartsFrom || claim.fixType || claim.sparePartsFromLocation) && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Repair Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail label="Garage" value={claim.garage || "N/A"} />
                <Detail label="Spare Parts From" value={claim.sparePartsFrom || "N/A"} />
                <Detail label="Fix Type" value={claim.fixType || "N/A"} />
              </div>
              {claim.sparePartsFromLocation && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Spare Parts Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Detail label="City" value={claim.sparePartsFromLocation.city || "N/A"} />
                    <Detail label="Sub City" value={claim.sparePartsFromLocation.subCity || "N/A"} />
                    <Detail label="Kebele" value={claim.sparePartsFromLocation.kebele || "N/A"} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Additional Description */}
          {claim.additionalDescription && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Additional Description</h2>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{claim.additionalDescription}</p>
            </div>
          )}

          {/* Basic Description (if different from additional) */}
          {claim.description && claim.description !== claim.additionalDescription && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{claim.description}</p>
            </div>
          )}


          {/* Comprehensive Evidence and Documentation */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Evidence and Documentation</h2>
            
            {/* Vehicle Damage Description */}
            {claim.vehicleDamageDesc && (
              <div className="space-y-2">
                <h3 className="font-medium">Vehicle Damage Description</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{claim.vehicleDamageDesc}</p>
              </div>
            )}

            {/* Third Party Damage */}
            {(claim.thirdPartyDamageFiles || claim.thirdPartyDamageDesc) && (
              <div className="space-y-2">
                <h3 className="font-medium">Third Party Damage</h3>
                {claim.thirdPartyDamageDesc && (
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{claim.thirdPartyDamageDesc}</p>
                )}
                {claim.thirdPartyDamageFiles && (
                  <div className="bg-gray-50 p-3 rounded">
                    <a 
                      href={claim.thirdPartyDamageFiles} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      View Third Party Damage Files
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Sketch Files */}
            {claim.sketchFiles && (
              <div className="space-y-2">
                <h3 className="font-medium">Accident Sketch</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <a 
                    href={claim.sketchFiles} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    View Accident Sketch Files
                  </a>
                </div>
              </div>
            )}

            {/* Evidence Documents */}
            {claim.evidenceDocuments && claim.evidenceDocuments.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Additional Evidence Documents</h3>
                <div className="space-y-2">
                  {claim.evidenceDocuments.map((doc, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <a 
                        href={doc} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Document {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Declaration and Signature */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Declaration and Signature</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Declaration Agreed?" value={claim.declaration !== undefined ? (claim.declaration ? "Yes" : "No") : "N/A"} />
              <Detail label="Agreed to Declaration?" value={claim.agreedToDeclaration !== undefined ? (claim.agreedToDeclaration ? "Yes" : "No") : "N/A"} />
              <Detail label="Signature Date" value={formatDate(claim.signatureDate)} />
            </div>
          </div>

          {/* Status History */}
          {claim.statusHistory && claim.statusHistory.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Status History</h2>
              <div className="space-y-2">
                {claim.statusHistory.map((history, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <Badge className={getStatusColor(history.status)} variant="secondary">
                          {history.status}
                        </Badge>
                        {history.note && (
                          <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(history.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessor Notes */}
          {claim.assessorNotes && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Assessor Notes</h2>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{claim.assessorNotes}</p>
            </div>
          )}

          {/* Additional Status Information */}
          {claim.statusReason && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Status Reason</h2>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{claim.statusReason}</p>
            </div>
          )}

          {/* Proforma Information */}
          {(claim.proformaSubmitted !== undefined || claim.garage || claim.sparePartsFrom) && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Proforma Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail label="Proforma Submitted?" value={claim.proformaSubmitted !== undefined ? (claim.proformaSubmitted ? "Yes" : "No") : "N/A"} />
              </div>
            </div>
          )}

          {/* Damage Evidence */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Damage Evidence</h2>
            {claim.damageImages && claim.damageImages.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto">
                {claim.damageImages.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt={`Damage Photo ${i + 1}`}
                    width={150}
                    height={150}
                    className="rounded-lg border shadow object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No damage images uploaded</p>
            )}
          </div>

          {/* Vehicle Damage Files */}
          {claim.vehicleDamageFiles && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Vehicle Damage Files</h2>
              <div className="bg-gray-50 p-3 rounded">
                <a 
                  href={claim.vehicleDamageFiles} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Vehicle Damage Files
                </a>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(claim.status === 'submitted' || claim.status === 'Submitted') && (
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button 
                variant="destructive"
                onClick={() => openDialog('reject')}
                disabled={updating}
              >
                {updating && dialogAction === 'reject' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Reject
              </Button>
              <Button 
                onClick={() => openDialog('approve')}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700"
              >
                {updating && dialogAction === 'approve' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Approve
              </Button>
            </div>
          )}

          {/* Status Information */}
          {claim.status === 'adminApproved' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">✅ Claim Approved</p>
              <p className="text-green-700 text-sm mt-1">
                User has been notified to submit police report documents.
              </p>
            </div>
          )}

          {claim.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">❌ Claim Rejected</p>
              {claim.rejectionReason && (
                <p className="text-red-700 text-sm mt-1">
                  Reason: {claim.rejectionReason}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approve Claim' : 'Reject Claim'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve' 
                ? 'Approving this claim will notify the user to submit police report documents.'
                : 'Please provide a reason for rejecting this claim.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder={
                dialogAction === 'approve' 
                  ? 'Add a note (optional)...' 
                  : 'Enter rejection reason...'
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={updating}>
              Cancel
            </Button>
            <Button
              onClick={dialogAction === 'approve' ? handleApprove : handleReject}
              disabled={updating || (dialogAction === 'reject' && !note.trim())}
              className={
                dialogAction === 'approve'
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {updating ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {dialogAction === 'approve' ? 'Approve Claim' : 'Reject Claim'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-sm font-medium text-gray-900 bg-gray-100 rounded px-3 py-1">{value}</p>
    </div>
  );
}