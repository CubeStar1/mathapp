"use client";

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from 'lucide-react';
import TeX from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';

interface DataPoint {
  x: number;
  y: number;
}

const NewtonGregoryInterpolation: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  const [interpolationPoint, setInterpolationPoint] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [method, setMethod] = useState<'forward' | 'backward'>('forward');
  const [showDetailedResult, setShowDetailedResult] = useState<boolean>(false);

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
    setShowDetailedResult(true);
  };

  const differences = useMemo(() => calculateDifferences(data), [data]);

  const getInterpolationEquation = (): string => {
    if (method === 'forward') {
      let equation = `f(x) = ${data[0].y.toFixed(2)}`;
      for (let i = 1; i < data.length; i++) {
        const sign = differences[i - 1][0] >= 0 ? '+' : '-';
        equation += ` ${sign} \\frac{${Math.abs(differences[i - 1][0]).toFixed(2)}`;
        for (let j = 0; j < i; j++) {
          equation += `(u${j === 0 ? '' : `-${j}`})`;
        }
        equation += `}{${factorial(i)}}`;
      }
      return equation;
    } else {
      let equation = `f(x) = ${data[data.length - 1].y.toFixed(2)}`;
      for (let i = 1; i < data.length; i++) {
        const sign = differences[i - 1][data.length - i - 1] >= 0 ? '+' : '-';
        equation += ` ${sign} \\frac{${Math.abs(differences[i - 1][data.length - i - 1]).toFixed(2)}`;
        for (let j = 0; j < i; j++) {
          equation += `(u${j === 0 ? '' : `+${j}`})`;
        }
        equation += `}{${factorial(i)}}`;
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
            <Input
              type="number"
              value={interpolationPoint}
              onChange={(e) => setInterpolationPoint(e.target.value)}
              placeholder="Enter interpolation point"
              className="w-full sm:w-full"
            />
            <Button onClick={interpolate} className="w-full sm:w-auto">Interpolate</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>X</TableHead>
                  <TableHead>Y</TableHead>
                  {/* {differences[0] && differences[0].map((_, index) => (
                    <TableHead key={index}>Δ^{index + 1}y</TableHead>
                  ))} */}
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>
                      <Input
                        type="number"
                        
                        onChange={(e) => updateData(rowIndex, 'x', e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        
                        onChange={(e) => updateData(rowIndex, 'y', e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                    {/* {differences.map((diff, diffIndex) => (
                      <TableCell key={diffIndex}>{diff[rowIndex]?.toFixed(4) || ''}</TableCell>
                    ))} */}
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeRow(rowIndex)}
                        disabled={data.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {showDetailedResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Detailed Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Input Data:</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>x</TableHead>
                  <TableHead>f(x)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((point, index) => (
                  <TableRow key={index}>
                    <TableCell>{point.x}</TableCell>
                    <TableCell>{point.y}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <h3 className="text-lg font-semibold mt-4 mb-2">Newton's {method.charAt(0).toUpperCase() + method.slice(1)} Difference Table:</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>x</TableHead>
                  <TableHead>y</TableHead>
                  {differences.map((_, index) => (
                    <TableHead key={index}>
                      <TeX math={`\\Delta^${index + 1}y`} />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((point, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{point.x}</TableCell>
                    <TableCell>{point.y}</TableCell>
                    {differences.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {column[rowIndex] !== undefined ? column[rowIndex].toFixed(2) : ''}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 space-y-2">
              <p>The value of x at which you want to find f(x): x = {interpolationPoint}</p>
              <p>
                <TeX math={`h = x_1 - x_0 = ${data[1].x} - ${data[0].x} = ${data[1].x - data[0].x}`} />
              </p>
              <p>
                <TeX math={`p = \\frac{x - x_0}{h} = \\frac{${interpolationPoint} - ${data[0].x}}{${data[1].x - data[0].x}} = ${((parseFloat(interpolationPoint) - data[0].x) / (data[1].x - data[0].x)).toFixed(2)}`} />
              </p>
            </div>

            <h3 className="text-lg font-semibold mt-4 mb-2">Newton's {method.charAt(0).toUpperCase() + method.slice(1)} Difference Interpolation Formula:</h3>
            <div className="p-4 rounded-md border border-border overflow-x-auto">
              <TeX math={getInterpolationEquation()} block />
            </div>

            {result !== null && (
              <Alert>
                <AlertDescription className="text-lg">
                  Interpolated value: f({interpolationPoint}) = {result.toFixed(4)}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewtonGregoryInterpolation;