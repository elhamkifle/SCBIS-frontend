"use client";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { authApi } from "../services/api";

export default function AdminLogin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const data = await authApi.login({
        identifier: phoneNumber,
        password
      });

      // Use the auth context login method
      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user
      });

      // Check for redirect URL in multiple places
      let redirectUrl = '/';
      
      // 1. Check URL search params first
      const urlParams = new URLSearchParams(window.location.search);
      const urlRedirect = urlParams.get('redirect');
      
      // 2. Check localStorage for stored redirect
      const storedRedirect = localStorage.getItem('redirectAfterLogin');
      
      // Use URL param if available, otherwise use stored redirect, otherwise default to home
      if (urlRedirect) {
        redirectUrl = urlRedirect;
      } else if (storedRedirect) {
        redirectUrl = storedRedirect;
        // Clear the stored redirect after using it
        localStorage.removeItem('redirectAfterLogin');
      }
      
      // Ensure we're not redirecting to login page itself
      if (redirectUrl === '/login') {
        redirectUrl = '/';
      }
      
      router.push(redirectUrl);
      
      return { success: true, user: data.user };

    } catch (error) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
            <p className="text-gray-600">SCBIS Insurance Management</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Phone Number or Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number or email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              For admin access only. Contact system administrator for credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}