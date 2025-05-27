"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import Image from "next/image";
import withAuth from "../../utils/withAuth";

interface Claim {
  id: string;
  claimantName: string;
  dateSubmitted: string;
  policyNumber: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected";
  vehicleInfo: string;
  accidentDate: string;
  location: string;
  driverName: string;
  damageImages: string[];
  declaration: boolean;
}

function IncomingClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Replace with real API fetch
    setClaims([
      {
        id: "1",
        claimantName: "John Doe",
        dateSubmitted: "2025-05-10",
        policyNumber: "POL12345",
        status: "Submitted",
        vehicleInfo: "Toyota Corolla 2020",
        accidentDate: "2025-05-08",
        location: "Addis Ababa",
        driverName: "John Doe",
        damageImages: ["/sample-damage1.jpg"],
        declaration: true,
      },
      {
        id: "2",
        claimantName: "Sara Smith",
        dateSubmitted: "2025-05-11",
        policyNumber: "POL67890",
        status: "Under Review",
        vehicleInfo: "Hyundai Tucson 2019",
        accidentDate: "2025-05-07",
        location: "Bahir Dar",
        driverName: "Tom Smith",
        damageImages: ["/sample-damage2.jpg"],
        declaration: true,
      },
      {
        id: "3",
        claimantName: "Michael Brown",
        dateSubmitted: "2025-05-12",
        policyNumber: "POL23456",
        status: "Approved",
        vehicleInfo: "Ford Focus 2018",
        accidentDate: "2025-05-06",
        location: "Hawassa",
        driverName: "Michael Brown",
        damageImages: ["/sample-damage3.jpg", "/sample-damage4.jpg"],
        declaration: true,
      },
      {
        id: "4",
        claimantName: "Liya Tesfaye",
        dateSubmitted: "2025-05-13",
        policyNumber: "POL34567",
        status: "Rejected",
        vehicleInfo: "Chevrolet Spark 2021",
        accidentDate: "2025-05-05",
        location: "Dire Dawa",
        driverName: "Liya Tesfaye",
        damageImages: ["/sample-damage5.jpg"],
        declaration: false,
      }
    ]);
  }, []);

  const getStatusColor = (status: Claim["status"]) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-700";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-700";
    }
  };

  const filteredClaims = claims.filter((claim) =>
    claim.claimantName.toLowerCase().includes(search.toLowerCase()) ||
    claim.policyNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Incoming Claims</h1>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by name or policy number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md"
        />
        <Button variant="outline" className="flex gap-2">
          <Search size={16} /> Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClaims.map((claim) => (
          <Card key={claim.id} className="rounded-2xl shadow-md">
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{claim.claimantName}</h2>
                <Badge className={getStatusColor(claim.status)}>
                  {claim.status}
                </Badge>
              </div>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Policy #:</span> {claim.policyNumber}</p>
                <p><span className="font-medium">Vehicle:</span> {claim.vehicleInfo}</p>
                <p><span className="font-medium">Accident:</span> {claim.accidentDate} at {claim.location}</p>
                <p><span className="font-medium">Driver:</span> {claim.driverName}</p>
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Damage Evidence:</p>
                <div className="flex gap-2 overflow-x-auto">
                  {claim.damageImages.map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      alt="damage image"
                      width={80}
                      height={80}
                      className="rounded-lg border"
                    />
                  ))}
                </div>
              </div>
              <Button variant="outline" className="w-full mt-2 flex items-center gap-2">
                <Eye size={16} /> View Full Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default withAuth(IncomingClaimsPage);