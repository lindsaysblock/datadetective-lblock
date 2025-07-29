import { AIProvider, AIMessage, AIResponse, AIProviderConfig } from '@/types/aiProvider';
import { ErrorHandler } from '@/services/ai/error/errorHandler';

export class OpenAIProvider implements AIProvider {
  type = 'openai' as const;
  name = 'OpenAI';
  models = ['gpt-4o-mini', 'gpt-4o'];
  defaultModel = 'gpt-4o-mini';
  private apiKey: string | null = null;

  get isConfigured(): boolean {
    return !!this.apiKey;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
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
        'openai'
      );
      ErrorHandler.logError(error);
      throw new Error(error.userMessage);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config?.model || this.defaultModel,
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = ErrorHandler.handleProviderError(
          new Error(`HTTP ${response.status}: ${errorText}`),
          'openai'
        );
        ErrorHandler.logError(error);
        throw new Error(error.userMessage);
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      
      if (!choice) {
        const error = ErrorHandler.handleProviderError(
          new Error('No response from OpenAI'),
          'openai'
        );
        ErrorHandler.logError(error);
        throw new Error(error.userMessage);
      }

      return {
        content: choice.message.content,
        usage: data.usage ? {
          input_tokens: data.usage.prompt_tokens,
          output_tokens: data.usage.completion_tokens,
          total_tokens: data.usage.total_tokens,
        } : undefined,
        model: data.model,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('Your ')) {
        // Already processed by error handler
        throw error;
      }
      
      const aiError = ErrorHandler.handleProviderError(error, 'openai');
      ErrorHandler.logError(aiError);
      throw new Error(aiError.userMessage);
    }
  }
}