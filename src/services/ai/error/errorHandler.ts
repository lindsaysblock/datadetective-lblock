/**
 * Enhanced Error Handling Service
 * Provides consistent error handling across all AI providers
 */

export interface AIError {
  code: string;
  message: string;
  provider: string;
  originalError?: any;
  retryable: boolean;
  userMessage: string;
}

export class ErrorHandler {
  static handleProviderError(error: any, provider: string): AIError {
    // OpenAI specific errors
    if (provider === 'openai') {
      return this.handleOpenAIError(error);
    }
    
    // Claude specific errors
    if (provider === 'claude') {
      return this.handleClaudeError(error);
    }
    
    // Perplexity specific errors
    if (provider === 'perplexity') {
      return this.handlePerplexityError(error);
    }
    
    // Generic error handling
    return this.handleGenericError(error, provider);
  }

  private static handleOpenAIError(error: any): AIError {
    const message = error?.message || 'Unknown OpenAI error';
    
    if (message.includes('401') || message.includes('unauthorized')) {
      return {
        code: 'INVALID_API_KEY',
        message: 'Invalid OpenAI API key',
        provider: 'openai',
        originalError: error,
        retryable: false,
        userMessage: 'Your OpenAI API key is invalid. Please check and update it.'
      };
    }
    
    if (message.includes('429') || message.includes('rate limit')) {
      return {
        code: 'RATE_LIMITED',
        message: 'OpenAI rate limit exceeded',
        provider: 'openai',
        originalError: error,
        retryable: true,
        userMessage: 'Too many requests. Please wait a moment and try again.'
      };
    }
    
    if (message.includes('quota') || message.includes('billing')) {
      return {
        code: 'QUOTA_EXCEEDED',
        message: 'OpenAI quota exceeded',
        provider: 'openai',
        originalError: error,
        retryable: false,
        userMessage: 'OpenAI quota exceeded. Please check your account billing.'
      };
    }
    
    if (message.includes('model') || message.includes('not found')) {
      return {
        code: 'MODEL_NOT_FOUND',
        message: 'OpenAI model not available',
        provider: 'openai',
        originalError: error,
        retryable: false,
        userMessage: 'The requested AI model is not available. Please try again later.'
      };
    }
    
    return {
      code: 'OPENAI_ERROR',
      message: `OpenAI error: ${message}`,
      provider: 'openai',
      originalError: error,
      retryable: true,
      userMessage: 'An error occurred with OpenAI. Please try again.'
    };
  }

  private static handleClaudeError(error: any): AIError {
    const message = error?.message || 'Unknown Claude error';
    
    if (message.includes('401') || message.includes('unauthorized')) {
      return {
        code: 'INVALID_API_KEY',
        message: 'Invalid Claude API key',
        provider: 'claude',
        originalError: error,
        retryable: false,
        userMessage: 'Your Claude API key is invalid. Please check and update it.'
      };
    }
    
    if (message.includes('429') || message.includes('rate limit')) {
      return {
        code: 'RATE_LIMITED',
        message: 'Claude rate limit exceeded',
        provider: 'claude',
        originalError: error,
        retryable: true,
        userMessage: 'Too many requests to Claude. Please wait and try again.'
      };
    }
    
    if (message.includes('credit') || message.includes('billing')) {
      return {
        code: 'QUOTA_EXCEEDED',
        message: 'Claude credits exhausted',
        provider: 'claude',
        originalError: error,
        retryable: false,
        userMessage: 'Claude credits exhausted. Please check your Anthropic account.'
      };
    }
    
    return {
      code: 'CLAUDE_ERROR',
      message: `Claude error: ${message}`,
      provider: 'claude',
      originalError: error,
      retryable: true,
      userMessage: 'An error occurred with Claude. Please try again.'
    };
  }

  private static handlePerplexityError(error: any): AIError {
    const message = error?.message || 'Unknown Perplexity error';
    
    if (message.includes('401') || message.includes('unauthorized')) {
      return {
        code: 'INVALID_API_KEY',
        message: 'Invalid Perplexity API key',
        provider: 'perplexity',
        originalError: error,
        retryable: false,
        userMessage: 'Your Perplexity API key is invalid. Please check and update it.'
      };
    }
    
    if (message.includes('429') || message.includes('rate limit')) {
      return {
        code: 'RATE_LIMITED',
        message: 'Perplexity rate limit exceeded',
        provider: 'perplexity',
        originalError: error,
        retryable: true,
        userMessage: 'Too many requests to Perplexity. Please wait and try again.'
      };
    }
    
    return {
      code: 'PERPLEXITY_ERROR',
      message: `Perplexity error: ${message}`,
      provider: 'perplexity',
      originalError: error,
      retryable: true,
      userMessage: 'An error occurred with Perplexity. Please try again.'
    };
  }

  private static handleGenericError(error: any, provider: string): AIError {
    const message = error?.message || 'Unknown error';
    
    if (error instanceof TypeError || message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        provider,
        originalError: error,
        retryable: true,
        userMessage: 'Network error. Please check your connection and try again.'
      };
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: `Unknown error: ${message}`,
      provider,
      originalError: error,
      retryable: true,
      userMessage: 'An unexpected error occurred. Please try again.'
    };
  }

  static shouldRetry(error: AIError, attemptCount: number, maxRetries: number = 3): boolean {
    if (attemptCount >= maxRetries) return false;
    
    // Don't retry authentication errors
    if (error.code === 'INVALID_API_KEY' || error.code === 'QUOTA_EXCEEDED') {
      return false;
    }
    
    // Retry rate limits with exponential backoff
    if (error.code === 'RATE_LIMITED') {
      return attemptCount < maxRetries;
    }
    
    // Retry network errors
    if (error.code === 'NETWORK_ERROR') {
      return attemptCount < maxRetries;
    }
    
    // Retry other retryable errors
    return error.retryable && attemptCount < maxRetries;
  }

  static getRetryDelay(attemptCount: number): number {
    // Exponential backoff: 1s, 2s, 4s
    return Math.min(1000 * Math.pow(2, attemptCount), 10000);
  }

  static logError(error: AIError): void {
    console.error(`[${error.provider.toUpperCase()}] ${error.code}: ${error.message}`, {
      provider: error.provider,
      code: error.code,
      retryable: error.retryable,
      originalError: error.originalError
    });
  }
}