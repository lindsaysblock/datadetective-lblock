/**
 * Optimized QA Runner Component
 * Integrates enhanced QA system with real-time optimization metrics
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Activity, Zap, TrendingUp, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TestResultCard from './TestResultCard';
import { optimizedQASystem } from '@/utils/qa/optimizedQASystem';
import { systemOptimizer, OptimizationMetrics } from '@/utils/performance/systemOptimizer';
import { QAReport } from '@/utils/qa/types';

const OptimizedQARunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [qaReport, setQaReport] = useState<QAReport | null>(null);
  const [optimizationMetrics, setOptimizationMetrics] = useState<OptimizationMetrics | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Real-time metrics updates
  useEffect(() => {
    const updateMetrics = () => {
      const metrics = systemOptimizer.getMetrics();
      const health = optimizedQASystem.getSystemHealth();
      setOptimizationMetrics(metrics);
      setSystemHealth(health);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const runOptimizedQA = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      toast({
        title: "🚀 Starting Optimized QA Analysis",
        description: "Running comprehensive tests with real-time optimizations...",
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Run optimized QA analysis
      const report = await optimizedQASystem.runOptimizedQAAnalysis();
      
      clearInterval(progressInterval);
      setProgress(100);
      setQaReport(report);
      
      // Update metrics after QA run
      const metrics = systemOptimizer.getMetrics();
      const health = optimizedQASystem.getSystemHealth();
      setOptimizationMetrics(metrics);
      setSystemHealth(health);

      const passed = report.passed;
      const total = report.totalTests;
      
      toast({
        title: "✅ Optimized QA Analysis Complete",
        description: `${passed}/${total} tests passed. System efficiency: ${metrics.systemEfficiency.toFixed(1)}%`,
        variant: report.overall === 'pass' ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: "QA Analysis Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  }, [toast]);

  const runQuickOptimization = useCallback(() => {
    toast({
      title: "🔧 Running Quick Optimization",
      description: "Applying system optimizations...",
    });

    systemOptimizer.runAllOptimizations({
      eventListenerCleanup: true,
      errorHandling: true,
      memoryReduction: true,
      loadTimeOptimization: true,
      imageLazyLoading: true,
      codeSplitting: true
    });

    // Update metrics
    setTimeout(() => {
      const metrics = systemOptimizer.getMetrics();
      setOptimizationMetrics(metrics);
      
      toast({
        title: "✅ Optimization Complete",
        description: `System efficiency: ${metrics.systemEfficiency.toFixed(1)}%`,
      });
    }, 1000);
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Optimized QA System
              </CardTitle>
              <CardDescription>
                Enhanced QA analysis with real-time system optimizations
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={runQuickOptimization}
                variant="outline"
                size="sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                Quick Optimize
              </Button>
              <Button
                onClick={runOptimizedQA}
                disabled={isRunning}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running Analysis...' : 'Run Optimized QA'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isRunning && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analysis Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Real-time Metrics */}
      {(optimizationMetrics || systemHealth) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Real-time System Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {optimizationMetrics && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {optimizationMetrics.systemEfficiency.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">System Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {optimizationMetrics.eventListenersOptimized}
                    </div>
                    <div className="text-sm text-muted-foreground">Listeners Optimized</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {optimizationMetrics.memoryReduced}KB
                    </div>
                    <div className="text-sm text-muted-foreground">Memory Reduced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {optimizationMetrics.imagesLazyLoaded}
                    </div>
                    <div className="text-sm text-muted-foreground">Images Optimized</div>
                  </div>
                </>
              )}
            </div>
            
            {systemHealth && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">System Health Score</span>
                  <Badge variant={systemHealth.performanceScore > 80 ? 'default' : 'secondary'}>
                    {systemHealth.performanceScore.toFixed(1)}/100
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* QA Results */}
      {qaReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              QA Analysis Results
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{qaReport.passed} Passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span>{qaReport.warnings} Warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>{qaReport.failed} Failed</span>
                </div>
                <Badge variant={qaReport.overall === 'pass' ? 'default' : 'destructive'}>
                  {qaReport.overall.toUpperCase()}
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="results">
              <TabsList>
                <TabsTrigger value="results">Test Results</TabsTrigger>
                <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
                <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="space-y-3">
                {qaReport.results.map((result, index) => (
                  <TestResultCard key={index} result={result} />
                ))}
              </TabsContent>
              
              <TabsContent value="performance">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{qaReport.performanceMetrics.systemEfficiency?.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">System Efficiency</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{qaReport.performanceMetrics.renderTime?.toFixed(0)}ms</div>
                    <div className="text-sm text-muted-foreground">Render Time</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{qaReport.performanceMetrics.codebaseHealth?.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Codebase Health</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="optimizations">
                <div className="space-y-3">
                  <h4 className="font-medium">Applied Optimizations:</h4>
                  <div className="grid gap-2">
                    <Badge variant="outline" className="justify-start">✅ Event listener cleanup optimization</Badge>
                    <Badge variant="outline" className="justify-start">✅ Error handling optimization</Badge>
                    <Badge variant="outline" className="justify-start">✅ Memory usage reduction</Badge>
                    <Badge variant="outline" className="justify-start">✅ Load time optimization</Badge>
                    <Badge variant="outline" className="justify-start">✅ Image lazy loading optimization</Badge>
                    <Badge variant="outline" className="justify-start">✅ Code splitting optimization</Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimizedQARunner;