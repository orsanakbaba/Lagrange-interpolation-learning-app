import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Input } from './ui/input';

const InteractiveControls = ({ 
  xMin, 
  xMax, 
  onRangeChange, 
  onPointsChange, 
  numPoints,
  onResetZoom
}) => {
  const [localXMin, setLocalXMin] = React.useState(xMin);
  const [localXMax, setLocalXMax] = React.useState(xMax);
  const [localNumPoints, setLocalNumPoints] = React.useState(numPoints);

  const handleApplyRange = () => {
    onRangeChange(localXMin, localXMax);
  };

  const handleApplyPoints = () => {
    onPointsChange(localNumPoints);
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Visualization Controls</CardTitle>
        <CardDescription>
          Adjust the visualization parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="range">
            <AccordionTrigger>X-Axis Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="x-min">Minimum X</Label>
                    <Input
                      id="x-min"
                      type="number"
                      step="any"
                      value={localXMin}
                      onChange={(e) => setLocalXMin(parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="x-max">Maximum X</Label>
                    <Input
                      id="x-max"
                      type="number"
                      step="any"
                      value={localXMax}
                      onChange={(e) => setLocalXMax(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                <Button onClick={handleApplyRange}>Apply Range</Button>
                <Button variant="outline" onClick={onResetZoom}>Reset Zoom</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="points">
            <AccordionTrigger>Plot Resolution</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="num-points">Number of Points: {localNumPoints}</Label>
                  <Slider
                    id="num-points"
                    min={50}
                    max={500}
                    step={10}
                    value={[localNumPoints]}
                    onValueChange={(value) => setLocalNumPoints(value[0])}
                    className="mt-2"
                  />
                </div>
                <Button onClick={handleApplyPoints}>Apply Resolution</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default InteractiveControls;
