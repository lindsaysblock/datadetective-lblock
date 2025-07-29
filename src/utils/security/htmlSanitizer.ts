import DOMPurify, { Config } from 'dompurify';

/**
 * HTML sanitization utilities to prevent XSS attacks
 */
export class HTMLSanitizer {
  /**
   * Sanitizes HTML content to prevent XSS attacks
   * @param html - The HTML string to sanitize
   * @param allowedTags - Optional array of allowed HTML tags
   * @returns Sanitized HTML string
   */
  static sanitize(html: string, allowedTags?: string[]): string {
    const config: Config = {
      ALLOWED_TAGS: allowedTags || ['b', 'i', 'em', 'strong', 'span', 'div', 'p'],
      ALLOWED_ATTR: ['class', 'style'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe'],
      KEEP_CONTENT: false,
      ALLOW_DATA_ATTR: false
    };

    return DOMPurify.sanitize(html, config).toString();
  }

  /**
   * Sanitizes CSS content for safe inline styles
   * @param css - CSS string to sanitize
   * @returns Sanitized CSS string
   */
  static sanitizeCSS(css: string): string {
    // Remove any javascript: urls and expression() calls
    const sanitized = css
      .replace(/javascript:/gi, '')
      .replace(/expression\s*\(/gi, '')
      .replace(/url\s*\(\s*['"]?javascript:/gi, '')
      .replace(/@import/gi, '')
      .replace(/behavior\s*:/gi, '');

    return DOMPurify.sanitize(sanitized, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      ALLOW_DATA_ATTR: false 
    }).toString();
  }

  /**
   * Validates that a string contains only safe CSS color values
   * @param cssString - The CSS string to validate
   * @returns Whether the CSS is safe for color properties
   */
  static isSafeColorCSS(cssString: string): boolean {
    // Allow only hex colors, rgb/rgba, hsl/hsla, and named colors
    const safeColorPattern = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)|transparent|inherit|initial|unset|[a-z]+)$/i;
    
    return safeColorPattern.test(cssString.trim());
  }
}