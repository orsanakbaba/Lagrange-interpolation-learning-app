import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

const StepByStepView = ({ calculationSteps, finalValue }) => {
  if (!calculationSteps || calculationSteps.length === 0) {
    return null;
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Step-by-Step Calculation</CardTitle>
        <CardDescription>
          Detailed calculation of Lagrange polynomial interpolation at x = {calculationSteps.steps[0].factors[0].numerator.split(' - ')[0].replace('(', '')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {calculationSteps.steps.map((step, index) => (
            <div key={index} className="p-4 border rounded-lg bg-slate-50">
              <h3 className="font-medium mb-2">Term {index + 1}: L<sub>{index}</sub>(x) · y<sub>{index}</sub></h3>
              
              <div className="mb-2">
                <span className="font-medium">Data point:</span> (x<sub>{index}</sub>, y<sub>{index}</sub>) = ({step.xj}, {step.yj})
              </div>
              
              <div className="mb-2">
                <span className="font-medium">Basis polynomial L<sub>{index}</sub>(x):</span>
              </div>
              
              <div className="pl-4 border-l-2 border-blue-300 mb-3">
                <div className="mb-2">
                  L<sub>{index}</sub>(x) = 
                  {step.factors.map((factor, fidx) => (
                    <span key={fidx}> {fidx > 0 ? '·' : ''} {factor.numerator}/{factor.denominator}</span>
                  ))}
                </div>
                <div>L<sub>{index}</sub>({calculationSteps.steps[0].factors[0].numerator.split(' - ')[0].replace('(', '')}) = {step.basisValue.toFixed(6)}</div>
              </div>
              
              <div className="font-medium">
                Term value: y<sub>{index}</sub> · L<sub>{index}</sub>(x) = {step.yj} · {step.basisValue.toFixed(6)} = {step.termValue.toFixed(6)}
              </div>
            </div>
          ))}
          
          <div className="p-4 border rounded-lg bg-green-50">
            <h3 className="font-medium mb-2">Final Interpolated Value</h3>
            <div>
              P(x) = {calculationSteps.steps.map((step, index) => (
                <span key={index}>
                  {index > 0 ? ' + ' : ''}
                  {step.termValue.toFixed(6)}
                </span>
              ))} = {calculationSteps.finalValue.toFixed(6)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepByStepView;
