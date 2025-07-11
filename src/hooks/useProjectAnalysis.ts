
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
    console.log('Starting real analysis with:', { researchQuestion, additionalContext, educational });
    setIsProcessingAnalysis(true);
    setEducationalMode(educational);
    
    // Simulate processing time with real analysis
    setTimeout(() => {
      let realResults: AnalysisResult[] = [];
      let analysisInsights = "No data available for analysis";
      let confidence = "low";
      let recommendations: string[] = [];

      if (parsedData) {
        console.log('Running real data analysis...');
        const engine = new DataAnalysisEngine(parsedData);
        realResults = engine.runCompleteAnalysis();
        
        // Generate insights based on real analysis
        analysisInsights = generateInsightsFromResults(realResults, researchQuestion);
        confidence = "high";
        recommendations = generateRecommendationsFromResults(realResults);
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

  const keyFindings = results.slice(0, 5).map(result => result.insight).join('. ');
  
  return `Based on your research question "${researchQuestion}" and comprehensive data analysis: ${keyFindings}. The analysis reveals important patterns in user behavior, product performance, and business metrics that can inform strategic decisions.`;
}

function generateRecommendationsFromResults(results: AnalysisResult[]): string[] {
  const recommendations: string[] = [];
  
  // Find zero-value purchases
  const zeroValueResult = results.find(r => r.id === 'zero-value-purchases');
  if (zeroValueResult && zeroValueResult.value > 0) {
    recommendations.push(`Investigate ${zeroValueResult.value} zero-value purchases - possible data quality issue`);
  }

  // Find authentication rates
  const authResult = results.find(r => r.id === 'user-authentication');
  if (authResult) {
    const loggedInPercentage = parseFloat(authResult.chartData?.[0]?.percentage || '0');
    if (loggedInPercentage < 50) {
      recommendations.push('Increase user authentication rate - only ' + loggedInPercentage + '% of events from logged-in users');
    }
  }

  // Product performance insights
  const topProductResult = results.find(r => r.id === 'top-purchased-products');
  if (topProductResult) {
    recommendations.push('Focus marketing efforts on top-performing products to maximize ROI');
  }

  // Time-based insights
  const timeResult = results.find(r => r.id === 'time-by-hour');
  if (timeResult) {
    recommendations.push('Optimize content delivery and promotional timing based on peak engagement hours');
  }

  // Default recommendations if no specific insights
  if (recommendations.length === 0) {
    recommendations.push('Implement A/B testing to optimize conversion rates');
    recommendations.push('Focus on user engagement metrics to drive growth');
    recommendations.push('Consider segmenting users based on behavior patterns');
  }

  return recommendations;
}

function generateSQLFromQuestion(researchQuestion: string, parsedData?: ParsedData): string {
  if (!parsedData) {
    return "-- No data available for SQL generation";
  }

  const tableName = "your_data";
  const lowerQuestion = researchQuestion.toLowerCase();

  if (lowerQuestion.includes('purchase') || lowerQuestion.includes('revenue')) {
    return `-- Analysis for: ${researchQuestion}
SELECT 
  action,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users,
  SUM(CASE WHEN action = 'purchase' THEN total_order_value ELSE 0 END) as total_revenue
FROM ${tableName}
WHERE action IN ('view', 'add_to_cart', 'purchase')
GROUP BY action
ORDER BY event_count DESC;`;
  }

  if (lowerQuestion.includes('product') || lowerQuestion.includes('popular')) {
    return `-- Top products analysis for: ${researchQuestion}
SELECT 
  product_name,
  COUNT(*) as view_count,
  COUNT(CASE WHEN action = 'purchase' THEN 1 END) as purchase_count,
  SUM(CASE WHEN action = 'purchase' THEN total_order_value ELSE 0 END) as total_revenue
FROM ${tableName}
WHERE product_name IS NOT NULL
GROUP BY product_name
ORDER BY view_count DESC
LIMIT 10;`;
  }

  // Default comprehensive query
  return `-- Comprehensive analysis for: ${researchQuestion}
SELECT 
  DATE(timestamp) as date,
  action,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT CASE WHEN user_id != 'unknown' THEN user_id END) as logged_in_users,
  AVG(time_spent_sec) as avg_time_spent,
  SUM(CASE WHEN action = 'purchase' THEN total_order_value ELSE 0 END) as daily_revenue
FROM ${tableName}
GROUP BY DATE(timestamp), action
ORDER BY date DESC, event_count DESC;`;
}

function generateQueryBreakdown(researchQuestion: string) {
  return {
    steps: [
      {
        step: 1,
        title: "Data Selection",
        description: "Select relevant columns for analysis",
        code: "SELECT action, product_name, user_id, timestamp, total_order_value",
        explanation: "We start by selecting the key columns needed to answer your research question."
      },
      {
        step: 2,
        title: "Filtering",
        description: "Apply filters to focus on relevant data",
        code: "WHERE action IN ('view', 'add_to_cart', 'purchase')",
        explanation: "Filter to focus on the main user actions that drive business value."
      },
      {
        step: 3,
        title: "Grouping",
        description: "Group data for aggregation",
        code: "GROUP BY action, product_name",
        explanation: "Group by action and product to calculate metrics for each combination."
      },
      {
        step: 4,
        title: "Aggregation",
        description: "Calculate summary statistics",
        code: "COUNT(*) as event_count, SUM(total_order_value) as revenue",
        explanation: "Calculate counts and revenue totals for each group."
      },
      {
        step: 5,
        title: "Ordering",
        description: "Sort results by importance",
        code: "ORDER BY event_count DESC",
        explanation: "Sort by event count to see the most frequent actions first."
      }
    ]
  };
}
