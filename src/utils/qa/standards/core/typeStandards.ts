
import { CodeQualityRule, QualityCheck } from '../types';

export class TypeStandards {
  static getTypeRules(): CodeQualityRule[] {
    return [
      {
        id: 'type-001',
        name: 'Strict TypeScript Usage',
        description: 'All variables and functions should have explicit types',
        severity: 'medium',
        category: 'types',
        check: (code: string) => this.checkExplicitTypes(code),
        autoFix: false
      },
      {
        id: 'type-002',
        name: 'Interface Consistency',
        description: 'Interfaces should be properly defined and used consistently',
        severity: 'medium',
        category: 'types',
        check: (code: string) => this.checkInterfaceUsage(code),
        autoFix: false
      },
      {
        id: 'type-003',
        name: 'Any Type Usage',
        description: 'Avoid using "any" type except in specific cases',
        severity: 'high',
        category: 'types',
        check: (code: string) => this.checkAnyUsage(code),
        autoFix: false
      }
    ];
  }

  private static checkExplicitTypes(code: string): QualityCheck {
    const implicitAnyPattern = /:\s*=|const\s+\w+\s*=/;
    const hasExplicitTypes = /:\s*(string|number|boolean|object)/;
    
    if (implicitAnyPattern.test(code) && !hasExplicitTypes.test(code)) {
      return {
        passed: false,
        message: 'Variables lack explicit type annotations',
        suggestions: [
          'Add explicit type annotations to variables',
          'Use interface types for objects',
          'Define return types for functions'
        ]
      };
    }
    
    return { passed: true, message: 'Explicit types properly used' };
  }

  private static checkInterfaceUsage(code: string): QualityCheck {
    const hasProps = /Props\s*[=:]|props\s*:/;
    const hasInterface = /interface\s+\w+Props/;
    
    if (hasProps && !hasInterface) {
      return {
        passed: false,
        message: 'Component props should use interface definitions',
        suggestions: [
          'Define interface for component props',
          'Use consistent naming convention (ComponentNameProps)',
          'Export interfaces for reusability'
        ]
      };
    }
    
    return { passed: true, message: 'Interface usage is consistent' };
  }

  private static checkAnyUsage(code: string): QualityCheck {
    const anyUsagePattern = /:\s*any(?!\w)/g;
    const anyMatches = code.match(anyUsagePattern);
    
    if (anyMatches && anyMatches.length > 2) {
      return {
        passed: false,
        message: `Excessive use of "any" type (${anyMatches.length} occurrences)`,
        suggestions: [
          'Replace "any" with specific types',
          'Use union types for multiple possibilities',
          'Create interfaces for complex objects'
        ]
      };
    }
    
    return { passed: true, message: 'Minimal and appropriate use of "any" type' };
  }
}
