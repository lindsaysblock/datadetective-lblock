import { AIProvider, AIMessage, AIResponse, AIProviderConfig } from '@/types/aiProvider';

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
      throw new Error('Claude API key not configured');
    }

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
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${error}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    
    if (!content) {
      throw new Error('No response from Claude');
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
  }
}