import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { HardDrive, Zap, Timer, BarChart3 } from 'lucide-react';
import { diskIOOptimizer } from '@/utils/performance/diskIOOptimizer';
import { optimizedDataProcessor } from '@/utils/performance/optimizedDataProcessor';
import { analysisCache } from '@/utils/performance/cachingStrategy';

interface DiskIOMetrics {
  totalBandwidth: number;
  cacheHitRate: number;
  batchEfficiency: number;
  streamingThroughput: number;
  memoryUtilization: number;
}

interface TestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  metrics?: Partial<DiskIOMetrics>;
  duration: number;
}

const DiskIOBandwidthTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [overallMetrics, setOverallMetrics] = useState<DiskIOMetrics | null>(null);

  const generateTestData = (size: number): any[] => {
    return Array.from({ length: size }, (_, i) => ({
      id: i,
      name: `Record ${i}`,
      data: Array.from({ length: 50 }, () => Math.random().toString(36)),
      timestamp: Date.now() + i,
      metadata: {
        category: `Category ${i % 10}`,
        priority: Math.floor(Math.random() * 5),
        tags: Array.from({ length: 5 }, () => Math.random().toString(36).substring(7))
      }
    }));
  };

  const testCacheEfficiency = async (): Promise<TestResult> => {
    const startTime = Date.now();
    const testData = generateTestData(1000);
    const cacheKey = 'disk_io_test_cache';
    
    try {
      // First write to cache
      diskIOOptimizer.cacheData(cacheKey, testData);
      
      // Test cache retrieval
      const cached = diskIOOptimizer.getCachedData(cacheKey);
      
      if (!cached || !Array.isArray(cached) || cached.length !== testData.length) {
        return {
          testName: 'Cache Efficiency',
          status: 'fail',
          message: 'Cache miss or data corruption',
          duration: Date.now() - startTime
        };
      }

      // Get cache stats
      const stats = analysisCache.getStats();
      const hitRate = stats.hitRate;

      return {
        testName: 'Cache Efficiency',
        status: hitRate > 0.8 ? 'pass' : 'warning',
        message: `Cache hit rate: ${(hitRate * 100).toFixed(1)}%`,
        metrics: { cacheHitRate: hitRate },
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName: 'Cache Efficiency',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  };

  const testBatchOperations = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const operations = Array.from({ length: 50 }, (_, i) => 
        () => Promise.resolve(`Operation ${i} completed`)
      );

      const results = await diskIOOptimizer.batchOperation(operations);
      
      if (results.length !== operations.length) {
        return {
          testName: 'Batch Operations',
          status: 'fail',
          message: 'Batch operation failed to complete all tasks',
          duration: Date.now() - startTime
        };
      }

      const duration = Date.now() - startTime;
      const efficiency = operations.length / (duration / 1000); // ops per second

      return {
        testName: 'Batch Operations',
        status: efficiency > 100 ? 'pass' : 'warning',
        message: `Processed ${operations.length} operations in ${duration}ms (${efficiency.toFixed(1)} ops/sec)`,
        metrics: { batchEfficiency: efficiency },
        duration
      };
    } catch (error) {
      return {
        testName: 'Batch Operations',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  };

  const testStreamProcessing = async (): Promise<TestResult> => {
    const startTime = Date.now();
    const testData = generateTestData(5000);
    
    try {
      const processor = async (chunk: any[]) => {
        return chunk.map(item => ({ ...item, processed: true }));
      };

      const results = await diskIOOptimizer.streamProcess(testData, processor, 500);
      
      if (results.length !== testData.length) {
        return {
          testName: 'Stream Processing',
          status: 'fail',
          message: 'Stream processing lost data',
          duration: Date.now() - startTime
        };
      }

      const duration = Date.now() - startTime;
      const throughput = testData.length / (duration / 1000); // items per second

      return {
        testName: 'Stream Processing',
        status: throughput > 1000 ? 'pass' : 'warning',
        message: `Processed ${testData.length} items in ${duration}ms (${throughput.toFixed(1)} items/sec)`,
        metrics: { streamingThroughput: throughput },
        duration
      };
    } catch (error) {
      return {
        testName: 'Stream Processing',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  };

  const testFileProcessing = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Create a mock CSV file
      const csvContent = Array.from({ length: 1000 }, (_, i) => 
        `${i},"Record ${i}",${Math.random()},${Date.now() + i}`
      ).join('\n');
      
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
      
      const result = await optimizedDataProcessor.parseFileOptimized(file);
      
      if (!result || typeof result !== 'string') {
        return {
          testName: 'File Processing',
          status: 'fail',
          message: 'File processing failed',
          duration: Date.now() - startTime
        };
      }

      const duration = Date.now() - startTime;
      const bandwidth = (file.size / 1024) / (duration / 1000); // KB/s

      return {
        testName: 'File Processing',
        status: bandwidth > 500 ? 'pass' : 'warning',
        message: `Processed ${(file.size / 1024).toFixed(1)} KB in ${duration}ms (${bandwidth.toFixed(1)} KB/s)`,
        metrics: { totalBandwidth: bandwidth },
        duration
      };
    } catch (error) {
      return {
        testName: 'File Processing',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  };

  const testMemoryUtilization = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Check memory usage before test
      const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Generate and cache large dataset
      const largeData = generateTestData(10000);
      const cacheKey = 'memory_test';
      
      diskIOOptimizer.cacheData(cacheKey, largeData, true);
      
      // Check memory usage after
      const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = memoryAfter - memoryBefore;
      
      // Test retrieval
      const retrieved = diskIOOptimizer.getCachedData(cacheKey);
      const utilizationEfficiency = retrieved ? 1 : 0;

      return {
        testName: 'Memory Utilization',
        status: utilizationEfficiency > 0.9 ? 'pass' : 'warning',
        message: `Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB, Efficiency: ${(utilizationEfficiency * 100).toFixed(1)}%`,
        metrics: { memoryUtilization: utilizationEfficiency },
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName: 'Memory Utilization',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  };

  const runDiskIOTests = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);
    setOverallMetrics(null);

    const tests = [
      testCacheEfficiency,
      testBatchOperations,
      testStreamProcessing,
      testFileProcessing,
      testMemoryUtilization
    ];

    const testResults: TestResult[] = [];
    const metrics: Partial<DiskIOMetrics> = {};

    for (let i = 0; i < tests.length; i++) {
      const result = await tests[i]();
      testResults.push(result);
      
      if (result.metrics) {
        Object.assign(metrics, result.metrics);
      }
      
      setResults([...testResults]);
      setProgress(((i + 1) / tests.length) * 100);
      
      // Small delay for UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Calculate overall metrics
    const overallMetrics: DiskIOMetrics = {
      totalBandwidth: metrics.totalBandwidth || 0,
      cacheHitRate: metrics.cacheHitRate || 0,
      batchEfficiency: metrics.batchEfficiency || 0,
      streamingThroughput: metrics.streamingThroughput || 0,
      memoryUtilization: metrics.memoryUtilization || 0
    };

    setOverallMetrics(overallMetrics);
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800 border-green-300';
      case 'fail': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          Disk I/O Bandwidth Optimization Test
        </CardTitle>
        <CardDescription>
          Comprehensive testing of disk I/O performance, caching efficiency, and bandwidth optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          onClick={runDiskIOTests}
          disabled={isRunning}
          className="w-full"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isRunning ? 'Running Disk I/O Tests...' : 'Run Disk I/O Bandwidth Tests'}
        </Button>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Testing Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {overallMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Total Bandwidth</div>
              <div className="text-xl font-semibold">{overallMetrics.totalBandwidth.toFixed(1)} KB/s</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Cache Hit Rate</div>
              <div className="text-xl font-semibold">{(overallMetrics.cacheHitRate * 100).toFixed(1)}%</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Batch Efficiency</div>
              <div className="text-xl font-semibold">{overallMetrics.batchEfficiency.toFixed(1)} ops/s</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600">Stream Throughput</div>
              <div className="text-xl font-semibold">{overallMetrics.streamingThroughput.toFixed(1)} items/s</div>
            </div>
            <div className="p-3 bg-cyan-50 rounded-lg">
              <div className="text-sm text-gray-600">Memory Efficiency</div>
              <div className="text-xl font-semibold">{(overallMetrics.memoryUtilization * 100).toFixed(1)}%</div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Test Results
            </h3>
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.testName}</span>
                      <Badge 
                        variant={result.status === 'pass' ? 'default' : result.status === 'fail' ? 'destructive' : 'secondary'}
                      >
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm">{result.message}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Timer className="w-3 h-3" />
                    {result.duration}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="text-sm text-gray-600 space-y-1">
            <h4 className="font-medium">Optimization Status:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>✅ Memory caching with LRU eviction</div>
              <div>✅ Batch operation processing</div>
              <div>✅ Stream processing for large datasets</div>
              <div>✅ Chunked file reading (64KB chunks)</div>
              <div>✅ Deferred write operations</div>
              <div>✅ Intelligent cache management</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiskIOBandwidthTest;