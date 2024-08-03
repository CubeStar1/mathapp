"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NewtonGregoryInterpolation from './NG';
import LagrangeInterpolation from './Lagrange';

const InterpolationCalculator: React.FC = () => {
  const [interpolationMethod, setInterpolationMethod] = useState<'newton-gregory' | 'lagrange'>('newton-gregory');

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Interpolation Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={interpolationMethod} 
            onValueChange={(value) => setInterpolationMethod(value as 'newton-gregory' | 'lagrange')}
          >
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select interpolation method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newton-gregory">Newton-Gregory Interpolation</SelectItem>
              <SelectItem value="lagrange">Lagrange Interpolation</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {interpolationMethod === 'newton-gregory' ? (
        <NewtonGregoryInterpolation />
      ) : (
        <LagrangeInterpolation />
      )}
    </div>
  );
};

export default InterpolationCalculator;