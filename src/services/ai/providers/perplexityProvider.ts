import { AIProvider, AIMessage, AIResponse, AIProviderConfig } from '@/types/aiProvider';
import { ErrorHandler } from '@/services/ai/error/errorHandler';

export class PerplexityProvider implements AIProvider {
  type = 'perplexity' as const;
  name = 'Perplexity';
  models = ['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online'];
  defaultModel = 'llama-3.1-sonar-large-128k-online';
  private apiKey: string | null = null;

  get isConfigured(): boolean {
    return !!this.apiKey;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1,
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async call(messages: AIMessage[], config?: Partial<AIProviderConfig>): Promise<AIResponse> {
    const apiKey = config?.apiKey || this.apiKey;
    if (!apiKey) {
      const error = ErrorHandler.handleProviderError(
        new Error('API key not configured'), 
        'perplexity'
      );
      ErrorHandler.logError(error);
      throw new Error(error.userMessage);
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config?.model || this.defaultModel,
          messages,
          temperature: 0.2, // Lower temperature for more factual responses
          max_tokens: 2500, // Slightly higher for real-time context
          return_images: false,
          return_related_questions: false,
          search_recency_filter: 'month', // Leverage real-time data
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = ErrorHandler.handleProviderError(
          new Error(`HTTP ${response.status}: ${errorText}`),
          'perplexity'
        );
        ErrorHandler.logError(error);
        throw new Error(error.userMessage);
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      
      if (!choice) {
        const error = ErrorHandler.handleProviderError(
          new Error('No response from Perplexity'),
          'perplexity'
        );
        ErrorHandler.logError(error);
        throw new Error(error.userMessage);
      }

      return {
        content: choice.message.content,
        usage: data.usage ? {
          input_tokens: data.usage.prompt_tokens || 0,
          output_tokens: data.usage.completion_tokens || 0,
          total_tokens: data.usage.total_tokens || 0,
        } : undefined,
        model: data.model,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('Your ')) {
        // Already processed by error handler
        throw error;
      }
      
      const aiError = ErrorHandler.handleProviderError(error, 'perplexity');
      ErrorHandler.logError(aiError);
      throw new Error(aiError.userMessage);
    }
  }
}