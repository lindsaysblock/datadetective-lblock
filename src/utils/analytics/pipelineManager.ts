
import { ParsedData } from '../dataParser';
import { AnalyticsPipeline, PipelineStage, AnalyticsConfig } from '../../types/analytics';
import { DataValidator } from './dataValidator';
import { DataAnalysisEngine } from '../analysis/dataAnalysisEngine';

export class AnalyticsPipelineManager {
  private readonly config: AnalyticsConfig;
  private readonly data: ParsedData;

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

  async runPipeline(): Promise<AnalyticsPipeline> {
    const pipeline: AnalyticsPipeline = {
      id: crypto.randomUUID(),
      name: 'Data Analytics Pipeline',
      stages: this.createStages(),
      status: 'pending',
      metrics: this.initializeMetrics()
    };

    try {
      pipeline.status = 'running';
      
      for (const stage of pipeline.stages) {
        await this.executeStage(stage, pipeline);
        if (stage.status === 'failed' && !this.config.enableErrorRecovery) {
          pipeline.status = 'failed';
          break;
        }
      }

      pipeline.status = pipeline.stages.every(s => s.status === 'completed') 
        ? 'completed' 
        : 'failed';

    } catch (error) {
      console.error('Pipeline execution failed:', error);
      pipeline.status = 'failed';
    }

    return pipeline;
  }

  private createStages(): PipelineStage[] {
    const stages: PipelineStage[] = [];

    if (this.config.enableValidation) {
      stages.push({
        id: 'validation',
        name: 'Data Validation',
        type: 'validation',
        status: 'pending'
      });
    }

    stages.push(
      {
        id: 'analysis',
        name: 'Data Analysis',
        type: 'analysis',
        status: 'pending'
      },
      {
        id: 'aggregation',
        name: 'Results Aggregation',
        type: 'aggregation',
        status: 'pending'
      }
    );

    return stages;
  }

  private async executeStage(stage: PipelineStage, pipeline: AnalyticsPipeline): Promise<void> {
    const startTime = performance.now();
    stage.status = 'running';

    try {
      switch (stage.type) {
        case 'validation':
          await this.executeValidationStage(stage);
          break;
        case 'analysis':
          await this.executeAnalysisStage(stage, pipeline);
          break;
        case 'aggregation':
          await this.executeAggregationStage(stage);
          break;
        default:
          throw new Error(`Unknown stage type: ${stage.type}`);
      }

      stage.status = 'completed';
    } catch (error) {
      stage.status = 'failed';
      stage.error = error instanceof Error ? error.message : String(error);
      
      if (this.config.enableErrorRecovery) {
        console.warn(`Stage ${stage.name} failed, continuing with error recovery`);
      } else {
        throw error;
      }
    } finally {
      stage.duration = performance.now() - startTime;
    }
  }

  private async executeValidationStage(stage: PipelineStage): Promise<void> {
    const validator = new DataValidator(this.data);
    const result = validator.validate();

    if (!result.isValid) {
      throw new Error(`Validation failed: ${result.errors.join(', ')}`);
    }

    if (result.confidence === 'low') {
      console.warn('Data quality is low, analysis results may be unreliable');
    }
  }

  private async executeAnalysisStage(stage: PipelineStage, pipeline: AnalyticsPipeline): Promise<void> {
    const engine = new DataAnalysisEngine(this.data, {
      enableLogging: true,
      maxRetries: this.config.maxRetries,
      timeoutMs: this.config.timeoutMs
    });

    const results = engine.runCompleteAnalysis();
    
    if (results.length === 0) {
      throw new Error('Analysis produced no results');
    }

    // Update pipeline metrics
    const highConfidenceCount = results.filter(r => r.confidence === 'high').length;
    pipeline.metrics.qualityScore = highConfidenceCount / results.length;
  }

  private async executeAggregationStage(stage: PipelineStage): Promise<void> {
    // Aggregate results and prepare for export
    // This could include creating summary statistics, charts, etc.
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing
  }

  private initializeMetrics() {
    return {
      totalRows: this.data.rows?.length || 0,
      totalColumns: this.data.columns?.length || 0,
      dataCompleteness: 0,
      uniqueValues: {},
      dataTypes: {},
      qualityScore: 0
    };
  }
}
