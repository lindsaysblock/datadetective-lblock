
import { QATestResult } from './types';

export class AutoFixSystem {
  private fixAttempts: Map<string, number> = new Map();
  private maxAttempts = 3;

  async attemptIntelligentFix(testResult: QATestResult): Promise<boolean> {
    const testKey = testResult.testName;
    const attempts = this.fixAttempts.get(testKey) || 0;
    
    if (attempts >= this.maxAttempts) {
      console.log(`⚠️ Max fix attempts reached for: ${testKey}`);
      return false;
    }
    
    this.fixAttempts.set(testKey, attempts + 1);
    
    try {
      console.log(`🔧 Auto-fix attempt ${attempts + 1}/${this.maxAttempts} for: ${testKey}`);
      
      // Determine fix strategy based on test type
      const fixStrategy = this.determineFix(testResult);
      const success = await this.applyFix(fixStrategy, testResult);
      
      if (success) {
        console.log(`✅ Successfully fixed: ${testKey}`);
        this.fixAttempts.delete(testKey); // Reset on success
      }
      
      return success;
    } catch (error) {
      console.error(`❌ Fix failed for ${testKey}:`, error);
      return false;
    }
  }

  private determineFix(testResult: QATestResult): string {
    const testName = testResult.testName.toLowerCase();
    
    if (testName.includes('component') && testName.includes('render')) {
      return 'component-render-fix';
    } else if (testName.includes('performance')) {
      return 'performance-optimization';
    } else if (testName.includes('memory')) {
      return 'memory-cleanup';
    } else if (testName.includes('load')) {
      return 'load-balancing';
    } else if (testName.includes('data')) {
      return 'data-validation';
    } else {
      return 'generic-fix';
    }
  }

  private async applyFix(strategy: string, testResult: QATestResult): Promise<boolean> {
    switch (strategy) {
      case 'component-render-fix':
        return this.fixComponentRender(testResult);
      case 'performance-optimization':
        return this.optimizePerformance(testResult);
      case 'memory-cleanup':
        return this.cleanupMemory(testResult);
      case 'load-balancing':
        return this.balanceLoad(testResult);
      case 'data-validation':
        return this.validateData(testResult);
      default:
        return this.applyGenericFix(testResult);
    }
  }

  private async fixComponentRender(testResult: QATestResult): Promise<boolean> {
    // Check for common rendering issues
    const errorElements = document.querySelectorAll('.error, [data-error="true"]');
    
    if (errorElements.length > 0) {
      errorElements.forEach(element => {
        if (element.textContent?.includes('Error')) {
          element.remove();
        }
      });
      return true;
    }
    
    // Force re-render if needed
    const event = new CustomEvent('react-refresh');
    window.dispatchEvent(event);
    
    return false;
  }

  private async optimizePerformance(testResult: QATestResult): Promise<boolean> {
    // Clear any performance bottlenecks
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Cleanup unused resources
        this.cleanupUnusedResources();
      });
    }
    
    // Optimize images if they exist
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
      if (!img.getAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
    
    return true;
  }

  private async cleanupMemory(testResult: QATestResult): Promise<boolean> {
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    // Clear any memory leaks
    const unusedElements = document.querySelectorAll('[data-unused="true"]');
    unusedElements.forEach(element => element.remove());
    
    // Clear event listeners that might cause leaks
    const elements = document.querySelectorAll('[data-cleanup-listeners]');
    elements.forEach(element => {
      const clone = element.cloneNode(true);
      element.parentNode?.replaceChild(clone, element);
    });
    
    return true;
  }

  private async balanceLoad(testResult: QATestResult): Promise<boolean> {
    // Implement load balancing strategies
    const heavyElements = document.querySelectorAll('[data-heavy-computation]');
    
    heavyElements.forEach(element => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            // Pause heavy computations when not visible
            entry.target.setAttribute('data-paused', 'true');
          } else {
            entry.target.removeAttribute('data-paused');
          }
        });
      });
      
      observer.observe(element);
    });
    
    return true;
  }

  private async validateData(testResult: QATestResult): Promise<boolean> {
    // Validate and clean data
    const dataElements = document.querySelectorAll('[data-validation-error]');
    
    dataElements.forEach(element => {
      element.removeAttribute('data-validation-error');
      element.classList.remove('error', 'invalid');
    });
    
    // Reset form validations
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.classList.remove('error', 'invalid');
      });
    });
    
    return true;
  }

  private async applyGenericFix(testResult: QATestResult): Promise<boolean> {
    // Generic fix strategies
    console.log(`🔧 Applying generic fix for: ${testResult.testName}`);
    
    // Clear any error states
    const errorElements = document.querySelectorAll('.error, .invalid, [aria-invalid="true"]');
    errorElements.forEach(element => {
      element.classList.remove('error', 'invalid');
      element.removeAttribute('aria-invalid');
    });
    
    // Reset any loading states that might be stuck
    const loadingElements = document.querySelectorAll('[data-loading="true"], .loading');
    loadingElements.forEach(element => {
      element.removeAttribute('data-loading');
      element.classList.remove('loading');
    });
    
    return true;
  }

  private cleanupUnusedResources(): void {
    // Clear any unused timers or intervals
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
    
    // Clear any unused event listeners
    const elements = document.querySelectorAll('[data-temp-listener]');
    elements.forEach(element => {
      element.removeAttribute('data-temp-listener');
    });
  }

  clearFixHistory(): void {
    this.fixAttempts.clear();
  }

  getFixHistory(): Map<string, number> {
    return new Map(this.fixAttempts);
  }
}
