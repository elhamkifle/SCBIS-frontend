"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { saveAs } from "file-saver";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { userApi, UserDetails } from "../../../services/api";

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationAction, setVerificationAction] = useState<'VERIFIED' | 'REJECTED' | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | null>(null);
  const [actionNotes, setActionNotes] = useState("");
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

  const handleVerification = async () => {
    if (!user || !verificationAction) return;
    
    setActionLoading("verify");
    try {
      await userApi.verifyUser(user.id, verificationAction, verificationNotes || undefined);
      // Refresh user data
      const updatedUser = await userApi.getUserDetails(user.id);
      setUser(updatedUser);
      toast.success(`User ${verificationAction.toLowerCase()} successfully`);
      setShowVerificationDialog(false);
      setVerificationNotes("");
      setVerificationAction(null);
    } catch (err) {
      console.error("Failed to verify user:", err);
      toast.error(`Failed to ${verificationAction.toLowerCase()} user: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUserAction = async () => {
    if (!user || !actionType) return;
    
    setActionLoading(actionType);
    try {
      if (actionType === "suspend") {
        await userApi.suspendUser(user.id, actionNotes || undefined);
      } else {
        await userApi.activateUser(user.id, actionNotes || undefined);
      }
      
      // Refresh user data
      const updatedUser = await userApi.getUserDetails(user.id);
      setUser(updatedUser);
      toast.success(`User ${actionType}d successfully`);
      setShowActionDialog(false);
      setActionNotes("");
      setActionType(null);
    } catch (err) {
      console.error(`Failed to ${actionType} user:`, err);
      toast.error(`Failed to ${actionType} user: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setActionLoading(null);
    }
  };

  const openVerificationDialog = (action: 'VERIFIED' | 'REJECTED') => {
    setVerificationAction(action);
    setShowVerificationDialog(true);
  };

  const openActionDialog = (action: 'suspend' | 'activate') => {
    setActionType(action);
    setShowActionDialog(true);
  };

  const viewTransactions = () => {
    router.push(`/userManagement/users/${user?.id}/transactions`);
  };

  const downloadIdDocument = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user?.fullname}_ID_Document_${index + 1}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
- Email Verified: ${user.isEmailVerified ? 'Yes' : 'No'}
- User Verified: ${user.userVerified ? 'Yes' : 'No'}
- Verification Status: ${user.verificationStatus || 'PENDING'}
- Verification Date: ${user.verificationDate ? new Date(user.verificationDate).toLocaleDateString() : 'N/A'}
- Verification Notes: ${user.verificationNotes || 'None'}
- Roles: ${user.roles.join(', ')}
- Status: ${user.status || 'Active'}

Address:
- Country: ${user.country}
- Nationality: ${user.nationality || 'Not provided'}
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
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-800">{user.fullname}</h1>
          <Badge variant={user.verificationStatus === 'VERIFIED' ? 'default' : user.verificationStatus === 'REJECTED' ? 'destructive' : 'secondary'}>
            {user.verificationStatus || 'PENDING'}
          </Badge>
          <Badge variant={user.status === 'Active' ? 'default' : user.status === 'Suspended' ? 'destructive' : 'secondary'}>
            {user.status || 'Active'}
          </Badge>
        </div>
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
          
          {/* Verification buttons - only show for pending users */}
          {user.verificationStatus === 'PENDING' && (
            <>
              <Button 
                onClick={() => openVerificationDialog('VERIFIED')} 
                variant="default"
                disabled={!!actionLoading}
              >
                Verify User
              </Button>
              <Button 
                onClick={() => openVerificationDialog('REJECTED')} 
                variant="destructive"
                disabled={!!actionLoading}
              >
                Reject User
              </Button>
            </>
          )}
          
          {/* Suspend/Activate buttons - conditional based on userVerified and status */}
          {!user.roles.includes('admin') && (
            <>
              {/* Show suspend button if user is verified and active */}
              {user.userVerified && user.status === 'Active' && (
                <Button 
                  onClick={() => openActionDialog('suspend')} 
                  variant="destructive"
                  disabled={!!actionLoading}
                >
                  Suspend User
                </Button>
              )}
              
              {/* Show activate button if user is not verified or not active */}
              {(!user.userVerified || user.status !== 'Active') && (
                <Button 
                  onClick={() => openActionDialog('activate')} 
                  variant="default"
                  disabled={!!actionLoading}
                >
                  Activate User
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Verification Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Verification Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail label="Verification Status" value={user.verificationStatus || 'PENDING'} />
                <Detail label="User Verified" value={user.userVerified ? 'Yes' : 'No'} />
                <Detail label="Verification Date" value={user.verificationDate ? new Date(user.verificationDate).toLocaleDateString() : 'N/A'} />
                <Detail label="Verified By" value={user.verifiedBy || 'N/A'} />
              </div>
              {user.verificationNotes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">Verification Notes:</p>
                  <p className="text-gray-800 bg-gray-100 p-3 rounded-md">{user.verificationNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ID Documents */}
          {user.idDocumentUrls && user.idDocumentUrls.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">ID Documents ({user.idDocumentUrls.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.idDocumentUrls.map((url, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Document {index + 1}</p>
                        <div className="space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadIdDocument(url, index)}
                          >
                            Download
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedImage(url)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                      {url ? (
                        <div className="relative">
                          <img 
                            src={url} 
                            alt={`ID Document ${index + 1}`}
                            className="w-full h-32 object-cover rounded cursor-pointer border"
                            onClick={() => setSelectedImage(url)}
                            onError={(e) => {
                              console.error('Failed to load image:', url);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <div 
                            className="absolute inset-0 bg-gray-200 rounded flex items-center justify-center cursor-pointer"
                            style={{ display: 'none' }}
                            onClick={() => setSelectedImage(url)}
                          >
                            <span className="text-gray-500 text-sm">Image not available</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No document URL</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2 break-all">{url}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Detail label="Full Name" value={user.fullname} />
                <Detail label="Phone Number" value={user.phoneNumber} />
                <Detail label="Email" value={user.email} />
                <Detail label="Roles" value={user.roles.join(", ")} />
                <Detail label="Email Verified" value={user.isEmailVerified ? "Yes" : "No"} />
                <Detail label="Wallet Address" value={user.walletAddress || "Not provided"} />
                <Detail label="Account Created" value={new Date(user.accountCreatedAt).toLocaleDateString()} />
                <Detail label="Last Active" value={new Date(user.lastActive).toLocaleDateString()} />
                <Detail label="TIN Number" value={user.tinNumber || "Not provided"} />
                <Detail label="Title" value={user.title || "Not provided"} />
                <Detail label="Country" value={user.country} />
                <Detail label="Nationality" value={user.nationality || "Not provided"} />
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
          {user.notes && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Admin Notes</h2>
                <p className="text-gray-800 bg-gray-50 p-4 rounded-md border">{user.notes}</p>
              </CardContent>
            </Card>
          )}

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
                            Period: {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${
                          policy.status === 'Active' ? 'bg-green-100 text-green-700' :
                          policy.status === 'Expired' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
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
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      // Show the "No Image" placeholder
                      const parent = target.parentElement;
                      if (parent) {
                        const placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }
                    }}
                  />
                ) : null}
                <div 
                  className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center image-placeholder"
                  style={{ display: user.profileImageUrl ? 'none' : 'flex' }}
                >
                  <span className="text-gray-500 text-lg">No Image</span>
                </div>
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

      {/* Verification Dialog */}
      {showVerificationDialog && (
        <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {verificationAction === 'VERIFIED' ? 'Verify User' : 'Reject User'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to {verificationAction?.toLowerCase()} this user?
              </p>
              <div>
                <Label htmlFor="verification-notes">Notes (Optional)</Label>
                <Textarea
                  id="verification-notes"
                  placeholder="Add any notes about this verification decision..."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowVerificationDialog(false);
                  setVerificationNotes("");
                  setVerificationAction(null);
                }}
                disabled={actionLoading === "verify"}
              >
                Cancel
              </Button>
              <Button 
                variant={verificationAction === 'VERIFIED' ? 'default' : 'destructive'}
                onClick={handleVerification}
                disabled={actionLoading === "verify"}
              >
                {actionLoading === "verify" ? "Processing..." : `${verificationAction === 'VERIFIED' ? 'Verify' : 'Reject'} User`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Action Dialog (Suspend/Activate) */}
      {showActionDialog && (
        <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {actionType === 'suspend' ? 'Suspend User' : 'Activate User'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to {actionType} this user?
              </p>
              <div>
                <Label htmlFor="action-notes">Notes (Optional)</Label>
                <Textarea
                  id="action-notes"
                  placeholder={`Add any notes about this ${actionType} action...`}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowActionDialog(false);
                  setActionNotes("");
                  setActionType(null);
                }}
                disabled={!!actionLoading}
              >
                Cancel
              </Button>
              <Button 
                variant={actionType === 'suspend' ? 'destructive' : 'default'}
                onClick={handleUserAction}
                disabled={!!actionLoading}
              >
                {actionLoading === actionType ? "Processing..." : `${actionType === 'suspend' ? 'Suspend' : 'Activate'} User`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Document Viewer</DialogTitle>
            </DialogHeader>
            <img src={selectedImage} alt="Document" className="w-full h-auto rounded-md" />
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
