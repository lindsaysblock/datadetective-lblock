/**
 * Safe DOM Helper Functions
 * Provides safe methods for DOM manipulation without runtime errors
 */

export class SafeDOMHelpers {
  /**
   * Safely check if element has a class
   */
  static hasClass(element: Element | null, className: string): boolean {
    if (!element || !className) return false;
    
    try {
      return element.classList.contains(className);
    } catch {
      return false;
    }
  }

  /**
   * Safely check if element class includes a substring
   */
  static classIncludes(element: Element | null, substring: string): boolean {
    if (!element || !substring) return false;
    
    try {
      return Array.from(element.classList).some(cls => cls.includes(substring));
    } catch {
      return false;
    }
  }

  /**
   * Safely get attribute value
   */
  static getAttribute(element: Element | null, attributeName: string): string {
    if (!element || !attributeName) return '';
    
    try {
      return element.getAttribute(attributeName) || '';
    } catch {
      return '';
    }
  }

  /**
   * Safely check if element has attribute
   */
  static hasAttribute(element: Element | null, attributeName: string): boolean {
    if (!element || !attributeName) return false;
    
    try {
      return element.hasAttribute(attributeName);
    } catch {
      return false;
    }
  }

  /**
   * Safely query DOM elements
   */
  static querySelectorAll(selector: string): Element[] {
    try {
      return Array.from(document.querySelectorAll(selector));
    } catch {
      return [];
    }
  }

  /**
   * Safely find closest parent element
   */
  static closest(element: Element | null, selector: string): Element | null {
    if (!element || !selector) return null;
    
    try {
      return element.closest(selector);
    } catch {
      return null;
    }
  }
}