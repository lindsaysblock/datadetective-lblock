/**
 * Hook Documentation Generator
 * Automatically generates documentation for custom hooks
 */

import { HookPattern } from './hookPatternDetector';

export interface HookDocumentation {
  name: string;
  description: string;
  category: string;
  parameters: HookParameter[];
  returnValue: HookReturnValue;
  examples: HookExample[];
  bestPractices: string[];
  performance: PerformanceInfo;
  dependencies: string[];
  since: string;
  author: string;
}

export interface HookParameter {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description: string;
}

export interface HookReturnValue {
  type: string;
  description: string;
  properties?: ReturnProperty[];
}

export interface ReturnProperty {
  name: string;
  type: string;
  description: string;
}

export interface HookExample {
  title: string;
  description: string;
  code: string;
  output?: string;
}

export interface PerformanceInfo {
  complexity: 'O(1)' | 'O(n)' | 'O(log n)' | 'O(n²)';
  memoryUsage: 'low' | 'medium' | 'high';
  reRenderFrequency: 'minimal' | 'moderate' | 'frequent';
  optimizations: string[];
}

export class HookDocumentationGenerator {
  private readonly hookLibrary = new Map<string, HookDocumentation>();

  constructor() {
    this.generateLibraryDocumentation();
  }

  generateDocumentationFromPattern(pattern: HookPattern): HookDocumentation {
    return {
      name: pattern.suggestedHookName,
      description: pattern.description,
      category: pattern.category,
      parameters: this.parseParameters(pattern.parameters),
      returnValue: this.parseReturnValue(pattern.returnType),
      examples: this.generateExamples(pattern),
      bestPractices: this.generateBestPractices(pattern),
      performance: this.analyzePerformance(pattern),
      dependencies: pattern.dependencies,
      since: new Date().toISOString().split('T')[0],
      author: 'Code Quality System'
    };
  }

  private generateLibraryDocumentation(): void {
    // useOptimizedForm documentation
    this.hookLibrary.set('useOptimizedForm', {
      name: 'useOptimizedForm',
      description: 'Performance-optimized form hook with validation, error handling, and debounced validation',
      category: 'form',
      parameters: [
        {
          name: 'initialData',
          type: 'object',
          required: false,
          defaultValue: {},
          description: 'Initial form data object'
        },
        {
          name: 'validationRules',
          type: 'ValidationRules',
          required: false,
          defaultValue: {},
          description: 'Object containing validation rules for each field'
        }
      ],
      returnValue: {
        type: 'FormState',
        description: 'Complete form state and handlers',
        properties: [
          { name: 'formData', type: 'object', description: 'Current form data' },
          { name: 'errors', type: 'object', description: 'Validation errors for each field' },
          { name: 'touched', type: 'object', description: 'Fields that have been interacted with' },
          { name: 'isSubmitting', type: 'boolean', description: 'Whether form is currently submitting' },
          { name: 'isValid', type: 'boolean', description: 'Whether all validations pass' },
          { name: 'handleChange', type: 'function', description: 'Handler for field value changes' },
          { name: 'handleBlur', type: 'function', description: 'Handler for field blur events' },
          { name: 'reset', type: 'function', description: 'Reset form to initial state' }
        ]
      },
      examples: [
        {
          title: 'Basic Form Usage',
          description: 'Simple form with validation',
          code: `const { formData, errors, handleChange, handleBlur, isValid } = useOptimizedForm(
  { email: '', password: '' },
  {
    email: { 
      required: true, 
      pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
      message: 'Please enter a valid email'
    },
    password: { 
      required: true, 
      minLength: 8 
    }
  }
);

return (
  <form>
    <input 
      value={formData.email}
      onChange={(e) => handleChange('email', e.target.value)}
      onBlur={() => handleBlur('email')}
    />
    {errors.email && <span>{errors.email}</span>}
  </form>
);`
        }
      ],
      bestPractices: [
        'Use debounced validation to avoid excessive re-renders',
        'Only validate fields after user interaction (onBlur)',
        'Provide clear error messages for validation failures',
        'Reset form state when switching between different forms'
      ],
      performance: {
        complexity: 'O(1)',
        memoryUsage: 'low',
        reRenderFrequency: 'minimal',
        optimizations: [
          'Debounced validation prevents excessive validation calls',
          'Memoized validation function reduces computation',
          'Selective error state updates minimize re-renders'
        ]
      },
      dependencies: ['useState', 'useCallback', 'useMemo', 'useEffect'],
      since: '2024-01-15',
      author: 'Advanced Hook System'
    });

    // useOptimizedApi documentation
    this.hookLibrary.set('useOptimizedApi', {
      name: 'useOptimizedApi',
      description: 'High-performance API hook with intelligent caching, request deduplication, and automatic cleanup',
      category: 'api',
      parameters: [
        {
          name: 'url',
          type: 'string',
          required: true,
          description: 'API endpoint URL'
        },
        {
          name: 'options',
          type: 'ApiOptions',
          required: false,
          defaultValue: {},
          description: 'Configuration options including cache settings and fetch parameters'
        }
      ],
      returnValue: {
        type: 'ApiState',
        description: 'API call state and control functions',
        properties: [
          { name: 'data', type: 'any', description: 'Response data from the API' },
          { name: 'loading', type: 'boolean', description: 'Whether request is in progress' },
          { name: 'error', type: 'string | null', description: 'Error message if request failed' },
          { name: 'refetch', type: 'function', description: 'Function to manually trigger a new request' },
          { name: 'clearCache', type: 'function', description: 'Function to clear cached data' }
        ]
      },
      examples: [
        {
          title: 'Basic API Call',
          description: 'Simple GET request with caching',
          code: `const { data, loading, error } = useOptimizedApi('/api/users', {
  cache: true,
  cacheMaxAge: 300000 // 5 minutes
});

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
return <div>{data?.users?.length} users found</div>;`
        },
        {
          title: 'POST Request with Manual Trigger',
          description: 'API call that only runs when explicitly triggered',
          code: `const { data, loading, fetchData } = useOptimizedApi('/api/users', {
  immediate: false
});

const createUser = async (userData) => {
  try {
    const result = await fetchData('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    console.log('User created:', result);
  } catch (error) {
    console.error('Failed to create user:', error);
  }
};`
        }
      ],
      bestPractices: [
        'Enable caching for read-only data to reduce network requests',
        'Set appropriate cache expiration times based on data freshness requirements',
        'Use immediate: false for mutations or user-triggered actions',
        'Handle loading and error states appropriately in your UI'
      ],
      performance: {
        complexity: 'O(1)',
        memoryUsage: 'medium',
        reRenderFrequency: 'minimal',
        optimizations: [
          'Intelligent caching reduces redundant network requests',
          'Request deduplication prevents duplicate calls',
          'Automatic request cancellation prevents memory leaks',
          'LRU cache eviction manages memory usage'
        ]
      },
      dependencies: ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef'],
      since: '2024-01-15',
      author: 'Advanced Hook System'
    });

    // useAdvancedLocalStorage documentation
    this.hookLibrary.set('useAdvancedLocalStorage', {
      name: 'useAdvancedLocalStorage',
      description: 'Enhanced localStorage hook with debounced writes, cross-tab synchronization, and error handling',
      category: 'utility',
      parameters: [
        {
          name: 'key',
          type: 'string',
          required: true,
          description: 'localStorage key to store the value under'
        },
        {
          name: 'defaultValue',
          type: 'any',
          required: true,
          description: 'Default value if no stored value exists'
        },
        {
          name: 'options',
          type: 'LocalStorageOptions',
          required: false,
          defaultValue: {},
          description: 'Configuration options for debouncing and cross-tab sync'
        }
      ],
      returnValue: {
        type: '[value, setValue, removeValue, error]',
        description: 'Tuple containing current value, setter, remover, and error state',
        properties: [
          { name: 'value', type: 'any', description: 'Current stored value' },
          { name: 'setValue', type: 'function', description: 'Function to update the stored value' },
          { name: 'removeValue', type: 'function', description: 'Function to remove the value from storage' },
          { name: 'error', type: 'string | null', description: 'Error message if storage operation failed' }
        ]
      },
      examples: [
        {
          title: 'Basic Usage',
          description: 'Simple localStorage with default value',
          code: `const [theme, setTheme] = useAdvancedLocalStorage('theme', 'light');

return (
  <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
    Current theme: {theme}
  </button>
);`
        },
        {
          title: 'With Cross-tab Sync',
          description: 'localStorage that syncs across browser tabs',
          code: `const [userPrefs, setUserPrefs, removePrefs, error] = useAdvancedLocalStorage(
  'userPreferences',
  { language: 'en', notifications: true },
  { syncAcrossTabs: true, debounceMs: 500 }
);

if (error) {
  console.error('Storage error:', error);
}`
        }
      ],
      bestPractices: [
        'Use debouncing for frequently updated values to avoid excessive localStorage writes',
        'Enable cross-tab sync for user preferences that should be consistent',
        'Handle storage errors gracefully in your UI',
        'Use meaningful keys to avoid conflicts with other applications'
      ],
      performance: {
        complexity: 'O(1)',
        memoryUsage: 'low',
        reRenderFrequency: 'minimal',
        optimizations: [
          'Debounced writes reduce localStorage operation frequency',
          'Error boundaries prevent crashes from storage issues',
          'Cross-tab synchronization uses efficient event listeners'
        ]
      },
      dependencies: ['useState', 'useEffect', 'useCallback', 'useRef'],
      since: '2024-01-15',
      author: 'Advanced Hook System'
    });
  }

  private parseParameters(parameters: string[]): HookParameter[] {
    return parameters.map((param, index) => ({
      name: param,
      type: this.inferParameterType(param),
      required: index < 2, // First two parameters usually required
      description: `Parameter: ${param}`
    }));
  }

  private parseReturnValue(returnType: string): HookReturnValue {
    return {
      type: returnType,
      description: `Returns: ${returnType}`,
      properties: this.parseReturnProperties(returnType)
    };
  }

  private parseReturnProperties(returnType: string): ReturnProperty[] {
    // Simple parsing for common return patterns
    if (returnType.includes('{') && returnType.includes('}')) {
      const match = returnType.match(/\{([^}]+)\}/);
      if (match) {
        return match[1].split(',').map(prop => {
          const trimmed = prop.trim();
          return {
            name: trimmed,
            type: 'any',
            description: `Property: ${trimmed}`
          };
        });
      }
    }
    
    if (returnType.includes('[') && returnType.includes(']')) {
      return [
        { name: 'value', type: 'any', description: 'Current value' },
        { name: 'setValue', type: 'function', description: 'Function to update value' }
      ];
    }

    return [];
  }

  private generateExamples(pattern: HookPattern): HookExample[] {
    return [
      {
        title: `Basic ${pattern.suggestedHookName} Usage`,
        description: `Simple example of using ${pattern.suggestedHookName}`,
        code: `const result = ${pattern.suggestedHookName}(${pattern.parameters.join(', ')});
console.log(result);`,
        output: 'Hook result object with relevant properties'
      }
    ];
  }

  private generateBestPractices(pattern: HookPattern): string[] {
    const practices: string[] = [];
    
    switch (pattern.category) {
      case 'form':
        practices.push(
          'Validate fields only after user interaction to improve UX',
          'Use debounced validation to prevent excessive re-renders',
          'Provide clear, actionable error messages'
        );
        break;
      case 'api':
        practices.push(
          'Handle loading and error states appropriately',
          'Use caching for read-only data to improve performance',
          'Cancel requests when component unmounts to prevent memory leaks'
        );
        break;
      case 'performance':
        practices.push(
          'Monitor performance metrics regularly',
          'Set appropriate thresholds for your use case',
          'Log warnings for performance issues'
        );
        break;
      default:
        practices.push(
          'Follow React hooks rules (only call at top level)',
          'Use useCallback and useMemo when appropriate',
          'Clean up resources in useEffect return functions'
        );
    }

    return practices;
  }

  private analyzePerformance(pattern: HookPattern): PerformanceInfo {
    const basePerformance: PerformanceInfo = {
      complexity: 'O(1)',
      memoryUsage: 'low',
      reRenderFrequency: 'minimal',
      optimizations: []
    };

    switch (pattern.category) {
      case 'api':
        return {
          ...basePerformance,
          memoryUsage: 'medium',
          optimizations: ['Request caching', 'Automatic cleanup', 'Request deduplication']
        };
      case 'form':
        return {
          ...basePerformance,
          optimizations: ['Debounced validation', 'Memoized functions', 'Selective updates']
        };
      case 'performance':
        return {
          ...basePerformance,
          memoryUsage: 'medium',
          optimizations: ['Performance monitoring', 'Memory tracking', 'Threshold checking']
        };
      default:
        return basePerformance;
    }
  }

  private inferParameterType(param: string): string {
    if (param.includes('initial') || param.includes('default')) return 'any';
    if (param.includes('url')) return 'string';
    if (param.includes('options') || param.includes('config')) return 'object';
    if (param.includes('enabled') || param.includes('auto')) return 'boolean';
    if (param.includes('delay') || param.includes('timeout')) return 'number';
    return 'any';
  }

  generateMarkdownDocumentation(hookName: string): string {
    const doc = this.hookLibrary.get(hookName);
    if (!doc) return `# Documentation not found for ${hookName}`;

    return `# ${doc.name}

## Description
${doc.description}

**Category:** ${doc.category}  
**Since:** ${doc.since}  
**Author:** ${doc.author}

## Parameters

${doc.parameters.map(param => 
  `- **${param.name}** (${param.type}${param.required ? ', required' : ', optional'}): ${param.description}${param.defaultValue !== undefined ? ` Default: \`${JSON.stringify(param.defaultValue)}\`` : ''}`
).join('\n')}

## Return Value

**Type:** \`${doc.returnValue.type}\`

${doc.returnValue.description}

${doc.returnValue.properties ? 
  '### Properties\n\n' + doc.returnValue.properties.map(prop => 
    `- **${prop.name}** (${prop.type}): ${prop.description}`
  ).join('\n') : ''}

## Examples

${doc.examples.map(example => `### ${example.title}

${example.description}

\`\`\`tsx
${example.code}
\`\`\`

${example.output ? `**Output:** ${example.output}` : ''}
`).join('\n')}

## Best Practices

${doc.bestPractices.map(practice => `- ${practice}`).join('\n')}

## Performance

- **Complexity:** ${doc.performance.complexity}
- **Memory Usage:** ${doc.performance.memoryUsage}
- **Re-render Frequency:** ${doc.performance.reRenderFrequency}

### Optimizations
${doc.performance.optimizations.map(opt => `- ${opt}`).join('\n')}

## Dependencies

${doc.dependencies.map(dep => `- ${dep}`).join('\n')}
`;
  }

  getAvailableHooks(): string[] {
    return Array.from(this.hookLibrary.keys());
  }

  getHookDocumentation(hookName: string): HookDocumentation | undefined {
    return this.hookLibrary.get(hookName);
  }

  getAllDocumentation(): HookDocumentation[] {
    return Array.from(this.hookLibrary.values());
  }

  getHooksByCategory(category: string): HookDocumentation[] {
    return Array.from(this.hookLibrary.values()).filter(doc => doc.category === category);
  }
}