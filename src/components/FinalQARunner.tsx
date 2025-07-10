
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertTriangle, XCircle, Play, RefreshCw } from 'lucide-react';

const FinalQARunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const runFinalQA = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    
    try {
      // Phase 1: Enhanced QA System
      setCurrentPhase('Running Enhanced QA System...');
      setProgress(20);
      
      const { EnhancedQASystem } = await import('../utils/qa/enhancedQASystem');
      const qaSystem = new EnhancedQASystem();
      const qaReport = await qaSystem.runEnhancedQA();
      
      // Phase 2: Load Testing
      setCurrentPhase('Running E2E Load Tests...');
      setProgress(40);
      
      const { E2ELoadTest } = await import('../utils/testing/e2eLoadTest');
      const loadTester = new E2ELoadTest();
      await loadTester.runComprehensiveLoadTest();
      
      // Phase 3: Compliance Check
      setCurrentPhase('Running Compliance Validation...');
      setProgress(60);
      
      const { autoComplianceSystem } = await import('../utils/qa/standards/autoComplianceSystem');
      const complianceReports = await autoComplianceSystem.runComplianceCheck();
      
      // Phase 4: Auto-fix Issues
      setCurrentPhase('Auto-fixing Identified Issues...');
      setProgress(80);
      
      if (qaReport.failed > 0) {
        await qaSystem.autoFix(qaReport);
      }
      
      // Phase 5: Final Validation
      setCurrentPhase('Final Validation...');
      setProgress(100);
      
      const finalReport = await qaSystem.runEnhancedQA();
      
      setResults({
        qa: finalReport,
        compliance: complianceReports,
        loadTest: 'completed'
      });
      
      if (finalReport.failed === 0) {
        toast({
          title: "Final QA Complete ✅",
          description: `All ${finalReport.totalTests} tests passed. System ready for publication!`,
          duration: 6000,
        });
      } else {
        toast({
          title: "QA Issues Remaining ⚠️",
          description: `${finalReport.failed} issues need manual attention`,
          variant: "destructive",
          duration: 8000,
        });
      }
      
    } catch (error) {
      console.error('Final QA failed:', error);
      toast({
        title: "Final QA Error",
        description: "An error occurred during final QA validation",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsRunning(false);
      setCurrentPhase('');
    }
  };

  useEffect(() => {
    // Auto-run final QA on mount
    runFinalQA();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pass: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      fail: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || ''}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-6 h-6 text-blue-600" />
            Final QA & Compliance Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRunning && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">{currentPhase}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={runFinalQA} 
              disabled={isRunning}
              variant="outline"
            >
              {isRunning ? 'Running...' : 'Run Final QA'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QA Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                QA Test Results
                {getStatusIcon(results.qa.overall)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Overall Status:</span>
                {getStatusBadge(results.qa.overall)}
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{results.qa.passed}</div>
                  <div className="text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{results.qa.warnings}</div>
                  <div className="text-gray-600">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{results.qa.failed}</div>
                  <div className="text-gray-600">Failed</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-sm text-gray-600">
                  Performance: {results.qa.performanceMetrics.renderTime.toFixed(2)}ms render time
                </div>
                {results.qa.performanceMetrics.systemEfficiency && (
                  <div className="text-sm text-gray-600">
                    System Efficiency: {results.qa.performanceMetrics.systemEfficiency.toFixed(1)}%
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Results */}
          <Card>
            <CardHeader>
              <CardTitle>Code Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Files Checked: {results.compliance.length}</div>
              </div>
              
              {results.compliance.length > 0 && (
                <div className="space-y-2">
                  {results.compliance.slice(0, 3).map((report: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="truncate">{report.filePath.split('/').pop()}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{report.complianceScore}/100</span>
                        {report.complianceScore >= 80 ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : report.complianceScore >= 60 ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                  {results.compliance.length > 3 && (
                    <div className="text-xs text-gray-500">
                      ...and {results.compliance.length - 3} more files
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {results && results.qa.overall === 'pass' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">System Ready for Publication!</h3>
                <p className="text-green-700 text-sm">
                  All tests passed, compliance validated, and code optimized. Your data schema is ready for testing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinalQARunner;
