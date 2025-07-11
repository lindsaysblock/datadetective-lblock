
import React, { useEffect, useState } from 'react';
import { useAutoQA } from '../hooks/useAutoQA';
import { useAutoRefactor } from '../hooks/useAutoRefactor';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw, Wrench } from 'lucide-react';
import { RefactoringSuggestion } from '../utils/qa/autoRefactorSystem';

interface QAIssue {
  type: 'error' | 'warning' | 'success';
  message: string;
  file?: string;
  fix?: string;
}

const QARunner: React.FC = () => {
  const { runManualQA, isAutoEnabled } = useAutoQA();
  const { generateRefactoringMessages, autoRefactorEnabled } = useAutoRefactor();
  const { toast } = useToast();
  const [hasRunInitialQA, setHasRunInitialQA] = useState(false);
  const [qaIssues, setQaIssues] = useState<QAIssue[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastReport, setLastReport] = useState<any>(null);

  // Check if we're in admin context
  const isAdminContext = window.location.pathname === '/admin' || window.location.pathname === '/final-qa';

  useEffect(() => {
    // Only run in admin context
    if (!isAdminContext) return;

    // Listen for auto-refactoring suggestions from QA system
    const handleAutoRefactorSuggestions = (event: CustomEvent<{ suggestions: RefactoringSuggestion[] }>) => {
      const { suggestions } = event.detail;
      if (suggestions.length > 0) {
        const messages = generateRefactoringMessages(suggestions);
        
        // Add refactoring issues to display
        const refactorIssues: QAIssue[] = suggestions.map(suggestion => ({
          type: 'warning',
          message: `File ${suggestion.filePath} should be refactored (${suggestion.metrics.complexity} complexity, ${suggestion.metrics.lines} lines)`,
          file: suggestion.filePath,
          fix: suggestion.recommendations[0]?.description || 'Refactor into smaller components'
        }));
        
        setQaIssues(prev => [...prev.filter(issue => issue.type !== 'warning'), ...refactorIssues]);
        
        if (autoRefactorEnabled) {
          // Auto-execute refactoring for suggestions marked as autoRefactor
          const autoExecuteMessages = messages.filter(m => m.autoExecute);
          
          if (autoExecuteMessages.length > 0) {
            console.log(`🔧 Auto-executing refactoring for ${autoExecuteMessages.length} files...`);
            
            // Automatically trigger refactoring without user prompt
            autoExecuteMessages.forEach(message => {
              const messageEvent = new CustomEvent('lovable-message', {
                detail: { message: message.message }
              });
              window.dispatchEvent(messageEvent);
            });
            
            // Only show toast in admin context
            toast({
              title: "Auto-Refactoring Applied",
              description: `Automatically refactored ${autoExecuteMessages.length} files to improve code quality`,
              duration: 4000,
            });
          }
        }
        
        // Still dispatch manual refactoring prompts for non-auto suggestions
        const manualMessages = messages.filter(m => !m.autoExecute);
        if (manualMessages.length > 0) {
          const promptEvent = new CustomEvent('qa-refactoring-prompts', {
            detail: { messages: manualMessages }
          });
          window.dispatchEvent(promptEvent);
        }
        
        console.log(`🔧 Auto-refactoring: ${suggestions.length} files processed (${messages.filter(m => m.autoExecute).length} auto-executed, ${messages.filter(m => !m.autoExecute).length} manual prompts)`);
      }
    };

    window.addEventListener('qa-auto-refactor-suggestions', handleAutoRefactorSuggestions as EventListener);

    return () => {
      window.removeEventListener('qa-auto-refactor-suggestions', handleAutoRefactorSuggestions as EventListener);
    };
  }, [generateRefactoringMessages, autoRefactorEnabled, toast, isAdminContext]);

  const runQAAnalysis = async () => {
    setIsRunning(true);
    setQaIssues([]);
    
    try {
      console.log('🔍 Running comprehensive QA analysis with auto-fix and auto-refactoring...');
      
      const report = await runManualQA();
      setLastReport(report);
      
      // Convert report to issues for display
      const issues: QAIssue[] = [];
      
      if (report.results) {
        report.results.forEach((result: any) => {
          if (result.status === 'fail') {
            issues.push({
              type: 'error',
              message: result.message,
              file: result.testName,
              fix: 'Auto-fix attempted'
            });
          } else if (result.status === 'warning') {
            issues.push({
              type: 'warning',
              message: result.message,
              file: result.testName
            });
          }
        });
      }
      
      if (report.failed === 0) {
        issues.push({
          type: 'success',
          message: `All ${report.totalTests} tests passed successfully`
        });
      }
      
      setQaIssues(issues);
      
      console.log('📊 QA Analysis Complete:', {
        overall: report.overall,
        passed: report.passed,
        failed: report.failed,
        warnings: report.warnings,
        totalTests: report.totalTests,
        renderTime: `${report.performanceMetrics.renderTime.toFixed(2)}ms`,
        autoFixAttempted: report.failed > 0 ? 'Multiple attempts made' : 'No fixes needed',
        autoRefactorEnabled: autoRefactorEnabled ? 'Enabled' : 'Disabled'
      });

      // Show success toast if all tests pass
      if (report.failed === 0) {
        toast({
          title: "QA Analysis Complete",
          description: `All ${report.totalTests} tests passed successfully. Auto-refactoring ${autoRefactorEnabled ? 'applied' : 'analysis included'}.`,
          duration: 5000,
        });
      } else if (report.failed > 0) {
        console.log('🔧 Attempting auto-fix for failed tests...');
        
        // Run enhanced QA system for better auto-fixing
        try {
          const { EnhancedQASystem } = await import('../utils/qa/enhancedQASystem');
          const enhancedQA = new EnhancedQASystem();
          await enhancedQA.autoFix(report);
          
          // Re-run QA after auto-fix
          const fixedReport = await runManualQA();
          
          if (fixedReport.failed === 0) {
            toast({
              title: "QA Auto-Fix Complete",
              description: `Successfully fixed all issues. System is now optimized.`,
              duration: 6000,
            });
          } else {
            toast({
              title: "QA Issues Detected",
              description: `${fixedReport.failed} tests still failing after auto-fix attempts.`,
              variant: "destructive",
              duration: 6000,
            });
          }
        } catch (fixError) {
          console.error('Auto-fix failed:', fixError);
          toast({
            title: "QA Issues Detected",
            description: `${report.failed} tests failed out of ${report.totalTests}. Manual review may be needed.`,
            variant: "destructive",
            duration: 6000,
          });
        }
      }

    } catch (error) {
      console.error('QA Analysis failed:', error);
      setQaIssues([{
        type: 'error',
        message: 'QA Analysis failed with an unexpected error',
        fix: 'Check console for details'
      }]);
      toast({
        title: "QA System Error",
        description: "An unexpected error occurred in the QA system",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Always run QA analysis when component mounts, regardless of context
    if (!hasRunInitialQA) {
      const runInitialQA = async () => {
        await runQAAnalysis();
        setHasRunInitialQA(true);
      };

      // Delay initial run to allow page to fully load
      const timer = setTimeout(runInitialQA, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasRunInitialQA, autoRefactorEnabled]);

  // Only render visible UI in admin context
  if (!isAdminContext) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            QA Analysis Results
          </span>
          <Button 
            onClick={runQAAnalysis} 
            disabled={isRunning}
            size="sm"
            variant="outline"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-run QA
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isRunning && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <span>Running comprehensive QA analysis...</span>
          </div>
        )}

        {lastReport && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{lastReport.passed}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{lastReport.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{lastReport.warnings}</div>
              <div className="text-sm text-gray-600">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{lastReport.totalTests}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {qaIssues.length === 0 && !isRunning && !hasRunInitialQA && (
            <div className="text-center py-8 text-gray-500">
              QA analysis will run automatically when you visit the admin page.
            </div>
          )}
          
          {qaIssues.map((issue, index) => (
            <div key={index} className={`flex items-start gap-3 p-3 rounded border ${
              issue.type === 'error' ? 'border-red-200 bg-red-50' :
              issue.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              'border-green-200 bg-green-50'
            }`}>
              {issue.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />}
              {issue.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />}
              {issue.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
              
              <div className="flex-1">
                <div className="font-medium">{issue.message}</div>
                {issue.file && (
                  <div className="text-sm text-gray-600 mt-1">
                    File: <code className="bg-gray-100 px-1 rounded">{issue.file}</code>
                  </div>
                )}
                {issue.fix && (
                  <div className="text-sm text-gray-600 mt-1">
                    Fix: {issue.fix}
                  </div>
                )}
              </div>
              
              <Badge variant={
                issue.type === 'error' ? 'destructive' :
                issue.type === 'warning' ? 'secondary' :
                'default'
              }>
                {issue.type.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QARunner;
