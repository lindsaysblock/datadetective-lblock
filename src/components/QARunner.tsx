
import React, { useEffect } from 'react';
import { useAutoQA } from '../hooks/useAutoQA';
import { useToast } from '@/hooks/use-toast';

const QARunner: React.FC = () => {
  const { runManualQA } = useAutoQA();
  const { toast } = useToast();

  useEffect(() => {
    const runQA = async () => {
      console.log('🔍 Running comprehensive QA analysis...');
      
      try {
        const report = await runManualQA();
        
        console.log('📊 QA Analysis Complete:', {
          overall: report.overall,
          passed: report.passed,
          failed: report.failed,
          warnings: report.warnings,
          totalTests: report.totalTests,
          renderTime: `${report.performanceMetrics.renderTime.toFixed(2)}ms`,
          refactoringRecommendations: report.refactoringRecommendations.length
        });

        // Show detailed results
        console.log('📋 Test Results:');
        report.results.forEach(result => {
          const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
          console.log(`${icon} ${result.testName}: ${result.message}`);
          if (result.suggestions) {
            result.suggestions.forEach(suggestion => {
              console.log(`  💡 ${suggestion}`);
            });
          }
        });

        console.log('🔧 Refactoring Recommendations:');
        report.refactoringRecommendations.forEach(rec => {
          console.log(`📁 ${rec.file} (${rec.priority} priority): ${rec.description}`);
          console.log(`  ➡️ ${rec.suggestion}`);
        });

        toast({
          title: "QA Analysis Complete",
          description: `${report.passed}/${report.totalTests} tests passed. Check console for detailed results.`,
          variant: report.overall === 'fail' ? 'destructive' : 'default'
        });

      } catch (error) {
        console.error('QA Analysis failed:', error);
        toast({
          title: "QA Analysis Failed",
          description: "Check console for error details",
          variant: "destructive"
        });
      }
    };

    runQA();
  }, [runManualQA, toast]);

  return null;
};

export default QARunner;
