"use client";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  console.log(phoneNumber, password);
  const handleLogin = async () => {
    try {
      const API_BASE_URL = "http://localhost:3001";

      const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: phoneNumber, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("user", JSON.stringify(data.user));

          window.location.href = '/'; 
        }

        console.log("Login successful:", data);
        // Redirect to the admin panel or settings page
        // For example: window.location.href = '/admin/settings'; 
        return { success: true, user: data.user };

      } else {
        const errorData = await response.json().catch(() => ({ message: "Login failed. Please check your credentials." }));
        console.error("Login failed:", errorData);
        alert(`Login failed: ${errorData.message || response.statusText}`);
        return { success: false, error: errorData.message || response.statusText };
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      alert("An unexpected error occurred during login. Please try again.");
      return { success: false, error: "An unexpected error occurred." };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 p-4">
      <div className="backdrop-blur-md bg-gray-900/70 text-white p-10 rounded-2xl shadow-[0_0_40px_rgba(0,255,255,0.2)] w-full max-w-md space-y-8 border border-cyan-400/20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-cyan-400 tracking-widest drop-shadow-md">
            ADMIN LOGIN
          </h1>
          <p className="text-sm text-gray-400 mt-2">Secure Access Only</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-300 font-medium">Email</label>
            <div className="flex items-center bg-gray-800 border border-cyan-500 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-400">
              <Mail className="text-cyan-300 mr-2 w-5 h-5" />
              <input
                type="text"
                className="bg-transparent w-full focus:outline-none text-sm placeholder-gray-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="email/phone number"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-300 font-medium">Password</label>
            <div className="flex items-center bg-gray-800 border border-cyan-500 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-400">
              <Lock className="text-cyan-300 mr-2 w-5 h-5" />
              <input
                type="password"
                className="bg-transparent w-full focus:outline-none text-sm placeholder-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            className="w-full mt-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all"
            onClick={handleLogin}
          >
            Log In
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-6">
          Unauthorized access is prohibited. IP logs are monitored.
        </p>
      </div>
    </div>
  );
}
