"use client";

import React, { useState, useMemo } from 'react';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from 'lucide-react';

interface DataPoint {
  x: number;
  y: number;
}

const NewtonGregoryInterpolation: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  const [interpolationPoint, setInterpolationPoint] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [method, setMethod] = useState<'forward' | 'backward'>('forward');

  const addRow = () => {
    setData([...data, { x: data.length, y: 0 }]);
  };

  const removeRow = (index: number) => {
    if (data.length > 2) {
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
    }
  };

  const updateData = (index: number, field: 'x' | 'y', value: string) => {
    const newData = [...data];
    newData[index][field] = parseFloat(value) || 0;
    setData(newData);
  };

  const calculateDifferences = (data: DataPoint[]): number[][] => {
    const differences: number[][] = [];
    for (let i = 0; i < data.length; i++) {
      differences[i] = [];
      for (let j = 0; j < data.length - i - 1; j++) {
        if (i === 0) {
          differences[i][j] = data[j + 1].y - data[j].y;
        } else {
          differences[i][j] = differences[i - 1][j + 1] - differences[i - 1][j];
        }
      }
    }
    return differences;
  };

  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  const interpolate = () => {
    const x = parseFloat(interpolationPoint);
    if (isNaN(x)) {
      alert('Please enter a valid number for interpolation point');
      return;
    }
    const differences = calculateDifferences(data);
    const h = data[1].x - data[0].x;
    let result = data[0].y;
    let u = (x - data[0].x) / h;

    if (method === 'forward') {
      for (let i = 1; i < data.length; i++) {
        let term = differences[i - 1][0];
        for (let j = 0; j < i; j++) {
          term *= (u - j);
        }
        term /= factorial(i);
        result += term;
      }
    } else {
      u = (x - data[data.length - 1].x) / h;
      result = data[data.length - 1].y;
      for (let i = 1; i < data.length; i++) {
        let term = differences[i - 1][data.length - i - 1];
        for (let j = 0; j < i; j++) {
          term *= (u + j);
        }
        term /= factorial(i);
        result += term;
      }
    }

    setResult(result);
  };

  const differences = useMemo(() => calculateDifferences(data), [data]);

  const getInterpolationEquation = (): string => {
    if (method === 'forward') {
      let equation = `f(x) = ${data[0].y.toFixed(2)}`;
      for (let i = 1; i < data.length; i++) {
        const sign = differences[i - 1][0] >= 0 ? '+' : '-';
        equation += ` ${sign} ${Math.abs(differences[i - 1][0]).toFixed(2)}`;
        for (let j = 0; j < i; j++) {
          equation += `(u${j === 0 ? '' : ` - ${j}`})`;
        }
        equation += ` / ${factorial(i)}`;
      }
      return equation;
    } else {
      let equation = `f(x) = ${data[data.length - 1].y.toFixed(2)}`;
      for (let i = 1; i < data.length; i++) {
        const sign = differences[i - 1][data.length - i - 1] >= 0 ? '+' : '-';
        equation += ` ${sign} ${Math.abs(differences[i - 1][data.length - i - 1]).toFixed(2)}`;
        for (let j = 0; j < i; j++) {
          equation += `(u${j === 0 ? '' : ` + ${j}`})`;
        }
        equation += ` / ${factorial(i)}`;
      }
      return equation;
    }
  };

  return (
    <div className="py-4 max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Newton-Gregory Interpolation Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button onClick={addRow} className="w-full sm:w-auto">Add Row</Button>
            <Select value={method} onValueChange={(value) => setMethod(value as 'forward' | 'backward')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forward">Forward Interpolation</SelectItem>
                <SelectItem value="backward">Backward Interpolation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th className="px-4 py-2">X</th>
                  <th className="px-4 py-2">Y</th>
                  {differences[0] && differences[0].map((_, index) => (
                    <th key={index} className="px-4 py-2">Δ^{index + 1}y</th>
                  ))}
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={row.x}
                        onChange={(e) => updateData(rowIndex, 'x', e.target.value)}
                        className="w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={row.y}
                        onChange={(e) => updateData(rowIndex, 'y', e.target.value)}
                        className="w-full"
                      />
                    </td>
                    {differences.map((diff, diffIndex) => (
                      <td key={diffIndex} className="px-4 py-2">{diff[rowIndex]?.toFixed(4) || ''}</td>
                    ))}
                    <td className="px-4 py-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeRow(rowIndex)}
                        disabled={data.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Input
              type="number"
              value={interpolationPoint}
              onChange={(e) => setInterpolationPoint(e.target.value)}
              placeholder="Enter interpolation point"
              className="w-full sm:w-auto"
            />
            <Button onClick={interpolate} className="w-full sm:w-auto">Interpolate</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result !== null && (
            <Alert>
              <AlertDescription className="text-lg">
                Interpolated value: {result.toFixed(4)}
              </AlertDescription>
            </Alert>
          )}
          <div>
            <h3 className="text-lg font-semibold mb-2">Interpolation Equation:</h3>
            <p className="text-sm p-4 rounded-md border border-border overflow-x-auto whitespace-nowrap">
              {getInterpolationEquation()}
            </p>
            <p className="text-xs mt-2 italic">
              Where u = (x - x₀) / h for forward, or u = (x - xₙ) / h for backward interpolation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewtonGregoryInterpolation;