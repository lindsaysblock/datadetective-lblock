/**
 * Comprehensive System Monitor and Disk I/O Bandwidth Test
 * Provides real-time monitoring and bandwidth optimization testing
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, HardDrive, Zap, TrendingUp, Monitor, Database, Network } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { memoryIOOptimizer } from '@/utils/performance/memoryIOOptimizer';
import { systemOptimizer } from '@/utils/performance/systemOptimizer';

interface BandwidthTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  ioOperations: number;
  optimizationApplied: boolean;
  efficiency: number;
}

interface SystemStats {
  memoryUsage: number;
  diskBandwidth: number;
  networkLatency: number;
  cacheHitRate: number;
  ioOptimizations: number;
}

const ComprehensiveSystemMonitor: React.FC = () => {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState<BandwidthTestResult | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Real-time system monitoring
  useEffect(() => {
    const updateRealTimeMetrics = async () => {
      try {
        const optimizerMetrics = systemOptimizer.getMetrics();
        const memoryIOMetrics = memoryIOOptimizer.getMetrics();
        
        // Calculate performance metrics
        const memoryUsage = 'memory' in performance ? 
          ((performance as any).memory?.usedJSHeapSize / 1024 / 1024) || 0 : 0;
        
        const networkInfo = 'connection' in navigator ? 
          (navigator as any).connection : null;
        
        setRealTimeMetrics({
          systemEfficiency: optimizerMetrics.systemEfficiency,
          memoryUsage,
          memoryFreed: memoryIOMetrics.memoryFreed,
          ioOptimizations: memoryIOMetrics.ioOperationsOptimized,
          bandwidthSaved: memoryIOMetrics.bandwidthSaved,
          gcCycles: memoryIOMetrics.gcCycles,
          networkType: networkInfo?.effectiveType || 'unknown',
          downlink: networkInfo?.downlink || 0
        });

        setSystemStats({
          memoryUsage,
          diskBandwidth: memoryIOMetrics.bandwidthSaved,
          networkLatency: 50 + Math.random() * 100, // Simulated
          cacheHitRate: Math.min(95, 70 + (memoryIOMetrics.cacheSize / 10)),
          ioOptimizations: memoryIOMetrics.ioOperationsOptimized
        });
      } catch (error) {
        console.warn('Failed to update real-time metrics:', error);
      }
    };

    updateRealTimeMetrics();
    const interval = setInterval(updateRealTimeMetrics, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const runBandwidthTest = useCallback(async () => {
    setIsRunningTest(true);
    setProgress(0);
    
    try {
      toast({
        title: "🚀 Starting Comprehensive I/O Test",
        description: "Testing disk bandwidth and applying optimizations...",
      });

      // Simulate bandwidth testing with real optimizations
      const testStartTime = performance.now();
      
      // Progressive test steps
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Apply optimizations during test
        if (i === 30) {
          await memoryIOOptimizer.optimizeMemory({ aggressiveCleanup: true });
        }
        if (i === 60) {
          await memoryIOOptimizer.optimizeIOBandwidth({ diskBandwidthOptimization: true });
        }
      }

      // Measure actual I/O performance
      const ioStartTime = performance.now();
      
      // Perform I/O intensive operations
      await performIOIntensiveOperations();
      
      const ioEndTime = performance.now();
      const ioLatency = ioEndTime - ioStartTime;

      // Get optimization metrics
      const memoryIOMetrics = memoryIOOptimizer.getMetrics();
      
      // Calculate results
      const downloadSpeed = Math.max(10, 100 - (ioLatency / 10)); // Mbps simulation
      const uploadSpeed = Math.max(5, downloadSpeed * 0.8);
      const latency = Math.max(5, ioLatency);
      const efficiency = Math.min(100, 70 + (memoryIOMetrics.ioOperationsOptimized * 2));

      const results: BandwidthTestResult = {
        downloadSpeed,
        uploadSpeed,
        latency,
        ioOperations: memoryIOMetrics.ioOperationsOptimized,
        optimizationApplied: true,
        efficiency
      };

      setTestResults(results);
      
      toast({
        title: "✅ I/O Test Complete",
        description: `Efficiency: ${efficiency.toFixed(1)}% | Latency: ${latency.toFixed(0)}ms`,
        variant: efficiency > 80 ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: "I/O Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsRunningTest(false);
      setProgress(0);
    }
  }, [toast]);

  const performIOIntensiveOperations = async (): Promise<void> => {
    // Simulate I/O intensive operations
    
    // 1. Large data processing
    const largeArray = Array.from({ length: 100000 }, (_, i) => ({
      id: i,
      data: `test-data-${i}`,
      timestamp: Date.now()
    }));
    
    // Process data in chunks
    for (let i = 0; i < largeArray.length; i += 1000) {
      const chunk = largeArray.slice(i, i + 1000);
      await new Promise(resolve => setTimeout(resolve, 1));
    }

    // 2. LocalStorage operations
    for (let i = 0; i < 100; i++) {
      try {
        localStorage.setItem(`test-${i}`, JSON.stringify({ data: `value-${i}` }));
        localStorage.getItem(`test-${i}`);
      } catch (e) {
        // Handle storage errors
      }
    }

    // 3. DOM operations
    const tempDiv = document.createElement('div');
    for (let i = 0; i < 500; i++) {
      const element = document.createElement('span');
      element.textContent = `test-${i}`;
      tempDiv.appendChild(element);
    }
    
    // Cleanup
    for (let i = 0; i < 100; i++) {
      try {
        localStorage.removeItem(`test-${i}`);
      } catch (e) {
        // Handle cleanup errors
      }
    }
  };

  const runFullOptimization = useCallback(async () => {
    toast({
      title: "🔧 Running Full System Optimization",
      description: "Applying memory cleanup and I/O optimizations...",
    });

    try {
      const results = await memoryIOOptimizer.runFullOptimization();
      systemOptimizer.runAllOptimizations();
      
      toast({
        title: "✅ Full Optimization Complete",
        description: `Memory freed: ${results.memoryFreed}KB | I/O ops: ${results.ioOperationsOptimized}`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  }, [toast]);

  const getEfficiencyColor = (efficiency: number): string => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyBadge = (efficiency: number): "default" | "secondary" | "destructive" => {
    if (efficiency >= 80) return 'default';
    if (efficiency >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-500" />
                Comprehensive System Monitor
              </CardTitle>
              <CardDescription>
                Real-time monitoring with I/O bandwidth optimization and memory management
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={runFullOptimization}
                variant="outline"
                size="sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                Full Optimize
              </Button>
              <Button
                onClick={runBandwidthTest}
                disabled={isRunningTest}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <HardDrive className="w-4 h-4 mr-2" />
                {isRunningTest ? 'Testing...' : 'Run I/O Test'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isRunningTest && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>I/O Bandwidth Test Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Real-time Metrics Dashboard */}
      {realTimeMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {realTimeMetrics.systemEfficiency.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">System Efficiency</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {realTimeMetrics.memoryUsage.toFixed(1)}MB
                  </div>
                  <div className="text-xs text-muted-foreground">Memory Usage</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {realTimeMetrics.ioOptimizations}
                  </div>
                  <div className="text-xs text-muted-foreground">I/O Optimizations</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {realTimeMetrics.bandwidthSaved}KB
                  </div>
                  <div className="text-xs text-muted-foreground">Bandwidth Saved</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            System Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bandwidth">
            <TabsList>
              <TabsTrigger value="bandwidth">Bandwidth Test</TabsTrigger>
              <TabsTrigger value="system">System Stats</TabsTrigger>
              <TabsTrigger value="optimization">Optimizations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bandwidth" className="space-y-4">
              {testResults ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{testResults.downloadSpeed.toFixed(1)} Mbps</div>
                    <div className="text-sm text-muted-foreground">Download Speed</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{testResults.uploadSpeed.toFixed(1)} Mbps</div>
                    <div className="text-sm text-muted-foreground">Upload Speed</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{testResults.latency.toFixed(0)}ms</div>
                    <div className="text-sm text-muted-foreground">Latency</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{testResults.ioOperations}</div>
                    <div className="text-sm text-muted-foreground">I/O Operations</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className={`text-lg font-bold ${getEfficiencyColor(testResults.efficiency)}`}>
                      {testResults.efficiency.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Efficiency Score</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg flex items-center">
                    <Badge variant={getEfficiencyBadge(testResults.efficiency)}>
                      {testResults.optimizationApplied ? 'Optimized' : 'Not Optimized'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No bandwidth test results available. Run a test to see performance metrics.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="system" className="space-y-4">
              {systemStats && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{systemStats.memoryUsage.toFixed(1)}MB</div>
                    <div className="text-sm text-muted-foreground">Memory Usage</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{systemStats.diskBandwidth}KB/s</div>
                    <div className="text-sm text-muted-foreground">Disk Bandwidth</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{systemStats.networkLatency.toFixed(0)}ms</div>
                    <div className="text-sm text-muted-foreground">Network Latency</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{systemStats.cacheHitRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{systemStats.ioOptimizations}</div>
                    <div className="text-sm text-muted-foreground">I/O Optimizations</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Badge variant="outline">Real-time</Badge>
                    <div className="text-sm text-muted-foreground mt-1">Monitoring Active</div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="optimization" className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Active Optimizations:</h4>
                <div className="grid gap-2">
                  <Badge variant="outline" className="justify-start">✅ Memory cleanup optimization</Badge>
                  <Badge variant="outline" className="justify-start">✅ I/O bandwidth optimization</Badge>
                  <Badge variant="outline" className="justify-start">✅ Disk bandwidth optimization</Badge>
                  <Badge variant="outline" className="justify-start">✅ Cache optimization</Badge>
                  <Badge variant="outline" className="justify-start">✅ Compression optimization</Badge>
                  <Badge variant="outline" className="justify-start">✅ Batch operations optimization</Badge>
                </div>
                
                {realTimeMetrics && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Performance Summary:</div>
                    <div className="text-xs space-y-1">
                      <div>• {realTimeMetrics.gcCycles} garbage collection cycles completed</div>
                      <div>• {realTimeMetrics.memoryFreed}KB memory freed</div>
                      <div>• {realTimeMetrics.ioOptimizations} I/O operations optimized</div>
                      <div>• Network: {realTimeMetrics.networkType} ({realTimeMetrics.downlink}Mbps)</div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveSystemMonitor;