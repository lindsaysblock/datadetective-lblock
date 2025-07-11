
import { useState, useCallback } from 'react';

export const useProjectAnalysis = () => {
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [educationalMode, setEducationalMode] = useState(false);

  const startAnalysis = useCallback((researchQuestion: string, additionalContext: string, educational: boolean = false) => {
    console.log('Starting analysis with:', { researchQuestion, additionalContext, educational });
    setIsProcessingAnalysis(true);
    setEducationalMode(educational);
    
    // Simulate analysis time
    setTimeout(() => {
      setAnalysisCompleted(true);
      setAnalysisResults({
        insights: "Based on your research question and data analysis, here are the key findings...",
        confidence: "high",
        recommendations: ["Consider implementing A/B testing", "Focus on user engagement metrics"],
        sqlQuery: "SELECT customer_id, COUNT(*) as order_count, AVG(order_total) as avg_order_value FROM orders WHERE order_date >= '2023-01-01' GROUP BY customer_id ORDER BY order_count DESC LIMIT 100",
        queryBreakdown: educational ? {
          steps: [
            {
              step: 1,
              title: "SELECT Statement",
              description: "We start by selecting the columns we want to analyze",
              code: "SELECT customer_id, COUNT(*) as order_count, AVG(order_total) as avg_order_value",
              explanation: "This selects the customer ID, counts how many orders each customer made, and calculates their average order value."
            },
            {
              step: 2,
              title: "FROM Clause",
              description: "We specify which table contains our data",
              code: "FROM orders",
              explanation: "We're pulling data from the 'orders' table which contains all transaction records."
            },
            {
              step: 3,
              title: "WHERE Filtering",
              description: "We filter the data to only include relevant records",
              code: "WHERE order_date >= '2023-01-01'",
              explanation: "This filters to only include orders from 2023 onwards, ensuring we're analyzing recent customer behavior."
            },
            {
              step: 4,
              title: "GROUP BY Aggregation",
              description: "We group the data to perform calculations per customer",
              code: "GROUP BY customer_id",
              explanation: "This groups all orders by customer, allowing us to calculate statistics for each individual customer."
            },
            {
              step: 5,
              title: "ORDER BY Sorting",
              description: "We sort the results to show the most relevant data first",
              code: "ORDER BY order_count DESC",
              explanation: "This sorts customers by their order count in descending order, showing the most active customers first."
            },
            {
              step: 6,
              title: "LIMIT Results",
              description: "We limit the results to a manageable number",
              code: "LIMIT 100",
              explanation: "This limits the results to the top 100 customers to keep the analysis focused and manageable."
            }
          ]
        } : null
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
  }, []);

  return {
    isProcessingAnalysis,
    analysisResults,
    analysisCompleted,
    showAnalysisView,
    educationalMode,
    startAnalysis,
    showResults,
    resetAnalysis,
    setShowAnalysisView
  };
};
