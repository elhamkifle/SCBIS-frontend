"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";

const mockRequestData = {
  id: "REQ-123456",
  policy: {
    type: "Comprehensive",
    duration: "1 Year",
    coverageArea: "National",
  },
  vehicle: {
    make: "Toyota",
    model: "Corolla",
    engineCapacity: 1800,
    plateNumber: "AB-12345",
    bodyType: "Sedan",
    engineNumber: "ENG-987654",
    purchasedValue: 900000,
    isDutyFree: false,
    vehicleDocuments: [
      { name: "Front View", url: "/car-front.jpg" },
      { name: "Back View", url: "/car-back.jpg" },
    ],
  },
  ownership: {
    ownerType: "Private",
    driverType: "Personal Use",
    seatingCapacity: 5,
  },
  driver: {
    licenseGrade: "Grade 1",
    experience: "3 Years",
    under21: false,
    infirmity: false,
    lessThan6MonthsExp: false,
  },
};

export default function PolicyDetailsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id, policy, vehicle, ownership, driver } = mockRequestData;

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Car Insurance Request Details</h1>
          <p className="text-gray-600 mt-1">Request ID: <span className="font-medium">{id}</span></p>
        </div>
      </div>

      {/* Policy Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-blue-100 p-2 rounded-md font-semibold text-blue-800">Policy Information</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700 pt-2">
            <p><strong>Policy Type:</strong> {policy.type}</p>
            <p><strong>Duration:</strong> {policy.duration}</p>
            <p><strong>Coverage Area:</strong> {policy.coverageArea}</p>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-green-100 p-2 rounded-md font-semibold text-green-800">Vehicle Details</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700 pt-2">
            <p><strong>Make:</strong> {vehicle.make}</p>
            <p><strong>Model:</strong> {vehicle.model}</p>
            <p><strong>Engine Capacity:</strong> {vehicle.engineCapacity} CC</p>
            <p><strong>Plate Number:</strong> {vehicle.plateNumber}</p>
            <p><strong>Body Type:</strong> {vehicle.bodyType}</p>
            <p><strong>Engine Number:</strong> {vehicle.engineNumber}</p>
            <p><strong>Purchased Value:</strong> {vehicle.purchasedValue.toLocaleString()} Birr</p>
            <p><strong>Duty Free:</strong> {vehicle.isDutyFree ? "Yes" : "No"}</p>
          </div>

          {/* Vehicle Documents */}
          <div className="mt-6">
            <h3 className="font-semibold mb-4 text-gray-800">Vehicle Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {vehicle.vehicleDocuments.map((doc, index) => (
                <div 
                  key={index}
                  className="border rounded-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedImage(doc.url)}
                >
                  <div className="relative h-40 w-full">
                    <Image src={doc.url} alt={doc.name} fill className="object-cover" />
                  </div>
                  <div className="p-2 text-center text-gray-700 font-medium">{doc.name}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ownership & Usage */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-yellow-100 p-2 rounded-md font-semibold text-yellow-800">Ownership & Usage</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700 pt-2">
            <p><strong>Owner Type:</strong> {ownership.ownerType}</p>
            <p><strong>Driver Type:</strong> {ownership.driverType}</p>
            <p><strong>Seating Capacity:</strong> {ownership.seatingCapacity}</p>
          </div>
        </CardContent>
      </Card>

      {/* Driver Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-orange-100 p-2 rounded-md font-semibold text-orange-800">Driver Information</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700 pt-2">
            <p><strong>License Grade:</strong> {driver.licenseGrade}</p>
            <p><strong>Experience:</strong> {driver.experience}</p>
            <p><strong>Under 21:</strong> {driver.under21 ? "Yes" : "No"}</p>
            <p><strong>Infirmity:</strong> {driver.infirmity ? "Yes" : "No"}</p>
            <p><strong>Less than 6 Months Exp.:</strong> {driver.lessThan6MonthsExp ? "Yes" : "No"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-2xl">
            <Image
              src={selectedImage}
              alt="Vehicle Document"
              width={800}
              height={600}
              className="object-contain w-full h-auto rounded"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
