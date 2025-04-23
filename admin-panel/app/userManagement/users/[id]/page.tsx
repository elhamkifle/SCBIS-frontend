 "use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailsPage() {
  const { id } = useParams();
  interface User {
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
  }
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

    useEffect(() => {
        // Mock data for user
        const mockUser = {
            fullname: "John Doe",
            phoneNumber: "+123456789",
            email: "johndoe@example.com",
            roles: ["Admin", "Editor"],
            isPhoneVerified: true,
            title: "Manager",
            tinNumber: "123456789",
            country: "USA",
            regionOrState: "California",
            city: "Los Angeles",
            subcity: "Downtown",
            zone: "Zone 1",
            woreda: "Woreda 2",
            kebele: "Kebele 3",
            houseNumber: "1234",
        };

        setTimeout(() => {
            setUser(mockUser);
            setLoading(false);
        }, 1000); // Simulate a delay
    }, []);

  if (!user) {
    return <p className="p-8 text-red-600">User not found.</p>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">User Details</h1>

      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <Detail label="Full Name" value={user.fullname} />
          <Detail label="Phone Number" value={user.phoneNumber} />
          <Detail label="Email" value={user.email || "-"} />
          <Detail label="Roles" value={user.roles?.join(", ") || "-"} />
          <Detail label="Phone Verified" value={user.isPhoneVerified ? "Yes" : "No"} />
          <Detail label="Title" value={user.title || "-"} />
          <Detail label="TIN Number" value={user.tinNumber || "-"} />
          <Detail label="Country" value={user.country || "-"} />
          <Detail label="Region / State" value={user.regionOrState || "-"} />
          <Detail label="City" value={user.city || "-"} />
          <Detail label="Subcity" value={user.subcity || "-"} />
          <Detail label="Zone" value={user.zone || "-"} />
          <Detail label="Woreda" value={user.woreda || "-"} />
          <Detail label="Kebele" value={user.kebele || "-"} />
          <Detail label="House Number" value={user.houseNumber || "-"} />
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
