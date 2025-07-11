
import { ParsedData } from '../dataParser';
import { AnalysisResult } from '../analysis/types';
import { DataAnalysisEngine } from '../analysis/dataAnalysisEngine';

interface RealTimeConfig {
  batchSize: number;
  processingInterval: number;
  enableStreamProcessing: boolean;
  maxQueueSize: number;
}

export class RealTimeAnalyticsEngine {
  private dataQueue: ParsedData[] = [];
  private processingTimer: NodeJS.Timeout | null = null;
  private isProcessing = false;
  private config: RealTimeConfig;
  private subscribers: Map<string, (results: AnalysisResult[]) => void> = new Map();

  constructor(config: Partial<RealTimeConfig> = {}) {
    this.config = {
      batchSize: 100,
      processingInterval: 5000,
      enableStreamProcessing: true,
      maxQueueSize: 1000,
      ...config
    };

    if (this.config.enableStreamProcessing) {
      this.startProcessing();
    }
  }

  addData(data: ParsedData): void {
    if (this.dataQueue.length >= this.config.maxQueueSize) {
      console.warn('Real-time analytics queue is full, dropping oldest data');
      this.dataQueue.shift();
    }
    
    this.dataQueue.push(data);
    
    if (this.dataQueue.length >= this.config.batchSize) {
      this.processBatch();
    }
  }

  subscribe(id: string, callback: (results: AnalysisResult[]) => void): void {
    this.subscribers.set(id, callback);
  }

  unsubscribe(id: string): void {
    this.subscribers.delete(id);
  }

  private startProcessing(): void {
    this.processingTimer = setInterval(() => {
      if (this.dataQueue.length > 0 && !this.isProcessing) {
        this.processBatch();
      }
    }, this.config.processingInterval);
  }

  private async processBatch(): Promise<void> {
    if (this.isProcessing || this.dataQueue.length === 0) return;

    this.isProcessing = true;
    const batchData = this.dataQueue.splice(0, this.config.batchSize);
    
    try {
      const combinedData = this.combineDataSets(batchData);
      const engine = new DataAnalysisEngine(combinedData, { enableLogging: false });
      const results = engine.runCompleteAnalysis();
      
      this.notifySubscribers(results);
    } catch (error) {
      console.error('Real-time analytics processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private combineDataSets(datasets: ParsedData[]): ParsedData {
    if (datasets.length === 0) {
      return { columns: [], rows: [], rowCount: 0, fileSize: 0, summary: { totalRows: 0, totalColumns: 0 } };
    }

    const combined = datasets[0];
    for (let i = 1; i < datasets.length; i++) {
      combined.rows.push(...datasets[i].rows);
      combined.rowCount += datasets[i].rowCount;
      combined.fileSize += datasets[i].fileSize;
      combined.summary.totalRows += datasets[i].summary.totalRows;
    }

    return combined;
  }

  private notifySubscribers(results: AnalysisResult[]): void {
    this.subscribers.forEach(callback => {
      try {
        callback(results);
      } catch (error) {
        console.error('Subscriber notification error:', error);
      }
    });
  }

  stop(): void {
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
    }
    this.subscribers.clear();
  }
}
