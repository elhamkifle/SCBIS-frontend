"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import Link from "next/link";

const mockUsers = [
  {
    id: "1",
    fullname: "Alice Johnson",
    phoneNumber: "0911123456",
    email: "alice@example.com",
    roles: ["user"],
    isPhoneVerified: true,
    city: "Addis Ababa",
  },
  {
    id: "2",
    fullname: "Bereket Tesfaye",
    phoneNumber: "0911987654",
    email: "bereket@example.com",
    roles: ["admin"],
    isPhoneVerified: false,
    city: "Adama",
  },
];

export default function UserPage() {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const handleView = (user: any) => {
    setSelectedUser(user);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">User Management</h1>

      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-md">
          <Input placeholder="Search by name, phone, or email" className="pl-10" />
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <Button>Search</Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          {mockUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-2"
            >
              <div>
                <p className="font-medium text-gray-800">{user.fullname}</p>
                <p className="text-sm text-gray-600">{user.email || "No email"}</p>
                <p className="text-sm text-gray-600">{user.phoneNumber}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Badge variant={user.isPhoneVerified ? "default" : "outline"}>
                  {user.isPhoneVerified ? "Verified" : "Unverified"}
                </Badge>
                <Button size="sm" onClick={() => handleView(user)}>
                  View
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Full Name:</strong> {selectedUser.fullname}</p>
              <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
              <p><strong>Email:</strong> {selectedUser.email || "N/A"}</p>
              <p><strong>Role:</strong> {selectedUser.roles.join(", ")}</p>
              <p><strong>City:</strong> {selectedUser.city || "N/A"}</p>
              <p><strong>Verified:</strong> {selectedUser.isPhoneVerified ? "Yes" : "No"}</p>
              <DialogFooter className="mt-4">
                <Link href={`/admin/users/${selectedUser.id}`} passHref>
                  <Button variant="secondary">View More</Button>
                </Link>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
