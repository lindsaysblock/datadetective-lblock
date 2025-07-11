
export interface CodeMetrics {
  complexity: number;
  maintainabilityIndex: number;
  linesOfCode: number;
  cyclomaticComplexity: number;
  halsteadMetrics: {
    vocabulary: number;
    length: number;
    difficulty: number;
    effort: number;
  };
  duplicatedCode: number;
  testCoverage: number;
}

export class CodeMetricsAnalyzer {
  static analyzeCode(code: string): CodeMetrics {
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    const linesOfCode = lines.length;
    
    // Basic complexity analysis
    const complexity = this.calculateComplexity(code);
    const cyclomaticComplexity = this.calculateCyclomaticComplexity(code);
    const maintainabilityIndex = this.calculateMaintainabilityIndex(complexity, linesOfCode);
    
    // Halstead metrics (simplified)
    const halsteadMetrics = this.calculateHalsteadMetrics(code);
    
    // Duplication detection (simplified)
    const duplicatedCode = this.detectDuplication(code);
    
    return {
      complexity,
      maintainabilityIndex,
      linesOfCode,
      cyclomaticComplexity,
      halsteadMetrics,
      duplicatedCode,
      testCoverage: Math.random() * 100 // Mock value
    };
  }

  private static calculateComplexity(code: string): number {
    // Count complexity indicators
    const complexityPatterns = [
      /if\s*\(/g,
      /else\s*if/g,
      /while\s*\(/g,
      /for\s*\(/g,
      /switch\s*\(/g,
      /catch\s*\(/g,
      /\|\|/g,
      /&&/g
    ];
    
    let complexity = 1; // Base complexity
    
    complexityPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });
    
    return complexity;
  }

  private static calculateCyclomaticComplexity(code: string): number {
    // Simplified cyclomatic complexity calculation
    const decisionPoints = [
      /if\s*\(/g,
      /while\s*\(/g,
      /for\s*\(/g,
      /case\s+/g,
      /catch\s*\(/g,
      /\?\s*:/g
    ];
    
    let complexity = 1;
    
    decisionPoints.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });
    
    return complexity;
  }

  private static calculateMaintainabilityIndex(complexity: number, linesOfCode: number): number {
    // Simplified maintainability index
    // Higher is better, scale 0-100
    const baseIndex = 100;
    const complexityPenalty = complexity * 2;
    const sizePenalty = linesOfCode * 0.1;
    
    return Math.max(0, Math.min(100, baseIndex - complexityPenalty - sizePenalty));
  }

  private static calculateHalsteadMetrics(code: string) {
    // Simplified Halstead metrics
    const operators = code.match(/[+\-*/=<>!&|%^~?:;,.\[\](){}]/g) || [];
    const operands = code.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g) || [];
    
    const uniqueOperators = new Set(operators).size;
    const uniqueOperands = new Set(operands).size;
    
    const vocabulary = uniqueOperators + uniqueOperands;
    const length = operators.length + operands.length;
    const difficulty = (uniqueOperators / 2) * (operands.length / uniqueOperands);
    const effort = difficulty * length;
    
    return {
      vocabulary,
      length,
      difficulty,
      effort
    };
  }

  private static detectDuplication(code: string): number {
    const lines = code.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const duplicates = new Map<string, number>();
    
    lines.forEach(line => {
      if (line.length > 10) { // Only consider meaningful lines
        duplicates.set(line, (duplicates.get(line) || 0) + 1);
      }
    });
    
    let duplicatedLines = 0;
    duplicates.forEach((count) => {
      if (count > 1) {
        duplicatedLines += count - 1;
      }
    });
    
    return lines.length > 0 ? (duplicatedLines / lines.length) * 100 : 0;
  }
}
