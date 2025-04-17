import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RequestDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Car Insurance Request Details</h1>
      <Card>
        <CardContent className="space-y-3 p-4">
          <p><strong>Name:</strong> Alice Johnson</p>
          <p><strong>Policy Type:</strong> Car Insurance</p>
          <p><strong>Vehicle Info:</strong></p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Model: Toyota Corolla</li>
            <li>Year: 2020</li>
            <li>License Plate: ABC-1234</li>
          </ul>
          <p><strong>Submitted Documents:</strong></p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Driver's License</li>
            <li>Vehicle Registration</li>
            <li>Inspection Report</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="destructive">Reject</Button>
        <Link href={`/purchaseRequests/${params.id}/premium-calculation`}>
          <Button>Go to Premium Calculation</Button>
        </Link>
      </div>
    </div>
  );
}
