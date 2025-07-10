
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { QATestResult } from '../../utils/qa/types';

interface QATestResultsProps {
  results: QATestResult[];
}

const QATestResults: React.FC<QATestResultsProps> = ({ results }) => {
  const getStatusIcon = (status: QATestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: QATestResult['status']) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-700';
      case 'fail': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="grid gap-3">
      {results.map((result, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{result.testName}</h4>
                  <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                    {result.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                {result.performance && (
                  <p className="text-xs text-blue-600">
                    Performance: {result.performance.toFixed(2)}ms
                  </p>
                )}
                {result.suggestions && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">Suggestions:</p>
                    <ul className="text-xs text-gray-600 list-disc list-inside">
                      {result.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QATestResults;
