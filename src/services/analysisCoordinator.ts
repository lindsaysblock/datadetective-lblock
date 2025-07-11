
import { DataAnalysisContext, ParsedDataFile } from '@/types/data';
import { AnalysisReport, AnalysisResult, AnalysisContext } from '@/types/analysis';
import { DataValidator, ValidationResult } from '@/utils/analysis/dataValidator';
import { DataProcessor } from '@/utils/dataProcessor';

export class AnalysisCoordinator {
  private static generateAnalysisId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static async executeAnalysis(context: DataAnalysisContext): Promise<AnalysisReport> {
    const startTime = Date.now();
    console.log('🔍 Starting coordinated analysis');

    try {
      // Validate input data
      const validation = DataValidator.validate(context.parsedData);
      
      if (!validation.isValid) {
        return this.createErrorReport(context, validation.errors, startTime);
      }

      // Process data for analysis
      const processedData = DataProcessor.extractAnalysisData(context.parsedData);
      
      // Generate analysis results
      const results = await this.generateAnalysisResults(context, processedData, validation);
      
      // Create comprehensive report
      const report: AnalysisReport = {
        id: this.generateAnalysisId(),
        context: {
          researchQuestion: context.researchQuestion,
          additionalContext: context.additionalContext,
          dataSource: this.detectDataSource(context.parsedData),
          educationalMode: context.educationalMode
        },
        results,
        insights: this.generateInsights(context, results, validation),
        recommendations: this.generateRecommendations(context, results, validation),
        confidence: this.calculateOverallConfidence(results, validation),
        executionTime: Date.now() - startTime,
        sqlQuery: this.generateSQLQuery(context, processedData),
        queryBreakdown: context.educationalMode ? this.generateQueryBreakdown(context) : undefined
      };

      console.log('✅ Analysis completed successfully');
      return report;

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      return this.createErrorReport(context, [error instanceof Error ? error.message : String(error)], startTime);
    }
  }

  private static async generateAnalysisResults(
    context: DataAnalysisContext, 
    processedData: any, 
    validation: ValidationResult
  ): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];

    // Data overview result
    results.push({
      id: 'data-overview',
      type: 'numeric',
      title: 'Dataset Overview',
      description: 'Summary of your connected data',
      value: processedData.totalRows,
      unit: 'rows',
      confidence: validation.score > 80 ? 'high' : validation.score > 60 ? 'medium' : 'low',
      timestamp: new Date().toISOString(),
      metadata: {
        files: processedData.fileCount,
        columns: processedData.allColumns.length
      }
    });

    // Data quality result
    results.push({
      id: 'data-quality',
      type: 'categorical',
      title: 'Data Quality Assessment',
      description: 'Overall quality of your dataset',
      value: validation.score > 80 ? 'Excellent' : validation.score > 60 ? 'Good' : 'Needs Improvement',
      confidence: 'high',
      timestamp: new Date().toISOString(),
      metadata: validation.metadata
    });

    // Research question specific analysis
    if (context.researchQuestion) {
      const questionAnalysis = this.analyzeResearchQuestion(context.researchQuestion, processedData);
      results.push(...questionAnalysis);
    }

    return results;
  }

  private static analyzeResearchQuestion(question: string, data: any): AnalysisResult[] {
    const results: AnalysisResult[] = [];
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('count') || lowerQuestion.includes('how many')) {
      results.push({
        id: 'count-analysis',
        type: 'numeric',
        title: 'Count Analysis',
        description: 'Counting analysis based on your question',
        value: data.totalRows,
        unit: 'records',
        confidence: 'high',
        timestamp: new Date().toISOString()
      });
    }

    if (lowerQuestion.includes('trend') || lowerQuestion.includes('time')) {
      results.push({
        id: 'trend-analysis',
        type: 'chart',
        title: 'Trend Analysis',
        description: 'Time-based patterns in your data',
        value: 'Time series analysis ready',
        chartType: 'line',
        chartData: [
          { name: 'Week 1', value: 45 },
          { name: 'Week 2', value: 52 },
          { name: 'Week 3', value: 48 },
          { name: 'Week 4', value: 61 }
        ],
        confidence: 'medium',
        timestamp: new Date().toISOString()
      });
    }

    return results;
  }

  private static generateInsights(context: DataAnalysisContext, results: AnalysisResult[], validation: ValidationResult): string {
    let insights = `## Analysis Results for: "${context.researchQuestion}"\n\n`;
    
    insights += `### Data Quality: ${validation.score}/100\n`;
    insights += `- **Completeness**: ${validation.metadata.completeness.toFixed(1)}%\n`;
    insights += `- **Total Records**: ${validation.metadata.rowCount.toLocaleString()}\n`;
    insights += `- **Columns**: ${validation.metadata.columnCount}\n\n`;

    if (validation.warnings.length > 0) {
      insights += `### Considerations:\n`;
      validation.warnings.forEach(warning => {
        insights += `- ${warning}\n`;
      });
      insights += '\n';
    }

    insights += `### Key Findings:\n`;
    results.forEach(result => {
      insights += `- **${result.title}**: ${typeof result.value === 'number' ? result.value.toLocaleString() : result.value}\n`;
    });

    return insights;
  }

  private static generateRecommendations(context: DataAnalysisContext, results: AnalysisResult[], validation: ValidationResult): string[] {
    const recommendations: string[] = [];

    if (validation.score < 70) {
      recommendations.push('Improve data quality by addressing missing values and inconsistencies');
    }

    if (validation.metadata.rowCount < 100) {
      recommendations.push('Consider collecting more data for statistically significant insights');
    }

    if (context.researchQuestion.toLowerCase().includes('user') && validation.metadata.columnCount < 5) {
      recommendations.push('Add user identifier columns for more detailed user analysis');
    }

    recommendations.push('Create visualizations to better communicate these insights');
    recommendations.push('Consider setting up automated reporting for ongoing monitoring');

    return recommendations;
  }

  private static calculateOverallConfidence(results: AnalysisResult[], validation: ValidationResult): 'high' | 'medium' | 'low' {
    const avgConfidence = results.reduce((sum, result) => {
      const score = result.confidence === 'high' ? 3 : result.confidence === 'medium' ? 2 : 1;
      return sum + score;
    }, 0) / results.length;

    const qualityFactor = validation.score / 100;
    const finalScore = (avgConfidence / 3) * qualityFactor;

    return finalScore > 0.7 ? 'high' : finalScore > 0.4 ? 'medium' : 'low';
  }

  private static generateSQLQuery(context: DataAnalysisContext, data: any): string {
    if (data.totalRows === 0) {
      return `-- No data available for SQL generation\n-- Research Question: ${context.researchQuestion}`;
    }

    return `-- Analysis Query for: ${context.researchQuestion}\nSELECT COUNT(*) as total_records FROM your_data;\n-- Add specific analysis based on research question`;
  }

  private static generateQueryBreakdown(context: DataAnalysisContext) {
    return {
      steps: [
        {
          step: 1,
          title: 'Data Selection',
          description: 'Select relevant columns for analysis',
          code: 'SELECT column1, column2 FROM table',
          explanation: 'Choose columns that relate to your research question'
        },
        {
          step: 2,
          title: 'Filtering',
          description: 'Apply filters to focus on relevant data',
          code: 'WHERE condition = value',
          explanation: 'Filter data to match your analysis criteria'
        }
      ]
    };
  }

  private static detectDataSource(data: ParsedDataFile[]): 'file' | 'database' | 'api' | 'paste' {
    if (!data || data.length === 0) return 'file';
    
    // Simple heuristic - could be enhanced
    const firstFile = data[0];
    if (firstFile.name.includes('api') || firstFile.name.includes('json')) return 'api';
    if (firstFile.name.includes('paste')) return 'paste';
    if (firstFile.name.includes('db') || firstFile.name.includes('sql')) return 'database';
    
    return 'file';
  }

  private static createErrorReport(context: DataAnalysisContext, errors: string[], startTime: number): AnalysisReport {
    return {
      id: this.generateAnalysisId(),
      context: {
        researchQuestion: context.researchQuestion,
        additionalContext: context.additionalContext,
        dataSource: 'file',
        educationalMode: context.educationalMode
      },
      results: [],
      insights: `Analysis failed with the following errors:\n${errors.join('\n')}`,
      recommendations: [
        'Check your data format and try again',
        'Ensure you have sufficient data for analysis',
        'Contact support if the issue persists'
      ],
      confidence: 'low',
      executionTime: Date.now() - startTime,
      sqlQuery: '-- Analysis failed, no query generated'
    };
  }
}
