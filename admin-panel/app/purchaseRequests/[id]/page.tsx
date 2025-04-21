"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwrap the params Promise

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Mock data - replace with actual data fetching
  const requestData = {
    policy: {
      type: "Comprehensive Cover",
      duration: "30 Days",
      coverageArea: "Ethiopia Only",
    },
    user: {
      title: "Mr.",
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      dateOfBirth: "1985-05-15",
      nationality: "Ethiopian",
      additionalPhoneNumber: "+251911223344",
      tinNumber: "123456789",
      identityDocuments: [
        { url: "/docs/id.png", name: "ID" },
        { url: "/docs/id.png", name: "ID" },
      ],
    },
    vehicle: {
      make: "Toyota",
      model: "Corolla",
      engineCapacity: 1600,
      plateNumber: "ABC-1234",
      bodyType: "Sedan",
      engineNumber: "EN12345678",
      purchasedValue: 1200000,
      isDutyFree: false,
      vehicleDocuments: [
        { url: "/docs/libre.png", name: "Vehicle Libre" },
        { url: "/docs/libre.png", name: "Registration" },
      ],
    },
    ownership: {
      ownerType: "Individual",
      driverType: "Owner",
      seatingCapacity: 5,
    },
    driver: {
      licenseGrade: "Grade 3",
      experience: "4 Years",
      under21: false,
      infirmity: false,
      lessThan6MonthsExp: false,
    },
  };

  const handleReject = async () => {
    setIsRejecting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Request Rejected",
      description: `Request #${id} has been rejected. Reason: ${rejectionReason}`,
      variant: "destructive",
    });

    setIsRejecting(false);
    setRejectOpen(false);
    setRejectionReason("");
    setIsSuccess(true); // Show success popup
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Car Insurance Request Details</h1>
      <p>Request ID: {id}</p>

      {/* Policy Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-blue-50 p-2 rounded-md font-semibold text-blue-800">Policy Information</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Policy Type:</strong> {requestData.policy.type}</p>
            <p><strong>Duration:</strong> {requestData.policy.duration}</p>
            <p><strong>Coverage Area:</strong> {requestData.policy.coverageArea}</p>
          </div>
        </CardContent>
      </Card>

      {/* User Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-purple-50 p-2 rounded-md font-semibold text-purple-800">Personal Information</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Full Name:</strong> {requestData.user.title} {requestData.user.firstName} {requestData.user.lastName}</p>
            <p><strong>Gender:</strong> {requestData.user.gender}</p>
            <p><strong>Date of Birth:</strong> {requestData.user.dateOfBirth}</p>
            <p><strong>Nationality:</strong> {requestData.user.nationality}</p>
            <p><strong>Additional Phone:</strong> {requestData.user.additionalPhoneNumber}</p>
            <p><strong>TIN Number:</strong> {requestData.user.tinNumber}</p>
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Identity Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {requestData.user.identityDocuments.map((doc, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedImage(doc.url)}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={doc.url}
                      alt={doc.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-center mt-2">{doc.name}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-green-50 p-2 rounded-md font-semibold text-green-800">Vehicle Details</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Make:</strong> {requestData.vehicle.make}</p>
            <p><strong>Model:</strong> {requestData.vehicle.model}</p>
            <p><strong>Engine Capacity:</strong> {requestData.vehicle.engineCapacity} CC</p>
            <p><strong>Plate Number:</strong> {requestData.vehicle.plateNumber}</p>
            <p><strong>Body Type:</strong> {requestData.vehicle.bodyType}</p>
            <p><strong>Engine Number:</strong> {requestData.vehicle.engineNumber}</p>
            <p><strong>Purchased Value:</strong> {requestData.vehicle.purchasedValue.toLocaleString()} Birr</p>
            <p><strong>Duty Free:</strong> {requestData.vehicle.isDutyFree ? "Yes" : "No"}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Vehicle Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {requestData.vehicle.vehicleDocuments.map((doc, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedImage(doc.url)}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={doc.url}
                      alt={doc.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-center mt-2">{doc.name}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ownership & Usage */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-yellow-50 p-2 rounded-md font-semibold text-yellow-800">Ownership & Usage</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Owner Type:</strong> {requestData.ownership.ownerType}</p>
            <p><strong>Driver Type:</strong> {requestData.ownership.driverType}</p>
            <p><strong>Seating Capacity:</strong> {requestData.ownership.seatingCapacity}</p>
          </div>
        </CardContent>
      </Card>

      {/* Driver Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-orange-50 p-2 rounded-md font-semibold text-orange-800">Driver Information</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>License Grade:</strong> {requestData.driver.licenseGrade}</p>
            <p><strong>Experience:</strong> {requestData.driver.experience}</p>
            <p><strong>Under 21:</strong> {requestData.driver.under21 ? "Yes" : "No"}</p>
            <p><strong>Infirmity:</strong> {requestData.driver.infirmity ? "Yes" : "No"}</p>
            <p><strong>Less than 6 Months Exp.:</strong> {requestData.driver.lessThan6MonthsExp ? "Yes" : "No"}</p>
          </div>
        </CardContent>
      </Card>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end">
        <Button 
          variant="destructive" 
          onClick={() => setRejectOpen(true)}
        >
          Reject Request
        </Button>
        <Link href={`/purchaseRequests/${id}/premium-calculation`}>
          <Button>Approve & Calculate Premium</Button>
        </Link>
      </div>

      {/* Image Zoom Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="sr-only">Document Preview</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[95vh] flex items-center justify-center">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Zoomed document"
                fill
                className="object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Insurance Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request. This will be communicated to the user.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter rejection reason (required)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRejectOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason.trim() || isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Popup */}
      <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Operation Successful!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <p className="text-center text-gray-600">
              The insurance request has been successfully rejected.
            </p>
            <Button 
              className="w-full" 
              onClick={() => setIsSuccess(false)}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}