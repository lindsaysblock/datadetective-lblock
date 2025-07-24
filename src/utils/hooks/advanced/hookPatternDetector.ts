/**
 * Hook Pattern Detection System
 * Intelligent analysis of code patterns that can be extracted into custom hooks
 */

export interface HookPattern {
  id: string;
  name: string;
  pattern: string;
  description: string;
  usageCount: number;
  complexity: 'simple' | 'medium' | 'complex';
  category: 'state' | 'effect' | 'api' | 'form' | 'performance' | 'utility';
  sourceFiles: string[];
  extractionPriority: 'high' | 'medium' | 'low';
  estimatedBenefit: number; // 1-100 score
  codeSnippets: string[];
  suggestedHookName: string;
  parameters: string[];
  returnType: string;
  dependencies: string[];
}

export interface HookExtractionSuggestion {
  pattern: HookPattern;
  targetFiles: string[];
  replacementCode: string;
  hookImplementation: string;
  migrationSteps: string[];
  testingGuidelines: string[];
}

export class HookPatternDetector {
  private detectedPatterns: HookPattern[] = [];
  private codePatterns: Map<string, RegExp> = new Map();

  constructor() {
    this.initializePatternLibrary();
  }

  async analyzeCodebase(): Promise<HookPattern[]> {
    console.log('🔍 Analyzing codebase for hook extraction opportunities');
    
    const patterns: HookPattern[] = [];
    
    // Simulate analyzing project files for common patterns
    const mockFiles = [
      'src/components/analysis/AnalysisResultsDisplay.tsx',
      'src/components/dashboard/DashboardView.tsx',
      'src/components/project/NewProjectContent.tsx',
      'src/hooks/useProjectFormManagement.ts',
      'src/pages/Analysis.tsx'
    ];

    for (const file of mockFiles) {
      const filePatterns = await this.analyzeFile(file);
      patterns.push(...filePatterns);
    }

    // Group similar patterns and calculate usage statistics
    const groupedPatterns = this.groupSimilarPatterns(patterns);
    this.detectedPatterns = this.prioritizePatterns(groupedPatterns);

    console.log(`✅ Found ${this.detectedPatterns.length} hook extraction opportunities`);
    return this.detectedPatterns;
  }

  async generateExtractionSuggestions(): Promise<HookExtractionSuggestion[]> {
    const highPriorityPatterns = this.detectedPatterns.filter(
      p => p.extractionPriority === 'high' && p.usageCount >= 3
    );

    const suggestions: HookExtractionSuggestion[] = [];

    for (const pattern of highPriorityPatterns) {
      const suggestion = await this.createExtractionSuggestion(pattern);
      suggestions.push(suggestion);
    }

    return suggestions;
  }

  private initializePatternLibrary(): void {
    // State management patterns
    this.codePatterns.set('useState-with-validation', 
      /const\s+\[(\w+),\s*set\w+\]\s*=\s*useState\([^)]*\)[\s\S]*?if\s*\([^)]*\.test\([^)]*\)\)/g
    );

    // API call patterns
    this.codePatterns.set('api-fetch-with-loading',
      /const\s+\[loading,\s*setLoading\]\s*=\s*useState\(false\)[\s\S]*?const\s+\[data,\s*setData\]\s*=\s*useState[\s\S]*?fetch\(/g
    );

    // Form handling patterns
    this.codePatterns.set('form-state-management',
      /const\s+\[formData,\s*setFormData\]\s*=\s*useState\([^)]*\)[\s\S]*?const\s+handleInputChange[\s\S]*?const\s+handleSubmit/g
    );

    // Effect cleanup patterns
    this.codePatterns.set('effect-with-cleanup',
      /useEffect\(\(\)\s*=>\s*\{[\s\S]*?return\s*\(\)\s*=>\s*\{[\s\S]*?\}[\s\S]*?\}/g
    );

    // Performance optimization patterns
    this.codePatterns.set('memoized-calculations',
      /const\s+\w+\s*=\s*useMemo\(\(\)\s*=>\s*\{[\s\S]*?\},\s*\[[^\]]*\]\)/g
    );
  }

  private async analyzeFile(filePath: string): Promise<HookPattern[]> {
    const patterns: HookPattern[] = [];
    
    // Simulate file content analysis
    const mockPatterns = this.generateMockPatterns(filePath);
    patterns.push(...mockPatterns);

    return patterns;
  }

  private generateMockPatterns(filePath: string): HookPattern[] {
    const patterns: HookPattern[] = [];

    // Form validation pattern
    if (filePath.includes('Form') || filePath.includes('Project')) {
      patterns.push({
        id: `form-validation-${Date.now()}`,
        name: 'Form Validation Pattern',
        pattern: 'useState + validation + error handling',
        description: 'Repeated form validation logic with error state management',
        usageCount: 5,
        complexity: 'medium',
        category: 'form',
        sourceFiles: [filePath],
        extractionPriority: 'high',
        estimatedBenefit: 85,
        codeSnippets: [
          'const [formData, setFormData] = useState({})',
          'const [errors, setErrors] = useState({})',
          'const validateForm = () => { ... }'
        ],
        suggestedHookName: 'useFormValidation',
        parameters: ['initialData', 'validationRules'],
        returnType: '{ formData, errors, handleChange, handleSubmit, isValid }',
        dependencies: ['useState', 'useCallback']
      });
    }

    // API loading pattern
    if (filePath.includes('Analysis') || filePath.includes('Dashboard')) {
      patterns.push({
        id: `api-loading-${Date.now()}`,
        name: 'API Loading State Pattern',
        pattern: 'useState(loading) + useState(data) + useState(error) + fetch',
        description: 'Consistent API call pattern with loading, data, and error states',
        usageCount: 8,
        complexity: 'medium',
        category: 'api',
        sourceFiles: [filePath],
        extractionPriority: 'high',
        estimatedBenefit: 90,
        codeSnippets: [
          'const [loading, setLoading] = useState(false)',
          'const [data, setData] = useState(null)',
          'const [error, setError] = useState(null)'
        ],
        suggestedHookName: 'useApiCall',
        parameters: ['url', 'options'],
        returnType: '{ data, loading, error, refetch }',
        dependencies: ['useState', 'useEffect', 'useCallback']
      });
    }

    // Data persistence pattern
    if (filePath.includes('Project') || filePath.includes('Form')) {
      patterns.push({
        id: `data-persistence-${Date.now()}`,
        name: 'Data Persistence Pattern',
        pattern: 'localStorage + useState + useEffect',
        description: 'Data persistence with localStorage and automatic sync',
        usageCount: 4,
        complexity: 'simple',
        category: 'utility',
        sourceFiles: [filePath],
        extractionPriority: 'medium',
        estimatedBenefit: 70,
        codeSnippets: [
          'const [data, setData] = useState(() => JSON.parse(localStorage.getItem(...)))',
          'useEffect(() => { localStorage.setItem(..., JSON.stringify(data)) }, [data])'
        ],
        suggestedHookName: 'useLocalStorage',
        parameters: ['key', 'defaultValue'],
        returnType: '[value, setValue]',
        dependencies: ['useState', 'useEffect']
      });
    }

    // Performance monitoring pattern
    if (filePath.includes('Analysis') || filePath.includes('Dashboard')) {
      patterns.push({
        id: `performance-monitoring-${Date.now()}`,
        name: 'Performance Monitoring Pattern',
        pattern: 'performance.now() + useEffect + cleanup',
        description: 'Performance measurement and monitoring logic',
        usageCount: 3,
        complexity: 'complex',
        category: 'performance',
        sourceFiles: [filePath],
        extractionPriority: 'medium',
        estimatedBenefit: 75,
        codeSnippets: [
          'const startTime = performance.now()',
          'useEffect(() => { const cleanup = () => { ... }; return cleanup }, [])'
        ],
        suggestedHookName: 'usePerformanceMonitor',
        parameters: ['operationName', 'threshold'],
        returnType: '{ duration, isOptimal, metrics }',
        dependencies: ['useState', 'useEffect', 'useRef']
      });
    }

    return patterns;
  }

  private groupSimilarPatterns(patterns: HookPattern[]): HookPattern[] {
    const grouped = new Map<string, HookPattern[]>();
    
    patterns.forEach(pattern => {
      const key = `${pattern.category}-${pattern.name}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(pattern);
    });

    // Merge similar patterns
    const mergedPatterns: HookPattern[] = [];
    grouped.forEach(similarPatterns => {
      if (similarPatterns.length === 1) {
        mergedPatterns.push(similarPatterns[0]);
      } else {
        const merged = this.mergePatterns(similarPatterns);
        mergedPatterns.push(merged);
      }
    });

    return mergedPatterns;
  }

  private mergePatterns(patterns: HookPattern[]): HookPattern {
    const firstPattern = patterns[0];
    const allSourceFiles = patterns.flatMap(p => p.sourceFiles);
    const totalUsageCount = patterns.reduce((sum, p) => sum + p.usageCount, 0);
    const allCodeSnippets = patterns.flatMap(p => p.codeSnippets);

    return {
      ...firstPattern,
      sourceFiles: [...new Set(allSourceFiles)],
      usageCount: totalUsageCount,
      codeSnippets: [...new Set(allCodeSnippets)],
      estimatedBenefit: Math.min(100, firstPattern.estimatedBenefit + (patterns.length - 1) * 10)
    };
  }

  private prioritizePatterns(patterns: HookPattern[]): HookPattern[] {
    return patterns.sort((a, b) => {
      // Sort by priority, usage count, and estimated benefit
      const priorityScore = (pattern: HookPattern) => {
        const priorityWeight = pattern.extractionPriority === 'high' ? 100 : 
                             pattern.extractionPriority === 'medium' ? 50 : 25;
        return priorityWeight + pattern.usageCount * 10 + pattern.estimatedBenefit;
      };

      return priorityScore(b) - priorityScore(a);
    });
  }

  private async createExtractionSuggestion(pattern: HookPattern): Promise<HookExtractionSuggestion> {
    const hookImplementation = this.generateHookImplementation(pattern);
    const replacementCode = this.generateReplacementCode(pattern);
    const migrationSteps = this.generateMigrationSteps(pattern);
    const testingGuidelines = this.generateTestingGuidelines(pattern);

    return {
      pattern,
      targetFiles: pattern.sourceFiles,
      replacementCode,
      hookImplementation,
      migrationSteps,
      testingGuidelines
    };
  }

  private generateHookImplementation(pattern: HookPattern): string {
    switch (pattern.category) {
      case 'form':
        return this.generateFormHook(pattern);
      case 'api':
        return this.generateApiHook(pattern);
      case 'utility':
        return this.generateUtilityHook(pattern);
      case 'performance':
        return this.generatePerformanceHook(pattern);
      default:
        return this.generateGenericHook(pattern);
    }
  }

  private generateFormHook(pattern: HookPattern): string {
    return `
import { useState, useCallback } from 'react';

export const ${pattern.suggestedHookName} = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((field, value) => {
    const rule = validationRules[field];
    if (!rule) return null;
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      return \`\${field} is required\`;
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || \`\${field} format is invalid\`;
    }
    
    return null;
  }, [validationRules]);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [formData, validateField, validationRules]);

  const handleSubmit = useCallback(async (onSubmit) => {
    if (!validateForm()) return false;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};`;
  }

  private generateApiHook(pattern: HookPattern): string {
    return `
import { useState, useEffect, useCallback, useRef } from 'react';

export const ${pattern.suggestedHookName} = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (customUrl = url, customOptions = {}) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(customUrl, {
        ...options,
        ...customOptions,
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('API call error:', err);
      }
      throw err;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [url, options]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (url && options.immediate !== false) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, url]);

  return {
    data,
    loading,
    error,
    refetch,
    fetchData
  };
};`;
  }

  private generateUtilityHook(pattern: HookPattern): string {
    return `
import { useState, useEffect } from 'react';

export const ${pattern.suggestedHookName} = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          setValue(e.newValue ? JSON.parse(e.newValue) : defaultValue);
        } catch (error) {
          console.error(\`Error parsing localStorage value for key "\${key}":\`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);

  return [value, setStoredValue];
};`;
  }

  private generatePerformanceHook(pattern: HookPattern): string {
    return `
import { useState, useEffect, useRef } from 'react';

export const ${pattern.suggestedHookName} = (operationName, threshold = 1000) => {
  const [metrics, setMetrics] = useState({
    duration: 0,
    isOptimal: true,
    averageDuration: 0,
    executionCount: 0
  });
  
  const startTimeRef = useRef(null);
  const executionHistoryRef = useRef([]);

  const startMeasurement = () => {
    startTimeRef.current = performance.now();
  };

  const endMeasurement = () => {
    if (!startTimeRef.current) return 0;
    
    const duration = performance.now() - startTimeRef.current;
    startTimeRef.current = null;
    
    // Update execution history
    executionHistoryRef.current.push(duration);
    if (executionHistoryRef.current.length > 100) {
      executionHistoryRef.current.shift(); // Keep only last 100 measurements
    }
    
    const averageDuration = executionHistoryRef.current.reduce((a, b) => a + b, 0) / executionHistoryRef.current.length;
    const isOptimal = duration <= threshold;
    
    setMetrics({
      duration,
      isOptimal,
      averageDuration,
      executionCount: executionHistoryRef.current.length
    });
    
    // Log performance warning if needed
    if (!isOptimal) {
      console.warn(\`Performance warning: \${operationName} took \${duration.toFixed(2)}ms (threshold: \${threshold}ms)\`);
    }
    
    return duration;
  };

  const measureOperation = async (operation) => {
    startMeasurement();
    try {
      const result = await operation();
      return result;
    } finally {
      endMeasurement();
    }
  };

  return {
    ...metrics,
    startMeasurement,
    endMeasurement,
    measureOperation
  };
};`;
  }

  private generateGenericHook(pattern: HookPattern): string {
    return `
import { useState, useEffect, useCallback } from 'react';

export const ${pattern.suggestedHookName} = (${pattern.parameters.join(', ')}) => {
  // Generated hook based on detected pattern: ${pattern.description}
  const [state, setState] = useState(null);
  
  const handleAction = useCallback(() => {
    // Implementation based on pattern analysis
    console.log('Hook action triggered');
  }, []);

  useEffect(() => {
    // Effect based on pattern
  }, []);

  return ${pattern.returnType};
};`;
  }

  private generateReplacementCode(pattern: HookPattern): string {
    return `// Replace existing code with:
const ${pattern.returnType} = ${pattern.suggestedHookName}(${pattern.parameters.join(', ')});`;
  }

  private generateMigrationSteps(pattern: HookPattern): string[] {
    return [
      `Create new file: src/hooks/${pattern.suggestedHookName}.ts`,
      `Implement the ${pattern.suggestedHookName} hook`,
      `Update imports in target files: ${pattern.sourceFiles.join(', ')}`,
      `Replace existing pattern code with hook usage`,
      `Test the refactored components`,
      `Remove duplicate code patterns`,
      `Update documentation and add usage examples`
    ];
  }

  private generateTestingGuidelines(pattern: HookPattern): string[] {
    return [
      `Test hook in isolation with different parameter combinations`,
      `Verify all return values function correctly`,
      `Test error handling and edge cases`,
      `Ensure no memory leaks in useEffect cleanup`,
      `Test hook behavior with rapid state changes`,
      `Verify performance improvements in target components`,
      `Test backward compatibility with existing functionality`
    ];
  }

  getDetectedPatterns(): HookPattern[] {
    return [...this.detectedPatterns];
  }

  getPatternsByCategory(category: HookPattern['category']): HookPattern[] {
    return this.detectedPatterns.filter(p => p.category === category);
  }

  getHighPriorityPatterns(): HookPattern[] {
    return this.detectedPatterns.filter(p => p.extractionPriority === 'high');
  }
}