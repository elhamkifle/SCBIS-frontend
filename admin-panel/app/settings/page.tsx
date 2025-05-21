"use client";

import ProfileSettings from "@/components/settings/ProfileSettings";
import SystemPreferences from "@/components/settings/SystemPreferences";
import AccountManagement from "@/components/settings/AccountManagement";
import SuccessPopup from "@/components/settings/SuccessPopup";
import { useState } from "react";

export default function SettingsPage() {
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
    }, 1500);
  };

  const handleLogout = () => {
    console.log("User logged out");
    // Add your logout logic here (e.g., clearing tokens, redirecting to login page)
    setShowLogoutConfirm(false);
  };


  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");

  const handleAccountDeletion = () => {
    if (confirmationInput.trim().toUpperCase() === "DELETE") {
      console.log("Account deleted");
      // Add actual delete logic here
      setShowDeleteConfirm(false);
      setConfirmationInput("");
    } else {
      alert("Please type DELETE to confirm.");
    }
  };


  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      <ProfileSettings
        formData={formData}
        updateForm={updateForm}
        handleImageChange={handleImageChange}
        imagePreview={imagePreview}
      />
      <SystemPreferences formData={formData} updateForm={updateForm} />
      <AccountManagement onDeleteClick={() => setShowDeleteConfirm(true)} />
         {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-xl font-semibold text-red-600">Confirm Account Deletion</h3>
            <p className="text-gray-700">
              This action is irreversible. Type <strong>DELETE</strong> below to confirm.
            </p>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Type DELETE to confirm"
            />
            <div className="flex justify-end space-x-3 pt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmationInput("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                onClick={handleAccountDeletion}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
      <SuccessPopup
        message="Your settings have been saved successfully."
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
      <div className="flex justify-end space-x-4">
        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => setShowLogoutConfirm(true)}
        >
          Log Out
        </button>
      </div>

{showLogoutConfirm && (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Confirm Logout</h3>
      <p className="text-gray-600">Are you sure you want to log out?</p>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
          onClick={() => setShowLogoutConfirm(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}