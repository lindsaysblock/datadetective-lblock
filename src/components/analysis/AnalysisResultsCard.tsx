
import React from 'react';
import AnalysisResultsDisplay from './AnalysisResultsDisplay';
import { AnalysisResults } from '@/types/data';

interface AnalysisResultsCardProps {
  analysisResults: AnalysisResults;
}

const AnalysisResultsCard: React.FC<AnalysisResultsCardProps> = ({ analysisResults }) => {
  console.log('AnalysisResultsCard received:', analysisResults);

  return <AnalysisResultsDisplay results={analysisResults} showSQLQuery={true} />;
};

export default AnalysisResultsCard;
