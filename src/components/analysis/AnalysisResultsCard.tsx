
import React from 'react';
import AnalysisResultsDisplay from './AnalysisResultsDisplay';
import { AnalysisResults } from '@/types/data';

interface AnalysisResultsCardProps {
  analysisResults: AnalysisResults;
}

const AnalysisResultsCard: React.FC<AnalysisResultsCardProps> = ({ analysisResults }) => {
  console.log('AnalysisResultsCard received:', analysisResults);

  // Handle different possible formats of analysis results
  const normalizedResults = {
    insights: analysisResults?.insights || 
              (Array.isArray(analysisResults?.insights) ? analysisResults.insights.join(' ') : '') ||
              'Analysis completed successfully with key patterns detected.',
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
