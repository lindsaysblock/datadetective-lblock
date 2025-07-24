/**
 * Enhanced QA Test Results Display
 * Detailed visibility into failing test cases with actionable insights
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronRight,
  Bug,
  Zap,
  Code,
  FileText,
  Clock,
  TrendingDown
} from 'lucide-react';
import { QATestResult, QAReport } from '@/utils/qa/types';

interface EnhancedQATestResult extends QATestResult {
  file?: string;
  line?: number;
  stackTrace?: string;
  relatedTests?: string[];
  fixSuggestions?: string[];
  severity?: 'critical' | 'high' | 'medium' | 'low';
  category?: 'functionality' | 'performance' | 'security' | 'maintainability' | 'testing';
  executionTime?: number;
}

interface QATestFailureDisplayProps {
  qaReport: QAReport;
  onRetryTest?: (testName: string) => void;
  onApplyFix?: (testName: string, fix: string) => void;
}

export const QATestFailureDisplay: React.FC<QATestFailureDisplayProps> = ({
  qaReport,
  onRetryTest,
  onApplyFix
}) => {
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const enhancedResults = qaReport.results.map(result => ({
    ...result,
    severity: determineSeverity(result),
    category: determineCategory(result),
    fixSuggestions: generateFixSuggestions(result),
    executionTime: Math.random() * 1000 // Simulated execution time
  })) as EnhancedQATestResult[];

  const failedTests = enhancedResults.filter(test => test.status === 'fail');
  const warningTests = enhancedResults.filter(test => test.status === 'warning');
  const passedTests = enhancedResults.filter(test => test.status === 'pass');

  const toggleTestExpansion = (testName: string) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(testName)) {
      newExpanded.delete(testName);
    } else {
      newExpanded.add(testName);
    }
    setExpandedTests(newExpanded);
  };

  const getFilteredTests = () => {
    if (selectedCategory === 'all') return enhancedResults;
    return enhancedResults.filter(test => test.category === selectedCategory);
  };

  const getStatusIcon = (status: string, severity?: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail':
        return severity === 'critical' ? 
          <XCircle className="h-4 w-4 text-red-600" /> : 
          <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bug className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'functionality': return <Code className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'security': return <AlertTriangle className="h-4 w-4" />;
      case 'maintainability': return <FileText className="h-4 w-4" />;
      case 'testing': return <Bug className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const categories = ['all', 'functionality', 'performance', 'security', 'maintainability', 'testing'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Failed Tests</p>
                <p className="text-2xl font-bold text-red-600">{failedTests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{warningTests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Passed</p>
                <p className="text-2xl font-bold text-green-600">{passedTests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round((passedTests.length / enhancedResults.length) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bug className="h-5 w-5" />
            <span>Test Results by Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Tests' : category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {getFilteredTests().map((test, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <Collapsible>
                    <CollapsibleTrigger 
                      className="w-full"
                      onClick={() => toggleTestExpansion(test.testName)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(test.status, test.severity)}
                          <div className="text-left">
                            <h4 className="font-medium">{test.testName}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={getSeverityColor(test.severity)}>
                                {test.severity || 'medium'}
                              </Badge>
                              <Badge variant="outline" className="flex items-center space-x-1">
                                {getCategoryIcon(test.category)}
                                <span className="capitalize">{test.category}</span>
                              </Badge>
                              {test.executionTime && (
                                <Badge variant="outline" className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{test.executionTime.toFixed(0)}ms</span>
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {test.status === 'fail' && onRetryTest && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRetryTest(test.testName);
                              }}
                            >
                              Retry
                            </Button>
                          )}
                          {expandedTests.has(test.testName) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-4">
                      <div className="space-y-4">
                        {/* Test Message */}
                        <div>
                          <h5 className="font-medium mb-2">Test Message</h5>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                            {test.message}
                          </p>
                        </div>

                        {/* File Location */}
                        {test.file && (
                          <div>
                            <h5 className="font-medium mb-2">Location</h5>
                            <p className="text-sm font-mono bg-muted p-2 rounded">
                              {test.file}{test.line && `:${test.line}`}
                            </p>
                          </div>
                        )}

                        {/* Stack Trace for Failed Tests */}
                        {test.status === 'fail' && test.stackTrace && (
                          <div>
                            <h5 className="font-medium mb-2">Stack Trace</h5>
                            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                              {test.stackTrace}
                            </pre>
                          </div>
                        )}

                        {/* Fix Suggestions */}
                        {test.fixSuggestions && test.fixSuggestions.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Fix Suggestions</h5>
                            <div className="space-y-2">
                              {test.fixSuggestions.map((suggestion, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-blue-50 p-3 rounded">
                                  <p className="text-sm">{suggestion}</p>
                                  {onApplyFix && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => onApplyFix(test.testName, suggestion)}
                                    >
                                      Apply Fix
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Related Tests */}
                        {test.relatedTests && test.relatedTests.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Related Tests</h5>
                            <div className="flex flex-wrap gap-1">
                              {test.relatedTests.map((relatedTest, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {relatedTest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Performance Impact */}
                        {test.performance && (
                          <div>
                            <h5 className="font-medium mb-2">Performance Impact</h5>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${Math.min(test.performance, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm">{test.performance.toFixed(1)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions
function determineSeverity(test: QATestResult): 'critical' | 'high' | 'medium' | 'low' {
  if (test.status === 'fail') {
    if (test.testName.toLowerCase().includes('security') || 
        test.testName.toLowerCase().includes('auth') ||
        test.testName.toLowerCase().includes('data loss')) {
      return 'critical';
    }
    if (test.testName.toLowerCase().includes('performance') ||
        test.testName.toLowerCase().includes('memory')) {
      return 'high';
    }
    return 'medium';
  }
  if (test.status === 'warning') return 'low';
  return 'low';
}

function determineCategory(test: QATestResult): 'functionality' | 'performance' | 'security' | 'maintainability' | 'testing' {
  const testName = test.testName.toLowerCase();
  
  if (testName.includes('performance') || testName.includes('memory') || testName.includes('speed')) {
    return 'performance';
  }
  if (testName.includes('security') || testName.includes('auth') || testName.includes('permission')) {
    return 'security';
  }
  if (testName.includes('test') || testName.includes('coverage') || testName.includes('mock')) {
    return 'testing';
  }
  if (testName.includes('complexity') || testName.includes('maintainability') || testName.includes('code quality')) {
    return 'maintainability';
  }
  
  return 'functionality';
}

function generateFixSuggestions(test: QATestResult): string[] {
  const suggestions: string[] = [];
  const testName = test.testName.toLowerCase();
  
  if (test.status === 'fail') {
    if (testName.includes('memory')) {
      suggestions.push('Add React.memo to prevent unnecessary re-renders');
      suggestions.push('Implement proper cleanup in useEffect hooks');
      suggestions.push('Use useMemo for expensive calculations');
    }
    
    if (testName.includes('performance')) {
      suggestions.push('Implement code splitting and lazy loading');
      suggestions.push('Optimize bundle size by removing unused dependencies');
      suggestions.push('Add performance monitoring and optimization');
    }
    
    if (testName.includes('test') || testName.includes('coverage')) {
      suggestions.push('Add unit tests for uncovered functions');
      suggestions.push('Implement integration tests for user workflows');
      suggestions.push('Add mock data for testing edge cases');
    }
    
    if (testName.includes('complexity')) {
      suggestions.push('Break down large functions into smaller ones');
      suggestions.push('Extract custom hooks for reusable logic');
      suggestions.push('Simplify conditional logic and reduce nesting');
    }
    
    if (testName.includes('security')) {
      suggestions.push('Implement proper input validation');
      suggestions.push('Add authentication and authorization checks');
      suggestions.push('Sanitize user inputs and API responses');
    }
    
    // Generic suggestions for failed tests
    if (suggestions.length === 0) {
      suggestions.push('Review test implementation and fix identified issues');
      suggestions.push('Check dependencies and ensure proper configuration');
      suggestions.push('Add error handling and validation');
    }
  }
  
  return suggestions;
}