
import React, { useEffect } from 'react';
import { useAutoQA } from '../hooks/useAutoQA';
import { useToast } from '@/hooks/use-toast';

const QATrigger: React.FC = () => {
  const { runManualQA } = useAutoQA();
  const { toast } = useToast();

  useEffect(() => {
    const runQA = async () => {
      console.log('🔍 Manual QA trigger activated...');
      
      toast({
        title: "QA Analysis Started",
        description: "Running comprehensive quality assurance analysis with auto-fix and auto-refactoring...",
        duration: 3000,
      });

      try {
        const report = await runManualQA();
        
        console.log('📊 QA Analysis Complete:', {
          overall: report.overall,
          passed: report.passed,
          failed: report.failed,
          warnings: report.warnings,
          totalTests: report.totalTests,
          renderTime: `${report.performanceMetrics.renderTime.toFixed(2)}ms`,
          systemEfficiency: `${report.performanceMetrics.systemEfficiency?.toFixed(1) || 'N/A'}%`,
          memoryEfficiency: `${report.performanceMetrics.memoryEfficiency?.toFixed(1) || 'N/A'}%`,
          refactoringRecommendations: report.refactoringRecommendations.length
        });

        if (report.overall === 'pass') {
          toast({
            title: "QA Analysis Complete ✅",
            description: `All ${report.totalTests} tests passed successfully. System efficiency: ${report.performanceMetrics.systemEfficiency?.toFixed(1) || 'N/A'}%`,
            duration: 5000,
          });
        } else if (report.overall === 'warning') {
          toast({
            title: "QA Analysis Complete ⚠️",
            description: `${report.passed}/${report.totalTests} tests passed with ${report.warnings} warnings. Auto-fixes applied where possible.`,
            duration: 6000,
          });
        } else {
          toast({
            title: "QA Issues Detected ❌",
            description: `${report.failed} tests failed out of ${report.totalTests}. Auto-fix attempts were made.`,
            variant: "destructive",
            duration: 8000,
          });
        }

        // Log detailed results
        if (report.results.length > 0) {
          console.log('\n📋 Detailed QA Results:');
          report.results.forEach((result, index) => {
            const status = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
            console.log(`${index + 1}. ${status} ${result.testName}: ${result.message}`);
            if (result.suggestions && result.suggestions.length > 0) {
              console.log(`   💡 Suggestions: ${result.suggestions.join(', ')}`);
            }
          });
        }

        // Log refactoring recommendations
        if (report.refactoringRecommendations.length > 0) {
          console.log('\n🔧 Refactoring Recommendations:');
          report.refactoringRecommendations.forEach((rec, index) => {
            console.log(`${index + 1}. ${rec.file} (${rec.priority} priority)`);
            console.log(`   Issue: ${rec.description}`);
            console.log(`   Suggestion: ${rec.suggestion}`);
          });
        }

      } catch (error) {
        console.error('❌ QA Analysis failed:', error);
        toast({
          title: "QA System Error",
          description: "An unexpected error occurred during QA analysis",
          variant: "destructive",
          duration: 5000,
        });
      }
    };

    runQA();
  }, [runManualQA, toast]);

  return null; // This is a background component
};

export default QATrigger;
