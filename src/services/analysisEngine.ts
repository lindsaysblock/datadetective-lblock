
import { DataAnalysisContext, AnalysisResults, AnalysisInsight } from '@/types/data';
import { DataProcessor } from '@/utils/dataProcessor';

export class AnalysisEngine {
  static async executeAnalysis(context: DataAnalysisContext): Promise<AnalysisResults> {
    console.log('🔍 Starting analysis with context:', {
      question: context.researchQuestion,
      hasData: context.parsedData?.length > 0,
      educational: context.educationalMode
    });

    const { allRows, allColumns, totalRows, fileCount } = DataProcessor.extractAnalysisData(context.parsedData);
    
    if (totalRows === 0) {
      return this.generateNoDataResponse(context.researchQuestion);
    }

    return this.generateDataAnalysis(context, allRows, allColumns, totalRows, fileCount);
  }

  private static generateDataAnalysis(
    context: DataAnalysisContext,
    rows: any[],
    columns: string[],
    totalRows: number,
    fileCount: number
  ): AnalysisResults {
    const detailedResults: AnalysisInsight[] = [];
    
    // Basic data overview
    detailedResults.push({
      id: 'data-overview',
      title: 'Dataset Overview',
      description: 'Summary of your uploaded data',
      value: totalRows,
      insight: `Your dataset contains ${totalRows.toLocaleString()} rows across ${fileCount} file${fileCount > 1 ? 's' : ''} with ${columns.length} columns: ${columns.slice(0, 5).join(', ')}${columns.length > 5 ? ` and ${columns.length - 5} more` : ''}`,
      confidence: 'high'
    });

    // Analyze research question
    const questionAnalysis = this.analyzeResearchQuestion(context.researchQuestion, rows, columns, totalRows);
    detailedResults.push(...questionAnalysis.insights);

    // Column analysis if mapping provided
    if (context.columnMapping) {
      const mappingInsights = this.analyzeColumnMapping(context.columnMapping, columns, rows);
      detailedResults.push(...mappingInsights);
    }

    // Generate insights summary
    const insights = this.generateInsightsSummary(context, questionAnalysis, totalRows, columns.length);

    return {
      insights,
      confidence: 'high',
      recommendations: this.generateRecommendations(context, totalRows, columns.length),
      detailedResults,
      sqlQuery: this.generateSQLQuery(context, columns, totalRows),
      queryBreakdown: context.educationalMode ? this.generateQueryBreakdown(context) : undefined
    };
  }

  private static analyzeResearchQuestion(question: string, rows: any[], columns: string[], totalRows: number) {
    const insights: AnalysisInsight[] = [];
    const questionLower = question.toLowerCase();

    // Row count questions
    if (questionLower.includes('how many') && (questionLower.includes('row') || questionLower.includes('record'))) {
      insights.push({
        id: 'row-count-answer',
        title: 'Row Count Analysis',
        description: 'Direct answer to your row count question',
        value: totalRows,
        insight: `**Answer**: Your dataset contains exactly **${totalRows.toLocaleString()} rows**. This ${totalRows > 1000 ? 'provides excellent data volume' : totalRows > 100 ? 'gives good sample size' : 'offers limited but workable data'} for analysis.`,
        confidence: 'high'
      });
    }

    // Column analysis questions
    if (questionLower.includes('column') || questionLower.includes('field')) {
      insights.push({
        id: 'column-analysis',
        title: 'Column Structure Analysis',
        description: 'Information about your data columns',
        value: columns.length,
        insight: `Your dataset has ${columns.length} columns: ${columns.join(', ')}`,
        confidence: 'high'
      });
    }

    // Data quality questions
    if (questionLower.includes('quality') || questionLower.includes('complete')) {
      const structure = DataProcessor.analyzeDataStructure(rows, columns);
      if (structure) {
        const completeness = Object.values(structure.nullCounts).reduce((sum, nulls) => sum + nulls, 0);
        const totalCells = columns.length * Math.min(rows.length, structure.sampleSize);
        const completenessPercentage = ((totalCells - completeness) / totalCells * 100).toFixed(1);
        
        insights.push({
          id: 'data-quality',
          title: 'Data Quality Assessment',
          description: 'Analysis of data completeness and quality',
          value: `${completenessPercentage}%`,
          insight: `Data completeness: ${completenessPercentage}% - ${parseFloat(completenessPercentage) > 90 ? 'Excellent' : parseFloat(completenessPercentage) > 75 ? 'Good' : 'Needs attention'}`,
          confidence: 'high'
        });
      }
    }

    return { insights, summary: `Analyzed "${question}" against ${totalRows} rows of data` };
  }

  private static analyzeColumnMapping(mapping: any, columns: string[], rows: any[]): AnalysisInsight[] {
    const insights: AnalysisInsight[] = [];

    if (mapping.valueColumns?.length > 0) {
      insights.push({
        id: 'numeric-analysis',
        title: 'Numeric Data Analysis',
        description: 'Analysis of quantitative columns',
        value: mapping.valueColumns.length,
        insight: `Found ${mapping.valueColumns.length} numeric columns for quantitative analysis: ${mapping.valueColumns.join(', ')}`,
        confidence: 'high'
      });
    }

    if (mapping.categoryColumns?.length > 0) {
      insights.push({
        id: 'categorical-analysis',
        title: 'Categorical Data Analysis',
        description: 'Analysis of categorical columns',
        value: mapping.categoryColumns.length,
        insight: `Identified ${mapping.categoryColumns.length} categorical columns for segmentation: ${mapping.categoryColumns.join(', ')}`,
        confidence: 'high'
      });
    }

    return insights;
  }

  private static generateInsightsSummary(context: DataAnalysisContext, questionAnalysis: any, totalRows: number, columnCount: number): string {
    let summary = `## Analysis Results for: "${context.researchQuestion}"\n\n`;
    
    summary += `**Dataset Summary**: ${totalRows.toLocaleString()} rows, ${columnCount} columns\n\n`;
    
    if (questionAnalysis.insights.length > 0) {
      summary += `**Key Findings**:\n`;
      questionAnalysis.insights.forEach((insight: AnalysisInsight) => {
        summary += `• ${insight.insight}\n`;
      });
      summary += '\n';
    }

    if (context.additionalContext) {
      summary += `**Business Context**: ${context.additionalContext}\n\n`;
    }

    summary += `The analysis has been completed with ${questionAnalysis.insights.length > 0 ? 'specific answers to your question' : 'general data insights'}.`;

    return summary;
  }

  private static generateRecommendations(context: DataAnalysisContext, totalRows: number, columnCount: number): string[] {
    const recommendations: string[] = [];

    recommendations.push(`Dataset contains ${totalRows.toLocaleString()} rows - ${totalRows > 1000 ? 'excellent for statistical analysis' : 'sufficient for initial insights'}`);
    
    if (context.columnMapping) {
      recommendations.push('Column relationships have been mapped for targeted analysis');
    } else {
      recommendations.push('Consider mapping column relationships for deeper insights');
    }

    if (!context.additionalContext) {
      recommendations.push('Adding business context would enhance the analysis relevance');
    }

    return recommendations;
  }

  private static generateSQLQuery(context: DataAnalysisContext, columns: string[], totalRows: number): string {
    return `-- Analysis Query for: ${context.researchQuestion}
SELECT 
  COUNT(*) as total_rows,
  COUNT(DISTINCT *) as unique_records,
  ${columns.slice(0, 3).map(col => `COUNT("${col}") as ${col}_count`).join(',\n  ')}
FROM your_dataset;

-- Results: ${totalRows} rows analyzed
-- Columns: ${columns.join(', ')}`;
  }

  private static generateQueryBreakdown(context: DataAnalysisContext) {
    return {
      steps: [
        {
          step: 1,
          title: 'Data Loading',
          description: 'Load and validate the uploaded dataset',
          code: 'SELECT * FROM uploaded_data;',
          explanation: 'First, we load all the data to understand its structure and content.'
        },
        {
          step: 2,
          title: 'Data Analysis',
          description: 'Analyze the data to answer your research question',
          code: 'SELECT COUNT(*), MIN(column), MAX(column) FROM data;',
          explanation: 'We perform the specific analysis requested in your research question.'
        },
        {
          step: 3,
          title: 'Results Summary',
          description: 'Compile and present the final results',
          code: 'SELECT summary_metrics FROM analysis_results;',
          explanation: 'Finally, we compile all findings into a comprehensive summary.'
        }
      ]
    };
  }

  private static generateNoDataResponse(researchQuestion: string): AnalysisResults {
    return {
      insights: `Ready to analyze your data for: "${researchQuestion}"\n\nTo get specific results, please upload a CSV or JSON file with actual data. The analysis engine is prepared to answer your question once data is available.`,
      confidence: 'medium',
      recommendations: [
        'Upload a CSV file with column headers and data rows',
        'Ensure your file contains actual data, not just headers',
        'The system will then provide specific answers to your research question'
      ],
      detailedResults: [
        {
          id: 'awaiting-data',
          title: 'Awaiting Data Upload',
          description: 'System ready for analysis',
          value: 0,
          insight: 'Upload your data file to get specific answers to your research question',
          confidence: 'medium'
        }
      ],
      sqlQuery: '-- Ready to analyze your data\n-- Upload a file to see your actual data query here\nSELECT * FROM your_dataset LIMIT 10;'
    };
  }
}
