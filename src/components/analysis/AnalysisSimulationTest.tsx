
/**
 * Analysis Simulation Test Component
 * Refactored to meet coding standards with proper constants and error handling
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataAnalysis } from '@/hooks/useDataAnalysis';
import { generateTestDataset, runAnalysisSimulationTest } from '@/utils/testDataGenerator';
import { DataAnalysisContext } from '@/types/data';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import AnalysisResultsDisplay from './AnalysisResultsDisplay';
import { SPACING } from '@/constants/ui';

interface TestResult {
  scenario: string;
  status: 'pending' | 'running' | 'success' | 'error';
  duration?: number;
  insights?: number;
  results?: number;
  error?: string;
}

const AnalysisSimulationTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentAnalysisResults, setCurrentAnalysisResults] = useState<any>(null);
  const { analyzeData } = useDataAnalysis();

  const runSimulationTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    setCurrentAnalysisResults(null);
    
    try {
      console.log('🚀 Starting comprehensive analysis simulation test...');
      
      const scenarios = await runAnalysisSimulationTest();
      
      // Initialize test results
      const initialResults: TestResult[] = scenarios.map(scenario => ({
        scenario: scenario.name,
        status: 'pending'
      }));
      setTestResults(initialResults);
      
      // Run each test scenario
      for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];
        console.log(`🧪 Testing scenario ${i + 1}: ${scenario.name}`);
        
        // Update status to running
        setTestResults(prev => prev.map((result, index) => 
          index === i ? { ...result, status: 'running' } : result
        ));
        
        const startTime = Date.now();
        
        try {
          // Create analysis context
          const context: DataAnalysisContext = {
            researchQuestion: scenario.question,
            additionalContext: `Simulation test for ${scenario.name}`,
            parsedData: [scenario.data],
            educationalMode: false
          };
          
          // Run the analysis
          const analysisResults = await analyzeData(context);
          const duration = Date.now() - startTime;
          
          if (analysisResults) {
            console.log(`✅ Scenario ${i + 1} completed successfully in ${duration}ms`);
            
            setTestResults(prev => prev.map((result, index) => 
              index === i ? {
                ...result,
                status: 'success',
                duration,
                insights: Array.isArray(analysisResults.insights) ? analysisResults.insights.length : analysisResults.insights.split('\n\n').length,
                results: analysisResults.detailedResults?.length || 0
              } : result
            ));
            
            // Store the last successful result for display
            if (i === scenarios.length - 1) {
              setCurrentAnalysisResults(analysisResults);
            }
          } else {
            throw new Error('Analysis returned null');
          }
          
        } catch (error) {
          const duration = Date.now() - startTime;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          console.error(`❌ Scenario ${i + 1} failed:`, error);
          
          setTestResults(prev => prev.map((result, index) => 
            index === i ? {
              ...result,
              status: 'error',
              duration,
              error: errorMessage
            } : result
          ));
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log('🏁 All simulation tests completed');
      
    } catch (error) {
      console.error('❌ Simulation test suite failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const successfulTests = testResults.filter(r => r.status === 'success').length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-600" />
            Analysis Engine Simulation Test
          </CardTitle>
          <CardDescription>
            Test the analysis engine with generated datasets to verify real analysis functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={runSimulationTest}
              disabled={isRunning}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running Simulation Tests...' : 'Run Analysis Simulation Test'}
            </Button>
            
            {testResults.length > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {successfulTests}/{totalTests}
                </div>
                <div className="text-xs text-gray-500">Tests Passed</div>
              </div>
            )}
          </div>

          {testResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Test Results</h3>
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.scenario}</div>
                      {result.error && (
                        <div className="text-sm text-red-600 mt-1">{result.error}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {result.duration && (
                      <span className="text-sm text-gray-500">{result.duration}ms</span>
                    )}
                    {result.insights !== undefined && (
                      <Badge variant="outline">{result.insights} insights</Badge>
                    )}
                    {result.results !== undefined && (
                      <Badge variant="outline">{result.results} results</Badge>
                    )}
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {currentAnalysisResults && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Analysis Results</CardTitle>
            <CardDescription>
              Results from the most recent simulation test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalysisResultsDisplay 
              results={currentAnalysisResults} 
              showSQLQuery={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisSimulationTest;
