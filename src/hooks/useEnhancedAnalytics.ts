
import { useState, useEffect, useCallback } from 'react';
import { RealTimeAnalyticsEngine } from '@/utils/analytics/realTimeAnalyticsEngine';
import { MLAnalyticsEngine } from '@/utils/ml/mlAnalyticsEngine';

import { AnalyticsExportImport } from '@/utils/analytics/analyticsExportImport';
import { AnalyticsScheduler } from '@/utils/analytics/analyticsScheduler';
import { ParsedData } from '@/utils/dataParser';
import { AnalysisResult } from '@/utils/analysis/types';

interface EnhancedAnalyticsConfig {
  enableRealTime: boolean;
  enableML: boolean;
  enableCaching: boolean;
  enableScheduling: boolean;
  realTimeConfig?: any;
  mlConfig?: any;
  cacheConfig?: any;
  scheduleConfig?: any;
}

export const useEnhancedAnalytics = (config: Partial<EnhancedAnalyticsConfig> = {}) => {
  const [engines] = useState(() => ({
    realTime: config.enableRealTime !== false ? new RealTimeAnalyticsEngine(config.realTimeConfig) : null,
    ml: config.enableML !== false ? new MLAnalyticsEngine() : null,
    cache: config.enableCaching !== false ? { getStats: () => ({}), get: (key: string) => null, set: (key: string, value: any) => {}, invalidate: (pattern?: string) => 0, stop: () => {}, generateKey: (data: any) => '' } : null,
    exportImport: new AnalyticsExportImport(),
    scheduler: config.enableScheduling !== false ? new AnalyticsScheduler(config.scheduleConfig) : null
  }));

  const [realTimeResults, setRealTimeResults] = useState<AnalysisResult[]>([]);
  const [mlPredictions, setMLPredictions] = useState<any[]>([]);
  const [cacheStats, setCacheStats] = useState<any>({});
  const [scheduledJobs, setScheduledJobs] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates
    if (engines.realTime) {
      engines.realTime.subscribe('enhanced-hook', (results) => {
        setRealTimeResults(results);
      });
    }

    // Update cache stats periodically
    if (engines.cache) {
      const interval = setInterval(() => {
        setCacheStats(engines.cache!.getStats());
      }, 5000);

      return () => clearInterval(interval);
    }

    return () => {
      if (engines.realTime) engines.realTime.stop();
      if (engines.cache) engines.cache.stop();
      if (engines.scheduler) engines.scheduler.stop();
    };
  }, []);

  const processData = useCallback(async (data: ParsedData) => {
    setIsProcessing(true);
    
    try {
      // Check cache first
      let results: AnalysisResult[] = [];
      
      if (engines.cache) {
        const cacheKey = engines.cache.generateKey(data);
        const cachedResults = engines.cache.get(cacheKey);
        
        if (cachedResults) {
          results = cachedResults;
        } else {
          // Process with real-time engine
          if (engines.realTime) {
            engines.realTime.addData(data);
          }
          
          // Cache the results
          engines.cache.set(cacheKey, results);
        }
      }

      // Run ML analysis
      if (engines.ml) {
        const [trends, anomalies, clusters] = await Promise.all([
          engines.ml.predictTrends(data),
          engines.ml.detectAnomalies(data),
          engines.ml.clusterUsers(data)
        ]);
        
        setMLPredictions([...trends, ...anomalies, ...clusters]);
        engines.ml.addTrainingData(data);
      }

      return results;
    } catch (error) {
      console.error('Enhanced analytics processing failed:', error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [engines]);

  const exportData = useCallback(async (
    data: ParsedData, 
    results: AnalysisResult[], 
    format: 'json' | 'csv' | 'xlsx' | 'pdf'
  ) => {
    return engines.exportImport.exportAnalytics(data, results, { format });
  }, [engines.exportImport]);

  const importData = useCallback(async (file: File) => {
    return engines.exportImport.importAnalytics(file);
  }, [engines.exportImport]);

  const scheduleAnalysis = useCallback((jobConfig: any) => {
    if (!engines.scheduler) {
      throw new Error('Scheduler not enabled');
    }
    
    const jobId = engines.scheduler.scheduleAnalysis(jobConfig);
    setScheduledJobs(engines.scheduler.getAllJobs());
    return jobId;
  }, [engines.scheduler]);

  const clearCache = useCallback((pattern?: string) => {
    if (engines.cache) {
      return engines.cache.invalidate(pattern);
    }
    return 0;
  }, [engines.cache]);

  return {
    // Data processing
    processData,
    isProcessing,
    
    // Real-time analytics
    realTimeResults,
    
    // ML predictions
    mlPredictions,
    mlModels: engines.ml?.getModelStatus() || [],
    
    // Caching
    cacheStats,
    clearCache,
    
    // Export/Import
    exportData,
    importData,
    
    // Scheduling
    scheduleAnalysis,
    scheduledJobs,
    
    // Engine access for advanced usage
    engines
  };
};
