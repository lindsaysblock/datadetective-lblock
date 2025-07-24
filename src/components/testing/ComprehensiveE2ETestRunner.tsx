import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Play, Activity, Settings, BarChart3, Zap, CheckCircle, AlertTriangle, Code, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { E2ETestRunner } from '@/utils/testing/e2eTestRunner';

const ComprehensiveE2ETestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testReport, setTestReport] = useState<E2ETestReport | null>(null);
  const [appliedRefactorings, setAppliedRefactorings] = useState<string[]>([]);
  const { toast } = useToast();

  const orchestrator = new E2ETestOrchestrator();

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestReport(null);
    setAppliedRefactorings([]);

    try {
      toast({
        title: "Comprehensive E2E Testing Started",
        description: "Running tests and analyzing refactoring opportunities...",
        duration: 3000,
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 95));
      }, 200);

      const report = await orchestrator.runComprehensiveE2ETest();
      
      clearInterval(progressInterval);
      setProgress(100);
      setTestReport(report);

      // Apply automatic refactorings for high-priority issues
      const autoRefactorings = await orchestrator.applyAutoRefactoring(report.refactoringOpportunities);
      setAppliedRefactorings(autoRefactorings);

      toast({
        title: "E2E Testing Complete ✅",
        description: `${report.passedTests}/${report.totalTests} tests passed. ${report.refactoringOpportunities.length} refactoring opportunities identified.`,
        duration: 5000,
      });

    } catch (error) {
      console.error('Comprehensive E2E test failed:', error);
      toast({
        title: "E2E Testing Failed",
        description: "Some tests failed. Check console for details.",
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Settings className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'complexity': return <BarChart3 className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'maintainability': return <Settings className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          Comprehensive E2E Testing & Refactoring
        </CardTitle>
        <CardDescription>
          Run complete test suite with automatic refactoring analysis and optimization recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            onClick={runComprehensiveTest}
            disabled={isRunning}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running Comprehensive Tests...' : 'Run E2E Tests & Analysis'}
          </Button>
          
          {isRunning && (
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{progress}%</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          )}
        </div>

        {isRunning && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Running unit tests, load tests, and E2E flows...
            </p>
          </div>
        )}

        {testReport && (
          <div className="space-y-6">
            {/* Test Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Tests</p>
                      <p className="text-2xl font-bold">{testReport.totalTests}</p>
                    </div>
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Passed</p>
                      <p className="text-2xl font-bold text-green-600">{testReport.passedTests}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold text-destructive">{testReport.failedTests}</p>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold text-primary">
                        {Math.round((testReport.passedTests / testReport.totalTests) * 100)}%
                      </p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Memory Usage</p>
                    <p className="font-semibold">{testReport.performanceMetrics.memoryUsage.toFixed(1)} MB</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Response Time</p>
                    <p className="font-semibold">{testReport.performanceMetrics.averageResponseTime.toFixed(1)} ms</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Throughput</p>
                    <p className="font-semibold">{testReport.performanceMetrics.throughput.toFixed(1)} req/s</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Error Rate</p>
                    <p className="font-semibold">{testReport.performanceMetrics.errorRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refactoring Opportunities */}
            {testReport.refactoringOpportunities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Refactoring Opportunities</CardTitle>
                  <CardDescription>
                    Identified {testReport.refactoringOpportunities.length} areas for improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testReport.refactoringOpportunities.map((opportunity, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(opportunity.type)}
                            <span className="font-medium">{opportunity.file}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityIcon(opportunity.priority)}
                            <Badge variant={opportunity.priority === 'critical' ? 'destructive' : 'secondary'}>
                              {opportunity.priority}
                            </Badge>
                            <Badge variant="outline">
                              Impact: {opportunity.estimatedImpact}/10
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Suggested Actions:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {opportunity.suggestedActions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-start gap-1">
                                <span>•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Applied Refactorings */}
            {appliedRefactorings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">Auto-Applied Refactorings</CardTitle>
                  <CardDescription>
                    {appliedRefactorings.length} automatic improvements were applied
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {appliedRefactorings.map((refactoring, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{refactoring}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
          <strong>Comprehensive E2E Testing:</strong> This suite runs unit tests, load tests, 
          and end-to-end flows while analyzing code for refactoring opportunities. 
          High-priority improvements are automatically applied.
        </div>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveE2ETestRunner;