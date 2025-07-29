import { Parser } from 'expr-eval';

/**
 * Safe mathematical expression evaluator
 * Replaces the dangerous eval() function with a secure alternative
 */
export class SafeMathEvaluator {
  private static parser = new Parser();
  
  /**
   * Safely evaluates a mathematical expression
   * @param expression - The mathematical expression to evaluate
   * @param variables - Object containing variable values
   * @returns The result of the evaluation or an error message
   */
  static evaluate(expression: string, variables: Record<string, number> = {}): number | string {
    try {
      // Validate the expression contains only allowed characters
      if (!this.isValidExpression(expression)) {
        return 'Invalid expression: contains forbidden characters';
      }

      // Parse and evaluate the expression
      const expr = this.parser.parse(expression);
      
      // Validate that all variables in the expression are provided
      const exprVars = expr.variables();
      const missingVars = exprVars.filter(v => !(v in variables));
      
      if (missingVars.length > 0) {
        return `Missing variables: ${missingVars.join(', ')}`;
      }

      const result = expr.evaluate(variables);
      
      // Check if result is a valid number
      if (typeof result !== 'number' || !isFinite(result)) {
        return 'Invalid calculation result';
      }

      return result;
    } catch (error) {
      console.error('Math evaluation error:', error);
      return 'Calculation error';
    }
  }

  /**
   * Validates that the expression contains only safe mathematical operations
   */
  private static isValidExpression(expression: string): boolean {
    // Allow numbers, basic operators, parentheses, and variable names
    const allowedPattern = /^[a-zA-Z_][a-zA-Z0-9_]*|[0-9]+\.?[0-9]*|[\+\-\*\/\(\)\s\.]$/;
    
    // Check each character individually
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
      if (!allowedPattern.test(char) && char !== ' ') {
        return false;
      }
    }

    // Additional security checks
    const forbiddenPatterns = [
      /eval/i,
      /function/i,
      /constructor/i,
      /prototype/i,
      /__proto__/i,
      /import/i,
      /require/i,
      /process/i,
      /global/i,
      /window/i,
      /document/i
    ];

    return !forbiddenPatterns.some(pattern => pattern.test(expression));
  }

  /**
   * Sanitizes column names to be safe for use in expressions
   */
  static sanitizeColumnName(columnName: string): string {
    // Replace spaces and special characters with underscores
    return columnName.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^[0-9]/, '_$&');
  }
}