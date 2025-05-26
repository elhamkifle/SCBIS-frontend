'use client';

import { LogIn } from 'lucide-react';
import { useRouter } from "next/navigation"

export default function AccessDenied() {
    const router = useRouter()
  const handleGoToLogin = () => {
    // Use window.location.href instead of router.push to ensure 
    // we fully reload the page and bypass any middleware caching
    // window.location.href = '/';
    router.push('/')
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#0F1D3F] to-[#3E99E7]">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center">
          <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
            <LogIn className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this page. Please log in to continue.
          </p>
          <button
            onClick={handleGoToLogin}
            className="w-full bg-[#1F2168] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
} 