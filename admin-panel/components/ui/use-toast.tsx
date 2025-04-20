"use client";
import * as React from "react";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from "@radix-ui/react-toast";

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport className="fixed top-0 right-0 p-4" />
    </ToastProvider>
  );
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }>>([]);

  const toast = ({ title, description, variant }: { title: string; description?: string; variant?: "default" | "destructive" }) => {
    setToasts((current) => [...current, { id: Date.now().toString(), title, description, variant }]);
  };

  return { toast, Toaster: () => (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant }) => (
        <Toast key={id} className={variant === "destructive" ? "bg-red-500 text-white" : "bg-white text-black"}>
          <ToastTitle>{title}</ToastTitle>
          {description && <ToastDescription>{description}</ToastDescription>}
        </Toast>
      ))}
      <ToastViewport className="fixed top-0 right-0 p-4" />
    </ToastProvider>
  )};
}