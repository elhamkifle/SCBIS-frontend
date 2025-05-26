"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock policy details data - in a real app, this would come from an API
const mockPolicyDetails: Record<string, {
  id: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  premium: string;
  coverageLimit: string;
  deductible: string;
  vehicle: {
    make: string;
    model: string;
    year: string;
    vin: string;
  };
  claims: {
    id: string;
    date: string;
    amount: string;
    status: string;
  }[];
}> = {
  "p-001": {
    id: "p-001",
    type: "Car Insurance",
    status: "Active",
    startDate: "2024-04-01",
    endDate: "2025-04-01",
    premium: "$120.00",
    coverageLimit: "$50,000",
    deductible: "$500",
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: "2020",
      vin: "4T1BF1FK7HU535269"
    },
    claims: [
      { id: "c-001", date: "2024-05-15", amount: "$1,200", status: "Approved" },
      { id: "c-002", date: "2024-06-22", amount: "$850", status: "Pending" }
    ]
  },
  "p-002": {
    id: "p-002",
    type: "Car Insurance",
    status: "Expired",
    startDate: "2023-04-01",
    endDate: "2024-04-01",
    premium: "$110.00",
    coverageLimit: "$45,000",
    deductible: "$500",
    vehicle: {
      make: "Honda",
      model: "Civic",
      year: "2018",
      vin: "2HGFC2F56LH551234"
    },
    claims: [
      { id: "c-003", date: "2023-11-10", amount: "$2,500", status: "Approved" }
    ]
  }
};

export default function PolicyDetailsPage() {
  const { id, policyId } = useParams();
  // Removed duplicate declaration of 'policy'
  const router = useRouter();

  // Get the policy details
  const policy = mockPolicyDetails[policyId as string];
  if (!policyId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Invalid Policy ID</h1>
        <p className="text-gray-600 mt-2">The policy ID is missing or invalid.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }
  if (!policy) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Policy Not Found</h1>
        <p className="text-gray-600 mt-2">The requested policy could not be found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-800">Policy Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Policies
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Policy Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Policy ID</p>
                <p className="font-medium">{policy.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{policy.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge
                  variant={policy.status === "Active" ? "default" : "secondary"}
                  className={
                    policy.status === "Active" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {policy.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Premium</p>
                <p className="font-medium">{policy.premium}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{policy.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">{policy.endDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coverage Limit</p>
                <p className="font-medium">{policy.coverageLimit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deductible</p>
                <p className="font-medium">{policy.deductible}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Make</p>
                <p className="font-medium">{policy.vehicle.make}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{policy.vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{policy.vehicle.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">VIN</p>
                <p className="font-medium">{policy.vehicle.vin}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claims History Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Claims History</CardTitle>
          </CardHeader>
          <CardContent>
            {policy.claims.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Claim ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {policy.claims.map((claim) => (
                      <tr key={claim.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {claim.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {claim.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {claim.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge
                            variant={
                              claim.status === "Approved" 
                                ? "default" 
                                : claim.status === "Pending" 
                                  ? "outline" 
                                  : "secondary"
                            }
                          >
                            {claim.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No claims found for this policy.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}