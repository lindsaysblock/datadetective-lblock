import { AIProvider, AIMessage, AIResponse, AIProviderConfig } from '@/types/aiProvider';
import { ErrorHandler } from '@/services/ai/error/errorHandler';

export class ClaudeProvider implements AIProvider {
  type = 'claude' as const;
  name = 'Claude (Anthropic)';
  models = ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'];
  defaultModel = 'claude-3-5-sonnet-20241022';
  private apiKey: string | null = null;

  get isConfigured(): boolean {
    return !!this.apiKey;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1,
        }),
      });
      return response.ok || response.status === 400; // 400 might be quota/billing issue but key is valid
    } catch {
      return false;
    }
  }

  async call(messages: AIMessage[], config?: Partial<AIProviderConfig>): Promise<AIResponse> {
    const apiKey = config?.apiKey || this.apiKey;
    if (!apiKey) {
      const error = ErrorHandler.handleProviderError(
        new Error('API key not configured'), 
        'claude'
      );
      ErrorHandler.logError(error);
      throw new Error(error.userMessage);
    }

    try {
      // Convert system message to Claude format
      const systemMessage = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config?.model || this.defaultModel,
          messages: userMessages,
          system: systemMessage?.content,
          max_tokens: 3000, // Claude can handle more tokens for detailed analysis
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = ErrorHandler.handleProviderError(
          new Error(`HTTP ${response.status}: ${errorText}`),
          'claude'
        );
        ErrorHandler.logError(error);
        throw new Error(error.userMessage);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text;
      
      if (!content) {
        const error = ErrorHandler.handleProviderError(
          new Error('No response from Claude'),
          'claude'
        );
        ErrorHandler.logError(error);
        throw new Error(error.userMessage);
      }

      return {
        content,
        usage: data.usage ? {
          input_tokens: data.usage.input_tokens,
          output_tokens: data.usage.output_tokens,
          total_tokens: data.usage.input_tokens + data.usage.output_tokens,
        } : undefined,
        model: data.model,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('Your ')) {
        // Already processed by error handler
        throw error;
      }
      
      const aiError = ErrorHandler.handleProviderError(error, 'claude');
      ErrorHandler.logError(aiError);
      throw new Error(aiError.userMessage);
    }
  }
}