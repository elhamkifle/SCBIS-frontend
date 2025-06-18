"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import SuccessPopup from "@/components/SuccessPopUp";
import { premiumSettingsApi, PremiumSettings } from "../services/api";
import withAuth from "../utils/withAuth";

function CarInsuranceAdminSettings() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<PremiumSettings>({
    baseRates: {
      comprehensive: 5,
      ownDamage: 3,
      thirdParty: 1.5,
    },
    multipliers: {
      commercialVehicle: 1.2,
      underageDriver: 1.15,
      lessThanSixMonthsExperience: 1.1,
      accidentHistory: 1.25,
      claimHistory: 1.2,
    },
    addOns: {
      personalAccident: 500,
      passengerAccident: 800,
      radioCoveragePercent: 1.5,
    },
  });

  // Fetch current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await premiumSettingsApi.getSettings();
        if (response.success && response.data) {
          setSettings(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch premium settings:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch premium settings");
        toast({
          title: "Error",
          description: "Failed to load premium settings. Using default values.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (
    section: "baseRates" | "multipliers" | "addOns",
    key: string,
    value: number
  ) => {
    // Validate input ranges
    let validatedValue = value;
    
    if (section === "baseRates") {
      // Base rates should be between 0.1 and 20
      validatedValue = Math.max(0.1, Math.min(20, value));
    } else if (section === "multipliers") {
      // Multipliers should be between 1.0 and 5.0
      validatedValue = Math.max(1.0, Math.min(5.0, value));
    } else if (section === "addOns") {
      if (key === "personalAccident" || key === "passengerAccident") {
        // Personal and passenger accident should be between 100 and 5000
        validatedValue = Math.max(100, Math.min(5000, value));
      } else if (key === "radioCoveragePercent") {
        // Radio coverage percent should be between 0.1 and 10
        validatedValue = Math.max(0.1, Math.min(10, value));
      }
    }

    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: validatedValue,
      },
    }));
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    try {
      
      const response = await premiumSettingsApi.updateSettings(settings);
      
      if (response.success) {
        setOpen(false);
        setShowSuccess(true);
        
        // Show success toast
        toast({
          title: "✅ Settings Applied Successfully",
          description: response.message || "Premium configuration has been saved and will be applied to new requests.",
        });
        
        // Update local state with response data if provided
        if (response.data) {
          setSettings(response.data);
        }
      } else {
        throw new Error(response.message || "Failed to save settings");
      }
    } catch (err) {
      console.error("Failed to save premium settings:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save premium settings";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <Skeleton className="h-8 w-1/3" />
        
        {/* Base Rates Skeleton */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-1/4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Risk Multipliers Skeleton */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-1/4" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Add-Ons Skeleton */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-1/4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800">Car Policy Premium Setup</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error Loading Settings</p>
              <p className="mt-2">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Car Policy Premium Setup</h1>

      {/* Base Rates */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold text-blue-700">Base Rate (% of vehicle value)</h2>
          {Object.entries(settings.baseRates).map(([key, value]) => (
            <div key={key}>
              <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
              <Input
                type="number"
                value={value}
                step={0.1}
                min={0.1}
                max={20}
                placeholder="0.1 - 20"
                onChange={(e) =>
                  handleChange("baseRates", key, parseFloat(e.target.value) || 0.1)
                }
              />
              <p className="text-xs text-gray-500 mt-1">Range: 0.1% - 20%</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risk Multipliers */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold text-yellow-700">Risk Multipliers</h2>
          {Object.entries(settings.multipliers).map(([key, value]) => (
            <div key={key}>
              <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
              <Input
                type="number"
                value={value}
                step={0.01}
                min={1.0}
                max={5.0}
                placeholder="1.0 - 5.0"
                onChange={(e) =>
                  handleChange("multipliers", key, parseFloat(e.target.value) || 1.0)
                }
              />
              <p className="text-xs text-gray-500 mt-1">Range: 1.0x - 5.0x</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add-Ons */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold text-purple-700">Add-On Charges</h2>
          {Object.entries(settings.addOns).map(([key, value]) => {
            const isPercent = key.toLowerCase().includes("percent");
            const isAccident = key === "personalAccident" || key === "passengerAccident";
            
            return (
              <div key={key}>
                <Label className="capitalize">
                  {key.replace(/([A-Z])/g, " $1")}{" "}
                  {isPercent ? "(%)" : "(Birr)"}
                </Label>
                <Input
                  type="number"
                  value={value}
                  step={0.1}
                  min={isAccident ? 100 : 0.1}
                  max={isAccident ? 5000 : 10}
                  placeholder={isAccident ? "100 - 5000" : "0.1 - 10"}
                  onChange={(e) =>
                    handleChange("addOns", key, parseFloat(e.target.value) || (isAccident ? 100 : 0.1))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {isAccident ? "100 - 5000 Birr" : "0.1% - 10%"}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Save Button with Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex justify-end">
            <Button className="mt-6">Save Settings</Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to save?</DialogTitle>
            <p className="text-sm text-gray-500">
              These premium settings will affect all future policy calculations.
            </p>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                handleConfirmSave();
              }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Confirm and Save"}
            </Button>
            <SuccessPopup
              message="Settings applied successfully!"
              onClose={() => setShowSuccess(false)}
              visible={showSuccess}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuth(CarInsuranceAdminSettings);
