"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import SuccessPopup from "@/components/SuccessPopUp"; // adjust the path as needed

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+251912345678",
    password: "",
    language: "English",
    timezone: "GMT+3 (EAT)",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
    }, 1500);
  };

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {/* Profile Settings */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Profile</h2>

          {/* Profile Picture with Edit Button */}
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
            <div>
              <p className="text-gray-700">Click the pencil icon to change your photo</p>
            </div>
          </div>

          {/* Profile Info */}
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

          <Button className="mt-6" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">System Preferences</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Language</Label>
              <Input
                value={formData.language}
                onChange={(e) => updateForm("language", e.target.value)}
              />
            </div>
            <div>
              <Label>Time Zone</Label>
              <Input
                value={formData.timezone}
                onChange={(e) => updateForm("timezone", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Account Management</h2>
          <p className="text-gray-600">
            Deleting your account is irreversible. All associated data will be permanently removed.
          </p>
          <Button variant="destructive">Delete My Account</Button>
        </CardContent>
      </Card>

      {/* Success Popup */}
      <SuccessPopup
        message="Your settings have been saved successfully."
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
