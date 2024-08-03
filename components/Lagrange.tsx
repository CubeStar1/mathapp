"use client";
import React, { useState } from 'react';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2 } from 'lucide-react';

interface DataPoint {
  x: number;
  y: number;
}

const LagrangeInterpolation: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  const [interpolationPoint, setInterpolationPoint] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

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

  const interpolate = () => {
    const x = parseFloat(interpolationPoint);
    if (isNaN(x)) {
      alert('Please enter a valid number for interpolation point');
      return;
    }

    let result = 0;
    for (let i = 0; i < data.length; i++) {
      let term = data[i].y;
      for (let j = 0; j < data.length; j++) {
        if (i !== j) {
          term *= (x - data[j].x) / (data[i].x - data[j].x);
        }
      }
      result += term;
    }

    setResult(result);
  };

  const getInterpolationEquation = (): string => {
    let equation = 'f(x) = ';
    for (let i = 0; i < data.length; i++) {
      if (i > 0) equation += ' + ';
      equation += `${data[i].y.toFixed(2)} * `;
      for (let j = 0; j < data.length; j++) {
        if (i !== j) {
          equation += `((x - ${data[j].x.toFixed(2)}) / (${data[i].x.toFixed(2)} - ${data[j].x.toFixed(2)}))`;
          if (j < data.length - 1 && j + 1 !== i) equation += ' * ';
        }
      }
    }
    return equation;
  };

  return (
    <div className="py-4 max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lagrange Interpolation Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={addRow} className="w-full sm:w-auto">Add Row</Button>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th className="px-4 py-2">X</th>
                  <th className="px-4 py-2">Y</th>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LagrangeInterpolation;