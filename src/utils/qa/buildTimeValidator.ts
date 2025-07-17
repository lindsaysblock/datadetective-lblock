/**
 * Build-time validator for code quality standards
 * Ensures all files meet our coding standards before build
 */

import { promises as fs } from 'fs';
import { join } from 'path';

interface FileViolation {
  file: string;
  lines: number;
  threshold: number;
  violation: string;
}

export class BuildTimeValidator {
  private static readonly MAX_LINES = 220;
  private static readonly EXCLUDE_PATTERNS = [
    'node_modules',
    'dist',
    'build',
    '.git',
    'coverage',
    '*.min.js',
    '*.bundle.js'
  ];

  /**
   * Validates all TypeScript and JavaScript files in the project
   */
  static async validateProject(rootPath: string = process.cwd()): Promise<FileViolation[]> {
    const violations: FileViolation[] = [];
    
    try {
      const files = await this.getAllSourceFiles(rootPath);
      
      for (const file of files) {
        const violation = await this.validateFile(file);
        if (violation) {
          violations.push(violation);
        }
      }
    } catch (error) {
      console.error('Build-time validation failed:', error);
    }

    return violations;
  }

  /**
   * Validates a single file against coding standards
   */
  private static async validateFile(filePath: string): Promise<FileViolation | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => 
        line.trim() !== '' && !line.trim().startsWith('//')
      ).length;

      if (lines > this.MAX_LINES) {
        return {
          file: filePath,
          lines,
          threshold: this.MAX_LINES,
          violation: `File exceeds maximum line limit (${lines}/${this.MAX_LINES})`
        };
      }
    } catch (error) {
      console.error(`Failed to validate file ${filePath}:`, error);
    }

    return null;
  }

  /**
   * Recursively gets all source files in the project
   */
  private static async getAllSourceFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);
        
        if (this.shouldExclude(fullPath)) {
          continue;
        }
        
        if (entry.isDirectory()) {
          const subFiles = await this.getAllSourceFiles(fullPath);
          files.push(...subFiles);
        } else if (this.isSourceFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist or be accessible
    }

    return files;
  }

  /**
   * Checks if a file should be excluded from validation
   */
  private static shouldExclude(filePath: string): boolean {
    return this.EXCLUDE_PATTERNS.some(pattern => 
      filePath.includes(pattern) || filePath.match(pattern.replace('*', '.*'))
    );
  }

  /**
   * Checks if a file is a source file that should be validated
   */
  private static isSourceFile(fileName: string): boolean {
    const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx'];
    return sourceExtensions.some(ext => fileName.endsWith(ext));
  }

  /**
   * Generates a build report of all violations
   */
  static generateReport(violations: FileViolation[]): string {
    if (violations.length === 0) {
      return '✅ All files meet coding standards';
    }

    let report = `❌ Code Quality Violations Found (${violations.length} files)\n\n`;
    
    violations.forEach(violation => {
      report += `📁 ${violation.file}\n`;
      report += `   ${violation.violation}\n`;
      report += `   Action required: Refactor into smaller components\n\n`;
    });

    report += '💡 Run auto-refactoring to fix these issues automatically.\n';
    
    return report;
  }
}

export default BuildTimeValidator;