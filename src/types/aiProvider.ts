export type AIProviderType = 'openai' | 'claude' | 'perplexity';

export interface AIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
  model?: string;
}

export interface AIProvider {
  type: AIProviderType;
  name: string;
  models: string[];
  defaultModel: string;
  isConfigured: boolean;
  call(messages: AIMessage[], config?: Partial<AIProviderConfig>): Promise<AIResponse>;
  validateApiKey(apiKey: string): Promise<boolean>;
  setApiKey(apiKey: string): void;
}

export interface AIProviderManager {
  getProvider(type: AIProviderType): AIProvider | null;
  setApiKey(type: AIProviderType, apiKey: string): void;
  getConfiguredProviders(): AIProvider[];
  getBestProvider(question?: string): AIProvider | null;
}