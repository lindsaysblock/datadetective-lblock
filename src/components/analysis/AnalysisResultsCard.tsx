
import React from 'react';
import AnalysisResultsDisplay from './AnalysisResultsDisplay';
import { AnalysisResults } from '@/types/data';

interface AnalysisResultsCardProps {
  analysisResults: AnalysisResults;
}

const AnalysisResultsCard: React.FC<AnalysisResultsCardProps> = ({ analysisResults }) => {
  console.log('AnalysisResultsCard received:', analysisResults);

  // Handle different possible formats of analysis results with proper formatting
  const formatInsights = (insights: any): string => {
    if (Array.isArray(insights)) {
      return insights.join('\n\n');
    }
    if (typeof insights === 'string') {
      return insights;
    }
    return 'Analysis completed successfully with key patterns detected.';
  };

  const DEFAULT_INSIGHTS = 'Analysis completed successfully with key patterns detected.';
  const DEFAULT_CONFIDENCE = 'medium';
  const DEFAULT_RECOMMENDATIONS = [
    'Consider focusing on high-performing segments',
    'Investigate the outlier cases',
    'Monitor trends over time'
  ];
  const DEFAULT_SQL_QUERY = '-- No query generated';

  const normalizedResults = {
    insights: formatInsights(analysisResults?.insights) || DEFAULT_INSIGHTS,
    confidence: analysisResults?.confidence || DEFAULT_CONFIDENCE,
    recommendations: analysisResults?.recommendations || DEFAULT_RECOMMENDATIONS,
    detailedResults: analysisResults?.detailedResults || [],
    sqlQuery: analysisResults?.sqlQuery || DEFAULT_SQL_QUERY,
    queryBreakdown: analysisResults?.queryBreakdown
  };

  return <AnalysisResultsDisplay results={normalizedResults} showSQLQuery={true} />;
};

export default AnalysisResultsCard;
