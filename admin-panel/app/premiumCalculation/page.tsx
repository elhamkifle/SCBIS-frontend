"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

export default function CarInsuranceAdminSettings() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [settings, setSettings] = useState({
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

  const handleChange = (
    section: "baseRates" | "multipliers" | "addOns",
    key: string,
    value: number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleConfirmSave = () => {
    console.log("Saving settings to backend...", settings);
    setOpen(false);

    // Show success toast
    toast({
      title: "✅ Settings Applied Successfully",
      description: "Premium configuration has been saved and will be applied to new requests.",
    });

    // Your API save logic would go here
  };

    const [showSuccess, setShowSuccess] = useState(false);

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
                onChange={(e) =>
                  handleChange("baseRates", key, parseFloat(e.target.value))
                }
              />
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
                onChange={(e) =>
                  handleChange("multipliers", key, parseFloat(e.target.value))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add-Ons */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold text-purple-700">Add-On Charges</h2>
          {Object.entries(settings.addOns).map(([key, value]) => (
            <div key={key}>
              <Label className="capitalize">
                {key.replace(/([A-Z])/g, " $1")}{" "}
                {key.toLowerCase().includes("percent") ? "(%)" : "(Birr)"}
              </Label>
              <Input
                type="number"
                value={value}
                step={0.1}
                onChange={(e) =>
                  handleChange("addOns", key, parseFloat(e.target.value))
                }
              />
            </div>
          ))}
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
            <Button onClick={() => {
              handleConfirmSave();
              setShowSuccess(true);
            }}>
              Confirm and Save
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
