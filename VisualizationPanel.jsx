import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import PolynomialVisualizer from './PolynomialVisualizer';

const VisualizationPanel = ({ 
  dataPoints, 
  interpolationPoint, 
  interpolatedValue,
  polynomialPoints, 
  basisPolynomialPoints,
  polynomialString,
  visibleBasisPolynomials,
  showAllBasisPolynomials,
  onToggleAllBasisPolynomials,
  onToggleBasisPolynomial,
  xAxisDomain,
  numPoints,
  onPointsChange
}) => {
  const COLORS = [
    '#2563eb', // blue
    '#16a34a', // green
    '#dc2626', // red
    '#9333ea', // purple
    '#ea580c', // orange
    '#0891b2', // cyan
    '#4f46e5', // indigo
    '#be123c', // rose
    '#854d0e', // amber
    '#1e293b', // slate
  ];

  const [showFinalPolynomial, setShowFinalPolynomial] = React.useState(true);

  if (!dataPoints || !polynomialPoints) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visualization</CardTitle>
        <CardDescription>
          Lagrange polynomial interpolation visualization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="graph" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="graph">Graph</TabsTrigger>
            <TabsTrigger value="formula">Formula</TabsTrigger>
          </TabsList>
          
          <TabsContent value="graph" className="space-y-4">
            <div className="flex flex-col space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-final" 
                  checked={showFinalPolynomial}
                  onCheckedChange={setShowFinalPolynomial}
                />
                <Label htmlFor="show-final">Show Final Polynomial</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-basis" 
                  checked={showAllBasisPolynomials}
                  onCheckedChange={onToggleAllBasisPolynomials}
                />
                <Label htmlFor="show-basis">Show Lagrange Basis Polynomials</Label>
              </div>
            </div>
            
            {showAllBasisPolynomials && basisPolynomialPoints && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {basisPolynomialPoints.map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Switch 
                      id={`basis-${index}`}
                      checked={visibleBasisPolynomials.includes(index)}
                      onCheckedChange={() => onToggleBasisPolynomial(index)}
                    />
                    <Label 
                      htmlFor={`basis-${index}`}
                      className="flex items-center"
                    >
                      <div 
                        className="w-3 h-3 mr-1 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      L<sub>{index}</sub>(x)
                    </Label>
                  </div>
                ))}
              </div>
            )}
            
            <PolynomialVisualizer
              dataPoints={dataPoints}
              polynomialPoints={polynomialPoints}
              basisPolynomialPoints={basisPolynomialPoints}
              interpolationPoint={interpolationPoint}
              interpolatedValue={interpolatedValue}
              visibleBasisPolynomials={visibleBasisPolynomials}
              xAxisDomain={xAxisDomain}
              showFinalPolynomial={showFinalPolynomial}
            />
            
            {interpolationPoint !== undefined && interpolatedValue !== undefined && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="font-medium">Interpolated value at x = {interpolationPoint}:</p>
                <p className="text-lg">P({interpolationPoint}) = {interpolatedValue.toFixed(6)}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="formula">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-medium mb-2">Interpolated Polynomial:</h3>
                <p className="text-lg font-mono">{polynomialString || 'No polynomial calculated yet'}</p>
              </div>
              
              {showAllBasisPolynomials && visibleBasisPolynomials.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-md">
                  <h3 className="font-medium mb-2">Basis Polynomials:</h3>
                  <div className="space-y-2">
                    {visibleBasisPolynomials.map((index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 mr-2 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span>L<sub>{index}</sub>(x) = (Basis polynomial {index + 1})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-medium mb-2">Lagrange Interpolation Formula:</h3>
                <p>
                  P(x) = Σ y<sub>i</sub> · L<sub>i</sub>(x)
                </p>
                <p className="mt-2">
                  where L<sub>i</sub>(x) = Π<sub>j≠i</sub> (x - x<sub>j</sub>)/(x<sub>i</sub> - x<sub>j</sub>)
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VisualizationPanel;
