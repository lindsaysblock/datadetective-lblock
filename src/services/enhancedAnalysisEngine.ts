/**
 * Enhanced Analysis Engine
 * Universal engine that works with any file type and data source
 */

import { UniversalAnalyticsOrchestrator, type UniversalAnalysisRequest } from './universalAnalyticsOrchestrator';
import { parseFile, type ParsedData } from '@/utils/dataParser';

export interface EnhancedAnalysisContext {
  question: string;
  files?: File[];
  parsedData?: ParsedData[];
  databaseTables?: string[];
  userId?: string;
  requiresAuth?: boolean;
}

export interface EnhancedAnalysisResult {
  success: boolean;
  answer?: string;
  visualizations?: any[];
  insights?: string[];
  recommendations?: string[];
  sqlQueries?: string[];
  confidence?: number;
  error?: string;
  requiresApiKey?: boolean;
}

export class EnhancedAnalysisEngine {
  private orchestrator: UniversalAnalyticsOrchestrator;
  
  constructor() {
    this.orchestrator = new UniversalAnalyticsOrchestrator();
  }

  async analyzeWithQuestion(context: EnhancedAnalysisContext): Promise<EnhancedAnalysisResult> {
    try {
      // Check if OpenAI API key is available
      if (!this.orchestrator.hasOpenAIApiKey()) {
        return {
          success: false,
          requiresApiKey: true,
          error: 'OpenAI API key required for intelligent analysis'
        };
      }

      // Parse files if provided
      let parsedData = context.parsedData || [];
      
      if (context.files && context.files.length > 0) {
        console.log('🔍 Parsing uploaded files...');
        const parsePromises = context.files.map(file => this.parseFileWithRetry(file));
        const parseResults = await Promise.allSettled(parsePromises);
        
        parseResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            parsedData.push(result.value);
          } else {
            console.error(`Failed to parse file ${index}:`, result.reason);
          }
        });
      }

      // Infer file types
      const fileTypes = this.inferFileTypes(context.files, parsedData);

      // Prepare universal analysis request
      const request: UniversalAnalysisRequest = {
        question: context.question,
        data: parsedData.length > 0 ? parsedData : undefined,
        databaseTables: context.databaseTables,
        fileTypes,
        userId: context.userId
      };

      // Execute analysis
      const result = await this.orchestrator.analyzeQuestion(request);

      return {
        success: true,
        answer: result.answer.answer,
        visualizations: result.visualizations,
        insights: result.insights,
        recommendations: result.recommendations,
        sqlQueries: result.sqlQueries,
        confidence: result.confidence
      };

    } catch (error) {
      console.error('❌ Enhanced analysis failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed'
      };
    }
  }

  private async parseFileWithRetry(file: File, maxRetries = 3): Promise<ParsedData> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📄 Parsing ${file.name} (attempt ${attempt}/${maxRetries})`);
        return await parseFile(file);
      } catch (error) {
        console.warn(`Parse attempt ${attempt} failed for ${file.name}:`, error);
        
        if (attempt === maxRetries) {
          throw new Error(`Failed to parse ${file.name} after ${maxRetries} attempts`);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    throw new Error('Should not reach here');
  }

  private inferFileTypes(files?: File[], parsedData?: ParsedData[]): string[] {
    const types = new Set<string>();
    
    if (files) {
      files.forEach(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension) {
          types.add(extension);
        }
      });
    }
    
    // Add common types if none detected
    if (types.size === 0) {
      ['csv', 'xlsx', 'json'].forEach(type => types.add(type));
    }
    
    return Array.from(types);
  }

  setOpenAIApiKey(apiKey: string): void {
    this.orchestrator.setOpenAIApiKey(apiKey);
  }

  hasOpenAIApiKey(): boolean {
    return this.orchestrator.hasOpenAIApiKey();
  }

  setPerplexityApiKey(apiKey: string): void {
    this.setOpenAIApiKey(apiKey);
  }

  hasPerplexityApiKey(): boolean {
    return this.hasOpenAIApiKey();
  }

  static getSupportedFileTypes(): string[] {
    return ['csv', 'xlsx', 'xls', 'json', 'txt'];
  }

  static isFileTypeSupported(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? this.getSupportedFileTypes().includes(extension) : false;
  }

  async testAnalysis(): Promise<boolean> {
    try {
      const testRequest: UniversalAnalysisRequest = {
        question: "What is the total number of records in my data?",
        data: {
          columns: [{ name: 'id', type: 'string', samples: ['1', '2', '3'] }],
          rows: [{ id: '1' }, { id: '2' }, { id: '3' }],
          rowCount: 3,
          fileSize: 100,
          summary: { totalRows: 3, totalColumns: 1 }
        },
        fileTypes: ['csv']
      };

      if (!this.orchestrator.hasOpenAIApiKey()) {
        console.log('⚠️ Test skipped: No OpenAI API key');
        return false;
      }

      const result = await this.orchestrator.analyzeQuestion(testRequest);
      console.log('✅ Test analysis result:', result);
      
      return result.confidence > 0;
    } catch (error) {
      console.error('❌ Test analysis failed:', error);
      return false;
    }
  }
}
