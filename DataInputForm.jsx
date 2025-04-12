import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Trash2, Plus, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const DataInputForm = ({ onDataSubmit }) => {
  const [dataPoints, setDataPoints] = useState([
    { x: '', y: '' },
    { x: '', y: '' },
    { x: '', y: '' },
    { x: '', y: '' },
    { x: '', y: '' },
  ]);
  
  const [interpolationPoint, setInterpolationPoint] = useState('');
  const [error, setError] = useState('');

  const handleAddPoint = () => {
    setDataPoints([...dataPoints, { x: '', y: '' }]);
  };

  const handleRemovePoint = (index) => {
    if (dataPoints.length > 5) {
      const newDataPoints = [...dataPoints];
      newDataPoints.splice(index, 1);
      setDataPoints(newDataPoints);
    } else {
      setError('At least 5 data points are required');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePointChange = (index, field, value) => {
    const newDataPoints = [...dataPoints];
    newDataPoints[index][field] = value;
    setDataPoints(newDataPoints);
  };

  const handleReset = () => {
    setDataPoints([
      { x: '', y: '' },
      { x: '', y: '' },
      { x: '', y: '' },
      { x: '', y: '' },
      { x: '', y: '' },
    ]);
    setInterpolationPoint('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate data
    const validDataPoints = dataPoints.filter(point => 
      point.x !== '' && point.y !== '' && 
      !isNaN(parseFloat(point.x)) && !isNaN(parseFloat(point.y))
    );
    
    if (validDataPoints.length < 5) {
      setError('Please provide at least 5 valid data points');
      return;
    }
    
    if (interpolationPoint === '' || isNaN(parseFloat(interpolationPoint))) {
      setError('Please provide a valid interpolation point');
      return;
    }
    
    // Check for duplicate x values
    const xValues = validDataPoints.map(point => parseFloat(point.x));
    const uniqueXValues = new Set(xValues);
    
    if (uniqueXValues.size !== validDataPoints.length) {
      setError('X values must be unique');
      return;
    }
    
    // Convert to numbers and submit
    const xPoints = validDataPoints.map(point => parseFloat(point.x));
    const yPoints = validDataPoints.map(point => parseFloat(point.y));
    
    onDataSubmit({
      xPoints,
      yPoints,
      interpolationPoint: parseFloat(interpolationPoint)
    });
  };

  const handleSampleData = () => {
    setDataPoints([
      { x: '-2', y: '4' },
      { x: '-1', y: '1' },
      { x: '0', y: '0' },
      { x: '1', y: '1' },
      { x: '2', y: '4' },
    ]);
    setInterpolationPoint('0.5');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Input</CardTitle>
        <CardDescription>
          Enter at least 5 data points (x, y) for Lagrange polynomial interpolation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center font-medium">
              <div>X Value</div>
              <div>Y Value</div>
              <div></div>
            </div>
            
            {dataPoints.map((point, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                <Input
                  type="number"
                  step="any"
                  value={point.x}
                  onChange={(e) => handlePointChange(index, 'x', e.target.value)}
                  placeholder="X value"
                  required
                />
                <Input
                  type="number"
                  step="any"
                  value={point.y}
                  onChange={(e) => handlePointChange(index, 'y', e.target.value)}
                  placeholder="Y value"
                  required
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleRemovePoint(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAddPoint}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Point
            </Button>
            
            <div className="pt-4 border-t">
              <Label htmlFor="interpolation-point">Interpolation Point (x value to calculate)</Label>
              <Input
                id="interpolation-point"
                type="number"
                step="any"
                value={interpolationPoint}
                onChange={(e) => setInterpolationPoint(e.target.value)}
                placeholder="Enter x value to interpolate"
                className="mt-1"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button type="submit" className="flex-1">
              Calculate Interpolation
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button type="button" variant="secondary" onClick={handleSampleData}>
              Load Sample Data
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DataInputForm;
