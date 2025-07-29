/**
 * Intelligent Question Answering Service
 * Integrates OpenAI GPT for smart analysis and answers
 */

import { supabase } from '@/integrations/supabase/client';

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
  private openaiApiKey: string | null = null;
  
  constructor() {
    this.loadApiKey();
  }

  private async loadApiKey(): Promise<void> {
    try {
      // Try to get from Supabase Edge Function secrets first
      const { data, error } = await supabase.functions.invoke('get-secrets', {
        body: { secretName: 'OPENAI_API_KEY' }
      });
      
      if (!error && data?.value) {
        this.openaiApiKey = data.value;
        console.log('✅ OpenAI API key loaded from Supabase');
        return;
      }
    } catch (error) {
      console.warn('⚠️ Could not load OpenAI API key from Supabase:', error);
    }
    
    // Fallback: check if user has provided key in session
    this.openaiApiKey = sessionStorage.getItem('openai_api_key');
  }

  setApiKey(apiKey: string): void {
    this.openaiApiKey = apiKey;
    sessionStorage.setItem('openai_api_key', apiKey);
  }

  hasApiKey(): boolean {
    return !!this.openaiApiKey;
  }

  async answerQuestion(context: AnalysisContext): Promise<QuestionAnswer> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const dataInsights = this.analyzeDataContext(context);
      const enhancedPrompt = this.buildAnalysisPrompt(context, dataInsights);
      
      const openaiResponse = await this.callOpenAIAPI(enhancedPrompt);
      
      const answer: QuestionAnswer = {
        id: crypto.randomUUID(),
        question: context.question,
        answer: openaiResponse.answer,
        confidence: this.calculateConfidence(openaiResponse, context),
        sources: [], // OpenAI doesn't provide sources like Perplexity
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

  private async callOpenAIAPI(prompt: string): Promise<any> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a data analysis expert specializing in business intelligence and statistical analysis. Provide precise, actionable insights based on the data context provided. Focus on statistical patterns, business implications, and specific recommendations. Be thorough but concise.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return {
      answer: data.choices[0]?.message?.content || 'No answer provided',
      usage: data.usage
    };
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
    const data = context.data;
    
    if (!data || (!data.rows && !Array.isArray(data))) {
      return {
        rowCount: 0,
        columnCount: 0,
        columnTypes: [],
        sampleData: {},
        patterns: ['No data available for analysis']
      };
    }

    const rows = data.rows || data;
    const columns = data.columns || (rows.length > 0 ? Object.keys(rows[0]) : []);
    
    return {
      rowCount: rows.length,
      columnCount: columns.length,
      columnTypes: this.inferColumnTypes(rows, columns),
      sampleData: rows.slice(0, 3),
      patterns: this.identifyDataPatterns(rows, columns)
    };
  }

  private inferColumnTypes(rows: any[], columns: string[]): string[] {
    return columns.map(col => {
      const sample = rows.slice(0, 10).map(row => row[col]).filter(val => val != null);
      
      if (sample.every(val => typeof val === 'number' || !isNaN(Number(val)))) {
        return 'numeric';
      } else if (sample.every(val => !isNaN(Date.parse(val)))) {
        return 'date';
      } else if (sample.every(val => typeof val === 'boolean' || val === 'true' || val === 'false')) {
        return 'boolean';
      } else {
        return 'text';
      }
    });
  }

  private identifyDataPatterns(rows: any[], columns: string[]): string[] {
    const patterns: string[] = [];
    
    // Check for missing data
    const missingDataCols = columns.filter(col => {
      const missing = rows.filter(row => row[col] == null || row[col] === '').length;
      return missing / rows.length > 0.1;
    });
    
    if (missingDataCols.length > 0) {
      patterns.push(`High missing data in columns: ${missingDataCols.join(', ')}`);
    }
    
    // Check for potential ID columns
    const idColumns = columns.filter(col => 
      col.toLowerCase().includes('id') && 
      new Set(rows.map(row => row[col])).size === rows.length
    );
    
    if (idColumns.length > 0) {
      patterns.push(`Unique identifier columns detected: ${idColumns.join(', ')}`);
    }
    
    // Check for temporal data
    const dateColumns = columns.filter(col => 
      col.toLowerCase().includes('date') || 
      col.toLowerCase().includes('time') ||
      rows.some(row => !isNaN(Date.parse(row[col])))
    );
    
    if (dateColumns.length > 0) {
      patterns.push(`Time-series data available in: ${dateColumns.join(', ')}`);
    }
    
    return patterns;
  }

  private calculateConfidence(response: any, context: AnalysisContext): number {
    let confidence = 0.6; // Base confidence for OpenAI
    
    // Increase confidence based on data quality
    if (this.getRowCount(context.data) > 100) confidence += 0.15;
    if (this.getColumnCount(context.data) > 5) confidence += 0.1;
    if (context.fileTypes.includes('xlsx') || context.fileTypes.includes('csv')) confidence += 0.1;
    
    // Increase confidence based on token usage (more detailed analysis)
    if (response.usage && response.usage.total_tokens > 800) confidence += 0.05;
    
    return Math.min(confidence, 1.0);
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
