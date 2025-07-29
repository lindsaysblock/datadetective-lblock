
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Activity, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TestResult {
  step?: string;
  testName?: string;
  status: 'success' | 'warning' | 'error' | 'pass' | 'fail' | 'skip';
  details?: string;
  message?: string;
  error?: string;
  timestamp?: Date;
  duration?: number;
  optimizations?: string[];
  fullDetails?: string;
}

interface TestResultCardProps {
  result: TestResult;
}

const TestResultCard: React.FC<TestResultCardProps> = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
      case 'fail': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success':
      case 'pass': return 'default';
      case 'warning': return 'secondary';
      case 'error':
      case 'fail': return 'destructive';
      default: return 'outline';
    }
  };

  const hasExpandableContent = result?.error || result?.optimizations?.length || result?.fullDetails;

  return (
    <div className="border rounded-lg bg-background">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            {getStatusIcon(result?.status || 'unknown')}
            <div>
              <div className="font-medium">{result?.step || result?.testName || 'Unknown Test'}</div>
              <div className="text-sm text-muted-foreground">
                {result?.details || result?.message || 'No details available'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(result?.status || 'unknown')}>
              {result?.status?.toUpperCase() || 'UNKNOWN'}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {result?.timestamp ? result.timestamp.toLocaleTimeString() : 
               result?.duration ? `${result.duration}ms` : 'No time'}
            </div>
            {hasExpandableContent && (
              <CollapsibleTrigger asChild>
                <button className="p-1 hover:bg-muted rounded transition-colors">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </CollapsibleTrigger>
            )}
          </div>
        </div>
        
        {hasExpandableContent && (
          <CollapsibleContent>
            <div className="px-3 pb-3 space-y-3 border-t bg-muted/30">
              {result?.error && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-destructive mb-2">Error Details:</h4>
                  <div className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                    {result.error}
                  </div>
                </div>
              )}
              
              {result?.optimizations && result.optimizations.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-blue-700 mb-2">Optimizations Identified:</h4>
                  <div className="space-y-1">
                    {result.optimizations.map((opt, index) => (
                      <div key={index} className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                        • {opt}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {result?.fullDetails && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-2">Full Details:</h4>
                  <div className="text-xs text-muted-foreground bg-background p-2 rounded border">
                    {result.fullDetails}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

export default TestResultCard;
