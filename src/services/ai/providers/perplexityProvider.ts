import { AIProvider, AIMessage, AIResponse, AIProviderConfig } from '@/types/aiProvider';

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
      throw new Error('Perplexity API key not configured');
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config?.model || this.defaultModel,
        messages,
        temperature: 0.2,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Perplexity API error: ${error}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    
    if (!choice) {
      throw new Error('No response from Perplexity');
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
  }
}