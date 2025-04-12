/**
 * Lagrange Polynomial Interpolation Algorithm
 * 
 * This module provides functions to calculate Lagrange polynomial interpolation
 * with step-by-step computation of basis polynomials and the final interpolated polynomial.
 */

/**
 * Calculate a single Lagrange basis polynomial L_j(x)
 * 
 * @param {number} j - Index of the current basis polynomial
 * @param {number} x - Point at which to evaluate the basis polynomial
 * @param {Array<number>} xPoints - Array of x coordinates of data points
 * @returns {number} - Value of the j-th Lagrange basis polynomial at x
 */
export const calculateBasisPolynomial = (j, x, xPoints) => {
  let basis = 1;
  
  for (let i = 0; i < xPoints.length; i++) {
    if (i !== j) {
      basis *= (x - xPoints[i]) / (xPoints[j] - xPoints[i]);
    }
  }
  
  return basis;
};

/**
 * Calculate all Lagrange basis polynomials for a given set of points
 * 
 * @param {Array<number>} xPoints - Array of x coordinates of data points
 * @param {number} x - Point at which to evaluate the basis polynomials
 * @returns {Array<number>} - Array of basis polynomial values at x
 */
export const calculateAllBasisPolynomials = (xPoints, x) => {
  return xPoints.map((_, j) => calculateBasisPolynomial(j, x, xPoints));
};

/**
 * Generate coefficients for each Lagrange basis polynomial in symbolic form
 * 
 * @param {Array<number>} xPoints - Array of x coordinates of data points
 * @returns {Array<Array<number>>} - Array of coefficient arrays for each basis polynomial
 */
export const generateBasisPolynomialCoefficients = (xPoints) => {
  const n = xPoints.length;
  const basisPolynomials = [];
  
  for (let j = 0; j < n; j++) {
    // Start with polynomial [1]
    let poly = [1];
    
    for (let i = 0; i < n; i++) {
      if (i !== j) {
        // Multiply by (x - x_i)
        const factor = [-xPoints[i], 1]; // represents (x - x_i)
        poly = multiplyPolynomials(poly, factor);
        
        // Divide by (x_j - x_i)
        const divisor = xPoints[j] - xPoints[i];
        poly = poly.map(coef => coef / divisor);
      }
    }
    
    basisPolynomials.push(poly);
  }
  
  return basisPolynomials;
};

/**
 * Multiply two polynomials represented as arrays of coefficients
 * 
 * @param {Array<number>} poly1 - First polynomial coefficients (ascending order)
 * @param {Array<number>} poly2 - Second polynomial coefficients (ascending order)
 * @returns {Array<number>} - Resulting polynomial coefficients
 */
export const multiplyPolynomials = (poly1, poly2) => {
  const result = Array(poly1.length + poly2.length - 1).fill(0);
  
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      result[i + j] += poly1[i] * poly2[j];
    }
  }
  
  return result;
};

/**
 * Calculate the interpolated polynomial value at a given point
 * 
 * @param {number} x - Point at which to evaluate the interpolated polynomial
 * @param {Array<number>} xPoints - Array of x coordinates of data points
 * @param {Array<number>} yPoints - Array of y coordinates of data points
 * @returns {number} - Interpolated value at x
 */
export const interpolate = (x, xPoints, yPoints) => {
  if (xPoints.length !== yPoints.length) {
    throw new Error('X and Y arrays must have the same length');
  }
  
  let result = 0;
  
  for (let j = 0; j < xPoints.length; j++) {
    result += yPoints[j] * calculateBasisPolynomial(j, x, xPoints);
  }
  
  return result;
};

/**
 * Calculate the final interpolated polynomial coefficients
 * 
 * @param {Array<number>} xPoints - Array of x coordinates of data points
 * @param {Array<number>} yPoints - Array of y coordinates of data points
 * @returns {Array<number>} - Coefficients of the interpolated polynomial
 */
export const calculatePolynomialCoefficients = (xPoints, yPoints) => {
  const basisPolynomials = generateBasisPolynomialCoefficients(xPoints);
  const result = Array(xPoints.length).fill(0);
  
  for (let j = 0; j < xPoints.length; j++) {
    for (let i = 0; i < basisPolynomials[j].length; i++) {
      result[i] = (result[i] || 0) + yPoints[j] * basisPolynomials[j][i];
    }
  }
  
  return result;
};

/**
 * Format polynomial as a string
 * 
 * @param {Array<number>} coefficients - Polynomial coefficients (ascending order)
 * @returns {string} - Formatted polynomial string
 */
export const formatPolynomial = (coefficients) => {
  if (coefficients.length === 0) return "0";
  
  let result = "";
  
  for (let i = coefficients.length - 1; i >= 0; i--) {
    const coef = coefficients[i];
    if (coef === 0) continue;
    
    // Add plus sign if needed
    if (result !== "" && coef > 0) {
      result += " + ";
    } else if (result !== "" && coef < 0) {
      result += " - ";
    } else if (coef < 0) {
      result += "-";
    }
    
    // Add coefficient if not 1 or -1, except for constant term
    const absCoef = Math.abs(coef);
    if ((absCoef !== 1 || i === 0) && Math.abs(absCoef - Math.round(absCoef)) < 1e-10) {
      result += Math.round(absCoef);
    } else if (absCoef !== 1 || i === 0) {
      result += absCoef.toFixed(4).replace(/\.?0+$/, "");
    }
    
    // Add variable and exponent if not constant term
    if (i > 0) {
      result += "x";
      if (i > 1) {
        result += "^" + i;
      }
    }
  }
  
  return result || "0";
};

/**
 * Generate points for plotting a polynomial
 * 
 * @param {Array<number>} coefficients - Polynomial coefficients (ascending order)
 * @param {number} min - Minimum x value
 * @param {number} max - Maximum x value
 * @param {number} points - Number of points to generate
 * @returns {Array<{x: number, y: number}>} - Array of points for plotting
 */
export const generatePolynomialPoints = (coefficients, min, max, points = 100) => {
  const step = (max - min) / (points - 1);
  const result = [];
  
  for (let i = 0; i < points; i++) {
    const x = min + i * step;
    let y = 0;
    
    for (let j = 0; j < coefficients.length; j++) {
      y += coefficients[j] * Math.pow(x, j);
    }
    
    result.push({ x, y });
  }
  
  return result;
};

/**
 * Generate points for plotting Lagrange basis polynomials
 * 
 * @param {Array<number>} xPoints - Array of x coordinates of data points
 * @param {number} min - Minimum x value
 * @param {number} max - Maximum x value
 * @param {number} points - Number of points to generate
 * @returns {Array<Array<{x: number, y: number}>>} - Array of point arrays for each basis polynomial
 */
export const generateBasisPolynomialPoints = (xPoints, min, max, points = 100) => {
  const basisCoefficients = generateBasisPolynomialCoefficients(xPoints);
  
  return basisCoefficients.map(coefficients => 
    generatePolynomialPoints(coefficients, min, max, points)
  );
};

/**
 * Calculate step-by-step interpolation for a specific x value
 * 
 * @param {number} x - Point at which to evaluate the interpolated polynomial
 * @param {Array<number>} xPoints - Array of x coordinates of data points
 * @param {Array<number>} yPoints - Array of y coordinates of data points
 * @returns {Object} - Step-by-step calculation details
 */
export const calculateStepByStep = (x, xPoints, yPoints) => {
  const steps = [];
  let finalSum = 0;
  
  for (let j = 0; j < xPoints.length; j++) {
    // Calculate numerator and denominator separately for clarity
    let numerator = 1;
    let denominator = 1;
    const factors = [];
    
    for (let i = 0; i < xPoints.length; i++) {
      if (i !== j) {
        numerator *= (x - xPoints[i]);
        denominator *= (xPoints[j] - xPoints[i]);
        factors.push({
          numerator: `(${x} - ${xPoints[i]})`,
          denominator: `(${xPoints[j]} - ${xPoints[i]})`
        });
      }
    }
    
    const basisValue = numerator / denominator;
    const termValue = yPoints[j] * basisValue;
    finalSum += termValue;
    
    steps.push({
      j,
      xj: xPoints[j],
      yj: yPoints[j],
      factors,
      basisValue,
      termValue
    });
  }
  
  return {
    steps,
    finalValue: finalSum
  };
};
