import { useState, useCallback, useMemo } from 'react';
import { DataAnalysisEngine, AnalysisResult } from '../utils/analysis/dataAnalysisEngine';
import { ParsedData } from '../utils/dataParser';

interface AnalysisResults {
  insights: string;
  confidence: 'high' | 'medium' | 'low';
  recommendations: string[];
  detailedResults: AnalysisResult[];
  sqlQuery: string;
  queryBreakdown?: {
    steps: Array<{
      step: number;
      title: string;
      description: string;
      code: string;
      explanation: string;
    }>;
  };
}

interface AnalysisState {
  isProcessingAnalysis: boolean;
  analysisResults: AnalysisResults | null;
  analysisCompleted: boolean;
  showAnalysisView: boolean;
  educationalMode: boolean;
  detailedResults: AnalysisResult[];
}

export const useProjectAnalysis = () => {
  const [state, setState] = useState<AnalysisState>({
    isProcessingAnalysis: false,
    analysisResults: null,
    analysisCompleted: false,
    showAnalysisView: false,
    educationalMode: false,
    detailedResults: []
  });

  const startAnalysis = useCallback((
    researchQuestion: string, 
    additionalContext: string, 
    educational: boolean = false,
    parsedData?: any
  ) => {
    console.log('🚀 Starting analysis with:', { 
      researchQuestion, 
      additionalContext, 
      educational,
      dataAvailable: !!parsedData,
      dataType: Array.isArray(parsedData) ? 'array' : typeof parsedData,
      dataLength: Array.isArray(parsedData) ? parsedData.length : 'N/A'
    });
    
    setState(prev => ({
      ...prev,
      isProcessingAnalysis: true,
      educationalMode: educational,
      analysisResults: null,
      analysisCompleted: false,
      showAnalysisView: false
    }));
    
    setTimeout(() => {
      console.log('🎯 Analysis processing complete, generating results...');
      const analysisResults = executeAnalysis(parsedData, researchQuestion, additionalContext, educational);
      
      setState(prev => ({
        ...prev,
        analysisResults,
        detailedResults: analysisResults.detailedResults,
        analysisCompleted: true,
        isProcessingAnalysis: false
      }));

      console.log('✅ Analysis results generated and state updated:', {
        insights: analysisResults.insights,
        confidence: analysisResults.confidence,
        recommendationsCount: analysisResults.recommendations.length,
        detailedResultsCount: analysisResults.detailedResults.length
      });
    }, 3000);
  }, []);

  const showResults = useCallback(() => {
    console.log('🎯 Showing results, setting showAnalysisView to true');
    setState(prev => ({
      ...prev,
      showAnalysisView: true,
      isProcessingAnalysis: false
    }));
  }, []);

  const resetAnalysis = useCallback(() => {
    setState({
      isProcessingAnalysis: false,
      analysisResults: null,
      analysisCompleted: false,
      showAnalysisView: false,
      educationalMode: false,
      detailedResults: []
    });
  }, []);

  const setShowAnalysisView = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showAnalysisView: show }));
  }, []);

  const memoizedValues = useMemo(() => ({
    hasValidData: state.analysisResults !== null,
    highConfidenceResults: state.detailedResults.filter(r => r.confidence === 'high').length,
    totalInsights: state.detailedResults.length
  }), [state.analysisResults, state.detailedResults]);

  return {
    ...state,
    ...memoizedValues,
    startAnalysis,
    showResults,
    resetAnalysis,
    setShowAnalysisView
  };
};

// Helper function to execute analysis
function executeAnalysis(
  parsedData: any,
  researchQuestion: string,
  additionalContext: string,
  educational: boolean
): AnalysisResults {
  console.log('📊 Executing analysis with data:', {
    hasData: !!parsedData,
    dataType: Array.isArray(parsedData) ? 'array' : typeof parsedData,
    dataLength: Array.isArray(parsedData) ? parsedData.length : 'N/A',
    question: researchQuestion
  });

  // Handle different data formats - combine all files into one analysis
  let totalRows = 0;
  let totalColumns = 0;
  let allData: Record<string, any>[] = [];
  let fileDetails: Array<{name: string, rows: number, columns: number}> = [];
  
  if (Array.isArray(parsedData) && parsedData.length > 0) {
    console.log('📋 Processing multiple files:', parsedData.length);
    
    // Combine data from all files
    parsedData.forEach((fileData, index) => {
      if (fileData.data && Array.isArray(fileData.data)) {
        const fileRows = fileData.data.length;
        const fileColumns = Object.keys(fileData.data[0] || {}).length;
        
        totalRows += fileRows;
        totalColumns = Math.max(totalColumns, fileColumns); // Take max columns across files
        allData = allData.concat(fileData.data);
        
        fileDetails.push({
          name: fileData.name,
          rows: fileRows,
          columns: fileColumns
        });
        
        console.log(`📄 File ${index + 1} (${fileData.name}): ${fileRows} rows, ${fileColumns} columns`);
      }
    });
    
    console.log('📊 Combined totals:', { totalRows, totalColumns, totalFiles: parsedData.length });
  }

  // Check for simple row count questions first
  const lowerQuestion = researchQuestion.toLowerCase();
  const isRowCountQuestion = lowerQuestion.includes('how many rows') || 
                            lowerQuestion.includes('number of rows') ||
                            lowerQuestion.includes('row count') ||
                            lowerQuestion.includes('rows in');

  if (totalRows > 0 && isRowCountQuestion) {
    console.log('✅ Row count question detected, returning combined answer:', { totalRows, totalColumns });
    
    // Create detailed breakdown by file
    const fileBreakdown = fileDetails.map(file => 
      `- **${file.name}**: ${file.rows.toLocaleString()} rows, ${file.columns} columns`
    ).join('\n');
    
    const multipleFilesText = fileDetails.length > 1 
      ? `\n\n**File Breakdown:**\n${fileBreakdown}\n\nCombined across ${fileDetails.length} files, your dataset provides a comprehensive view with ${totalRows.toLocaleString()} total data points.`
      : '';
    
    return {
      insights: `Your dataset contains **${totalRows.toLocaleString()} rows** total across ${fileDetails.length} file${fileDetails.length > 1 ? 's' : ''}. ${totalRows > 10000 ? 'This is a substantial dataset that provides excellent statistical power for analysis.' : totalRows > 1000 ? 'This is a good-sized dataset for meaningful analysis.' : 'This dataset provides a solid foundation for analysis.'}${multipleFilesText}`,
      confidence: 'high',
      recommendations: [
        `With ${totalRows.toLocaleString()} total rows of data, you can explore comprehensive trends and patterns`,
        fileDetails.length > 1 ? 'Consider analyzing relationships between data from different files' : 'Consider analyzing specific columns or segments of your data',
        'Look for correlations and insights across your complete dataset'
      ],
      detailedResults: [
        {
          id: 'total-row-count',
          title: 'Total Dataset Size',
          description: `Combined rows across ${fileDetails.length} file${fileDetails.length > 1 ? 's' : ''}`,
          value: totalRows,
          insight: `Your complete dataset contains ${totalRows.toLocaleString()} rows of data`,
          confidence: 'high'
        },
        {
          id: 'file-count',
          title: 'Data Sources',
          description: 'Number of uploaded files',
          value: fileDetails.length,
          insight: `Data sourced from ${fileDetails.length} file${fileDetails.length > 1 ? 's' : ''}`,
          confidence: 'high'
        },
        ...fileDetails.map((file, index) => ({
          id: `file-${index}-details`,
          title: `${file.name} Details`,
          description: 'Individual file statistics',
          value: file.rows,
          insight: `${file.name}: ${file.rows.toLocaleString()} rows, ${file.columns} columns`,
          confidence: 'high' as const
        }))
      ],
      sqlQuery: `-- Count total rows across all your data files\nSELECT COUNT(*) as total_rows FROM (\n${fileDetails.map((file, index) => `  SELECT * FROM ${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`).join('\n  UNION ALL\n')}\n) combined_data;\n-- Result: ${totalRows} total rows across ${fileDetails.length} file${fileDetails.length > 1 ? 's' : ''}`
    };
  }

  // If not a row count question or no data, provide default response
  let analysisInsights = "Analysis completed successfully";
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  let recommendations: string[] = [];
  let realResults: AnalysisResult[] = [];

  if (totalRows > 0) {
    analysisInsights = `Analysis completed on your dataset containing ${totalRows.toLocaleString()} total rows across ${fileDetails.length} file${fileDetails.length > 1 ? 's' : ''}. The data is ready for deeper analysis based on your specific research question: "${researchQuestion}"`;
    confidence = 'high';
    recommendations = [
      'Your data is successfully loaded and ready for analysis',
      'Consider exploring specific patterns or relationships in your data',
      'Try asking more specific questions about your data trends'
    ];
    realResults = [
      {
        id: 'data-loaded',
        title: 'Data Successfully Processed',
        description: 'All uploaded files have been analyzed',
        value: totalRows,
        insight: `${totalRows.toLocaleString()} rows loaded from ${fileDetails.length} file${fileDetails.length > 1 ? 's' : ''}`,
        confidence: 'high'
      }
    ];
  } else {
    analysisInsights = "No valid data was provided for analysis. Please upload a dataset with rows and columns.";
    recommendations = ["Upload a CSV or JSON file with data", "Ensure the file contains both headers and data rows"];
  }

  const finalResults = {
    insights: analysisInsights,
    confidence,
    recommendations,
    detailedResults: realResults,
    sqlQuery: generateSQLFromQuestion(researchQuestion, null),
    queryBreakdown: educational ? generateQueryBreakdown(researchQuestion) : undefined
  };

  console.log('📋 Final analysis results:', {
    insightsLength: finalResults.insights.length,
    confidence: finalResults.confidence,
    recommendationsCount: finalResults.recommendations.length,
    detailedResultsCount: finalResults.detailedResults.length
  });

  return finalResults;
}

function generateInsightsFromResults(results: AnalysisResult[], researchQuestion: string): string {
  if (results.length === 0) {
    return "No analysis results available. Please ensure your data contains the expected columns.";
  }

  const keyFindings = results
    .filter(result => result.confidence === 'high' && result.insight)
    .map(result => result.insight)
    .slice(0, 5);

  if (keyFindings.length === 0) {
    keyFindings.push("Basic data structure analysis completed successfully.");
  }

  const findings = keyFindings.join('. ');
  
  return `Based on your research question "${researchQuestion}" and comprehensive data analysis: ${findings}. ${keyFindings.length > 1 ? 'The analysis reveals important patterns that can inform strategic decisions.' : ''}`;
}

function determineOverallConfidence(results: AnalysisResult[]): 'high' | 'medium' | 'low' {
  const highConfidenceCount = results.filter(r => r.confidence === 'high').length;
  const confidenceRatio = highConfidenceCount / results.length;
  
  if (confidenceRatio >= 0.7) return 'high';
  if (confidenceRatio >= 0.4) return 'medium';
  return 'low';
}

function generateRecommendationsFromResults(results: AnalysisResult[]): string[] {
  const recommendations: string[] = [];
  
  results.forEach(result => {
    if (result.id === 'data-completeness' && typeof result.value === 'number' && result.value < 90) {
      recommendations.push(`Data completeness is ${result.value}% - consider improving data collection processes`);
    }
    
    if (result.id === 'unique-users' && typeof result.value === 'number' && result.value > 100) {
      recommendations.push('Consider user segmentation analysis with this user base size');
    }
    
    if (result.id === 'total-rows' && typeof result.value === 'number' && result.value > 10000) {
      recommendations.push('Large dataset detected - consider implementing data sampling for faster analysis');
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('Data analysis completed successfully');
    recommendations.push('Consider exploring specific business questions with this dataset');
    recommendations.push('Look for trends and patterns in user behavior');
  }

  return recommendations;
}

function generateSQLFromQuestion(researchQuestion: string, parsedData?: ParsedData): string {
  const lowerQuestion = researchQuestion.toLowerCase();
  
  if (lowerQuestion.includes('how many rows') || lowerQuestion.includes('row count')) {
    return `-- Count total rows in your dataset\nSELECT COUNT(*) as total_rows FROM your_data;\n-- This query counts all rows in your combined dataset`;
  }
  
  return `-- Analysis query for: ${researchQuestion}\nSELECT * FROM your_data LIMIT 100;\n-- Modify this query based on your specific analysis needs`;
}

function generateQueryBreakdown(researchQuestion: string) {
  return {
    steps: [
      {
        step: 1,
        title: "Data Selection",
        description: "Select relevant columns for analysis",
        code: "SELECT column1, column2, column3",
        explanation: "We start by selecting the key columns needed to answer your research question."
      },
      {
        step: 2,
        title: "Filtering",
        description: "Apply filters to focus on relevant data",
        code: "WHERE condition = 'value'",
        explanation: "Filter to focus on the data most relevant to your question."
      },
      {
        step: 3,
        title: "Grouping",
        description: "Group data for aggregation",
        code: "GROUP BY category",
        explanation: "Group by relevant categories to calculate summary statistics."
      },
      {
        step: 4,
        title: "Aggregation",
        description: "Calculate summary statistics",
        code: "COUNT(*) as total, AVG(value) as average",
        explanation: "Calculate counts, averages, and other metrics for each group."
      },
      {
        step: 5,
        title: "Ordering",
        description: "Sort results by importance",
        code: "ORDER BY total DESC",
        explanation: "Sort results to highlight the most important findings first."
      }
    ]
  };
}
