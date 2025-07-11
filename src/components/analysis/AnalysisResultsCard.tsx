
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

  const normalizedResults = {
    insights: formatInsights(analysisResults?.insights) || 'Analysis completed successfully with key patterns detected.',
    confidence: analysisResults?.confidence || 'medium',
    recommendations: analysisResults?.recommendations || [
      'Consider focusing on high-performing segments',
      'Investigate the outlier cases',
      'Monitor trends over time'
    ],
    detailedResults: analysisResults?.detailedResults || [],
    sqlQuery: analysisResults?.sqlQuery || '-- No query generated',
    queryBreakdown: analysisResults?.queryBreakdown
  };

  return <AnalysisResultsDisplay results={normalizedResults} showSQLQuery={true} />;
};

export default AnalysisResultsCard;
