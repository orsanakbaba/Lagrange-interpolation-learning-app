import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

const ResultSummary = ({ 
  dataPoints, 
  interpolationPoint, 
  interpolatedValue, 
  polynomialString 
}) => {
  if (!dataPoints || dataPoints.length === 0) {
    return null;
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Interpolation Results</CardTitle>
        <CardDescription>
          Summary of the Lagrange polynomial interpolation results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Data Points</h3>
            <div className="flex flex-wrap gap-2">
              {dataPoints.map((point, index) => (
                <Badge key={index} variant="outline" className="font-mono">
                  ({point.x.toFixed(2)}, {point.y.toFixed(2)})
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Interpolation Point</h3>
            <p className="font-mono">x = {interpolationPoint}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Interpolated Value</h3>
            <p className="font-mono text-lg">P({interpolationPoint}) = {interpolatedValue.toFixed(6)}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Interpolated Polynomial</h3>
            <p className="font-mono break-words">{polynomialString}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultSummary;
