import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react';
import { TestResultCard as TestResult } from '../../types/testing';
import { QATestDetails } from './QATestDetails';

interface TestResultCardProps {
  result: TestResult;
  expandedQA?: boolean;
  onToggleQAExpanded?: () => void;
}

export const TestResultCardComponent: React.FC<TestResultCardProps> = ({
  result,
  expandedQA,
  onToggleQAExpanded
}) => {
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">SUCCESS</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">WARNING</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">ERROR</Badge>;
      case 'running': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">RUNNING</Badge>;
    }
  };

  return (
    <Card key={result.name} className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-3">
            {getStatusIcon(result.status)}
            <span>{result.name}</span>
            {getStatusBadge(result.status)}
          </div>
          <span className="text-xs text-muted-foreground font-normal">{result.timestamp}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{result.details}</p>
        
        {/* Metrics Display */}
        {result.metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/50 rounded">
            {result.metrics.testsRun && (
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{result.metrics.testsRun}</div>
                <div className="text-xs text-muted-foreground">Tests Run</div>
              </div>
            )}
            {result.metrics.passed !== undefined && (
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{result.metrics.passed}</div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
            )}
            {result.metrics.failed !== undefined && result.metrics.failed > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{result.metrics.failed}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            )}
            {result.metrics.coverage && (
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{result.metrics.coverage}%</div>
                <div className="text-xs text-muted-foreground">Coverage</div>
              </div>
            )}
            {result.metrics.efficiency && (
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{result.metrics.efficiency}</div>
                <div className="text-xs text-muted-foreground">Efficiency</div>
              </div>
            )}
            {result.metrics.duration && (
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{result.metrics.duration}ms</div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>
            )}
          </div>
        )}

        {/* QA Test Details - only show if QA props are provided */}
        {expandedQA !== undefined && onToggleQAExpanded && (
          <QATestDetails 
            result={result}
            expanded={expandedQA}
            onToggleExpanded={onToggleQAExpanded}
          />
        )}

        {/* Optimizations */}
        {result.optimizations && result.optimizations.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Recommended Optimizations:</h4>
              <Button variant="outline" size="sm" className="h-6 px-2">
                Apply
              </Button>
            </div>
            <div className="space-y-2">
              {result.optimizations.map((optimization, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{optimization}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestResultCardComponent;