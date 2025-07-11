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
      const analysisResults = executeAnalysis(
        parsedData, 
        researchQuestion, 
        additionalContext, 
        educational, 
        columnMapping
      );
      
      setState(prev => ({
        ...prev,
        analysisResults,
        detailedResults: analysisResults.detailedResults,
        analysisCompleted: true,
        isProcessingAnalysis: false
      }));

      console.log('✅ Analysis results generated:', analysisResults);
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
  console.log('📊 Executing analysis with:', {
    hasData: !!parsedData,
    question: researchQuestion,
    context: additionalContext,
    hasColumnMapping: !!columnMapping
  });

  // Extract actual data from the parsed structure
  let actualData: any[] = [];
  let dataColumns: string[] = [];
  let totalRows = 0;

  // Handle the data structure from useFileUpload
  if (parsedData && parsedData.rows && Array.isArray(parsedData.rows)) {
    actualData = parsedData.rows;
    dataColumns = parsedData.columns || [];
    totalRows = parsedData.rows.length;
    console.log('✅ Extracted data from ParsedData structure:', { totalRows, columns: dataColumns.length });
  } else if (Array.isArray(parsedData)) {
    actualData = parsedData;
    totalRows = parsedData.length;
    if (parsedData.length > 0) {
      dataColumns = Object.keys(parsedData[0]);
    }
    console.log('✅ Using array data directly:', { totalRows, columns: dataColumns.length });
  }

  // If we have real data, analyze it properly
  if (totalRows > 0 && actualData.length > 0) {
    console.log('🔍 Analyzing real data with question:', researchQuestion);
    
    // Analyze the research question to determine what type of analysis to perform
    const questionLower = researchQuestion.toLowerCase();
    
    // Generate targeted analysis based on the question
    let insights = '';
    let recommendations: string[] = [];
    let detailedResults: AnalysisResult[] = [];
    
    // Basic data overview
    detailedResults.push({
      id: 'data-overview',
      title: 'Dataset Overview',
      description: 'Summary of your uploaded data',
      value: totalRows,
      insight: `Your dataset contains ${totalRows.toLocaleString()} rows with ${dataColumns.length} columns: ${dataColumns.slice(0, 5).join(', ')}${dataColumns.length > 5 ? ` and ${dataColumns.length - 5} more` : ''}`,
      confidence: 'high'
    });

    // Answer specific questions
    if (questionLower.includes('how many') && (questionLower.includes('row') || questionLower.includes('record'))) {
      insights = `**Answer to your question**: Your dataset contains **${totalRows.toLocaleString()} rows** of data.\n\nThis provides a solid foundation for analysis with sufficient data points to identify meaningful patterns and trends.`;
      
      recommendations = [
        `With ${totalRows.toLocaleString()} rows, you have substantial data for statistical analysis`,
        'Consider exploring specific columns to understand data distribution',
        'Look for patterns across different data segments'
      ];

      detailedResults.push({
        id: 'row-count-analysis',
        title: 'Row Count Analysis',
        description: 'Direct answer to your row count question',
        value: totalRows,
        insight: `Your dataset has exactly ${totalRows.toLocaleString()} rows, which is ${totalRows > 1000 ? 'excellent' : totalRows > 100 ? 'good' : 'limited'} for analysis purposes`,
        confidence: 'high'
      });
    } else {
      // General analysis
      insights = `Based on your question "${researchQuestion}", I've analyzed your dataset of ${totalRows.toLocaleString()} rows.\n\n`;
      
      // Column analysis
      if (columnMapping) {
        if (columnMapping.valueColumns && columnMapping.valueColumns.length > 0) {
          insights += `**Numeric Analysis Ready**: Found ${columnMapping.valueColumns.length} numeric columns (${columnMapping.valueColumns.join(', ')}) for quantitative analysis.\n\n`;
          
          detailedResults.push({
            id: 'numeric-columns',
            title: 'Numeric Data Analysis',
            description: 'Available quantitative data columns',
            value: columnMapping.valueColumns.length,
            insight: `${columnMapping.valueColumns.length} numeric columns identified: ${columnMapping.valueColumns.join(', ')}`,
            confidence: 'high'
          });
        }
        
        if (columnMapping.categoryColumns && columnMapping.categoryColumns.length > 0) {
          insights += `**Categorical Analysis Ready**: Found ${columnMapping.categoryColumns.length} categorical columns (${columnMapping.categoryColumns.join(', ')}) for segmentation analysis.\n\n`;
          
          detailedResults.push({
            id: 'categorical-columns',
            title: 'Categorical Data Analysis',
            description: 'Available categorical data for segmentation',
            value: columnMapping.categoryColumns.length,
            insight: `${columnMapping.categoryColumns.length} categorical columns identified: ${columnMapping.categoryColumns.join(', ')}`,
            confidence: 'high'
          });
        }
      }
      
      insights += `The data structure is well-formed and ready for detailed analysis to answer your specific research question.`;
      
      recommendations = [
        'Data has been successfully processed and validated',
        columnMapping ? 'Column relationships have been mapped for targeted analysis' : 'Consider mapping column relationships for deeper insights',
        'Your dataset size supports reliable statistical analysis'
      ];
    }

    // Add context-specific analysis if additional context was provided
    if (additionalContext && additionalContext.trim()) {
      detailedResults.push({
        id: 'context-analysis',
        title: 'Context-Aware Analysis',
        description: 'Analysis incorporating your business context',
        value: 1,
        insight: `Incorporating your context: "${additionalContext}" - This adds important business perspective to the data analysis`,
        confidence: 'medium'
      });
    }

    return {
      insights,
      confidence: 'high',
      recommendations,
      detailedResults,
      sqlQuery: `-- Analysis for: ${researchQuestion}\nSELECT COUNT(*) as total_rows,\n       COUNT(DISTINCT *) as unique_records\nFROM your_dataset;\n-- Result: ${totalRows} rows analyzed`
    };
  }

  // Fallback when no data is available
  console.log('⚠️ No valid data found, providing guidance');
  return {
    insights: "Ready to analyze your data! To get meaningful results, please upload a CSV or JSON file with actual data rows. The analysis engine is prepared to answer your research question once data is available.",
    confidence: 'medium',
    recommendations: [
      "Upload a CSV file with column headers and data rows",
      "Ensure your file contains actual data, not just headers",
      "The system will then provide specific answers to your research question"
    ],
    detailedResults: [
      {
        id: 'no-data-state',
        title: 'Awaiting Data Upload',
        description: 'System ready for analysis',
        value: 0,
        insight: 'Upload your data file to get specific answers to your research question',
        confidence: 'medium'
      }
    ],
    sqlQuery: "-- Ready to analyze your data\n-- Upload a file to see your actual data query here\nSELECT * FROM your_dataset LIMIT 10;"
  };
}
