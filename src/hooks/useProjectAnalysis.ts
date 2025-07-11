
import { useState, useCallback } from 'react';
import { DataAnalysisEngine, AnalysisResult } from '../utils/analysis/dataAnalysisEngine';
import { ParsedData } from '../utils/dataParser';

export const useProjectAnalysis = () => {
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [educationalMode, setEducationalMode] = useState(false);
  const [detailedResults, setDetailedResults] = useState<AnalysisResult[]>([]);

  const startAnalysis = useCallback((
    researchQuestion: string, 
    additionalContext: string, 
    educational: boolean = false,
    parsedData?: ParsedData
  ) => {
    console.log('🚀 Starting real analysis with:', { 
      researchQuestion, 
      additionalContext, 
      educational,
      dataAvailable: !!parsedData,
      dataRows: parsedData?.rows?.length || 0
    });
    
    setIsProcessingAnalysis(true);
    setEducationalMode(educational);
    
    // Simulate processing time with real analysis
    setTimeout(() => {
      let realResults: AnalysisResult[] = [];
      let analysisInsights = "No data available for analysis";
      let confidence = "low";
      let recommendations: string[] = [];

      if (parsedData && parsedData.rows && parsedData.rows.length > 0) {
        console.log('📊 Running real data analysis on', parsedData.rows.length, 'rows...');
        
        try {
          const engine = new DataAnalysisEngine(parsedData);
          realResults = engine.runCompleteAnalysis();
          
          console.log('✅ Analysis completed with', realResults.length, 'results');
          
          // Generate insights based on real analysis
          if (realResults.length > 0) {
            analysisInsights = generateInsightsFromResults(realResults, researchQuestion);
            confidence = "high";
            recommendations = generateRecommendationsFromResults(realResults);
          } else {
            analysisInsights = "Analysis completed but no significant patterns were found in the data.";
            confidence = "medium";
            recommendations = ["Consider checking data quality", "Verify column names and data types"];
          }
        } catch (error) {
          console.error('❌ Analysis failed:', error);
          analysisInsights = `Analysis failed: ${error}. Please check your data format.`;
          confidence = "low";
          recommendations = ["Check data format and structure", "Ensure data has proper column headers"];
        }
      } else {
        console.warn('⚠️ No valid data provided for analysis');
        analysisInsights = "No valid data was provided for analysis. Please upload a dataset with rows and columns.";
        recommendations = ["Upload a CSV or JSON file with data", "Ensure the file contains both headers and data rows"];
      }

      setDetailedResults(realResults);
      setAnalysisCompleted(true);
      setAnalysisResults({
        insights: analysisInsights,
        confidence,
        recommendations,
        detailedResults: realResults,
        sqlQuery: generateSQLFromQuestion(researchQuestion, parsedData),
        queryBreakdown: educational ? generateQueryBreakdown(researchQuestion) : null
      });

      console.log('🎯 Analysis results set:', {
        insights: analysisInsights,
        confidence,
        recommendationsCount: recommendations.length,
        detailedResultsCount: realResults.length
      });
    }, 3000);
  }, []);

  const showResults = useCallback(() => {
    setShowAnalysisView(true);
    setIsProcessingAnalysis(false);
  }, []);

  const resetAnalysis = useCallback(() => {
    setIsProcessingAnalysis(false);
    setAnalysisResults(null);
    setAnalysisCompleted(false);
    setShowAnalysisView(false);
    setEducationalMode(false);
    setDetailedResults([]);
  }, []);

  return {
    isProcessingAnalysis,
    analysisResults,
    analysisCompleted,
    showAnalysisView,
    educationalMode,
    detailedResults,
    startAnalysis,
    showResults,
    resetAnalysis,
    setShowAnalysisView
  };
};

// Helper functions
function generateInsightsFromResults(results: AnalysisResult[], researchQuestion: string): string {
  if (results.length === 0) {
    return "No analysis results available. Please ensure your data contains the expected columns.";
  }

  // Get key findings from results
  const keyFindings: string[] = [];
  
  results.forEach(result => {
    if (result.confidence === 'high' && result.insight) {
      keyFindings.push(result.insight);
    }
  });

  if (keyFindings.length === 0) {
    keyFindings.push("Basic data structure analysis completed successfully.");
  }

  const findings = keyFindings.slice(0, 5).join('. ');
  
  return `Based on your research question "${researchQuestion}" and comprehensive data analysis: ${findings}. ${keyFindings.length > 1 ? 'The analysis reveals important patterns that can inform strategic decisions.' : ''}`;
}

function generateRecommendationsFromResults(results: AnalysisResult[]): string[] {
  const recommendations: string[] = [];
  
  // Find specific issues and generate recommendations
  results.forEach(result => {
    if (result.id === 'zero-value-purchases' && result.value > 0) {
      recommendations.push(`Investigate ${result.value} zero-value purchases - possible data quality issue`);
    }
    
    if (result.id === 'data-completeness' && result.value < 90) {
      recommendations.push(`Data completeness is ${result.value}% - consider improving data collection processes`);
    }
    
    if (result.id === 'unique-users' && result.value > 100) {
      recommendations.push('Consider user segmentation analysis with this user base size');
    }
    
    if (result.id === 'total-rows' && result.value > 10000) {
      recommendations.push('Large dataset detected - consider implementing data sampling for faster analysis');
    }
  });

  // Default recommendations if no specific insights
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

  // Basic query showing structure
  let query = `-- Analysis for: ${researchQuestion}\nSELECT\n`;
  
  // Add first few columns
  const displayColumns = columns.slice(0, 5);
  query += displayColumns.map(col => `  ${col}`).join(',\n');
  if (columns.length > 5) {
    query += `\n  -- ... and ${columns.length - 5} more columns`;
  }
  
  query += `\nFROM ${tableName}`;
  
  // Add WHERE clause based on question
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
