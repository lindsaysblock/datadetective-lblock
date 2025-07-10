
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { DataQualityScore, StatisticalValidation } from '../../utils/visualization/dataQualityAnalyzer';

interface QualityIndicatorProps {
  qualityScore: DataQualityScore;
  validation: StatisticalValidation;
}

const QualityIndicator: React.FC<QualityIndicatorProps> = ({ qualityScore, validation }) => {
  const getQualityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <Info className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getQualityIcon(qualityScore.overall)}
          <span className="text-sm font-medium">Data Quality: {qualityScore.overall}%</span>
        </div>
        <div className="text-xs text-gray-500">
          Sample: {validation.sampleSize} rows, {validation.confidenceLevel}% confidence
        </div>
      </div>
      
      {qualityScore.issues.length > 0 && (
        <Alert className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Data Quality Issues:</strong>
            <ul className="list-disc list-inside mt-1">
              {qualityScore.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {validation.warnings.length > 0 && (
        <Alert className="mt-2">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Statistical Warnings:</strong>
            <ul className="list-disc list-inside mt-1">
              {validation.warnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default QualityIndicator;
