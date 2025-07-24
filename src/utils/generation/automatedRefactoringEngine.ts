/**
 * Automated Refactoring Engine
 * Intelligently refactors code based on patterns, best practices, and performance optimizations
 */

export interface RefactoringRule {
  id: string;
  name: string;
  description: string;
  pattern: RegExp;
  replacement: string | ((match: string) => string);
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  category: 'performance' | 'maintainability' | 'readability' | 'security';
  autoApply: boolean;
}

export interface RefactoringResult {
  fileName: string;
  originalContent: string;
  refactoredContent: string;
  appliedRules: RefactoringRule[];
  improvements: string[];
  warnings: string[];
  confidence: number;
  linesChanged: number;
}

export interface RefactoringSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  filesProcessed: number;
  totalRefactorings: number;
  results: RefactoringResult[];
  summary: {
    performanceImprovements: number;
    maintainabilityImprovements: number;
    readabilityImprovements: number;
    securityImprovements: number;
  };
}

export class AutomatedRefactoringEngine {
  private rules: Map<string, RefactoringRule> = new Map();
  private sessions: Map<string, RefactoringSession> = new Map();
  private currentSession: RefactoringSession | null = null;

  constructor() {
    this.initializeRefactoringRules();
  }

  private initializeRefactoringRules(): void {
    // Performance rules
    this.addRule({
      id: 'react-memo-optimization',
      name: 'React.memo Optimization',
      description: 'Add React.memo to pure components for performance',
      pattern: /export const (\w+) = \(([^)]*)\) => \{/,
      replacement: (match: string) => {
        const [, componentName, props] = match.match(/export const (\w+) = \(([^)]*)\) => \{/) || [];
        return `export const ${componentName} = React.memo((${props}) => {`;
      },
      confidence: 0.8,
      impact: 'medium',
      category: 'performance',
      autoApply: true
    });

    this.addRule({
      id: 'usecallback-optimization',
      name: 'useCallback Optimization',
      description: 'Wrap function definitions in useCallback for performance',
      pattern: /const (\w+) = \([^)]*\) => \{[\s\S]*?\};/g,
      replacement: (match: string) => {
        const funcName = match.match(/const (\w+) =/)?.[1];
        return match.replace(/const (\w+) = /, `const $1 = useCallback(`).replace(/};$/, '}, []);');
      },
      confidence: 0.7,
      impact: 'medium',
      category: 'performance',
      autoApply: false
    });

    // Maintainability rules
    this.addRule({
      id: 'extract-constants',
      name: 'Extract Magic Numbers',
      description: 'Extract magic numbers into named constants',
      pattern: /(\w+\s*[=<>!]+\s*)(\d{2,})/g,
      replacement: 'const THRESHOLD_VALUE = $2;\n$1THRESHOLD_VALUE',
      confidence: 0.6,
      impact: 'low',
      category: 'maintainability',
      autoApply: false
    });

    this.addRule({
      id: 'consistent-naming',
      name: 'Consistent Naming Convention',
      description: 'Ensure consistent camelCase naming',
      pattern: /const (\w*_\w+)/g,
      replacement: (match: string) => {
        const varName = match.match(/const (\w*_\w+)/)?.[1];
        if (varName) {
          const camelCase = varName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          return match.replace(varName, camelCase);
        }
        return match;
      },
      confidence: 0.9,
      impact: 'low',
      category: 'readability',
      autoApply: true
    });

    // Security rules
    this.addRule({
      id: 'prevent-xss',
      name: 'Prevent XSS with dangerouslySetInnerHTML',
      description: 'Add sanitization for dangerouslySetInnerHTML',
      pattern: /dangerouslySetInnerHTML=\{\{__html:\s*([^}]+)\}\}/g,
      replacement: 'dangerouslySetInnerHTML={{__html: sanitizeHtml($1)}}',
      confidence: 0.95,
      impact: 'high',
      category: 'security',
      autoApply: false
    });

    // Readability rules
    this.addRule({
      id: 'simplify-conditionals',
      name: 'Simplify Conditional Expressions',
      description: 'Simplify boolean expressions',
      pattern: /if\s*\(\s*(\w+)\s*===?\s*true\s*\)/g,
      replacement: 'if ($1)',
      confidence: 0.95,
      impact: 'low',
      category: 'readability',
      autoApply: true
    });

    this.addRule({
      id: 'destructuring-props',
      name: 'Use Destructuring for Props',
      description: 'Use destructuring assignment for cleaner code',
      pattern: /const (\w+) = props\.(\w+);/g,
      replacement: 'const { $2: $1 } = props;',
      confidence: 0.8,
      impact: 'low',
      category: 'readability',
      autoApply: true
    });
  }

  private addRule(rule: RefactoringRule): void {
    this.rules.set(rule.id, rule);
  }

  startRefactoringSession(): string {
    const sessionId = `refactor_${Date.now()}`;
    this.currentSession = {
      id: sessionId,
      startTime: new Date(),
      filesProcessed: 0,
      totalRefactorings: 0,
      results: [],
      summary: {
        performanceImprovements: 0,
        maintainabilityImprovements: 0,
        readabilityImprovements: 0,
        securityImprovements: 0
      }
    };
    
    this.sessions.set(sessionId, this.currentSession);
    console.log(`🔄 Started refactoring session: ${sessionId}`);
    return sessionId;
  }

  async refactorCode(fileName: string, content: string, autoApplyAll: boolean = false): Promise<RefactoringResult> {
    console.log(`🔧 Refactoring: ${fileName}`);

    let refactoredContent = content;
    const appliedRules: RefactoringRule[] = [];
    const improvements: string[] = [];
    const warnings: string[] = [];
    let totalConfidence = 0;
    let linesChanged = 0;

    for (const rule of this.rules.values()) {
      const shouldApply = autoApplyAll || rule.autoApply;
      
      if (shouldApply && rule.pattern.test(content)) {
        const beforeLines = refactoredContent.split('\n').length;
        
        try {
          if (typeof rule.replacement === 'string') {
            refactoredContent = refactoredContent.replace(rule.pattern, rule.replacement);
          } else {
            refactoredContent = refactoredContent.replace(rule.pattern, rule.replacement);
          }

          const afterLines = refactoredContent.split('\n').length;
          linesChanged += Math.abs(afterLines - beforeLines);

          appliedRules.push(rule);
          improvements.push(`Applied ${rule.name}: ${rule.description}`);
          totalConfidence += rule.confidence;

          // Update session summary
          if (this.currentSession) {
            this.currentSession.summary[`${rule.category}Improvements`]++;
            this.currentSession.totalRefactorings++;
          }

        } catch (error) {
          warnings.push(`Failed to apply rule ${rule.name}: ${error}`);
        }
      } else if (!shouldApply && rule.pattern.test(content)) {
        warnings.push(`Manual review required for rule: ${rule.name}`);
      }
    }

    const result: RefactoringResult = {
      fileName,
      originalContent: content,
      refactoredContent,
      appliedRules,
      improvements,
      warnings,
      confidence: appliedRules.length > 0 ? totalConfidence / appliedRules.length : 0,
      linesChanged
    };

    if (this.currentSession) {
      this.currentSession.filesProcessed++;
      this.currentSession.results.push(result);
    }

    console.log(`✅ Refactored ${fileName}: ${appliedRules.length} rules applied, ${warnings.length} warnings`);
    return result;
  }

  async refactorMultipleFiles(files: Map<string, string>, autoApplyAll: boolean = false): Promise<RefactoringResult[]> {
    const results: RefactoringResult[] = [];
    
    for (const [fileName, content] of files.entries()) {
      try {
        const result = await this.refactorCode(fileName, content, autoApplyAll);
        results.push(result);
      } catch (error) {
        console.error(`Failed to refactor ${fileName}:`, error);
      }
    }

    return results;
  }

  endRefactoringSession(): RefactoringSession | null {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
      const session = { ...this.currentSession };
      this.currentSession = null;
      
      console.log(`🏁 Ended refactoring session: ${session.id}`);
      console.log(`   Files processed: ${session.filesProcessed}`);
      console.log(`   Total refactorings: ${session.totalRefactorings}`);
      console.log(`   Performance improvements: ${session.summary.performanceImprovements}`);
      console.log(`   Maintainability improvements: ${session.summary.maintainabilityImprovements}`);
      console.log(`   Readability improvements: ${session.summary.readabilityImprovements}`);
      console.log(`   Security improvements: ${session.summary.securityImprovements}`);
      
      return session;
    }
    
    return null;
  }

  getRefactoringRules(): RefactoringRule[] {
    return Array.from(this.rules.values());
  }

  getRefactoringRulesByCategory(category: RefactoringRule['category']): RefactoringRule[] {
    return Array.from(this.rules.values()).filter(rule => rule.category === category);
  }

  addCustomRule(rule: RefactoringRule): void {
    this.addRule(rule);
    console.log(`Added custom refactoring rule: ${rule.name}`);
  }

  removeRule(ruleId: string): boolean {
    const removed = this.rules.delete(ruleId);
    if (removed) {
      console.log(`Removed refactoring rule: ${ruleId}`);
    }
    return removed;
  }

  getSessionHistory(): RefactoringSession[] {
    return Array.from(this.sessions.values());
  }

  getSession(sessionId: string): RefactoringSession | undefined {
    return this.sessions.get(sessionId);
  }

  generateRefactoringReport(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return 'Session not found';
    }

    const duration = session.endTime 
      ? (session.endTime.getTime() - session.startTime.getTime()) / 1000 
      : 0;

    let report = `# Refactoring Report - ${session.id}\n\n`;
    report += `**Duration:** ${duration}s\n`;
    report += `**Files Processed:** ${session.filesProcessed}\n`;
    report += `**Total Refactorings:** ${session.totalRefactorings}\n\n`;

    report += `## Summary\n`;
    report += `- Performance improvements: ${session.summary.performanceImprovements}\n`;
    report += `- Maintainability improvements: ${session.summary.maintainabilityImprovements}\n`;
    report += `- Readability improvements: ${session.summary.readabilityImprovements}\n`;
    report += `- Security improvements: ${session.summary.securityImprovements}\n\n`;

    report += `## Detailed Results\n`;
    for (const result of session.results) {
      if (result.appliedRules.length > 0) {
        report += `### ${result.fileName}\n`;
        report += `- Rules applied: ${result.appliedRules.length}\n`;
        report += `- Confidence: ${Math.round(result.confidence * 100)}%\n`;
        report += `- Lines changed: ${result.linesChanged}\n`;
        
        if (result.improvements.length > 0) {
          report += `#### Improvements\n`;
          result.improvements.forEach(imp => report += `- ${imp}\n`);
        }
        
        if (result.warnings.length > 0) {
          report += `#### Warnings\n`;
          result.warnings.forEach(warn => report += `- ${warn}\n`);
        }
        
        report += '\n';
      }
    }

    return report;
  }
}