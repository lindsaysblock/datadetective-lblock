
export interface CodingStandard {
  id: string;
  name: string;
  description: string;
  category: 'structure' | 'performance' | 'maintainability' | 'security' | 'accessibility';
  severity: 'error' | 'warning' | 'info';
  autoFixable: boolean;
  rule: (code: string, filePath: string) => StandardViolation[];
  autoFix?: (code: string, violations: StandardViolation[]) => string;
}

export interface StandardViolation {
  standardId: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  autoFixable: boolean;
  suggestedFix?: string;
}

export interface ComplianceReport {
  filePath: string;
  violations: StandardViolation[];
  complianceScore: number;
  autoFixesApplied: number;
  manualFixesNeeded: number;
}

export const CODING_STANDARDS: CodingStandard[] = [
  {
    id: 'file-size-limit',
    name: 'File Size Limit',
    description: 'Files should not exceed recommended line limits',
    category: 'maintainability',
    severity: 'warning',
    autoFixable: false,
    rule: (code: string, filePath: string) => {
      const lines = code.split('\n').length;
      const thresholds = {
        component: 200,
        hook: 150,
        utility: 250,
        page: 300
      };
      
      const fileType = getFileType(filePath);
      const threshold = thresholds[fileType as keyof typeof thresholds] || 200;
      
      if (lines > threshold) {
        return [{
          standardId: 'file-size-limit',
          line: lines,
          column: 0,
          message: `File has ${lines} lines, exceeds ${threshold} line threshold for ${fileType}`,
          severity: 'warning' as const,
          autoFixable: false,
          suggestedFix: `Consider splitting into smaller, focused modules`
        }];
      }
      return [];
    }
  },
  
  {
    id: 'no-unused-imports',
    name: 'No Unused Imports',
    description: 'Remove unused import statements',
    category: 'maintainability',
    severity: 'warning',
    autoFixable: true,
    rule: (code: string) => {
      const violations: StandardViolation[] = [];
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        if (line.trim().startsWith('import') && !line.includes('type')) {
          const importMatch = line.match(/import\s+{([^}]+)}\s+from/);
          if (importMatch) {
            const imports = importMatch[1].split(',').map(i => i.trim());
            imports.forEach(importName => {
              const cleanImport = importName.replace(/\s+as\s+\w+/, '');
              if (!code.includes(cleanImport) || code.indexOf(cleanImport) === code.indexOf(line)) {
                violations.push({
                  standardId: 'no-unused-imports',
                  line: index + 1,
                  column: 0,
                  message: `Unused import: ${importName}`,
                  severity: 'warning',
                  autoFixable: true
                });
              }
            });
          }
        }
      });
      
      return violations;
    },
    autoFix: (code: string, violations: StandardViolation[]) => {
      let fixedCode = code;
      const lines = code.split('\n');
      
      violations.forEach(violation => {
        if (violation.standardId === 'no-unused-imports') {
          const lineIndex = violation.line - 1;
          const line = lines[lineIndex];
          
          if (line.includes('{') && line.includes('}')) {
            const beforeBrace = line.substring(0, line.indexOf('{') + 1);
            const afterBrace = line.substring(line.indexOf('}'));
            const imports = line.substring(line.indexOf('{') + 1, line.indexOf('}')).split(',');
            
            const usedImports = imports.filter(imp => {
              const cleanImp = imp.trim().replace(/\s+as\s+\w+/, '');
              return code.split('\n').some((codeLine, idx) => 
                idx !== lineIndex && codeLine.includes(cleanImp)
              );
            });
            
            if (usedImports.length === 0) {
              lines[lineIndex] = '';
            } else {
              lines[lineIndex] = beforeBrace + usedImports.join(', ') + afterBrace;
            }
          }
        }
      });
      
      return lines.join('\n').replace(/\n\s*\n\s*\n/g, '\n\n');
    }
  },
  
  {
    id: 'react-performance',
    name: 'React Performance Optimization',
    description: 'Ensure React components use performance best practices',
    category: 'performance',
    severity: 'info',
    autoFixable: true,
    rule: (code: string, filePath: string) => {
      const violations: StandardViolation[] = [];
      
      if (filePath.includes('components') && code.includes('useState') && !code.includes('useMemo')) {
        const lines = code.split('\n');
        lines.forEach((line, index) => {
          if (line.includes('useState') && !line.includes('useMemo')) {
            violations.push({
              standardId: 'react-performance',
              line: index + 1,
              column: 0,
              message: 'Consider using useMemo for expensive computations',
              severity: 'info',
              autoFixable: false,
              suggestedFix: 'Add useMemo for computed values or expensive operations'
            });
          }
        });
      }
      
      return violations;
    }
  },
  
  {
    id: 'tailwind-semantic-tokens',
    name: 'Use Semantic Tailwind Tokens',
    description: 'Use semantic color tokens instead of direct colors',
    category: 'maintainability',
    severity: 'warning',
    autoFixable: true,
    rule: (code: string) => {
      const violations: StandardViolation[] = [];
      const directColorPattern = /bg-(red|blue|green|yellow|purple|pink|indigo|gray)-\d+/g;
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        const matches = line.matchAll(directColorPattern);
        for (const match of matches) {
          violations.push({
            standardId: 'tailwind-semantic-tokens',
            line: index + 1,
            column: match.index || 0,
            message: `Use semantic tokens instead of direct color: ${match[0]}`,
            severity: 'warning',
            autoFixable: true,
            suggestedFix: 'Replace with semantic tokens like bg-primary, bg-secondary, etc.'
          });
        }
      });
      
      return violations;
    },
    autoFix: (code: string, violations: StandardViolation[]) => {
      let fixedCode = code;
      const colorMappings: Record<string, string> = {
        'bg-blue-500': 'bg-primary',
        'bg-blue-600': 'bg-primary/90',
        'bg-red-500': 'bg-destructive',
        'bg-green-500': 'bg-primary',
        'bg-gray-100': 'bg-muted',
        'bg-gray-200': 'bg-muted/80',
        'text-blue-600': 'text-primary',
        'text-red-600': 'text-destructive',
        'text-gray-600': 'text-muted-foreground'
      };
      
      Object.entries(colorMappings).forEach(([direct, semantic]) => {
        fixedCode = fixedCode.replace(new RegExp(direct, 'g'), semantic);
      });
      
      return fixedCode;
    }
  },
  
  {
    id: 'typescript-strict',
    name: 'TypeScript Strict Mode',
    description: 'Use proper TypeScript types and avoid any',
    category: 'maintainability',
    severity: 'error',
    autoFixable: false,
    rule: (code: string) => {
      const violations: StandardViolation[] = [];
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes(': any') || line.includes('<any>')) {
          violations.push({
            standardId: 'typescript-strict',
            line: index + 1,
            column: line.indexOf('any'),
            message: 'Avoid using "any" type, use specific types instead',
            severity: 'error',
            autoFixable: false,
            suggestedFix: 'Define proper TypeScript interfaces or use unknown/object'
          });
        }
      });
      
      return violations;
    }
  }
];

function getFileType(filePath: string): string {
  if (filePath.includes('/components/')) return 'component';
  if (filePath.includes('/hooks/')) return 'hook';
  if (filePath.includes('/pages/')) return 'page';
  if (filePath.includes('/utils/')) return 'utility';
  return 'unknown';
}
