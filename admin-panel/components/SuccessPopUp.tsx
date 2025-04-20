"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface SuccessPopupProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export default function SuccessPopup({
  message,
  visible,
  onClose,
}: SuccessPopupProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in">
      <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 relative max-w-sm w-full">
        <div className="text-2xl">✅</div>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-green-700 hover:text-green-900 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
