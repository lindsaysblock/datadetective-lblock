
export class MetricsCalculator {
  calculateMaintainabilityIndex(lines: number, complexity: number): number {
    // Simplified maintainability index calculation
    const volume = lines * Math.log2(Math.max(complexity, 1));
    const maintainability = Math.max(0, 171 - 5.2 * Math.log(volume) - 0.23 * complexity - 16.2 * Math.log(lines));
    return Math.min(100, maintainability);
  }

  estimateImports(fileType: string): string[] {
    const commonImports = {
      'component': ['React', '@/components/ui/*', 'lucide-react'],
      'page': ['React', '@/components/*', '@/hooks/*', 'lucide-react'],
      'hook': ['React', '@/utils/*'],
      'utility': ['@/types/*'],
      'type': []
    };

    return commonImports[fileType as keyof typeof commonImports] || [];
  }

  estimateExports(path: string, fileType: string): string[] {
    const fileName = path.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '') || 'Unknown';
    
    if (fileType === 'component' || fileType === 'page') {
      return [fileName];
    } else if (fileType === 'hook') {
      return [fileName];
    } else if (fileType === 'utility') {
      return [`${fileName}Utils`, `${fileName}Helper`];
    }
    
    return [fileName];
  }

  identifyIssues(metrics: any): string[] {
    const issues: string[] = [];
    
    if (metrics.lines > 300) {
      issues.push('File is too large');
    }
    
    if (metrics.complexity > 20) {
      issues.push('High cyclomatic complexity');
    }
    
    if (metrics.imports.length > 15) {
      issues.push('Too many imports');
    }
    
    return issues;
  }

  getThresholdForType(fileType: string): number {
    const thresholds = {
      component: 200,
      page: 300,
      hook: 150,
      utility: 250,
      type: 100
    };
    return thresholds[fileType as keyof typeof thresholds] || 200;
  }
}
