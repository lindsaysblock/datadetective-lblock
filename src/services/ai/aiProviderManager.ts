import { AIProvider, AIProviderManager as IAIProviderManager, AIProviderType } from '@/types/aiProvider';
import { OpenAIProvider } from './providers/openaiProvider';
import { ClaudeProvider } from './providers/claudeProvider';
import { PerplexityProvider } from './providers/perplexityProvider';

export class AIProviderManager implements IAIProviderManager {
  private providers: Map<AIProviderType, AIProvider> = new Map();
  private apiKeys: Map<AIProviderType, string> = new Map();

  constructor() {
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('claude', new ClaudeProvider());
    this.providers.set('perplexity', new PerplexityProvider());
    
    // Load API keys from localStorage
    this.loadApiKeys();
  }

  getProvider(type: AIProviderType): AIProvider | null {
    return this.providers.get(type) || null;
  }

  setApiKey(type: AIProviderType, apiKey: string): void {
    this.apiKeys.set(type, apiKey);
    const provider = this.providers.get(type);
    if (provider) {
      provider.setApiKey(apiKey);
    }
    
    // Persist to localStorage
    localStorage.setItem(`ai_key_${type}`, apiKey);
  }

  getApiKey(type: AIProviderType): string | null {
    return this.apiKeys.get(type) || null;
  }

  getConfiguredProviders(): AIProvider[] {
    return Array.from(this.providers.values()).filter(provider => provider.isConfigured);
  }

  getBestProvider(question?: string): AIProvider | null {
    const configured = this.getConfiguredProviders();
    if (configured.length === 0) return null;

    // Simple provider selection based on question type
    if (question) {
      const lowerQuestion = question.toLowerCase();
      
      // Perplexity for real-time, current events, or web-related questions
      if (lowerQuestion.includes('latest') || lowerQuestion.includes('current') || 
          lowerQuestion.includes('recent') || lowerQuestion.includes('today') ||
          lowerQuestion.includes('news') || lowerQuestion.includes('web')) {
        const perplexity = configured.find(p => p.type === 'perplexity');
        if (perplexity) return perplexity;
      }
      
      // Claude for complex analysis, reasoning, or detailed explanations
      if (lowerQuestion.includes('analyze') || lowerQuestion.includes('complex') ||
          lowerQuestion.includes('detailed') || lowerQuestion.includes('reasoning') ||
          lowerQuestion.includes('explain') || lowerQuestion.includes('compare')) {
        const claude = configured.find(p => p.type === 'claude');
        if (claude) return claude;
      }
    }

    // Default to OpenAI, then Claude, then Perplexity
    return configured.find(p => p.type === 'openai') ||
           configured.find(p => p.type === 'claude') ||
           configured.find(p => p.type === 'perplexity') ||
           configured[0];
  }

  private loadApiKeys(): void {
    for (const type of ['openai', 'claude', 'perplexity'] as AIProviderType[]) {
      const apiKey = localStorage.getItem(`ai_key_${type}`);
      if (apiKey) {
        this.setApiKey(type, apiKey);
      }
    }
  }

  clearApiKey(type: AIProviderType): void {
    this.apiKeys.delete(type);
    const provider = this.providers.get(type);
    if (provider) {
      provider.setApiKey('');
    }
    localStorage.removeItem(`ai_key_${type}`);
  }

  clearAllApiKeys(): void {
    for (const type of this.providers.keys()) {
      this.clearApiKey(type);
    }
  }
}

// Singleton instance
export const aiProviderManager = new AIProviderManager();