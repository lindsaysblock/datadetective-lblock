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
    parsedData?: any // This could be the array of parsed files
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
    
    // Simulate analysis processing with more realistic timing
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

  // Handle different data formats - could be array of parsed files or single ParsedData
  let processedData: ParsedData | undefined;
  
  if (Array.isArray(parsedData) && parsedData.length > 0) {
    // If it's an array of parsed files, use the first one or combine them
    const firstFile = parsedData[0];
    console.log('📋 Processing first file from array:', {
      name: firstFile.name,
      rows: firstFile.rows,
      columns: firstFile.columns,
      hasData: firstFile.data && firstFile.data.length > 0
    });
    
    if (firstFile.data && firstFile.data.length > 0) {
      // Convert the parsed file data to ParsedData format
      const headers = Object.keys(firstFile.data[0] || {});
      processedData = {
        columns: headers.map(header => ({ name: header, type: 'string' as const })),
        rows: firstFile.data,
        rowCount: firstFile.data.length,
        fileSize: 0,
        summary: {
          totalRows: firstFile.data.length,
          totalColumns: headers.length,
          possibleUserIdColumns: headers.filter(h => /user|customer|id/i.test(h)),
          possibleEventColumns: headers.filter(h => /event|action|activity/i.test(h)),
          possibleTimestampColumns: headers.filter(h => /time|date|timestamp/i.test(h))
        }
      };
      console.log('✅ Converted parsed file to ProcessedData:', {
        rows: processedData.rowCount,
        columns: processedData.columns.length
      });
    }
  } else if (parsedData && typeof parsedData === 'object' && parsedData.rows) {
    // It's already in ParsedData format
    processedData = parsedData;
    console.log('✅ Using data in ParsedData format:', {
      rows: processedData.rowCount,
      columns: processedData.columns?.length
    });
  }

  // Check for simple row count questions first
  const lowerQuestion = researchQuestion.toLowerCase();
  const isRowCountQuestion = lowerQuestion.includes('how many rows') || 
                            lowerQuestion.includes('number of rows') ||
                            lowerQuestion.includes('row count') ||
                            lowerQuestion.includes('rows in');

  if (processedData && processedData.rows && isRowCountQuestion) {
    const rowCount = processedData.rows.length;
    const columnCount = processedData.columns?.length || 0;
    
    console.log('✅ Row count question detected, returning direct answer:', { rowCount, columnCount });
    
    return {
      insights: `Your dataset contains **${rowCount.toLocaleString()} rows** and ${columnCount} columns. ${rowCount > 10000 ? 'This is a substantial dataset that provides excellent statistical power for analysis.' : rowCount > 1000 ? 'This is a good-sized dataset for meaningful analysis.' : 'This is a smaller dataset - results may have limited statistical significance.'}`,
      confidence: 'high',
      recommendations: [
        `With ${rowCount.toLocaleString()} rows of data, you can explore trends and patterns`,
        'Consider analyzing specific columns or segments of your data',
        'Look for relationships between different variables in your dataset'
      ],
      detailedResults: [
        {
          id: 'row-count',
          title: 'Dataset Size',
          description: 'Total number of data records',
          value: rowCount,
          insight: `Your dataset contains ${rowCount.toLocaleString()} rows of data`,
          confidence: 'high'
        },
        {
          id: 'column-count',
          title: 'Data Dimensions', 
          description: 'Number of data attributes/columns',
          value: columnCount,
          insight: `Each row has ${columnCount} data points/attributes`,
          confidence: 'high'
        }
      ],
      sqlQuery: `-- Count total rows in your dataset\nSELECT COUNT(*) as total_rows FROM your_data;\n-- Result: ${rowCount} rows`
    };
  }

  let realResults: AnalysisResult[] = [];
  let analysisInsights = "No data available for analysis";
  let confidence: 'high' | 'medium' | 'low' = 'low';
  let recommendations: string[] = [];

  if (processedData && processedData.rows && processedData.rows.length > 0) {
    console.log('📊 Running real data analysis on', processedData.rows.length, 'rows...');
    
    try {
      const engine = new DataAnalysisEngine(processedData, { enableLogging: true });
      realResults = engine.runCompleteAnalysis();
      
      console.log('✅ Analysis completed with', realResults.length, 'results');
      
      if (realResults.length > 0) {
        analysisInsights = generateInsightsFromResults(realResults, researchQuestion);
        confidence = determineOverallConfidence(realResults);
        recommendations = generateRecommendationsFromResults(realResults);
      } else {
        analysisInsights = "Analysis completed but no significant patterns were found in the data.";
        confidence = 'medium';
        recommendations = ["Consider checking data quality", "Verify column names and data types"];
      }
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      analysisInsights = `Analysis failed: ${error}. Please check your data format.`;
      confidence = 'low';
      recommendations = ["Check data format and structure", "Ensure data has proper column headers"];
    }
  } else {
    console.warn('⚠️ No valid data provided for analysis');
    console.log('Debug - parsedData details:', {
      parsedData,
      isArray: Array.isArray(parsedData),
      hasRows: processedData?.rows?.length
    });
    analysisInsights = "No valid data was provided for analysis. Please upload a dataset with rows and columns.";
    recommendations = ["Upload a CSV or JSON file with data", "Ensure the file contains both headers and data rows"];
  }

  const finalResults = {
    insights: analysisInsights,
    confidence,
    recommendations,
    detailedResults: realResults,
    sqlQuery: generateSQLFromQuestion(researchQuestion, processedData),
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
  if (!parsedData || !parsedData.columns) {
    return "-- No data available for SQL generation";
  }

  const tableName = "your_data";
  const columns = parsedData.columns.map(col => col.name);
  const lowerQuestion = researchQuestion.toLowerCase();

  let query = `-- Analysis for: ${researchQuestion}\nSELECT\n`;
  
  const displayColumns = columns.slice(0, 5);
  query += displayColumns.map(col => `  ${col}`).join(',\n');
  if (columns.length > 5) {
    query += `\n  -- ... and ${columns.length - 5} more columns`;
  }
  
  query += `\nFROM ${tableName}`;
  
  if (lowerQuestion.includes('purchase') || lowerQuestion.includes('buy')) {
    const actionCol = columns.find(col => col.toLowerCase().includes('action'));
    if (actionCol) {
      query += `\nWHERE ${actionCol} = 'purchase'`;
    }
  }
  
  query += `\nLIMIT 100;`;
  
  return query;
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
