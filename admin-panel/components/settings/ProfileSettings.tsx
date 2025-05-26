import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ProfileSettings({ formData, updateForm, handleImageChange, imagePreview }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        <div className="flex items-center space-x-6">
          <div className="relative h-24 w-24 rounded-full overflow-hidden border shadow group">
            {imagePreview ? (
              <Image src={imagePreview} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 p-1 bg-white rounded-full shadow hover:bg-gray-100 transition"
              title="Edit profile picture"
            >
              <Pencil size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={formData.fullName}
              onChange={(e) => updateForm("fullName", e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={formData.email}
              onChange={(e) => updateForm("email", e.target.value)}
            />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input
              value={formData.phone}
              onChange={(e) => updateForm("phone", e.target.value)}
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={(e) => updateForm("password", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}