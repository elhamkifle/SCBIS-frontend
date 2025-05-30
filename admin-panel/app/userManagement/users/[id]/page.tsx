"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { saveAs } from "file-saver";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { userApi, UserDetails } from "../../../services/api";

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch user details from API
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id || typeof id !== 'string') {
        setError("Invalid user ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userData = await userApi.getUserDetails(id);
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch user details");
      } finally {
    setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const suspendUser = async () => {
    if (!user) return;
    
    setActionLoading("suspend");
    try {
      await userApi.suspendUser(user.id);
      // Refresh user data
      const updatedUser = await userApi.getUserDetails(user.id);
      setUser(updatedUser);
      alert(`User ${user.fullname} has been suspended.`);
    } catch (err) {
      console.error("Failed to suspend user:", err);
      alert(`Failed to suspend user: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setActionLoading(null);
    }
  };

  const activateUser = async () => {
    if (!user) return;
    
    setActionLoading("activate");
    try {
      await userApi.activateUser(user.id);
      // Refresh user data
      const updatedUser = await userApi.getUserDetails(user.id);
      setUser(updatedUser);
      alert(`User ${user.fullname} has been activated.`);
    } catch (err) {
      console.error("Failed to activate user:", err);
      alert(`Failed to activate user: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setActionLoading(null);
    }
  };

  const viewTransactions = () => {
    router.push(`/userManagement/users/${user?.id}/transactions`);
  };

  const downloadReport = () => {
    if (!user) return;
    
    const content = `
User Report
===========

Basic Information:
- Full Name: ${user.fullname}
- Email: ${user.email}
- Phone: ${user.phoneNumber}
- Phone Verified: ${user.isPhoneVerified ? 'Yes' : 'No'}
- Roles: ${user.roles.join(', ')}

Address:
- Country: ${user.country}
- Region/State: ${user.regionOrState}
- City: ${user.city}
- Subcity: ${user.subcity}
- Zone: ${user.zone}
- Woreda: ${user.woreda}
- Kebele: ${user.kebele}
- House Number: ${user.houseNumber}

Additional Information:
- Title: ${user.title}
- TIN Number: ${user.tinNumber}
- Wallet Address: ${user.walletAddress}
- Account Created: ${user.accountCreatedAt}
- Last Active: ${user.lastActive}

Statistics:
- Total Policies: ${user.policies.length}
- Active Policies: ${user.policies.filter(p => p.status === 'Active').length}
- Total Claims: ${user.claims.length}
- Pending Claims: ${user.claims.filter(c => c.status === 'Pending').length}

Notes:
${user.notes || 'No notes available'}

Policies:
${user.policies.map(p => `- ${p.type} (${p.status}) - ${p.startDate} to ${p.endDate}`).join('\n')}

Claims:
${user.claims.map(c => `- ${c.type} (${c.status}) - Submitted: ${c.submittedAt}`).join('\n')}
    `;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${user.fullname.replace(/ /g, "_")}_report.txt`);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/4 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error Loading User</p>
              <p className="mt-2">{error}</p>
              <Button 
                onClick={() => router.back()} 
                className="mt-4"
                variant="outline"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-600">
              <p className="text-lg font-semibold">User Not Found</p>
              <Button 
                onClick={() => router.back()} 
                className="mt-4"
                variant="outline"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{user.fullname}</h1>
        <div className="space-x-2">
          <Button onClick={() => router.back()} variant="outline">
            Back to Users
          </Button>
          <Button onClick={viewTransactions} variant="outline">
            View Transactions
          </Button>
          <Button onClick={downloadReport} variant="outline">
            Download Report
          </Button>
          {user.roles.includes('admin') ? null : (
            <>
              {user.status === 'Active' ? (
                <Button 
                  onClick={suspendUser} 
                  variant="destructive"
                  disabled={actionLoading === "suspend"}
                >
                  {actionLoading === "suspend" ? "Suspending..." : "Suspend User"}
                </Button>
              ) : (
                <Button 
                  onClick={activateUser} 
                  variant="default"
                  disabled={actionLoading === "activate"}
                >
                  {actionLoading === "activate" ? "Activating..." : "Activate User"}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
      <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Detail label="Full Name" value={user.fullname} />
            <Detail label="Phone Number" value={user.phoneNumber} />
            <Detail label="Email" value={user.email} />
            <Detail label="Roles" value={user.roles.join(", ")} />
            <Detail label="Phone Verified" value={user.isPhoneVerified ? "Yes" : "No"} />
                <Detail label="Wallet Address" value={user.walletAddress || "Not provided"} />
                <Detail label="Account Created" value={new Date(user.accountCreatedAt).toLocaleDateString()} />
                <Detail label="Last Active" value={new Date(user.lastActive).toLocaleDateString()} />
                <Detail label="TIN Number" value={user.tinNumber || "Not provided"} />
                <Detail label="Title" value={user.title || "Not provided"} />
            <Detail label="Country" value={user.country} />
                <Detail label="Region / State" value={user.regionOrState || "Not provided"} />
            <Detail label="City" value={user.city} />
            <Detail label="Subcity" value={user.subcity} />
            <Detail label="Zone" value={user.zone} />
                <Detail label="Woreda" value={user.woreda || "Not provided"} />
            <Detail label="Kebele" value={user.kebele} />
                <Detail label="House Number" value={user.houseNumber || "Not provided"} />
          </div>
        </CardContent>
      </Card>

          {/* Notes */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="text-xl font-semibold mb-2">Notes / Flags</h2>
          <p className="text-gray-700 bg-gray-100 p-3 rounded-md shadow-sm whitespace-pre-line">
                {user.notes || "No notes available for this user."}
          </p>
        </CardContent>
      </Card>

          {/* Policies */}
      <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Policies ({user.policies.length})</h2>
              {user.policies.length === 0 ? (
                <p className="text-gray-500">No policies found.</p>
              ) : (
                <div className="space-y-3">
                  {user.policies.map((policy) => (
                    <div key={policy.id} className="border p-3 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{policy.type}</p>
                          <p className="text-sm text-gray-600">ID: {policy.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${
                          policy.status === 'Active' ? 'bg-green-100 text-green-700' :
                          policy.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {policy.status}
                        </span>
                      </div>
        </div>
          ))}
                </div>
          )}
        </CardContent>
      </Card>

          {/* Claims */}
      <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Claims ({user.claims.length})</h2>
              {user.claims.length === 0 ? (
                <p className="text-gray-500">No claims found.</p>
              ) : (
                <div className="space-y-3">
          {user.claims.map((claim) => (
                    <div key={claim.id} className="border p-3 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{claim.type}</p>
                          <p className="text-sm text-gray-600">ID: {claim.id}</p>
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(claim.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${
                          claim.status === 'Closed' ? 'bg-green-100 text-green-700' :
                          claim.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
            </div>
          ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Image */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                {user.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-32 h-32 mx-auto rounded-full object-cover cursor-pointer border-4 border-gray-200"
                    onClick={() => setSelectedImage(user.profileImageUrl)}
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">No Image</span>
                  </div>
                )}
                <p className="text-sm text-gray-600">Profile Picture</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Policies:</span>
                  <span className="font-medium">{user.policies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Policies:</span>
                  <span className="font-medium">{user.policies.filter(p => p.status === 'Active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Claims:</span>
                  <span className="font-medium">{user.claims.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Claims:</span>
                  <span className="font-medium">{user.claims.filter(c => c.status === 'Pending').length}</span>
                </div>
              </div>
        </CardContent>
      </Card>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Profile Picture</DialogTitle>
            </DialogHeader>
            <img src={selectedImage} alt="Profile" className="w-full h-auto rounded-md" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Helper component for displaying details
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-600 font-medium">{label}:</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}
