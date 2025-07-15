import { ParsedData } from '../dataParser';
import { AnalyticsPipeline, PipelineStage, AnalyticsConfig } from '../../types/analytics';
import { DataValidator } from './dataValidator';
import { DataAnalysisEngine } from '../analysis/dataAnalysisEngine';
import { diskIOOptimizer } from '../performance/diskIOOptimizer';

export class OptimizedPipelineManager {
  private readonly config: AnalyticsConfig;
  private readonly data: ParsedData;
  private readonly performanceMetrics: Map<string, number> = new Map();

  constructor(data: ParsedData, config: Partial<AnalyticsConfig> = {}) {
    this.data = data;
    this.config = {
      enableValidation: true,
      enableErrorRecovery: true,
      maxRetries: 3,
      timeoutMs: 30000,
      qualityThreshold: 0.7,
      ...config
    };
  }

  async runOptimizedPipeline(): Promise<AnalyticsPipeline> {
    const pipeline: AnalyticsPipeline = {
      id: crypto.randomUUID(),
      name: 'Disk I/O Optimized Pipeline',
      stages: this.createOptimizedStages(),
      status: 'pending',
      metrics: this.initializeMetrics()
    };

    const cacheKey = `pipeline_${this.data.rowCount}_${Date.now()}`;
    const startTime = performance.now();
    
    try {
      // Check for cached pipeline results
      const cachedResult = diskIOOptimizer.getCachedData<AnalyticsPipeline>(cacheKey);
      if (cachedResult) {
        console.log('⚡ Using cached pipeline result');
        return cachedResult;
      }

      pipeline.status = 'running';
      
      // Use batched operations to reduce I/O
      const stageOperations = pipeline.stages.map(stage => 
        () => this.executeOptimizedStage(stage, pipeline)
      );

      await diskIOOptimizer.batchOperation(stageOperations);

      pipeline.status = pipeline.stages.every(s => s.status === 'completed') 
        ? 'completed' 
        : 'failed';

      // Cache successful pipeline results
      if (pipeline.status === 'completed') {
        diskIOOptimizer.cacheData(cacheKey, pipeline);
      }

    } catch (error) {
      console.error('Optimized pipeline execution failed:', error);
      pipeline.status = 'failed';
      
      if (this.config.enableErrorRecovery) {
        await this.recoverFromError(pipeline, error);
      }
    } finally {
      const totalTime = performance.now() - startTime;
      this.performanceMetrics.set('total_execution_time', totalTime);
      console.log(`Optimized pipeline completed in ${totalTime.toFixed(2)}ms`);
    }

    return pipeline;
  }

  private createOptimizedStages(): PipelineStage[] {
    return [
      {
        id: 'memory-validation',
        name: 'In-Memory Validation',
        type: 'validation',
        status: 'pending'
      },
      {
        id: 'stream-analysis',
        name: 'Streaming Analysis',
        type: 'analysis',
        status: 'pending'
      },
      {
        id: 'batch-aggregation',
        name: 'Batched Aggregation',
        type: 'aggregation',
        status: 'pending'
      }
    ];
  }

  private async executeOptimizedStage(stage: PipelineStage, pipeline: AnalyticsPipeline): Promise<void> {
    const startTime = performance.now();
    stage.status = 'running';

    try {
      switch (stage.type) {
        case 'validation':
          await this.executeMemoryValidation(stage);
          break;
        case 'analysis':
          await this.executeStreamingAnalysis(stage, pipeline);
          break;
        case 'aggregation':
          await this.executeBatchedAggregation(stage);
          break;
        default:
          throw new Error(`Unknown stage type: ${stage.type}`);
      }

      stage.status = 'completed';
      
    } catch (error) {
      stage.status = 'failed';
      stage.error = error instanceof Error ? error.message : String(error);
    } finally {
      stage.duration = performance.now() - startTime;
      this.performanceMetrics.set(`${stage.id}_duration`, stage.duration);
    }
  }

  private async executeMemoryValidation(stage: PipelineStage): Promise<void> {
    // Use cached validation if available
    const cacheKey = `validation_${this.data.rowCount}`;
    const cachedValidation = diskIOOptimizer.getCachedData(cacheKey);
    
    if (cachedValidation) {
      return;
    }

    const validator = new DataValidator(this.data);
    const result = validator.validate();

    if (!result.isValid && result.errors.length > 0) {
      throw new Error(`Validation failed: ${result.errors.join(', ')}`);
    }

    // Cache validation result
    diskIOOptimizer.cacheData(cacheKey, result);
  }

  private async executeStreamingAnalysis(stage: PipelineStage, pipeline: AnalyticsPipeline): Promise<void> {
    const engine = new DataAnalysisEngine(this.data, {
      enableLogging: false,
      maxRetries: 1,
      timeoutMs: this.config.timeoutMs
    });

    // Stream analysis to reduce memory usage
    const results = await diskIOOptimizer.streamProcess(
      [this.data], 
      async (chunk) => {
        const analysis = await engine.runCompleteAnalysis();
        return analysis;
      },
      1 // Process one at a time for memory efficiency
    );

    if (!results || results.length === 0) {
      throw new Error('Streaming analysis produced no results');
    }

    // Update metrics efficiently
    const flatResults = results.flat();
    const highConfidenceCount = flatResults.filter(r => r.confidence === 'high').length;
    pipeline.metrics.qualityScore = flatResults.length > 0 ? highConfidenceCount / flatResults.length : 0;
  }

  private async executeBatchedAggregation(stage: PipelineStage): Promise<void> {
    // Use deferred writes for aggregation
    const chunkSize = 500; // Smaller chunks for better I/O
    const chunks = Math.ceil(this.data.rowCount / chunkSize);
    
    const aggregationPromises = [];
    for (let i = 0; i < chunks; i++) {
      const promise = new Promise<void>(resolve => {
        // Defer the aggregation work
        diskIOOptimizer.deferredWrite(`chunk_${i}`, {
          start: i * chunkSize,
          end: Math.min((i + 1) * chunkSize, this.data.rowCount)
        });
        resolve();
      });
      aggregationPromises.push(promise);
    }
    
    await Promise.all(aggregationPromises);
    
    // Flush all deferred writes
    await diskIOOptimizer.flushPendingWrites();
  }

  private async recoverFromError(pipeline: AnalyticsPipeline, error: unknown): Promise<void> {
    console.warn('Applying optimized error recovery:', error);
    
    const failedStages = pipeline.stages.filter(s => s.status === 'failed');
    
    // Use batched recovery
    const recoveryOperations = failedStages.map(stage => async () => {
      stage.status = 'pending';
      stage.error = undefined;
      
      try {
        await this.executeOptimizedStage(stage, pipeline);
      } catch (retryError) {
        console.warn(`Stage ${stage.name} failed after optimized recovery`);
      }
    });
    
    await diskIOOptimizer.batchOperation(recoveryOperations);
  }

  private calculateDataCompleteness(): number {
    if (!this.data.rows || this.data.rows.length === 0) return 0;
    
    let totalCells = 0;
    let filledCells = 0;
    
    this.data.rows.forEach(row => {
      Object.values(row).forEach(value => {
        totalCells++;
        if (value !== null && value !== undefined && value !== '') {
          filledCells++;
        }
      });
    });
    
    return totalCells > 0 ? (filledCells / totalCells) * 100 : 0;
  }

  private calculateUniqueValues(): Record<string, number> {
    const uniqueValues: Record<string, number> = {};
    
    if (!this.data.rows || this.data.rows.length === 0) return uniqueValues;
    
    Object.keys(this.data.rows[0]).forEach(column => {
      const values = new Set(this.data.rows.map(row => row[column]));
      uniqueValues[column] = values.size;
    });
    
    return uniqueValues;
  }

  private calculateDataTypes(): Record<string, string> {
    const dataTypes: Record<string, string> = {};
    
    if (!this.data.columns) return dataTypes;
    
    this.data.columns.forEach(column => {
      dataTypes[column.name] = column.type;
    });
    
    return dataTypes;
  }

  private initializeMetrics() {
    return {
      totalRows: this.data.rowCount || 0,
      totalColumns: this.data.columns?.length || 0,
      dataCompleteness: 0,
      uniqueValues: {},
      dataTypes: {},
      qualityScore: 0
    };
  }
}
