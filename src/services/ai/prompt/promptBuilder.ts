import { AIProviderType } from '@/types/aiProvider';
import { AnalysisContext } from '@/services/intelligentQAService';

export interface PromptConfig {
  provider: AIProviderType;
  maxTokens: number;
  temperature: number;
  specialFeatures?: string[];
}

export class PromptBuilder {
  static buildSystemPrompt(provider: AIProviderType): string {
    const basePrompt = 'You are a data analysis expert specializing in business intelligence and statistical analysis. Provide precise, actionable insights based on the data context provided.';
    
    switch (provider) {
      case 'claude':
        return `${basePrompt} Use your advanced reasoning capabilities to provide deep analytical insights. Think step-by-step through complex patterns and relationships in the data. Focus on nuanced interpretations and sophisticated analysis techniques.`;
      
      case 'perplexity':
        return `${basePrompt} Leverage your real-time knowledge and web search capabilities to provide current market context and industry benchmarks. Compare findings with recent trends and external data sources when relevant.`;
      
      case 'openai':
      default:
        return `${basePrompt} Focus on statistical patterns, business implications, and specific recommendations. Be thorough but concise.`;
    }
  }

  static buildAnalysisPrompt(context: AnalysisContext, dataInsights: any, provider: AIProviderType): string {
    const basePrompt = `
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
`;

    const providerSpecificEnding = this.getProviderSpecificEnding(provider);
    
    return `${basePrompt}

${providerSpecificEnding}

Focus on actionable insights that can drive business decisions. Be specific and provide concrete examples where possible.`;
  }

  private static getProviderSpecificEnding(provider: AIProviderType): string {
    switch (provider) {
      case 'claude':
        return `Please provide a comprehensive analysis including:
1. A direct, reasoned answer to the research question with logical steps
2. Deep statistical insights with sophisticated interpretations
3. Complex pattern recognition and relationship analysis
4. Strategic business implications with detailed reasoning
5. Advanced analytical recommendations for next steps
6. Data quality assessment with improvement suggestions`;

      case 'perplexity':
        return `Please provide a contextual analysis including:
1. A direct answer to the research question
2. Key statistical insights compared to industry standards
3. Current market context and recent trends (if applicable)
4. Business implications with real-world examples
5. Benchmark comparisons and competitive analysis
6. Data quality observations and external validation opportunities`;

      case 'openai':
      default:
        return `Please provide:
1. A direct answer to the research question
2. Key statistical insights from the data
3. Business implications and recommendations
4. Potential next analysis steps
5. Data quality observations`;
    }
  }

  static getOptimalConfig(provider: AIProviderType): PromptConfig {
    switch (provider) {
      case 'claude':
        return {
          provider,
          maxTokens: 3000,
          temperature: 0.3,
          specialFeatures: ['reasoning', 'detailed_analysis']
        };

      case 'perplexity':
        return {
          provider,
          maxTokens: 2500,
          temperature: 0.2,
          specialFeatures: ['real_time_data', 'web_search', 'benchmarking']
        };

      case 'openai':
      default:
        return {
          provider,
          maxTokens: 2000,
          temperature: 0.7,
          specialFeatures: ['general_analysis', 'business_insights']
        };
    }
  }
}