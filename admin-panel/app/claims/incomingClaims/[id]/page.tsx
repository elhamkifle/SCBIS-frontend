"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface Claim {
  id: string;
  claimantName: string;
  dateSubmitted: string;
  policyNumber: string;
  status: string;
  vehicleInfo: string;
  accidentDate: string;
  location: string;
  driverName: string;
  damageImages: string[];
  declaration: boolean;
  statusHistory?: { status: string; note: string; date: string }[];
}

const mockClaims: Claim[] = [
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
    statusHistory: [],
  },
];

export default function ClaimDetailsPage() {
  const { id } = useParams();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [dialogAction, setDialogAction] = useState<string | null>(null);

  useEffect(() => {
    const found = mockClaims.find((c) => c.id === id);
    if (found) setClaim(found);
    setLoading(false);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-700";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Needs More Info":
        return "bg-orange-100 text-orange-700";
      case "Forwarded":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusChange = (newStatus: string, note: string) => {
    if (!claim) return;
    const updatedHistory = [
      ...(claim.statusHistory || []),
      {
        status: newStatus,
        note,
        date: new Date().toISOString(),
      },
    ];
    setClaim({ ...claim, status: newStatus, statusHistory: updatedHistory });
    toast.success(`Claim marked as ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
    );
  }

  if (!claim) {
    return <p className="p-8 text-red-600">Claim not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Claim Details</h1>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{claim.claimantName}</p>
              <p className="text-sm text-gray-500">Submitted on {claim.dateSubmitted}</p>
            </div>
            <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <Detail label="Policy Number" value={claim.policyNumber} />
            <Detail label="Vehicle Info" value={claim.vehicleInfo} />
            <Detail label="Accident Date" value={claim.accidentDate} />
            <Detail label="Location" value={claim.location} />
            <Detail label="Driver Name" value={claim.driverName} />
            <Detail label="Declaration Signed" value={claim.declaration ? "Yes" : "No"} />
          </div>

          <div>
            <p className="font-medium text-sm mb-2">Damage Evidence</p>
            <div className="flex gap-3 overflow-x-auto">
              {claim.damageImages.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt="Damage Photo"
                  width={150}
                  height={150}
                  className="rounded-lg border shadow"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {["Approve", "Reject"].map((action) => (
                <Dialog key={action}>
                  <DialogTrigger asChild>
                    <Button
                      variant={
                        action === "Approve"
                          ? "default"
                          : action === "Reject"
                          ? "destructive"
                          : "outline"
                      }
                      className={
                        action === "Approve"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : ""
                      }
                      onClick={() => setDialogAction(action)}
                    >
                      {action}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add note for {action}</DialogTitle>
                    </DialogHeader>
                    <Textarea
                      placeholder={`Enter note for ${action}`}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          handleStatusChange(action, note);
                          setNote("");
                          setDialogAction(null);
                        }}
                        className={
                          action === "Approve"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : ""
                        }
                      >
                        Confirm {action}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))}
            </div>

            <div className="flex gap-4">
              {["Under Review", "Needs More Info", "Forwarded"].map((action) => {
                let buttonClass = "";
                if (action === "Under Review") {
                  buttonClass = "bg-blue-50 hover:bg-blue-100 text-blue-700";
                } else if (action === "Needs More Info") {
                  buttonClass = "bg-amber-50 hover:bg-amber-100 text-amber-700";
                } else if (action === "Forwarded") {
                  buttonClass = "bg-purple-50 hover:bg-purple-100 text-purple-700";
                }

                return (
                  <Dialog key={action}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className={buttonClass}
                        onClick={() => setDialogAction(action)}
                      >
                        {action}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add note for {action}</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        placeholder={`Enter note for ${action}`}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <DialogFooter>
                        <Button
                          onClick={() => {
                            handleStatusChange(action, note);
                            setNote("");
                            setDialogAction(null);
                          }}
                          className={buttonClass.replace("50", "100")}
                        >
                          Confirm {action}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          </div>

          {claim.statusHistory && claim.statusHistory.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Status History</h2>
              <ul className="space-y-3 text-sm">
                {claim.statusHistory.map((entry, i) => (
                  <li key={i} className="bg-gray-50 p-3 rounded-md border">
                    <div className="flex justify-between">
                      <span className="font-semibold">{entry.status}</span>
                      <span className="text-gray-500">{new Date(entry.date).toLocaleString()}</span>
                    </div>
                    {entry.note && <p className="text-gray-700 mt-1">Note: {entry.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
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