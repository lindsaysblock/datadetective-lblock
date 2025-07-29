/**
 * Empty SystemOptimizer stub
 * This file exists only to override cached versions and prevent errors
 * All optimization functionality has been moved to simpleOptimizer.ts
 */

// Simple stub to prevent import errors
export class SystemOptimizer {
  static getInstance() {
    return new SystemOptimizer();
  }
  
  constructor() {
    // Do nothing - no initialization
  }
  
  runAllOptimizations() {
    console.log('⚠️ SystemOptimizer is deprecated. Use simpleOptimizer instead.');
    return Promise.resolve({});
  }
  
  initializeOptimizations() {
    // Do nothing - prevent recursion
  }
  
  optimizeEventListeners() {
    // Do nothing - prevent recursion  
  }
  
  addPassiveListeners() {
    // Do nothing - prevent recursion
  }
}

// Export empty instance to prevent singleton issues
export const systemOptimizer = new SystemOptimizer();