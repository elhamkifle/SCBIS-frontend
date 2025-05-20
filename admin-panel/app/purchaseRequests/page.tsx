import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const mockRequests = [
  { id: "req-001", name: "Alice Johnson", policy: "Car Insurance", submittedAt: "2025-04-15" },
  { id: "req-002", name: "Bob Smith", policy: "Car Insurance", submittedAt: "2025-04-14" },
];

export default function IncomingRequestsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Incoming Purchase Requests</h1>
      <div className="grid gap-4">
        {mockRequests.map((req) => (
          <Card key={req.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h2 className="font-medium text-lg">{req.name}</h2>
                <p className="text-sm text-gray-500">Policy: {req.policy}</p>
                <p className="text-xs text-gray-400">Submitted on: {req.submittedAt}</p>
              </div>
              <Link href={`/purchaseRequests/${req.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}