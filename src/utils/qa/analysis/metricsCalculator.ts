
export class MetricsCalculator {
  calculateMaintainabilityIndex(lines: number, complexity: number): number {
    const volume = Math.log2(lines) * 10;
    const complexityPenalty = complexity * 2;
    return Math.max(0, Math.min(100, 100 - volume - complexityPenalty));
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

  identifyIssues(metrics: any): string[] {
    const issues: string[] = [];
    
    if (metrics.lines > 300) {
      issues.push('File is very large and should be split');
    }
    if (metrics.complexity > 25) {
      issues.push('High cyclomatic complexity detected');
    }
    if (metrics.componentCount > 1) {
      issues.push('Multiple components in single file');
    }
    if (metrics.hookCount > 4) {
      issues.push('Too many hooks, consider extracting custom hooks');
    }
    
    return issues;
  }

  estimateImports(fileType: string): string[] {
    const common = ['react'];
    if (fileType === 'component' || fileType === 'page') {
      return [...common, '@/components/ui', '@/hooks', '@/utils'];
    }
    if (fileType === 'hook') {
      return [...common, '@/utils'];
    }
    return ['@/types'];
  }

  estimateExports(path: string, fileType: string): string[] {
    const fileName = path.split('/').pop()?.replace('.tsx', '').replace('.ts', '') || 'Unknown';
    return [fileName];
  }
}
