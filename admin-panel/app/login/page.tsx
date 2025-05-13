"use client";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with:", email, password);
    // Handle authentication logic here
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
                type="email"
                className="bg-transparent w-full focus:outline-none text-sm placeholder-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
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
