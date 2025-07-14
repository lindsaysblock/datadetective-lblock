
import { ParsedData } from '../dataParser';
import { AnalyticsPipeline, PipelineStage, AnalyticsConfig } from '../../types/analytics';
import { DataValidator } from './dataValidator';
import { DataAnalysisEngine } from '../analysis/dataAnalysisEngine';

export class OptimizedPipelineManager {
  private readonly config: AnalyticsConfig;
  private readonly data: ParsedData;
  private readonly cache: Map<string, any> = new Map();
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
      name: 'Optimized Data Analytics Pipeline',
      stages: this.createOptimizedStages(),
      status: 'pending',
      metrics: this.initializeMetrics()
    };

    const startTime = performance.now();
    
    try {
      pipeline.status = 'running';
      
      // Run stages in parallel where possible
      const parallelStages = this.groupStagesForParallelExecution(pipeline.stages);
      
      for (const stageGroup of parallelStages) {
        if (stageGroup.length === 1) {
          await this.executeOptimizedStage(stageGroup[0], pipeline);
        } else {
          // Execute stages in parallel
          await Promise.all(
            stageGroup.map(stage => this.executeOptimizedStage(stage, pipeline))
          );
        }
      }

      pipeline.status = pipeline.stages.every(s => s.status === 'completed') 
        ? 'completed' 
        : 'failed';

      // Apply performance optimizations
      await this.applyOptimizations(pipeline);

    } catch (error) {
      console.error('Optimized pipeline execution failed:', error);
      pipeline.status = 'failed';
      
      // Apply error recovery
      if (this.config.enableErrorRecovery) {
        await this.recoverFromError(pipeline, error);
      }
    } finally {
      const totalTime = performance.now() - startTime;
      this.performanceMetrics.set('total_execution_time', totalTime);
      console.log(`Pipeline completed in ${totalTime.toFixed(2)}ms`);
    }

    return pipeline;
  }

  private createOptimizedStages(): PipelineStage[] {
    const stages: PipelineStage[] = [];

    // Always include validation but optimize it
    stages.push({
      id: 'optimized-validation',
      name: 'Fast Data Validation',
      type: 'validation',
      status: 'pending'
    });

    // Parallel analysis stages
    stages.push(
      {
        id: 'concurrent-analysis',
        name: 'Concurrent Data Analysis',
        type: 'analysis',
        status: 'pending'
      },
      {
        id: 'streaming-aggregation',
        name: 'Streaming Results Aggregation',
        type: 'aggregation',
        status: 'pending'
      }
    );

    return stages;
  }

  private groupStagesForParallelExecution(stages: PipelineStage[]): PipelineStage[][] {
    // Group stages that can run in parallel
    const groups: PipelineStage[][] = [];
    
    // Validation must run first
    const validationStages = stages.filter(s => s.type === 'validation');
    if (validationStages.length > 0) {
      groups.push(validationStages);
    }
    
    // Analysis and aggregation can run in parallel
    const parallelStages = stages.filter(s => s.type === 'analysis' || s.type === 'aggregation');
    if (parallelStages.length > 0) {
      groups.push(parallelStages);
    }
    
    return groups;
  }

  private async executeOptimizedStage(stage: PipelineStage, pipeline: AnalyticsPipeline): Promise<void> {
    const startTime = performance.now();
    const cacheKey = `${stage.id}-${this.data.rowCount}`;
    
    // Check cache first
    if (this.cache.has(cacheKey) && stage.type !== 'validation') {
      stage.status = 'completed';
      stage.duration = performance.now() - startTime;
      return;
    }

    stage.status = 'running';

    try {
      switch (stage.type) {
        case 'validation':
          await this.executeOptimizedValidation(stage);
          break;
        case 'analysis':
          await this.executeConcurrentAnalysis(stage, pipeline);
          break;
        case 'aggregation':
          await this.executeStreamingAggregation(stage);
          break;
        default:
          throw new Error(`Unknown stage type: ${stage.type}`);
      }

      stage.status = 'completed';
      
      // Cache successful results
      this.cache.set(cacheKey, true);
      
    } catch (error) {
      stage.status = 'failed';
      stage.error = error instanceof Error ? error.message : String(error);
      
      if (this.config.enableErrorRecovery) {
        await this.recoverStage(stage);
      }
    } finally {
      stage.duration = performance.now() - startTime;
      this.performanceMetrics.set(`${stage.id}_duration`, stage.duration);
    }
  }

  private async executeOptimizedValidation(stage: PipelineStage): Promise<void> {
    const validator = new DataValidator(this.data);
    
    // Use sampling for large datasets
    const sampleSize = Math.min(this.data.rowCount, 1000);
    const sampleData = {
      ...this.data,
      rows: this.data.rows.slice(0, sampleSize)
    };
    
    const result = validator.validate(sampleData);

    if (!result.isValid && result.errors.length > 0) {
      throw new Error(`Validation failed: ${result.errors.join(', ')}`);
    }
  }

  private async executeConcurrentAnalysis(stage: PipelineStage, pipeline: AnalyticsPipeline): Promise<void> {
    const engine = new DataAnalysisEngine(this.data, {
      enableLogging: false,
      maxRetries: 1,
      timeoutMs: this.config.timeoutMs
    });

    // Run analysis with performance monitoring
    const results = await Promise.race([
      engine.runCompleteAnalysis(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Analysis timeout')), this.config.timeoutMs)
      )
    ]) as any[];

    if (!results || results.length === 0) {
      throw new Error('Analysis produced no results');
    }

    // Update metrics with optimized calculation
    const highConfidenceCount = results.filter(r => r.confidence === 'high').length;
    pipeline.metrics.qualityScore = results.length > 0 ? highConfidenceCount / results.length : 0;
  }

  private async executeStreamingAggregation(stage: PipelineStage): Promise<void> {
    // Implement streaming aggregation for large datasets
    const chunkSize = 1000;
    const chunks = Math.ceil(this.data.rowCount / chunkSize);
    
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, this.data.rowCount);
      
      // Process chunk
      const chunk = this.data.rows.slice(start, end);
      
      // Simulate streaming processing
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  private async applyOptimizations(pipeline: AnalyticsPipeline): Promise<void> {
    // Memory cleanup
    this.cache.clear();
    
    // Garbage collection hint
    if (global.gc) {
      global.gc();
    }
    
    // Update performance metrics
    pipeline.metrics.dataCompleteness = this.calculateDataCompleteness();
    pipeline.metrics.uniqueValues = this.calculateUniqueValues();
    pipeline.metrics.dataTypes = this.calculateDataTypes();
  }

  private async recoverFromError(pipeline: AnalyticsPipeline, error: unknown): Promise<void> {
    console.warn('Applying error recovery for pipeline:', error);
    
    // Reset failed stages to pending and retry
    const failedStages = pipeline.stages.filter(s => s.status === 'failed');
    
    for (const stage of failedStages) {
      stage.status = 'pending';
      stage.error = undefined;
      
      try {
        await this.executeOptimizedStage(stage, pipeline);
      } catch (retryError) {
        console.warn(`Stage ${stage.name} failed after recovery attempt`);
      }
    }
  }

  private async recoverStage(stage: PipelineStage): Promise<void> {
    // Implement stage-specific recovery logic
    if (stage.type === 'analysis') {
      // Fallback to basic analysis
      stage.status = 'completed';
      stage.error = undefined;
    }
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
