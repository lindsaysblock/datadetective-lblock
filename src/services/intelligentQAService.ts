/**
 * Intelligent Question Answering Service
 * Integrates multiple AI providers for smart analysis and answers
 */

import { supabase } from '@/integrations/supabase/client';
import { aiProviderManager } from '@/services/ai/aiProviderManager';
import { AIMessage, AIProviderType } from '@/types/aiProvider';

export interface QuestionAnswer {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  sources: string[];
  visualizations?: any[];
  timestamp: Date;
  dataContext: {
    fileTypes: string[];
    rowCount: number;
    columnCount: number;
    dataSource: 'file' | 'database' | 'mixed';
  };
}

export interface AnalysisContext {
  question: string;
  data: any;
  fileTypes: string[];
  dataSource: 'file' | 'database' | 'mixed';
  userId?: string;
}

export class IntelligentQAService {
  private preferredProvider: AIProviderType | null = null;
  
  constructor() {
    this.loadPreferredProvider();
  }

  private loadPreferredProvider(): void {
    const stored = localStorage.getItem('preferred_ai_provider');
    if (stored && ['openai', 'claude', 'perplexity'].includes(stored)) {
      this.preferredProvider = stored as AIProviderType;
    }
  }

  setPreferredProvider(provider: AIProviderType): void {
    this.preferredProvider = provider;
    localStorage.setItem('preferred_ai_provider', provider);
  }

  setApiKey(provider: AIProviderType, apiKey: string): void {
    aiProviderManager.setApiKey(provider, apiKey);
  }

  hasApiKey(): boolean {
    return aiProviderManager.getConfiguredProviders().length > 0;
  }

  getConfiguredProviders(): AIProviderType[] {
    return aiProviderManager.getConfiguredProviders().map(p => p.type);
  }

  async answerQuestion(context: AnalysisContext): Promise<QuestionAnswer> {
    try {
      const dataInsights = this.analyzeDataContext(context);
      const messages = this.buildAnalysisMessages(context, dataInsights);
      
      // Use provider manager with retry and fallback logic
      const { response: aiResponse, provider } = await aiProviderManager.callWithRetry(
        messages,
        this.preferredProvider || undefined
      );
      
      const answer: QuestionAnswer = {
        id: crypto.randomUUID(),
        question: context.question,
        answer: aiResponse.content,
        confidence: this.calculateConfidence(aiResponse, context, provider.type),
        sources: provider.type === 'perplexity' ? ['Perplexity AI with real-time data'] : [],
        timestamp: new Date(),
        dataContext: {
          fileTypes: context.fileTypes,
          rowCount: this.getRowCount(context.data),
          columnCount: this.getColumnCount(context.data),
          dataSource: context.dataSource
        }
      };

      // Store in database if user is authenticated
      if (context.userId) {
        await this.storeAnswer(answer, context.userId);
      }

      console.log(`✅ Analysis completed using ${provider.name} with ${answer.confidence.toFixed(2)} confidence`);
      return answer;
    } catch (error) {
      console.error('❌ Failed to answer question:', error);
      throw error;
    }
  }

  private buildAnalysisMessages(context: AnalysisContext, dataInsights: any): AIMessage[] {
    const provider = this.preferredProvider 
      ? aiProviderManager.getProvider(this.preferredProvider)
      : aiProviderManager.getBestProvider(context.question);
    
    const providerType = provider?.type || 'openai';
    const { PromptBuilder } = require('@/services/ai/prompt/promptBuilder');
    
    return [
      {
        role: 'system',
        content: PromptBuilder.buildSystemPrompt(providerType)
      },
      {
        role: 'user',
        content: PromptBuilder.buildAnalysisPrompt(context, dataInsights, providerType)
      }
    ];
  }

  // Legacy method - now handled by PromptBuilder
  private buildAnalysisPrompt(context: AnalysisContext, dataInsights: any): string {
    const { PromptBuilder } = require('@/services/ai/prompt/promptBuilder');
    return PromptBuilder.buildAnalysisPrompt(context, dataInsights, 'openai');
  }

  private analyzeDataContext(context: AnalysisContext): any {
    const { DataAnalyzer } = require('@/services/ai/analysis/dataAnalyzer');
    return DataAnalyzer.analyzeDataContext(context);
  }

  // Legacy methods - kept for backward compatibility but now delegate to specialized services
  private inferColumnTypes(rows: any[], columns: string[]): string[] {
    const { DataAnalyzer } = require('@/services/ai/analysis/dataAnalyzer');
    return DataAnalyzer.inferColumnTypes(rows, columns);
  }

  private identifyDataPatterns(rows: any[], columns: string[]): string[] {
    const { DataAnalyzer } = require('@/services/ai/analysis/dataAnalyzer');
    const insights = DataAnalyzer.analyzeDataContext({ data: { rows, columns } });
    return insights.patterns;
  }

  private calculateConfidence(response: any, context: AnalysisContext, providerType?: AIProviderType): number {
    const { ConfidenceCalculator } = require('@/services/ai/confidence/confidenceCalculator');
    const { DataAnalyzer } = require('@/services/ai/analysis/dataAnalyzer');
    
    const dataInsights = DataAnalyzer.analyzeDataContext(context);
    return ConfidenceCalculator.calculate(response, context, dataInsights, providerType || 'openai');
  }

  private getRowCount(data: any): number {
    if (!data) return 0;
    if (data.rows) return data.rows.length;
    if (Array.isArray(data)) return data.length;
    return 0;
  }

  private getColumnCount(data: any): number {
    if (!data) return 0;
    if (data.columns) return data.columns.length;
    if (Array.isArray(data) && data.length > 0) return Object.keys(data[0]).length;
    return 0;
  }

  private async storeAnswer(answer: QuestionAnswer, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('research_questions')
        .insert({
          question: answer.question,
          answer: answer.answer,
          confidence_level: answer.confidence.toString(),
          visualization_data: answer.visualizations || {},
          analysis_session_id: crypto.randomUUID() // You might want to track this properly
        });

      if (error) {
        console.error('Failed to store answer:', error);
      }
    } catch (error) {
      console.error('Database storage error:', error);
    }
  }
}
