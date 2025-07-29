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
    const provider = this.preferredProvider 
      ? aiProviderManager.getProvider(this.preferredProvider)
      : aiProviderManager.getBestProvider(context.question);

    if (!provider || !provider.isConfigured) {
      throw new Error('No AI provider configured. Please add API keys for OpenAI, Claude, or Perplexity.');
    }

    try {
      const dataInsights = this.analyzeDataContext(context);
      const messages = this.buildAnalysisMessages(context, dataInsights);
      
      const aiResponse = await provider.call(messages);
      
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

  private buildAnalysisPrompt(context: AnalysisContext, dataInsights: any): string {
    return `
Analyze the following data context and answer the research question:

**Research Question:** ${context.question}

**Data Context:**
- File Types: ${context.fileTypes.join(', ')}
- Data Source: ${context.dataSource}
- Total Rows: ${dataInsights.rowCount}
- Total Columns: ${dataInsights.columnCount}
- Column Types: ${dataInsights.columnTypes.join(', ')}
- Sample Data Structure: ${JSON.stringify(dataInsights.sampleData).substring(0, 500)}

**Data Insights:**
${dataInsights.patterns.map((p: string) => `- ${p}`).join('\n')}

Please provide:
1. A direct answer to the research question
2. Key statistical insights from the data
3. Business implications and recommendations
4. Potential next analysis steps
5. Data quality observations

Focus on actionable insights that can drive business decisions. Be specific and provide concrete examples where possible.
    `;
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
