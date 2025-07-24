/**
 * Smart Documentation Generator
 * Automatically generates comprehensive documentation for components, hooks, utilities, and APIs
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

export interface DocumentationConfig {
  includeTypes: boolean;
  includeExamples: boolean;
  includeTests: boolean;
  generateApiDocs: boolean;
  outputFormat: 'markdown' | 'html' | 'json';
}

export interface FileDocumentation {
  fileName: string;
  filePath: string;
  type: 'component' | 'hook' | 'utility' | 'type';
  description: string;
  exports: ExportInfo[];
  imports: ImportInfo[];
  examples: string[];
  tests: string[];
  complexity: number;
  lastModified: Date;
}

export interface ExportInfo {
  name: string;
  type: 'function' | 'class' | 'interface' | 'type' | 'const';
  signature: string;
  description: string;
  parameters?: ParameterInfo[];
  returns?: string;
}

export interface ImportInfo {
  name: string;
  source: string;
  isDefault: boolean;
}

export interface ParameterInfo {
  name: string;
  type: string;
  optional: boolean;
  description: string;
  defaultValue?: string;
}

export interface ApiDocumentation {
  version: string;
  components: FileDocumentation[];
  hooks: FileDocumentation[];
  utilities: FileDocumentation[];
  types: FileDocumentation[];
  coverage: {
    totalFiles: number;
    documentedFiles: number;
    percentage: number;
  };
  generatedAt: Date;
}

export class SmartDocumentationGenerator {
  private config: DocumentationConfig;
  private documentationCache: Map<string, FileDocumentation> = new Map();

  constructor(config: Partial<DocumentationConfig> = {}) {
    this.config = {
      includeTypes: true,
      includeExamples: true,
      includeTests: true,
      generateApiDocs: true,
      outputFormat: 'markdown',
      ...config
    };
  }

  async generateProjectDocumentation(): Promise<ApiDocumentation> {
    console.log('📚 Generating comprehensive project documentation...');

    const files = await this.scanProjectFiles();
    const documentation: FileDocumentation[] = [];

    for (const file of files) {
      try {
        const fileDoc = await this.generateFileDocumentation(file);
        if (fileDoc) {
          documentation.push(fileDoc);
          this.documentationCache.set(file, fileDoc);
        }
      } catch (error) {
        console.warn(`Failed to generate documentation for ${file}:`, error);
      }
    }

    const apiDoc: ApiDocumentation = {
      version: '1.0.0',
      components: documentation.filter(d => d.type === 'component'),
      hooks: documentation.filter(d => d.type === 'hook'),
      utilities: documentation.filter(d => d.type === 'utility'),
      types: documentation.filter(d => d.type === 'type'),
      coverage: {
        totalFiles: files.length,
        documentedFiles: documentation.length,
        percentage: Math.round((documentation.length / files.length) * 100)
      },
      generatedAt: new Date()
    };

    console.log(`✅ Generated documentation for ${documentation.length}/${files.length} files (${apiDoc.coverage.percentage}%)`);
    return apiDoc;
  }

  private async scanProjectFiles(): Promise<string[]> {
    const files: string[] = [];
    const directories = ['src/components', 'src/hooks', 'src/utils', 'src/types'];

    for (const dir of directories) {
      try {
        const dirFiles = await this.scanDirectory(dir);
        files.push(...dirFiles);
      } catch (error) {
        // Directory might not exist, continue
      }
    }

    return files.filter(file => 
      ['.ts', '.tsx', '.js', '.jsx'].includes(extname(file)) &&
      !file.includes('.test.') &&
      !file.includes('.spec.')
    );
  }

  private async scanDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await readdir(dir);
      
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          const subFiles = await this.scanDirectory(fullPath);
          files.push(...subFiles);
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or no access
    }

    return files;
  }

  private async generateFileDocumentation(filePath: string): Promise<FileDocumentation | null> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const stats = await stat(filePath);
      
      const fileType = this.determineFileType(filePath, content);
      const exports = this.extractExports(content);
      const imports = this.extractImports(content);
      const description = this.extractDescription(content);
      const examples = this.config.includeExamples ? this.extractExamples(content) : [];
      const tests = this.config.includeTests ? await this.findRelatedTests(filePath) : [];
      const complexity = this.calculateComplexity(content);

      return {
        fileName: basename(filePath),
        filePath,
        type: fileType,
        description,
        exports,
        imports,
        examples,
        tests,
        complexity,
        lastModified: stats.mtime
      };
    } catch (error) {
      console.warn(`Failed to process file ${filePath}:`, error);
      return null;
    }
  }

  private determineFileType(filePath: string, content: string): 'component' | 'hook' | 'utility' | 'type' {
    if (filePath.includes('/hooks/') || basename(filePath).startsWith('use')) {
      return 'hook';
    }
    if (filePath.includes('/components/') || content.includes('JSX.Element') || content.includes('return (')) {
      return 'component';
    }
    if (filePath.includes('/types/') || content.includes('interface ') || content.includes('type ')) {
      return 'type';
    }
    return 'utility';
  }

  private extractExports(content: string): ExportInfo[] {
    const exports: ExportInfo[] = [];
    
    // Extract function exports
    const functionRegex = /export\s+(const|function)\s+(\w+)/g;
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      exports.push({
        name: match[2],
        type: 'function',
        signature: this.extractFunctionSignature(content, match[2]),
        description: this.extractJSDocDescription(content, match[2])
      });
    }

    // Extract interface exports
    const interfaceRegex = /export\s+interface\s+(\w+)/g;
    while ((match = interfaceRegex.exec(content)) !== null) {
      exports.push({
        name: match[1],
        type: 'interface',
        signature: this.extractInterfaceSignature(content, match[1]),
        description: this.extractJSDocDescription(content, match[1])
      });
    }

    // Extract type exports
    const typeRegex = /export\s+type\s+(\w+)/g;
    while ((match = typeRegex.exec(content)) !== null) {
      exports.push({
        name: match[1],
        type: 'type',
        signature: this.extractTypeSignature(content, match[1]),
        description: this.extractJSDocDescription(content, match[1])
      });
    }

    return exports;
  }

  private extractImports(content: string): ImportInfo[] {
    const imports: ImportInfo[] = [];
    const importRegex = /import\s+(?:(\w+)|\{([^}]+)\})\s+from\s+['"`]([^'"`]+)['"`]/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const [, defaultImport, namedImports, source] = match;
      
      if (defaultImport) {
        imports.push({
          name: defaultImport,
          source,
          isDefault: true
        });
      }
      
      if (namedImports) {
        namedImports.split(',').forEach(namedImport => {
          const name = namedImport.trim();
          if (name) {
            imports.push({
              name,
              source,
              isDefault: false
            });
          }
        });
      }
    }

    return imports;
  }

  private extractDescription(content: string): string {
    // Look for file-level JSDoc comment
    const fileDocRegex = /\/\*\*\s*\n([^*]|\*(?!\/))*\*\//;
    const match = content.match(fileDocRegex);
    
    if (match) {
      return match[0]
        .replace(/\/\*\*|\*\/|\s*\*\s?/g, '')
        .trim()
        .split('\n')[0];
    }

    // Fallback to first comment
    const commentRegex = /\/\/\s*(.+)/;
    const commentMatch = content.match(commentRegex);
    return commentMatch ? commentMatch[1] : 'No description available';
  }

  private extractExamples(content: string): string[] {
    const examples: string[] = [];
    
    // Look for @example tags in JSDoc
    const exampleRegex = /@example\s*\n([\s\S]*?)(?=@|\*\/)/g;
    let match;
    while ((match = exampleRegex.exec(content)) !== null) {
      examples.push(match[1].trim());
    }

    return examples;
  }

  private async findRelatedTests(filePath: string): Promise<string[]> {
    const tests: string[] = [];
    const baseName = basename(filePath, extname(filePath));
    const testPatterns = [
      `${baseName}.test.ts`,
      `${baseName}.test.tsx`,
      `${baseName}.spec.ts`,
      `${baseName}.spec.tsx`
    ];

    for (const pattern of testPatterns) {
      try {
        const testPath = filePath.replace(basename(filePath), pattern);
        await stat(testPath);
        tests.push(testPath);
      } catch {
        // Test file doesn't exist
      }
    }

    return tests;
  }

  private calculateComplexity(content: string): number {
    let complexity = 1; // Base complexity
    
    // Count decision points
    const decisionKeywords = ['if', 'else', 'while', 'for', 'switch', 'case', '&&', '||', '?'];
    for (const keyword of decisionKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = content.match(regex);
      complexity += matches ? matches.length : 0;
    }

    return complexity;
  }

  private extractFunctionSignature(content: string, functionName: string): string {
    const regex = new RegExp(`(export\\s+)?(const|function)\\s+${functionName}[^{]*`, 'g');
    const match = content.match(regex);
    return match ? match[0] : '';
  }

  private extractInterfaceSignature(content: string, interfaceName: string): string {
    const regex = new RegExp(`interface\\s+${interfaceName}[^}]*}`, 'g');
    const match = content.match(regex);
    return match ? match[0] : '';
  }

  private extractTypeSignature(content: string, typeName: string): string {
    const regex = new RegExp(`type\\s+${typeName}[^;]*`, 'g');
    const match = content.match(regex);
    return match ? match[0] : '';
  }

  private extractJSDocDescription(content: string, name: string): string {
    const regex = new RegExp(`\\/\\*\\*[\\s\\S]*?\\*\\/\\s*(?:export\\s+)?(?:const|function|interface|type)\\s+${name}`, 'g');
    const match = content.match(regex);
    
    if (match) {
      const jsDoc = match[0].match(/\/\*\*[\s\S]*?\*\//);
      if (jsDoc) {
        return jsDoc[0]
          .replace(/\/\*\*|\*\/|\s*\*\s?/g, '')
          .split('@')[0]
          .trim();
      }
    }
    
    return 'No description available';
  }

  async generateMarkdownDocs(apiDoc: ApiDocumentation): Promise<string> {
    let markdown = `# API Documentation\n\n`;
    markdown += `Generated on ${apiDoc.generatedAt.toISOString()}\n\n`;
    markdown += `## Coverage\n`;
    markdown += `- Total Files: ${apiDoc.coverage.totalFiles}\n`;
    markdown += `- Documented Files: ${apiDoc.coverage.documentedFiles}\n`;
    markdown += `- Coverage: ${apiDoc.coverage.percentage}%\n\n`;

    if (apiDoc.components.length > 0) {
      markdown += `## Components\n\n`;
      for (const component of apiDoc.components) {
        markdown += this.generateFileMarkdown(component);
      }
    }

    if (apiDoc.hooks.length > 0) {
      markdown += `## Hooks\n\n`;
      for (const hook of apiDoc.hooks) {
        markdown += this.generateFileMarkdown(hook);
      }
    }

    if (apiDoc.utilities.length > 0) {
      markdown += `## Utilities\n\n`;
      for (const utility of apiDoc.utilities) {
        markdown += this.generateFileMarkdown(utility);
      }
    }

    return markdown;
  }

  private generateFileMarkdown(fileDoc: FileDocumentation): string {
    let markdown = `### ${fileDoc.fileName}\n\n`;
    markdown += `${fileDoc.description}\n\n`;
    
    if (fileDoc.exports.length > 0) {
      markdown += `#### Exports\n\n`;
      for (const exp of fileDoc.exports) {
        markdown += `- **${exp.name}** (${exp.type}): ${exp.description}\n`;
        if (exp.signature) {
          markdown += `  \`\`\`typescript\n  ${exp.signature}\n  \`\`\`\n`;
        }
      }
      markdown += '\n';
    }

    if (fileDoc.examples.length > 0) {
      markdown += `#### Examples\n\n`;
      for (const example of fileDoc.examples) {
        markdown += `\`\`\`typescript\n${example}\n\`\`\`\n\n`;
      }
    }

    return markdown;
  }

  getDocumentationCache(): Map<string, FileDocumentation> {
    return new Map(this.documentationCache);
  }

  clearCache(): void {
    this.documentationCache.clear();
  }
}