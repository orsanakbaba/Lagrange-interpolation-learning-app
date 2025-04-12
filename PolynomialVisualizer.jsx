import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceDot,
  Brush
} from 'recharts';

const PolynomialVisualizer = ({ 
  dataPoints, 
  polynomialPoints, 
  basisPolynomialPoints,
  interpolationPoint,
  interpolatedValue,
  visibleBasisPolynomials,
  xAxisDomain,
  showFinalPolynomial = true
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

  if (!dataPoints || !polynomialPoints) {
    return null;
  }

  // Find min and max y values for better axis scaling
  let allPoints = showFinalPolynomial ? [...polynomialPoints] : [];
  visibleBasisPolynomials.forEach(index => {
    if (basisPolynomialPoints[index]) {
      allPoints = [...allPoints, ...basisPolynomialPoints[index]];
    }
  });
  
  // Add data points to ensure they're included in the y-axis range
  dataPoints.forEach(point => {
    allPoints.push(point);
  });
  
  // Add interpolation point if it exists
  if (interpolationPoint !== undefined && interpolatedValue !== undefined) {
    allPoints.push({ x: interpolationPoint, y: interpolatedValue });
  }
  
  const yValues = allPoints.map(point => point.y);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const yPadding = (yMax - yMin) * 0.1;
  
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="x" 
            domain={xAxisDomain || ['auto', 'auto']}
            label={{ value: 'X', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis 
            domain={[yMin - yPadding, yMax + yPadding]}
            label={{ value: 'Y', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip 
            formatter={(value) => value.toFixed(4)}
            labelFormatter={(value) => `x: ${value.toFixed(4)}`}
          />
          <Legend />
          <Brush dataKey="x" height={30} stroke="#8884d8" />
          
          {/* Original data points */}
          {dataPoints.map((point, i) => (
            <ReferenceDot
              key={i}
              x={point.x}
              y={point.y}
              r={5}
              fill="#000"
              stroke="none"
            />
          ))}
          
          {/* Interpolation point */}
          {interpolationPoint !== undefined && interpolatedValue !== undefined && (
            <ReferenceDot
              x={interpolationPoint}
              y={interpolatedValue}
              r={5}
              fill="#ff0000"
              stroke="none"
            />
          )}
          
          {/* Basis polynomials */}
          {visibleBasisPolynomials.map((index) => (
            <Line
              key={`basis-${index}`}
              data={basisPolynomialPoints[index]}
              type="monotone"
              dataKey="y"
              name={`L${index}(x)`}
              stroke={COLORS[index % COLORS.length]}
              dot={false}
              strokeWidth={1.5}
              strokeDasharray="5 5"
            />
          ))}
          
          {/* Interpolated polynomial */}
          {showFinalPolynomial && (
            <Line
              data={polynomialPoints}
              type="monotone"
              dataKey="y"
              name="P(x)"
              stroke="#000"
              dot={false}
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PolynomialVisualizer;
