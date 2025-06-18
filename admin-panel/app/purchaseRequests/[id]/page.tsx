"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { purchaseRequestsApi, PurchaseRequest } from "../../services/api";
import { usePurchaseRequestsSocket } from "../../services/socket";
import withAuth from "../../utils/withAuth";
import PurchaseRequestNotifications from "../../components/notifications/PurchaseRequestNotifications";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwrap the params Promise
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reuploadOpen, setReuploadOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [isRequestingReupload, setIsRequestingReupload] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // API integration states
  const [requestData, setRequestData] = useState<PurchaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const socket = usePurchaseRequestsSocket();

  // Helper function to get status value
  const getStatusValue = (status: string | { value: string }): string => {
    if (typeof status === 'string') {
      return status;
    }
    return status.value || 'pending';
  };

  // Fetch request details - separate from socket logic
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await purchaseRequestsApi.getById(id);
        setRequestData(data);
      } catch (err) {
        console.error("Failed to fetch request details:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch request details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRequestDetails();
    }
  }, [id]); // Only depend on id

  // Socket connection setup - separate useEffect
  useEffect(() => {
    if (!id) return;

    let cleanupFunctions: (() => void)[] = [];

    const setupSocketListeners = async () => {
      try {
        await socket.connect();
        setSocketConnected(true);

        // Listen for status changes for this specific request
        const unsubscribeStatusChange = socket.on('purchase-request-status-changed', (data) => {
          if (data.data.id === id) {
            setRequestData(prev => prev ? { ...prev, status: data.data.newStatus } : null);

            toast({
              title: "Status Updated",
              description: `Request status changed to ${data.data.newStatus}`,
              variant: data.data.newStatus === 'approved' ? 'default' : 'destructive',
            });
          }
        });

        // Listen for approvals
        const unsubscribeApproved = socket.on('purchase-request-approved', (data) => {
          if (data.data.id === id) {
            setRequestData(prev => prev ? { ...prev, status: 'approved' } : null);

            toast({
              title: "Request Approved",
              description: `This request has been approved by ${data.data.approvedBy}`,
            });
          }
        });

        // Listen for rejections
        const unsubscribeRejected = socket.on('purchase-request-rejected', (data) => {
          if (data.data.id === id) {
            setRequestData(prev => prev ? { ...prev, status: 'rejected' } : null);

            toast({
              title: "Request Rejected",
              description: `This request has been rejected: ${data.data.reason}`,
              variant: "destructive",
            });
          }
        });

        // Listen for reupload requests
        const unsubscribeReuploadRequested = socket.on('purchase-request-reupload-requested', (data) => {
          
          if (data.data.id === id) {

            toast({
              title: "File Reupload Requested",
              description: `${data.message} - Files: ${data.data.files}${data.data.reason ? ` (${data.data.reason})` : ''}`,
            });
          } else {
            
          }
        });

        // Store cleanup functions
        cleanupFunctions = [unsubscribeStatusChange, unsubscribeApproved, unsubscribeRejected, unsubscribeReuploadRequested];
        
      } catch (error) {
        console.error('❌ Failed to setup Socket.IO listeners:', error);
        setSocketConnected(false);
      }
    };

    setupSocketListeners();

    // Cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [id, socket, toast]); // Include socket and toast in dependencies but they shouldn't change often

  const handleReject = async () => {
    if (!requestData) return;

    setIsRejecting(true);
    try {
      await purchaseRequestsApi.reject(requestData.id, rejectionReason);

      toast({
        title: "Request Rejected",
        description: `Request #${requestData.id} has been rejected. Reason: ${rejectionReason}`,
        variant: "destructive",
      });

      // Update local state immediately for better UX
      setRequestData(prev => prev ? { ...prev, status: 'rejected' } : null);

      setIsRejecting(false);
      setRejectOpen(false);
      setRejectionReason("");
      setIsSuccess(true);
    } catch (err) {
      console.error("Failed to reject request:", err);
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive",
      });
      setIsRejecting(false);
    }
  };

  const handleRequestReupload = async () => {
    if (!requestData || !selectedFile) return;

    setIsRequestingReupload(true);
    try {
      // Map selected file to array of files for the API
      let filesToReupload: string[] = [];
      if (selectedFile === "Vehicle Libre") {
        filesToReupload = ["vehicleLibre"];
      } else if (selectedFile === "Driver&rsquo;s License") {
        filesToReupload = ["driversLicense"];
      } else if (selectedFile === "Both Vehicle Libre and License") {
        filesToReupload = ["vehicleLibre", "driversLicense"];
      }

      // Call the actual API endpoint
      await purchaseRequestsApi.requestReupload(
        requestData._id || requestData.id, 
        filesToReupload,
        selectedFile // Send the exact selected text as reason
      );

      toast({
        title: "Reupload Requested",
        description: selectedFile === "Both Vehicle Libre and License"
          ? `Requested reupload of both Vehicle Libre and Driver&rsquo;s License for request #${requestData.policyId || requestData.id}`
          : `Requested reupload of ${selectedFile} for request #${requestData.policyId || requestData.id}`,
      });

      setIsRequestingReupload(false);
      setReuploadOpen(false);
      setSelectedFile("");
      setIsSuccess(true);
    } catch (err) {
      console.error("❌ Failed to request reupload:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to request document reupload. Please try again.",
        variant: "destructive",
      });
      setIsRequestingReupload(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-48" />

        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <div className="grid md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800">Request Details</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error Loading Request</p>
              <p className="mt-2">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!requestData) {
    return (
      <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800">Request Not Found</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">The requested purchase request could not be found.</p>
            <Link href="/purchaseRequests">
              <Button className="mt-4" variant="outline">
                Back to Requests
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Car Insurance Request Details</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            Socket: {socketConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      <p>Request ID: {requestData.id}</p>

      {/* Policy Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-blue-50 p-2 rounded-md font-semibold text-blue-800">Policy Information</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Policy Type:</strong> {requestData.policyType || "N/A"}</p>
            <p><strong>Duration:</strong> {requestData.duration ? `${requestData.duration} Days` : "N/A"}</p>
            <p><strong>Coverage Area:</strong> {requestData.coverageArea || "N/A"}</p>
            <p><strong>Premium:</strong> {requestData.premium ? `${requestData.premium.toLocaleString()} Birr` : "N/A"}</p>
            <p><strong>Status:</strong>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusValue(requestData.status) === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                getStatusValue(requestData.status) === 'approved' ? 'bg-green-100 text-green-700' :
                  getStatusValue(requestData.status) === 'canceled' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                }`}>
                {getStatusValue(requestData.status)?.charAt(0).toUpperCase() + getStatusValue(requestData.status)?.slice(1) || "Unknown"}
              </span>
            </p>
            <p><strong>Submitted On:</strong> {requestData.submittedOn ? new Date(requestData.submittedOn).toLocaleDateString() : "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* User Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-purple-50 p-2 rounded-md font-semibold text-purple-800">Personal Information</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Full Name:</strong> {requestData.user?.fullname || "Unknown User"}</p>
            <p><strong>Email:</strong> {requestData.user?.email || "Not provided"}</p>
            <p><strong>Phone Number:</strong> {requestData.user?.phoneNumber || "Not provided"}</p>
            <p><strong>User ID:</strong> {requestData.userId || requestData.user?.id || "N/A"}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Identity Documents</h3>
            {requestData.user?.idDocumentUrls && requestData.user.idDocumentUrls.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {requestData.user.idDocumentUrls.map((url: string, index: number) => (
                  <div
                    key={index}
                    className="border rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedImage(url)}
                  >
                    <div className="relative h-32 w-full">
                      <Image
                        src={url}
                        alt={`Identity Document ${index + 1}`}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/docs/id.png';
                        }}
                      />
                    </div>
                    <p className="text-center mt-2 text-sm">Identity Document {index + 1}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* Default document placeholders */}
                <div className="border rounded-lg p-2">
                  <div className="relative h-32 w-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded">
                    <div className="text-center text-gray-400">
                      <svg width="24" height="24" viewBox="0 0 48 48" fill="none" className="mx-auto mb-1">
                        <path d="M12 16L16 12H32L36 16V36H12V16Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M20 24L24 28L32 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                      <p className="text-xs">ID Document</p>
                    </div>
                  </div>
                  <p className="text-center mt-2 text-sm text-gray-500">Identity Document</p>
                </div>
                <div className="border rounded-lg p-2">
                  <div className="relative h-32 w-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded">
                    <div className="text-center text-gray-400">
                      <svg width="24" height="24" viewBox="0 0 48 48" fill="none" className="mx-auto mb-1">
                        <path d="M12 16L16 12H32L36 16V36H12V16Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M20 24L24 28L32 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                      <p className="text-xs">Additional Doc</p>
                    </div>
                  </div>
                  <p className="text-center mt-2 text-sm text-gray-500">Additional Document</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Info */}
      {requestData.vehicle && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="bg-green-50 p-2 rounded-md font-semibold text-green-800">Vehicle Details</div>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <p><strong>Vehicle Type:</strong> {requestData.vehicle.vehicleType || "N/A"}</p>
              <p><strong>Category:</strong> {requestData.vehicle.privateVehicle?.vehicleCategory || "N/A"}</p>
              <p><strong>Make:</strong> {requestData.vehicle.privateVehicle?.generalDetails?.make || "N/A"}</p>
              <p><strong>Model:</strong> {requestData.vehicle.privateVehicle?.generalDetails?.model || "N/A"}</p>
              <p><strong>Manufacturing Year:</strong> {requestData.vehicle.privateVehicle?.generalDetails?.manufacturingYear || "N/A"}</p>
              <p><strong>Engine Capacity:</strong> {requestData.vehicle.privateVehicle?.generalDetails?.engineCapacity ? `${requestData.vehicle.privateVehicle.generalDetails.engineCapacity} CC` : "N/A"}</p>
              <p><strong>Plate Number:</strong> {requestData.vehicle.privateVehicle?.generalDetails?.plateNumber || "N/A"}</p>
              <p><strong>Chassis Number:</strong> {requestData.vehicle.privateVehicle?.generalDetails?.chassisNumber || "N/A"}</p>
              <p><strong>Body Type:</strong> {requestData.vehicle.privateVehicle?.generalDetails?.bodyType || "N/A"}</p>
              <p><strong>Engine Number:</strong> {requestData.vehicle.privateVehicle?.generalDetails?.engineNumber || "N/A"}</p>
              <p><strong>Purchased Value:</strong> {requestData.vehicle.privateVehicle?.ownershipUsage?.purchasedValue ? `${requestData.vehicle.privateVehicle.ownershipUsage.purchasedValue.toLocaleString()} Birr` : "N/A"}</p>
              <p><strong>Duty Free:</strong> {requestData.vehicle.privateVehicle?.ownershipUsage?.dutyFree ? "Yes" : "No"}</p>
              <p><strong>Usage Type:</strong> {requestData.vehicle.privateVehicle?.usageType?.join(", ") || "N/A"}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Vehicle Documents</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Driver's License */}
                <div
                  className="border rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedImage(
                    requestData.vehicle?.privateVehicle?.documents?.driversLicense || null
                  )}
                >
                  <div className="relative h-32 w-full">
                    {requestData.vehicle?.privateVehicle?.documents?.driversLicense ? (
                      <Image
                        src={requestData.vehicle.privateVehicle.documents.driversLicense}
                        alt="Driver License"
                        fill
                        className="object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/docs/id.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded">
                        <div className="text-center text-gray-400">
                          <svg width="24" height="24" viewBox="0 0 48 48" fill="none" className="mx-auto mb-1">
                            <path d="M12 16L16 12H32L36 16V36H12V16Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M20 24L24 28L32 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                          </svg>
                          <p className="text-xs">No Image</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-center mt-2 text-sm">Driver License</p>
                  {!requestData.vehicle?.privateVehicle?.documents?.driversLicense && (
                    <p className="text-center text-xs text-gray-500">No image uploaded</p>
                  )}
                </div>

                {/* Vehicle Libre */}
                <div
                  className="border rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedImage(
                    requestData.vehicle?.privateVehicle?.documents?.vehicleLibre || null
                  )}
                >
                  <div className="relative h-32 w-full">
                    {requestData.vehicle?.privateVehicle?.documents?.vehicleLibre ? (
                      <Image
                        src={requestData.vehicle.privateVehicle.documents.vehicleLibre}
                        alt="Vehicle Libre"
                        fill
                        className="object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/docs/libre.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded">
                        <div className="text-center text-gray-400">
                          <svg width="24" height="24" viewBox="0 0 48 48" fill="none" className="mx-auto mb-1">
                            <path d="M12 16L16 12H32L36 16V36H12V16Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M20 24L24 28L32 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                          </svg>
                          <p className="text-xs">No Image</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-center mt-2 text-sm">Vehicle Libre</p>
                  {!requestData.vehicle?.privateVehicle?.documents?.vehicleLibre && (
                    <p className="text-center text-xs text-gray-500">No image uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ownership & Usage */}
      {requestData.vehicle?.privateVehicle?.ownershipUsage && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="bg-yellow-50 p-2 rounded-md font-semibold text-yellow-800">Ownership & Usage</div>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <p><strong>Owner Type:</strong> {requestData.vehicle.privateVehicle.ownershipUsage.ownerType || "N/A"}</p>
              <p><strong>Driver Type:</strong> {requestData.vehicle.privateVehicle.ownershipUsage.driverType || "N/A"}</p>
              <p><strong>Seating Capacity:</strong> {requestData.vehicle.privateVehicle.ownershipUsage.seatingCapacity || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Driver Info - Using placeholder data since not provided in API */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="bg-orange-50 p-2 rounded-md font-semibold text-orange-800">Driver Information</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>License Grade:</strong> N/A</p>
            <p><strong>Experience:</strong> N/A</p>
            <p><strong>Under 21:</strong> N/A</p>
            <p><strong>Infirmity:</strong> N/A</p>
            <p><strong>Less than 6 Months Exp.:</strong> N/A</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end">
        <Button
          variant="destructive"
          onClick={() => setRejectOpen(true)}
          disabled={getStatusValue(requestData.status) !== 'pending'}
        >
          Reject Request
        </Button>
        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
          onClick={() => setReuploadOpen(true)}
          disabled={getStatusValue(requestData.status) !== 'pending'}
        >
          Request File Reuploads
        </Button>
        <Link href={`/purchaseRequests/${requestData.id}/premium-calculation`}>
          <Button disabled={getStatusValue(requestData.status) !== 'pending'}>
            Approve & Calculate Premium
          </Button>
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

      {/* Reupload Request Modal */}
      <Dialog open={reuploadOpen} onOpenChange={setReuploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Document Reuploads</DialogTitle>
            <DialogDescription>
              Please select which files need to be reuploaded by the user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Select onValueChange={(value) => setSelectedFile(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Which file should be reuploaded?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vehicle Libre">Vehicle Libre</SelectItem>
                <SelectItem value="Driver&rsquo;s License">Driver&rsquo;s License</SelectItem>
                <SelectItem value="Both Vehicle Libre and License">Both Vehicle Libre and License</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReuploadOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={handleRequestReupload}
              disabled={!selectedFile || isRequestingReupload}
            >
              {isRequestingReupload ? "Requesting..." : "Request Document Reuploads"}
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
              The operation was completed successfully.
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

      {/* Real-time notifications */}
      <PurchaseRequestNotifications />
    </div>
  );
}

export default withAuth(RequestDetailsPage);