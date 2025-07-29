/**
 * Universal Analytics Orchestrator
 * Handles analysis for any file type and data source
 */

import { ParsedData } from '@/utils/dataParser';
import { IntelligentQAService, type AnalysisContext, type QuestionAnswer } from './intelligentQAService';
import { supabase } from '@/integrations/supabase/client';

export interface UniversalAnalysisRequest {
  question: string;
  data?: ParsedData | ParsedData[];
  databaseTables?: string[];
  fileTypes?: string[];
  userId?: string;
}

export interface AnalysisResult {
  answer: QuestionAnswer;
  visualizations: any[];
  sqlQueries: string[];
  insights: string[];
  recommendations: string[];
  confidence: number;
}

export class UniversalAnalyticsOrchestrator {
  private qaService: IntelligentQAService;
  
  constructor() {
    this.qaService = new IntelligentQAService();
  }

  setOpenAIApiKey(apiKey: string): void {
    this.qaService.setApiKey(apiKey);
  }

  hasOpenAIApiKey(): boolean {
    return this.qaService.hasApiKey();
  }

  // Keep backward compatibility with Perplexity method names
  setPerplexityApiKey(apiKey: string): void {
    this.setOpenAIApiKey(apiKey);
  }

  hasPerplexityApiKey(): boolean {
    return this.hasOpenAIApiKey();
  }

  async analyzeQuestion(request: UniversalAnalysisRequest): Promise<AnalysisResult> {
    try {
      console.log('🔍 Starting universal analysis:', request.question);
      
      // Determine data source and prepare context
      const analysisContext = await this.prepareAnalysisContext(request);
      
      // Get AI-powered answer using Perplexity
      const answer = await this.qaService.answerQuestion(analysisContext);
      
      // Generate SQL queries if database data is involved
      const sqlQueries = await this.generateSQLQueries(request);
      
      // Create visualizations based on data type and question
      const visualizations = await this.generateVisualizations(request, answer);
      
      // Extract insights and recommendations
      const insights = this.extractInsights(answer);
      const recommendations = this.extractRecommendations(answer);
      
      const result: AnalysisResult = {
        answer,
        visualizations,
        sqlQueries,
        insights,
        recommendations,
        confidence: answer.confidence
      };
      
      console.log('✅ Universal analysis complete:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Universal analysis failed:', error);
      throw error;
    }
  }

  private async prepareAnalysisContext(request: UniversalAnalysisRequest): Promise<AnalysisContext> {
    let combinedData: any = null;
    let fileTypes: string[] = [];
    let dataSource: 'file' | 'database' | 'mixed' = 'file';
    
    // Handle file data
    if (request.data) {
      const dataArray = Array.isArray(request.data) ? request.data : [request.data];
      combinedData = this.combineFileData(dataArray);
      fileTypes = request.fileTypes || this.inferFileTypes(dataArray);
    }
    
    // Handle database data
    if (request.databaseTables && request.databaseTables.length > 0) {
      const dbData = await this.fetchDatabaseData(request.databaseTables, request.userId);
      
      if (combinedData) {
        // Mix file and database data
        combinedData = this.mergeDatabaseAndFileData(combinedData, dbData);
        dataSource = 'mixed';
      } else {
        combinedData = dbData;
        dataSource = 'database';
      }
    }
    
    return {
      question: request.question,
      data: combinedData,
      fileTypes,
      dataSource,
      userId: request.userId
    };
  }

  private combineFileData(dataArray: ParsedData[]): any {
    if (dataArray.length === 0) return null;
    if (dataArray.length === 1) return dataArray[0];
    
    // Combine multiple files
    const combinedRows: any[] = [];
    const allColumns = new Set<string>();
    
    dataArray.forEach(data => {
      data.columns.forEach(col => allColumns.add(col.name));
      combinedRows.push(...data.rows);
    });
    
    return {
      rows: combinedRows,
      columns: Array.from(allColumns).map(name => ({ name, type: 'string' })),
      summary: {
        totalRows: combinedRows.length,
        totalColumns: allColumns.size
      }
    };
  }

  private inferFileTypes(dataArray: ParsedData[]): string[] {
    // This would normally come from the original file extensions
    // For now, return common types
    return ['csv', 'xlsx', 'json'];
  }

  private async fetchDatabaseData(tables: string[], userId?: string): Promise<any> {
    try {
      const combinedData: any[] = [];
      
      // Map of allowed tables to prevent injection
      const allowedTables = ['datasets', 'projects', 'analysis_results', 'analysis_sessions'] as const;
      type AllowedTable = typeof allowedTables[number];
      
      for (const table of tables) {
        if (!allowedTables.includes(table as AllowedTable)) {
          console.warn(`Table ${table} not allowed`);
          continue;
        }
        
        try {
          let query = supabase.from(table as AllowedTable).select('*');
          
          // Add user filter if the table has user_id column
          if (userId) {
            query = query.eq('user_id', userId);
          }
          
          const { data, error } = await query.limit(1000);
          
          if (error) {
            console.error(`Error fetching ${table}:`, error);
            continue;
          }
          
          if (data && data.length > 0) {
            combinedData.push(...data);
          }
        } catch (tableError) {
          console.error(`Error querying ${table}:`, tableError);
          continue;
        }
      }
      
      return {
        rows: combinedData,
        columns: combinedData.length > 0 ? Object.keys(combinedData[0]).map(name => ({ name, type: 'string' })) : [],
        summary: {
          totalRows: combinedData.length,
          totalColumns: combinedData.length > 0 ? Object.keys(combinedData[0]).length : 0
        }
      };
      
    } catch (error) {
      console.error('Database fetch error:', error);
      return { rows: [], columns: [], summary: { totalRows: 0, totalColumns: 0 } };
    }
  }

  private mergeDatabaseAndFileData(fileData: any, dbData: any): any {
    return {
      rows: [...(fileData.rows || []), ...(dbData.rows || [])],
      columns: [...(fileData.columns || []), ...(dbData.columns || [])],
      summary: {
        totalRows: (fileData.rows?.length || 0) + (dbData.rows?.length || 0),
        totalColumns: Math.max(fileData.columns?.length || 0, dbData.columns?.length || 0)
      }
    };
  }

  private async generateSQLQueries(request: UniversalAnalysisRequest): Promise<string[]> {
    const queries: string[] = [];
    
    if (request.databaseTables && request.databaseTables.length > 0) {
      // Generate relevant SQL queries based on the question
      for (const table of request.databaseTables) {
        if (request.question.toLowerCase().includes('count')) {
          queries.push(`SELECT COUNT(*) as total_records FROM ${table};`);
        }
        
        if (request.question.toLowerCase().includes('recent') || request.question.toLowerCase().includes('latest')) {
          queries.push(`SELECT * FROM ${table} ORDER BY created_at DESC LIMIT 10;`);
        }
        
        if (request.question.toLowerCase().includes('trend') || request.question.toLowerCase().includes('over time')) {
          queries.push(`SELECT DATE(created_at) as date, COUNT(*) as count FROM ${table} GROUP BY DATE(created_at) ORDER BY date;`);
        }
      }
    }
    
    return queries;
  }

  private async generateVisualizations(request: UniversalAnalysisRequest, answer: QuestionAnswer): Promise<any[]> {
    const visualizations: any[] = [];
    
    // Basic chart recommendations based on question type
    const question = request.question.toLowerCase();
    
    if (question.includes('trend') || question.includes('over time')) {
      visualizations.push({
        type: 'line',
        title: 'Trend Analysis',
        description: 'Time-based trend visualization'
      });
    }
    
    if (question.includes('compare') || question.includes('vs')) {
      visualizations.push({
        type: 'bar',
        title: 'Comparison Chart',
        description: 'Comparative analysis visualization'
      });
    }
    
    if (question.includes('distribution') || question.includes('spread')) {
      visualizations.push({
        type: 'histogram',
        title: 'Distribution Analysis',
        description: 'Data distribution visualization'
      });
    }
    
    if (question.includes('correlation') || question.includes('relationship')) {
      visualizations.push({
        type: 'scatter',
        title: 'Correlation Analysis',
        description: 'Relationship visualization'
      });
    }
    
    return visualizations;
  }

  private extractInsights(answer: QuestionAnswer): string[] {
    const insights: string[] = [];
    const text = answer.answer.toLowerCase();
    
    // Extract insights based on common patterns
    const sentences = answer.answer.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.length > 20) {
        if (trimmed.includes('increase') || trimmed.includes('decrease') || 
            trimmed.includes('higher') || trimmed.includes('lower') ||
            trimmed.includes('significant') || trimmed.includes('notable')) {
          insights.push(trimmed);
        }
      }
    });
    
    return insights.slice(0, 5); // Return top 5 insights
  }

  private extractRecommendations(answer: QuestionAnswer): string[] {
    const recommendations: string[] = [];
    const sentences = answer.answer.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.length > 20) {
        if (trimmed.includes('should') || trimmed.includes('recommend') || 
            trimmed.includes('suggest') || trimmed.includes('consider') ||
            trimmed.includes('improve') || trimmed.includes('optimize')) {
          recommendations.push(trimmed);
        }
      }
    });
    
    return recommendations.slice(0, 5); // Return top 5 recommendations
  }
}
