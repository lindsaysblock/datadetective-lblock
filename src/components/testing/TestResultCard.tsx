import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckCircle, AlertTriangle, Clock, XCircle, Wrench, Zap } from 'lucide-react';
import { TestResultCard as TestResult } from '../../types/testing';
import { QATestDetails } from './QATestDetails';
import { TestFixService } from '../../utils/testing/testFixService';
import { useToast } from '@/hooks/use-toast';

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
  const [isApplyingFixes, setIsApplyingFixes] = useState(false);
  const [isApplyingOptimizations, setIsApplyingOptimizations] = useState(false);
  const { toast } = useToast();
  const testFixService = TestFixService.getInstance();
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

  const handleApplyFixes = async () => {
    if (!result.fixes || result.fixes.length === 0) return;
    
    setIsApplyingFixes(true);
    try {
      const { success, results } = await testFixService.applyAllFixes(result.fixes);
      
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;
      
      toast({
        title: success ? "🎉 All Fixes Applied Successfully" : `⚠️ ${successCount}/${results.length} Fixes Applied`,
        description: success 
          ? `All ${results.length} fixes have been successfully applied. System performance should be improved.`
          : `${successCount} fixes applied successfully, ${failureCount} require manual attention.`,
        variant: success ? "default" : "destructive",
        duration: 5000
      });
      
      // Show individual fix results
      results.forEach((fixResult, index) => {
        setTimeout(() => {
          toast({
            title: fixResult.success ? "✅ Fix Applied" : "❌ Fix Failed",
            description: fixResult.message,
            variant: fixResult.success ? "default" : "destructive",
            duration: 3000
          });
        }, index * 500);
      });
      
    } catch (error) {
      toast({
        title: "❌ Fix Application Failed",
        description: "Critical error during fix application. Check console for details.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsApplyingFixes(false);
    }
  };

  const handleApplyOptimizations = async () => {
    if (!result.availableOptimizations || result.availableOptimizations.length === 0) return;
    
    setIsApplyingOptimizations(true);
    try {
      let successCount = 0;
      let totalGain = '';
      
      for (let i = 0; i < result.availableOptimizations.length; i++) {
        const optimization = result.availableOptimizations[i];
        const optimizationResult = await testFixService.applyOptimization(optimization.id);
        
        if (optimizationResult.success) {
          successCount++;
          if (optimizationResult.performanceGain) {
            totalGain += ` +${optimizationResult.performanceGain}`;
          }
        }
        
        // Show individual optimization results
        toast({
          title: optimizationResult.success ? "🚀 Optimization Applied" : "❌ Optimization Failed",
          description: optimizationResult.message,
          variant: optimizationResult.success ? "default" : "destructive",
          duration: 3000
        });
        
        // Small delay between optimizations
        if (i < result.availableOptimizations.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Final summary
      toast({
        title: `🎯 Optimization Summary`,
        description: `${successCount}/${result.availableOptimizations.length} optimizations applied successfully.${totalGain ? ` Performance improvements: ${totalGain}` : ''}`,
        duration: 5000
      });
      
    } catch (error) {
      toast({
        title: "❌ Optimization Failed",
        description: "Error applying optimizations. Check system logs.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsApplyingOptimizations(false);
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

        {/* Enhanced Fixes Section */}
        {result.fixes && result.fixes.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Critical Issues Detected ({result.fixes.length}):
              </h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleApplyFixes}
                  disabled={isApplyingFixes}
                  className="h-8 px-3"
                >
                  {isApplyingFixes ? (
                    <>
                      <Clock className="w-3 h-3 mr-1 animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    <>
                      <Wrench className="w-3 h-3 mr-1" />
                      Auto-Fix All
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {result.fixes.map((fix) => (
                <div key={fix.id} className="border rounded-lg p-3 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-red-800">{fix.title}</span>
                        <div className="flex gap-1">
                          <Badge className={`text-xs ${
                            fix.severity === 'critical' ? 'bg-red-200 text-red-800' :
                            fix.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                            fix.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-blue-200 text-blue-800'
                          }`}>
                            {fix.severity}
                          </Badge>
                          <Badge className="bg-gray-200 text-gray-700 text-xs">{fix.category}</Badge>
                          {fix.autoFixable && (
                            <Badge className="bg-green-200 text-green-700 text-xs">Auto-fixable</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-red-700 mb-2">{fix.description}</p>
                      {fix.affectedFiles && (
                        <div className="text-xs text-red-600">
                          <strong>Affected files:</strong> {fix.affectedFiles.join(', ')}
                        </div>
                      )}
                      <div className="text-xs text-red-600 mt-1">
                        <strong>Est. fix time:</strong> {fix.estimatedTime} | <strong>Impact:</strong> {fix.impact}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Optimizations Section */}
        {result.availableOptimizations && result.availableOptimizations.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Performance Optimizations ({result.availableOptimizations.length}):
              </h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleApplyOptimizations}
                disabled={isApplyingOptimizations}
                className="h-8 px-3"
              >
                {isApplyingOptimizations ? (
                  <>
                    <Clock className="w-3 h-3 mr-1 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 mr-1" />
                    Apply All
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-3">
              {result.availableOptimizations.map((optimization) => (
                <div key={optimization.id} className="border rounded-lg p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-blue-800">{optimization.title}</span>
                        <div className="flex gap-1">
                          <Badge className={`text-xs ${
                            optimization.impact === 'high' ? 'bg-green-200 text-green-800' :
                            optimization.impact === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-blue-200 text-blue-800'
                          }`}>
                            {optimization.impact} impact
                          </Badge>
                          <Badge className="bg-gray-200 text-gray-700 text-xs">{optimization.category}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-blue-700 mb-2">{optimization.description}</p>
                      <div className="text-xs text-blue-600">
                        <strong>Implementation:</strong> {optimization.implementation}
                      </div>
                      {optimization.estimatedGain && (
                        <div className="text-xs text-blue-600 mt-1">
                          <strong>Expected gain:</strong> {optimization.estimatedGain}
                        </div>
                      )}
                      {optimization.prerequisites && (
                        <div className="text-xs text-blue-600 mt-1">
                          <strong>Prerequisites:</strong> {optimization.prerequisites.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legacy Optimizations (fallback) */}
        {result.optimizations && result.optimizations.length > 0 && !result.availableOptimizations && (
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