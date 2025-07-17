/**
 * Development mode validator for real-time code quality enforcement
 * Integrates with the auto-refactoring system for immediate feedback
 */

import { AutoRefactorSystem } from './autoRefactorSystem';
import { RefactoringSuggestion } from './autoRefactorSystem';

export class DevModeValidator {
  private static instance: DevModeValidator;
  private autoRefactorSystem: AutoRefactorSystem;
  private isEnabled: boolean = false;

  private constructor() {
    this.autoRefactorSystem = new AutoRefactorSystem();
  }

  static getInstance(): DevModeValidator {
    if (!DevModeValidator.instance) {
      DevModeValidator.instance = new DevModeValidator();
    }
    return DevModeValidator.instance;
  }

  /**
   * Enables real-time validation in development mode
   */
  enable(): void {
    this.isEnabled = true;
    console.log('🔍 Dev mode validator enabled - Real-time code quality monitoring active');
  }

  /**
   * Disables real-time validation
   */
  disable(): void {
    this.isEnabled = false;
    console.log('⏸️ Dev mode validator disabled');
  }

  /**
   * Validates the current codebase and returns suggestions
   */
  async validateCodebase(): Promise<RefactoringSuggestion[]> {
    if (!this.isEnabled) {
      return [];
    }

    try {
      return await this.autoRefactorSystem.analyzeCodebase();
    } catch (error) {
      console.error('Dev mode validation failed:', error);
      return [];
    }
  }

  /**
   * Checks if auto-refactoring should be triggered
   */
  async shouldAutoRefactor(): Promise<RefactoringSuggestion[]> {
    if (!this.isEnabled) {
      return [];
    }

    const suggestions = await this.validateCodebase();
    return await this.autoRefactorSystem.shouldAutoTriggerRefactoring(suggestions);
  }

  /**
   * Validates a specific file path
   */
  async validateFile(filePath: string): Promise<boolean> {
    if (!this.isEnabled) {
      return true;
    }

    const suggestions = await this.validateCodebase();
    return !suggestions.some(s => s.file === filePath && s.priority === 'critical');
  }

  /**
   * Gets the current validation status
   */
  isValidationEnabled(): boolean {
    return this.isEnabled;
  }
}

export default DevModeValidator;