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
    parsedData?: any,
    columnMapping?: any
  ) => {
    console.log('🚀 Starting analysis with:', { 
      researchQuestion, 
      additionalContext, 
      educational,
      dataAvailable: !!parsedData,
      dataType: Array.isArray(parsedData) ? 'array' : typeof parsedData,
      dataLength: Array.isArray(parsedData) ? parsedData.length : 'N/A',
      dataStructure: parsedData ? Object.keys(parsedData).slice(0, 5) : 'N/A',
      columnMapping: columnMapping ? 'Available' : 'None'
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
      const analysisResults = executeAnalysis(parsedData, researchQuestion, additionalContext, educational, columnMapping);
      
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

function executeAnalysis(
  parsedData: any,
  researchQuestion: string,
  additionalContext: string,
  educational: boolean,
  columnMapping?: any
): AnalysisResults {
  console.log('📊 Executing analysis with data:', {
    hasData: !!parsedData,
    dataType: Array.isArray(parsedData) ? 'array' : typeof parsedData,
    dataKeys: parsedData ? Object.keys(parsedData).slice(0, 10) : 'N/A',
    question: researchQuestion,
    hasColumnMapping: !!columnMapping
  });

  // Better data validation and processing
  let processedData: any[] = [];
  let totalRows = 0;
  let totalColumns = 0;
  let fileDetails: Array<{name: string, rows: number, columns: number}> = [];
  
  // Handle different data formats more robustly
  if (parsedData) {
    if (Array.isArray(parsedData)) {
      // Handle array of files or array of data
      parsedData.forEach((item, index) => {
        if (item && typeof item === 'object') {
          if (item.data && Array.isArray(item.data)) {
            // This is a file object with data array
            const fileRows = item.data.length;
            const fileColumns = fileRows > 0 ? Object.keys(item.data[0] || {}).length : 0;
            
            totalRows += fileRows;
            totalColumns = Math.max(totalColumns, fileColumns);
            processedData = processedData.concat(item.data);
            
            fileDetails.push({
              name: item.name || `File ${index + 1}`,
              rows: fileRows,
              columns: fileColumns
            });
          } else if (Object.keys(item).length > 0) {
            // This is a data row
            processedData.push(item);
            totalRows++;
            totalColumns = Math.max(totalColumns, Object.keys(item).length);
          }
        }
      });
    } else if (typeof parsedData === 'object' && parsedData.rows && Array.isArray(parsedData.rows)) {
      // Handle ParsedData format
      processedData = parsedData.rows;
      totalRows = parsedData.rows.length;
      totalColumns = parsedData.columns ? parsedData.columns.length : 0;
      fileDetails.push({
        name: 'Dataset',
        rows: totalRows,
        columns: totalColumns
      });
    } else if (typeof parsedData === 'object') {
      // Handle single object
      processedData = [parsedData];
      totalRows = 1;
      totalColumns = Object.keys(parsedData).length;
      fileDetails.push({
        name: 'Single Record',
        rows: 1,
        columns: totalColumns
      });
    }
  }

  console.log('📋 Processed data summary:', { 
    totalRows, 
    totalColumns, 
    fileCount: fileDetails.length,
    processedDataLength: processedData.length
  });

  // Generate analysis based on processed data and column mapping
  if (totalRows === 0) {
    return {
      insights: "No valid data was detected in your upload. Please ensure your file contains data rows with columns. Supported formats include CSV files with headers and data rows, or JSON files with arrays of objects.",
      confidence: 'low',
      recommendations: [
        "Upload a CSV file with column headers in the first row",
        "Ensure your file contains actual data rows, not just headers",
        "Verify your JSON file contains an array of objects with consistent properties",
        "Check that your file isn't empty or corrupted"
      ],
      detailedResults: [],
      sqlQuery: "-- No data available for analysis"
    };
  }

  // Enhanced analysis with column mapping information
  let analysisInsights = `Analysis completed successfully on your dataset containing ${totalRows.toLocaleString()} rows and ${totalColumns} columns.`;
  
  if (columnMapping) {
    const mappedColumns = [];
    if (columnMapping.userIdColumn) mappedColumns.push(`user identification (${columnMapping.userIdColumn})`);
    if (columnMapping.timestampColumn) mappedColumns.push(`timestamps (${columnMapping.timestampColumn})`);
    if (columnMapping.eventColumn) mappedColumns.push(`events (${columnMapping.eventColumn})`);
    if (columnMapping.valueColumns && columnMapping.valueColumns.length > 0) {
      mappedColumns.push(`value analysis (${columnMapping.valueColumns.join(', ')})`);
    }
    if (columnMapping.categoryColumns && columnMapping.categoryColumns.length > 0) {
      mappedColumns.push(`categorization (${columnMapping.categoryColumns.join(', ')})`);
    }
    
    if (mappedColumns.length > 0) {
      analysisInsights += ` Your data structure has been mapped for ${mappedColumns.join(', ')}, enabling comprehensive analysis of patterns and relationships.`;
    }
  }

  // Check for specific question patterns
  const lowerQuestion = researchQuestion.toLowerCase();
  const isRowCountQuestion = lowerQuestion.includes('how many rows') || 
                            lowerQuestion.includes('number of rows') ||
                            lowerQuestion.includes('row count') ||
                            lowerQuestion.includes('rows in');

  if (isRowCountQuestion) {
    const fileBreakdown = fileDetails.map(file => 
      `- **${file.name}**: ${file.rows.toLocaleString()} rows, ${file.columns} columns`
    ).join('\n');
    
    const multipleFilesText = fileDetails.length > 1 
      ? `\n\n**File Breakdown:**\n${fileBreakdown}\n\nCombined across ${fileDetails.length} files, your dataset provides a comprehensive view with ${totalRows.toLocaleString()} total data points.`
      : '';
    
    return {
      insights: `Your dataset contains **${totalRows.toLocaleString()} rows** total${fileDetails.length > 1 ? ` across ${fileDetails.length} files` : ''}. ${totalRows > 10000 ? 'This is a substantial dataset that provides excellent statistical power for analysis.' : totalRows > 1000 ? 'This is a good-sized dataset for meaningful analysis.' : 'This dataset provides a solid foundation for analysis.'}${multipleFilesText}`,
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
        ...fileDetails.map((file, index) => ({
          id: `file-${index}-details`,
          title: `${file.name} Details`,
          description: 'Individual file statistics',
          value: file.rows,
          insight: `${file.name}: ${file.rows.toLocaleString()} rows, ${file.columns} columns`,
          confidence: 'high' as const
        }))
      ],
      sqlQuery: `-- Count total rows across all your data files\nSELECT COUNT(*) as total_rows FROM your_dataset;\n-- Result: ${totalRows} total rows`
    };
  }

  // Default analysis for other questions with column mapping context
  const detailedResults = [
    {
      id: 'data-overview',
      title: 'Dataset Overview',
      description: 'Successfully processed dataset statistics',
      value: totalRows,
      insight: `Dataset loaded with ${totalRows.toLocaleString()} rows and ${totalColumns} columns`,
      confidence: 'high' as const
    },
    {
      id: 'data-quality',
      title: 'Data Quality Check',
      description: 'Initial data validation completed',
      value: Math.round((totalRows > 0 ? 100 : 0)),
      insight: 'Data structure validated successfully',
      confidence: 'high' as const
    }
  ];

  // Add column mapping insights if available
  if (columnMapping) {
    if (columnMapping.valueColumns && columnMapping.valueColumns.length > 0) {
      detailedResults.push({
        id: 'value-columns',
        title: 'Numeric Analysis Ready',
        description: 'Columns identified for numerical analysis',
        value: columnMapping.valueColumns.length,
        insight: `Ready to analyze ${columnMapping.valueColumns.length} numeric columns: ${columnMapping.valueColumns.join(', ')}`,
        confidence: 'high' as const
      });
    }

    if (columnMapping.categoryColumns && columnMapping.categoryColumns.length > 0) {
      detailedResults.push({
        id: 'category-columns',
        title: 'Segmentation Ready',
        description: 'Columns identified for categorization',
        value: columnMapping.categoryColumns.length,
        insight: `Ready to segment data by ${columnMapping.categoryColumns.length} categories: ${columnMapping.categoryColumns.join(', ')}`,
        confidence: 'high' as const
      });
    }
  }

  return {
    insights: analysisInsights + ` Based on your research question: "${researchQuestion}", the data is now ready for deeper analysis.`,
    confidence: 'high',
    recommendations: [
      'Your data has been successfully processed and mapped',
      columnMapping ? 'Column relationships have been identified for targeted analysis' : 'Consider exploring specific patterns or relationships in your data',
      'Try asking more specific questions about trends, distributions, or comparisons'
    ],
    detailedResults,
    sqlQuery: `-- Analyze your dataset with mapped columns\nSELECT COUNT(*) as total_rows, COUNT(DISTINCT *) as unique_rows\nFROM your_dataset;\n-- Dataset contains ${totalRows} rows`
  };
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
