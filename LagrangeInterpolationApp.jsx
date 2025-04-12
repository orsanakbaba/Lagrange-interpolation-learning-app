import React, { useState, useEffect } from 'react';
import { 
  calculateAllBasisPolynomials, 
  interpolate, 
  calculatePolynomialCoefficients,
  formatPolynomial,
  generatePolynomialPoints,
  generateBasisPolynomialPoints,
  calculateStepByStep
} from '../utils/lagrangeInterpolation';

import DataInputForm from './DataInputForm';
import VisualizationPanel from './VisualizationPanel';
import StepByStepView from './StepByStepView';
import ResultSummary from './ResultSummary';
import InteractiveControls from './InteractiveControls';

const LagrangeInterpolationApp = () => {
  // State for input data
  const [inputData, setInputData] = useState(null);
  
  // State for calculation results
  const [results, setResults] = useState(null);
  
  // State for visualization settings
  const [visibleBasisPolynomials, setVisibleBasisPolynomials] = useState([]);
  const [showAllBasisPolynomials, setShowAllBasisPolynomials] = useState(false);
  const [xAxisDomain, setXAxisDomain] = useState(null);
  const [numPoints, setNumPoints] = useState(100);
  
  // Process data when input changes or when numPoints changes
  useEffect(() => {
    if (!inputData) return;
    
    const { xPoints, yPoints, interpolationPoint } = inputData;
    
    // Calculate interpolated value at the specified point
    const interpolatedValue = interpolate(interpolationPoint, xPoints, yPoints);
    
    // Calculate polynomial coefficients
    const coefficients = calculatePolynomialCoefficients(xPoints, yPoints);
    
    // Format polynomial as string
    const polynomialString = formatPolynomial(coefficients);
    
    // Calculate step-by-step details
    const stepByStepCalculation = calculateStepByStep(interpolationPoint, xPoints, yPoints);
    
    // Find min and max x values for plotting
    const minX = Math.min(...xPoints);
    const maxX = Math.max(...xPoints);
    const range = maxX - minX;
    const plotMinX = minX - range * 0.2;
    const plotMaxX = maxX + range * 0.2;
    
    // Generate points for plotting the polynomial with the current numPoints setting
    const polynomialPoints = generatePolynomialPoints(coefficients, plotMinX, plotMaxX, numPoints);
    
    // Generate points for plotting basis polynomials with the current numPoints setting
    const basisPolynomialPoints = generateBasisPolynomialPoints(xPoints, plotMinX, plotMaxX, numPoints);
    
    // Create data points for plotting
    const dataPoints = xPoints.map((x, i) => ({ x, y: yPoints[i] }));
    
    // Set results
    setResults({
      interpolatedValue,
      coefficients,
      polynomialString,
      stepByStepCalculation,
      polynomialPoints,
      basisPolynomialPoints,
      dataPoints,
      plotMinX,
      plotMaxX
    });
    
    // Reset visualization settings if not already set
    if (!xAxisDomain) {
      setXAxisDomain([plotMinX, plotMaxX]);
    }
    
    // If showing all basis polynomials, update visible ones
    if (showAllBasisPolynomials) {
      setVisibleBasisPolynomials(Array.from({ length: xPoints.length }, (_, i) => i));
    }
  }, [inputData, numPoints]);
  
  // Handle data submission from form
  const handleDataSubmit = (data) => {
    setInputData(data);
    // Reset visualization settings when new data is submitted
    setXAxisDomain(null);
  };
  
  // Toggle showing all basis polynomials
  const handleToggleAllBasisPolynomials = () => {
    if (showAllBasisPolynomials) {
      setShowAllBasisPolynomials(false);
      setVisibleBasisPolynomials([]);
    } else {
      setShowAllBasisPolynomials(true);
      setVisibleBasisPolynomials(
        Array.from({ length: inputData.xPoints.length }, (_, i) => i)
      );
    }
  };
  
  // Toggle individual basis polynomial
  const handleToggleBasisPolynomial = (index) => {
    if (visibleBasisPolynomials.includes(index)) {
      setVisibleBasisPolynomials(visibleBasisPolynomials.filter(i => i !== index));
    } else {
      setVisibleBasisPolynomials([...visibleBasisPolynomials, index]);
    }
  };
  
  // Handle x-axis range change
  const handleRangeChange = (min, max) => {
    setXAxisDomain([min, max]);
  };
  
  // Handle number of points change
  const handlePointsChange = (points) => {
    setNumPoints(points);
  };
  
  // Reset zoom to default
  const handleResetZoom = () => {
    if (results) {
      setXAxisDomain([results.plotMinX, results.plotMaxX]);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Lagrange Polynomial Interpolation</h1>
        <p className="text-gray-600">
          An interactive tool to visualize and understand the Lagrange interpolation method
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DataInputForm onDataSubmit={handleDataSubmit} />
          
          {results && (
            <InteractiveControls
              xMin={xAxisDomain ? xAxisDomain[0] : results.plotMinX}
              xMax={xAxisDomain ? xAxisDomain[1] : results.plotMaxX}
              onRangeChange={handleRangeChange}
              onPointsChange={handlePointsChange}
              numPoints={numPoints}
              onResetZoom={handleResetZoom}
            />
          )}
        </div>
        
        <div className="lg:col-span-2">
          {results && (
            <>
              <VisualizationPanel
                dataPoints={results.dataPoints}
                interpolationPoint={inputData.interpolationPoint}
                interpolatedValue={results.interpolatedValue}
                polynomialPoints={results.polynomialPoints}
                basisPolynomialPoints={results.basisPolynomialPoints}
                polynomialString={results.polynomialString}
                visibleBasisPolynomials={visibleBasisPolynomials}
                showAllBasisPolynomials={showAllBasisPolynomials}
                onToggleAllBasisPolynomials={handleToggleAllBasisPolynomials}
                onToggleBasisPolynomial={handleToggleBasisPolynomial}
                xAxisDomain={xAxisDomain}
                numPoints={numPoints}
                onPointsChange={handlePointsChange}
              />
              
              <ResultSummary
                dataPoints={results.dataPoints}
                interpolationPoint={inputData.interpolationPoint}
                interpolatedValue={results.interpolatedValue}
                polynomialString={results.polynomialString}
              />
              
              <StepByStepView
                calculationSteps={results.stepByStepCalculation}
                finalValue={results.interpolatedValue}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LagrangeInterpolationApp;
