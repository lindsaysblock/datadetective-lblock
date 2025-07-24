/**
 * Intelligent Code Generator
 * Automatically generates components, hooks, utilities, and tests based on patterns and requirements
 */

export interface CodeGenerationRequest {
  type: 'component' | 'hook' | 'utility' | 'test' | 'type' | 'api';
  name: string;
  description: string;
  requirements: string[];
  dependencies?: string[];
  props?: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface GeneratedCode {
  fileName: string;
  filePath: string;
  content: string;
  dependencies: string[];
  tests?: string;
  documentation?: string;
  typeDefinitions?: string;
}

export interface CodePattern {
  name: string;
  type: string;
  template: string;
  dependencies: string[];
  examples: string[];
}

export class IntelligentCodeGenerator {
  private patterns: Map<string, CodePattern> = new Map();
  private generatedFiles: Map<string, GeneratedCode> = new Map();

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns(): void {
    // Component patterns
    this.patterns.set('react-component', {
      name: 'React Component',
      type: 'component',
      template: this.getComponentTemplate(),
      dependencies: ['React'],
      examples: ['Button', 'Modal', 'Card']
    });

    // Hook patterns
    this.patterns.set('custom-hook', {
      name: 'Custom Hook',
      type: 'hook',
      template: this.getHookTemplate(),
      dependencies: ['React'],
      examples: ['useLocalStorage', 'useApi', 'useForm']
    });

    // Utility patterns
    this.patterns.set('utility-function', {
      name: 'Utility Function',
      type: 'utility',
      template: this.getUtilityTemplate(),
      dependencies: [],
      examples: ['formatDate', 'validateEmail', 'debounce']
    });

    // Test patterns
    this.patterns.set('component-test', {
      name: 'Component Test',
      type: 'test',
      template: this.getTestTemplate(),
      dependencies: ['@testing-library/react', 'vitest'],
      examples: ['Button.test.tsx', 'Modal.test.tsx']
    });
  }

  async generateCode(request: CodeGenerationRequest): Promise<GeneratedCode> {
    console.log(`🎨 Generating ${request.type}: ${request.name}`);

    const pattern = this.patterns.get(`${request.type === 'component' ? 'react-' : ''}${request.type}${request.type === 'test' ? '' : request.type === 'component' ? '' : request.type === 'hook' ? '' : '-function'}`);
    
    if (!pattern) {
      throw new Error(`No pattern found for type: ${request.type}`);
    }

    const generated = await this.processTemplate(pattern, request);
    this.generatedFiles.set(generated.fileName, generated);

    console.log(`✅ Generated ${request.type} successfully: ${generated.fileName}`);
    return generated;
  }

  private async processTemplate(pattern: CodePattern, request: CodeGenerationRequest): Promise<GeneratedCode> {
    const fileName = this.generateFileName(request);
    const filePath = this.generateFilePath(request);
    
    let content = pattern.template;
    
    // Replace template variables
    content = content.replace(/\{\{name\}\}/g, request.name);
    content = content.replace(/\{\{description\}\}/g, request.description);
    content = content.replace(/\{\{requirements\}\}/g, request.requirements.join(', '));
    
    // Generate props interface for components
    if (request.type === 'component' && request.props) {
      const propsInterface = this.generatePropsInterface(request.name, request.props);
      content = content.replace(/\{\{propsInterface\}\}/g, propsInterface);
      content = content.replace(/\{\{propsType\}\}/g, `${request.name}Props`);
    } else {
      content = content.replace(/\{\{propsInterface\}\}/g, '');
      content = content.replace(/\{\{propsType\}\}/g, '{}');
    }

    // Generate imports
    const imports = this.generateImports(pattern.dependencies, request.dependencies || []);
    content = content.replace(/\{\{imports\}\}/g, imports);

    const generated: GeneratedCode = {
      fileName,
      filePath,
      content,
      dependencies: [...pattern.dependencies, ...(request.dependencies || [])],
      tests: request.type !== 'test' ? this.generateTests(request) : undefined,
      documentation: this.generateDocumentation(request),
      typeDefinitions: request.type === 'utility' ? this.generateTypeDefinitions(request) : undefined
    };

    return generated;
  }

  private generateFileName(request: CodeGenerationRequest): string {
    const extension = request.type === 'component' ? '.tsx' : 
                     request.type === 'hook' ? '.ts' : 
                     request.type === 'test' ? '.test.tsx' : '.ts';
    
    return `${request.name}${extension}`;
  }

  private generateFilePath(request: CodeGenerationRequest): string {
    const baseDir = request.type === 'component' ? 'src/components' : 
                    request.type === 'hook' ? 'src/hooks' : 
                    request.type === 'utility' ? 'src/utils' : 
                    request.type === 'test' ? 'src/__tests__' : 'src/types';
    
    return `${baseDir}/${this.generateFileName(request)}`;
  }

  private generatePropsInterface(name: string, props: Record<string, string>): string {
    const propLines = Object.entries(props)
      .map(([key, type]) => `  ${key}: ${type};`)
      .join('\n');
    
    return `interface ${name}Props {\n${propLines}\n}`;
  }

  private generateImports(patternDeps: string[], requestDeps: string[]): string {
    const allDeps = [...new Set([...patternDeps, ...requestDeps])];
    return allDeps
      .map(dep => {
        if (dep === 'React') return "import React from 'react';";
        if (dep.startsWith('@/')) return `import ${dep.split('/').pop()} from '${dep}';`;
        return `import { } from '${dep}';`;
      })
      .join('\n');
  }

  private generateTests(request: CodeGenerationRequest): string {
    return `import { render, screen } from '@testing-library/react';
import { ${request.name} } from './${request.name}';

describe('${request.name}', () => {
  it('renders correctly', () => {
    render(<${request.name} />);
    expect(screen.getByTestId('${request.name.toLowerCase()}')).toBeInTheDocument();
  });

  it('handles props correctly', () => {
    // Add specific prop tests based on requirements
    ${request.requirements.map(req => `// Test: ${req}`).join('\n    ')}
  });
});`;
  }

  private generateDocumentation(request: CodeGenerationRequest): string {
    return `# ${request.name}

${request.description}

## Requirements
${request.requirements.map(req => `- ${req}`).join('\n')}

## Usage
\`\`\`tsx
import { ${request.name} } from './${request.name}';

// Basic usage
<${request.name} />
\`\`\`

## Props
${request.props ? Object.entries(request.props).map(([key, type]) => `- \`${key}\`: ${type}`).join('\n') : 'No props'}

## Dependencies
${request.dependencies?.map(dep => `- ${dep}`).join('\n') || 'None'}
`;
  }

  private generateTypeDefinitions(request: CodeGenerationRequest): string {
    return `export interface ${request.name}Options {
  // Add configuration options
}

export interface ${request.name}Result {
  // Add return type definitions
}

export type ${request.name}Callback = (result: ${request.name}Result) => void;
`;
  }

  private getComponentTemplate(): string {
    return `{{imports}}

{{propsInterface}}

/**
 * {{description}}
 */
export const {{name}} = (props: {{propsType}}) => {
  return (
    <div data-testid="{{name}}" className="{{name}}">
      {/* Component implementation based on requirements */}
      {/* {{requirements}} */}
    </div>
  );
};

export default {{name}};
`;
  }

  private getHookTemplate(): string {
    return `{{imports}}

/**
 * {{description}}
 * Requirements: {{requirements}}
 */
export const {{name}} = () => {
  // Hook implementation
  
  return {
    // Return hook interface
  };
};

export default {{name}};
`;
  }

  private getUtilityTemplate(): string {
    return `{{imports}}

/**
 * {{description}}
 * Requirements: {{requirements}}
 */
export const {{name}} = () => {
  // Utility implementation
};

export default {{name}};
`;
  }

  private getTestTemplate(): string {
    return `{{imports}}

describe('{{name}}', () => {
  it('{{description}}', () => {
    // Test implementation based on requirements
    // {{requirements}}
  });
});
`;
  }

  getGeneratedFiles(): Map<string, GeneratedCode> {
    return new Map(this.generatedFiles);
  }

  clearGeneratedFiles(): void {
    this.generatedFiles.clear();
  }

  getAvailablePatterns(): CodePattern[] {
    return Array.from(this.patterns.values());
  }
}