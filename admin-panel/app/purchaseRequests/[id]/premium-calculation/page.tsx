"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PremiumCalculationPage({ params }: { params: { id: string } }) {
  const currentYear = new Date().getFullYear();
  const [driverAge, setDriverAge] = useState(30);
  const [carValue, setCarValue] = useState(15000);
  const [year, setYear] = useState(2020);
  const [coverageType, setCoverageType] = useState("comprehensive");

  const carAge = currentYear - year;
  const riskFactor = coverageType === "comprehensive" ? 0.04 : 0.02;
  const depreciationRate = 100;
  const premium = Math.round((carValue * riskFactor) + (carAge * depreciationRate));

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

      <Button className="mt-4">Approve and Confirm</Button>
    </div>
  );
}
