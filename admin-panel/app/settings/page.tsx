"use client";

import ProfileSettings from "@/components/settings/ProfileSettings";
import SystemPreferences from "@/components/settings/SystemPreferences";
import AccountManagement from "@/components/settings/AccountManagement";
import SuccessPopup from "@/components/settings/SuccessPopup";
import { useState, useEffect } from "react";
import withAuth from '../utils/withAuth'; // Adjust path as needed
import { adminApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

// Placeholder for your actual auth data retrieval
// Replace this with your actual implementation (e.g., from context, localStorage)
const getAuthCredentials = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem('accessToken');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    return { accessToken: token, user: userData };
  }
  return { accessToken: null, user: { id: '', fullname: "John Doe", email: "john@example.com", phone: "+251912345678", language: "English", timezone: "GMT+3 (EAT)" } };
};

function SettingsPage() {
  const { logout } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    language: "English",
    timezone: "GMT+3 (EAT)",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const { user, accessToken } = getAuthCredentials(); // Ensure token is still fetched if page needs it
    // The HOC handles redirection, but the page might still need user data if it's already past the HOC check
    console.log(user, accessToken);
    if (accessToken && user && user._id) { 
      console.log('\nuser\n', user);

      setFormData({
        fullname: user.fullname || "Default Full Name",
        email: user.email || "default@example.com",
        phoneNumber: user.phoneNumber || user.phone || "",
        password: "", 
        language: user.language || "English", 
        timezone: user.timezone || "GMT+3 (EAT)",
      });
    } else if (!accessToken) {
      console.log('\naccessToken\n', accessToken);
        // This case should ideally be caught by withAuth HOC and redirected.
        // If it reaches here, it might mean the user was initially authenticated then token removed.
        console.warn("User data or token not found for settings page. Check HOC.");
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { accessToken } = getAuthCredentials();

    if (!accessToken) {
      // This check is somewhat redundant if withAuth works correctly, but good for safety
      alert("Authentication token not found. Please log in again.");
      setIsSaving(false);
      return;
    }
    const payload = {
      fullname: formData.fullname,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password || undefined,
      language: formData.language,
      timezone: formData.timezone,
    };
    console.log('\npayload\n', payload);
    try {
      const updatedUser = await adminApi.updateProfile(payload);

      // --- Update localStorage with the new user data ---
      if (typeof window !== "undefined" && updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("User data in localStorage updated:", updatedUser);

        // Optionally, re-populate formData from the updatedUser to ensure UI consistency
        // This is useful if the backend modifies/formats data (e.g., phone number)
        // or if there are fields in updatedUser not directly in formData but should be reflected.
        setFormData({
          fullname: updatedUser.fullname || "",
          email: updatedUser.email || "",
          phoneNumber: updatedUser.phoneNumber || "",
          password: "", // Clear password field after successful save
          language: updatedUser.language || "English",
          timezone: updatedUser.timezone || "GMT+3 (EAT)",
        });
      }
      // --- End of localStorage update ---

      setShowSuccess(true);
    } catch (error) {
      console.error("Save failed:", error);
      alert(`Error saving settings: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    console.log("User logged out");
    logout(); // Use AuthContext logout which handles redirect
    setShowLogoutConfirm(false);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");

  const handleAccountDeletion = async () => {
    if (confirmationInput.trim().toUpperCase() === "DELETE") {
      const { accessToken } = getAuthCredentials();
      if (!accessToken) {
        alert("Authentication token not found. Please log in again.");
        return;
      }
      setIsSaving(true); 
      try {
        await adminApi.deleteProfile();
        alert("Account deleted successfully.");
        // Use AuthContext logout which handles redirect and cleanup
        logout();
      } catch (error) {
        console.error("Deletion failed:", error);
        alert(`Error deleting account: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        setIsSaving(false); 
        setShowDeleteConfirm(false);
        setConfirmationInput("");
      }
    } else {
      alert("Please type DELETE to confirm.");
    }
  };

  console.log('formData\n', formData);
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

export default withAuth(SettingsPage); // Wrap SettingsPage with withAuth