
import React, { useState, useCallback, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Activity, ChevronDown, ChevronRight, Zap, Bug, Lightbulb } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { systemOptimizer } from '@/utils/performance/systemOptimizer';

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
  stackTrace?: string;
  fixSuggestions?: string[];
  suggestions?: string[];
  relatedFiles?: string[];
}

interface TestResultCardProps {
  result: TestResult;
}

const TestResultCard: React.FC<TestResultCardProps> = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Optimize expansion toggle with useCallback
  const handleExpansionToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
    
    // Track expansion analytics
    systemOptimizer.addMemoryCleanupTask(() => {
      console.log('QA card interaction tracked');
    });
  }, []);

  // Memoize expensive computations
  const { statusIcon, statusBadgeVariant, hasExpandableContent } = useMemo(() => {

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

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
      switch (status) {
        case 'success':
        case 'pass': return 'default';
        case 'warning': return 'secondary';
        case 'error':
        case 'fail': return 'destructive';
        default: return 'outline';
      }
    };

    const hasExpandableContent = result?.error || result?.optimizations?.length || result?.fullDetails || 
      result?.fixSuggestions?.length || result?.stackTrace || result?.suggestions?.length || result?.relatedFiles?.length;

    return {
      statusIcon: getStatusIcon(result?.status || 'unknown'),
      statusBadgeVariant: getStatusBadgeVariant(result?.status || 'unknown'),
      hasExpandableContent
    };
  }, [result]);

  return (
    <div className="border rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow">
      <Collapsible open={isExpanded} onOpenChange={handleExpansionToggle}>
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            {statusIcon}
            <div>
              <div className="font-medium">{result?.step || result?.testName || 'Unknown Test'}</div>
              <div className="text-sm text-muted-foreground">
                {result?.details || result?.message || 'No details available'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusBadgeVariant}>
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
          <CollapsibleContent className="animate-in slide-in-from-top-1 duration-200">
            <div className="px-3 pb-3 space-y-3 border-t bg-muted/30">
              {result?.error && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-destructive mb-2 flex items-center gap-2">
                    <Bug className="w-4 h-4" />
                    Error Details:
                  </h4>
                  <div className="text-xs text-destructive bg-destructive/10 p-3 rounded border border-destructive/20 font-mono">
                    {result.error}
                  </div>
                </div>
              )}

              {result?.stackTrace && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-destructive mb-2 flex items-center gap-2">
                    <Bug className="w-4 h-4" />
                    Stack Trace:
                  </h4>
                  <div className="text-xs text-destructive bg-destructive/10 p-3 rounded border border-destructive/20 font-mono max-h-40 overflow-y-auto">
                    {result.stackTrace}
                  </div>
                </div>
              )}

              {result?.suggestions && result.suggestions.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Suggestions ({result.suggestions.length}):
                  </h4>
                  <div className="space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-orange-600 bg-orange-50 p-3 rounded border border-orange-200 hover:bg-orange-100 transition-colors">
                        💡 {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result?.fixSuggestions && result.fixSuggestions.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Fix Suggestions ({result.fixSuggestions.length}):
                  </h4>
                  <div className="space-y-2">
                    {result.fixSuggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-green-600 bg-green-50 p-3 rounded border border-green-200 hover:bg-green-100 transition-colors">
                        🔧 {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {result?.optimizations && result.optimizations.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Optimizations Identified ({result.optimizations.length}):
                  </h4>
                  <div className="space-y-2">
                    {result.optimizations.map((opt, index) => (
                      <div key={index} className="text-xs text-blue-600 bg-blue-50 p-3 rounded border border-blue-200 hover:bg-blue-100 transition-colors">
                        ⚡ {opt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result?.relatedFiles && result.relatedFiles.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-purple-700 mb-2">Related Files:</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.relatedFiles.map((file, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {file}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {result?.fullDetails && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-2">Full Details:</h4>
                  <div className="text-xs text-muted-foreground bg-background p-3 rounded border max-h-32 overflow-y-auto">
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
