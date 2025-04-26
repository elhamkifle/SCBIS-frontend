"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { saveAs } from "file-saver";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  interface User {
    id: string;
    fullname: string;
    phoneNumber: string;
    email: string;
    roles: string[];
    isPhoneVerified: boolean;
    title: string;
    tinNumber: string;
    country: string;
    regionOrState: string;
    city: string;
    subcity: string;
    zone: string;
    woreda: string;
    kebele: string;
    houseNumber: string;
    profileImageUrl: string;
    walletAddress: string;
    accountCreatedAt: string;
    lastActive: string;
    notes: string;
    policies: { id: string; type: string; status: string; startDate: string; endDate: string }[];
    claims: { id: string; type: string; status: string; submittedAt: string }[];
  }

  const mockUsers: User[] = [
    {
      id: "u12345",
      fullname: "Alice Johnson",
      phoneNumber: "+251912345678",
      email: "alice@example.com",
      roles: ["Admin"],
      isPhoneVerified: true,
      title: "Manager",
      tinNumber: "123456789",
      country: "Ethiopia",
      regionOrState: "Addis Ababa",
      city: "Addis Ababa",
      subcity: "Bole",
      zone: "Zone 1",
      woreda: "Woreda 2",
      kebele: "Kebele 3",
      houseNumber: "1234",
      profileImageUrl: "/docs/id.png",
      walletAddress: "0xabc123456789ef00000000000000000000000000",
      accountCreatedAt: "2024-01-01",
      lastActive: "2025-04-23",
      notes: "Important client. Requested premium waiver.",
      policies: [
        { id: "p-001", type: "Car Insurance", status: "Active", startDate: "2024-04-01", endDate: "2025-04-01" },
        { id: "p-002", type: "Car Insurance", status: "Expired", startDate: "2023-04-01", endDate: "2024-04-01" },
        { id: "p-003", type: "Car Insurance", status: "Expired", startDate: "2023-04-01", endDate: "2024-04-01" },
        { id: "p-004", type: "Car Insurance", status: "Expired", startDate: "2023-04-01", endDate: "2024-04-01" },
        { id: "p-005", type: "Car Insurance", status: "Expired", startDate: "2023-04-01", endDate: "2024-04-01" }
      ],
      claims: [
        { id: "c-001", type: "Collision", status: "Closed", submittedAt: "2024-06-12" },
        { id: "c-002", type: "Theft", status: "Pending", submittedAt: "2025-03-15" }
      ]
    }
  ];

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const foundUser = mockUsers.find((user) => user.id === id);
    if (foundUser) setUser(foundUser);
    else setError("User not found.");
    setLoading(false);
  }, [id]);

  const suspendUser = () => {
    alert(`User ${user?.fullname} has been suspended (mock).`);
  };

  const viewTransactions = () => {
    router.push(`/userManagement/users/${user?.id}/transactions`);
  };

  const downloadReport = () => {
    const content = `
User: ${user?.fullname}
Email: ${user?.email}
Phone: ${user?.phoneNumber}
Wallet: ${user?.walletAddress}
Policies: ${user?.policies.length}
Claims: ${user?.claims.length}
    `;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${user?.fullname.replace(" ", "_")}_report.txt`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!user) return <p className="p-8 text-red-600">User not found.</p>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
        <div className="flex gap-3">
          <Button variant="destructive" onClick={suspendUser}>Suspend User</Button>
          <Button variant="outline" onClick={viewTransactions}>View Transactions</Button>
          <Button onClick={downloadReport}>Download Report</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 flex gap-6">
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-[90vw] max-h-[90vh]">
              <DialogHeader>
          <DialogTitle className="sr-only">Profile Image Preview</DialogTitle>
              </DialogHeader>
              <div className="relative w-full h-[95vh] flex items-center justify-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Zoomed profile"
              className="object-contain max-h-full max-w-full"
            />
          )}
              </div>
            </DialogContent>
          </Dialog>
          <img
            src={user.profileImageUrl}
            alt="User ID"
            className="w-32 h-32 rounded-lg object-cover border cursor-pointer"
            onClick={() => setSelectedImage(user.profileImageUrl)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Detail label="Full Name" value={user.fullname} />
            <Detail label="Phone Number" value={user.phoneNumber} />
            <Detail label="Email" value={user.email} />
            <Detail label="Roles" value={user.roles.join(", ")} />
            <Detail label="Phone Verified" value={user.isPhoneVerified ? "Yes" : "No"} />
            <Detail label="Wallet Address" value={user.walletAddress} />
            <Detail label="Account Created" value={user.accountCreatedAt} />
            <Detail label="Last Active" value={user.lastActive} />
            <Detail label="TIN Number" value={user.tinNumber} />
            <Detail label="Title" value={user.title} />
            <Detail label="Country" value={user.country} />
            <Detail label="Region / State" value={user.regionOrState} />
            <Detail label="City" value={user.city} />
            <Detail label="Subcity" value={user.subcity} />
            <Detail label="Zone" value={user.zone} />
            <Detail label="Woreda" value={user.woreda} />
            <Detail label="Kebele" value={user.kebele} />
            <Detail label="House Number" value={user.houseNumber} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="text-xl font-semibold mb-2">Notes / Flags</h2>
          <p className="text-gray-700 bg-gray-100 p-3 rounded-md shadow-sm whitespace-pre-line">
            {user.notes}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Policy History</h2>
          {user.policies.slice(0, 3).map((policy) => (
        <div key={policy.id} className="p-3 border rounded-md">
          <p><strong>Type:</strong> {policy.type}</p>
          <p><strong>Status:</strong> {policy.status}</p>
          <p><strong>Start Date:</strong> {policy.startDate}</p>
          <p><strong>End Date:</strong> {policy.endDate}</p>
        </div>
          ))}
          {user.policies.length > 3 && (
        <Button variant="outline" onClick={() => router.push(`/userManagement/users/${user.id}/policies`)}>
          View More
        </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Claim History</h2>
          {user.claims.map((claim) => (
            <div key={claim.id} className="p-3 border rounded-md">
              <p><strong>Type:</strong> {claim.type}</p>
              <p><strong>Status:</strong> {claim.status}</p>
              <p><strong>Submitted At:</strong> {claim.submittedAt}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-gray-800 bg-gray-100 rounded px-3 py-2 shadow-sm">
        {value}
      </p>
    </div>
  );
}
