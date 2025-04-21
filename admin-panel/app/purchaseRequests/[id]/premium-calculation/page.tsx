"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PremiumCalculationPage({ params }: { params: { id: string } }) {
  const currentYear = new Date().getFullYear();
  const [driverAge, setDriverAge] = useState(30);
  const [carValue, setCarValue] = useState(15000);
  const [year, setYear] = useState(2020);
  const [coverageType, setCoverageType] = useState("comprehensive");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const carAge = currentYear - year;
  const riskFactor = coverageType === "comprehensive" ? 0.04 : 0.02;
  const depreciationRate = 100;
  const premium = Math.round((carValue * riskFactor) + (carAge * depreciationRate));

  const handleConfirm = async () => {
    setIsConfirming(false);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSuccess(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Car Premium Calculation</h1>
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-2">
            <Label htmlFor="driverAge">Driver Age</Label>
            <Input id="driverAge" type="number" value={driverAge} onChange={(e) => setDriverAge(Number(e.target.value))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="carValue">Car Value ($)</Label>
            <Input id="carValue" type="number" value={carValue} onChange={(e) => setCarValue(Number(e.target.value))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Year of Manufacture</Label>
            <Input id="year" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="coverage">Coverage Type</Label>
            <select
              id="coverage"
              className="border rounded p-2"
              value={coverageType}
              onChange={(e) => setCoverageType(e.target.value)}
            >
              <option value="comprehensive">Comprehensive</option>
              <option value="third-party">Third-Party</option>
            </select>
          </div>
          <div className="text-gray-800">
            <strong>Calculated Premium:</strong> ${premium}
          </div>
        </CardContent>
      </Card>

      <Button className="mt-4" onClick={() => setIsConfirming(true)}>
        Approve and Confirm
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this insurance request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirming(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Operation Successful!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <p className="text-center text-gray-600">
              The insurance request has been successfully approved.
            </p>
            <Button 
              className="w-full" 
              onClick={() => setIsSuccess(false)}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}