
export interface WorkerTask<T = any> {
  id: string;
  payload: T;
  priority: 'low' | 'normal' | 'high' | 'critical';
  retries: number;
  maxRetries: number;
  createdAt: number;
}

export interface WorkerResult<T = any> {
  taskId: string;
  success: boolean;
  result?: T;
  error?: string;
  duration: number;
}

export class TaskQueue<T = any> {
  private queues: {
    critical: WorkerTask<T>[];
    high: WorkerTask<T>[];
    normal: WorkerTask<T>[];
    low: WorkerTask<T>[];
  } = {
    critical: [],
    high: [],
    normal: [],
    low: []
  };
  
  private processing = new Set<string>();
  private maxConcurrentTasks: number;
  private currentTasks = 0;

  constructor(maxConcurrentTasks = 4) {
    this.maxConcurrentTasks = maxConcurrentTasks;
  }

  addTask(task: Omit<WorkerTask<T>, 'id' | 'createdAt'>): string {
    const fullTask: WorkerTask<T> = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    };
    
    this.queues[task.priority].push(fullTask);
    this.processNext();
    
    return fullTask.id;
  }

  private async processNext(): Promise<void> {
    if (this.currentTasks >= this.maxConcurrentTasks) return;
    
    const task = this.getNextTask();
    if (!task) return;
    
    this.processing.add(task.id);
    this.currentTasks++;
    
    try {
      const result = await this.executeTask(task);
      this.handleTaskResult(task, result);
    } catch (error) {
      this.handleTaskError(task, error);
    } finally {
      this.processing.delete(task.id);
      this.currentTasks--;
      this.processNext(); // Process next task
    }
  }

  private getNextTask(): WorkerTask<T> | null {
    // Process by priority: critical -> high -> normal -> low
    for (const priority of ['critical', 'high', 'normal', 'low'] as const) {
      const queue = this.queues[priority];
      if (queue.length > 0) {
        return queue.shift()!;
      }
    }
    return null;
  }

  private async executeTask(task: WorkerTask<T>): Promise<any> {
    // This would be overridden by specific implementations
    console.log(`Executing task ${task.id} with priority ${task.priority}`);
    
    // Simulate different processing times based on priority
    const processingTime = {
      critical: 100,
      high: 200,
      normal: 500,
      low: 1000
    }[task.priority];
    
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    return { processed: true, taskId: task.id };
  }

  private handleTaskResult(task: WorkerTask<T>, result: any): void {
    console.log(`Task ${task.id} completed successfully:`, result);
  }

  private handleTaskError(task: WorkerTask<T>, error: any): void {
    console.error(`Task ${task.id} failed:`, error);
    
    if (task.retries < task.maxRetries) {
      task.retries++;
      // Re-queue with lower priority for retry
      const retryPriority = task.priority === 'critical' ? 'high' : 
                           task.priority === 'high' ? 'normal' : 'low';
      this.queues[retryPriority].push({ ...task, priority: retryPriority });
      this.processNext();
    }
  }

  getQueueStats(): {
    totalTasks: number;
    processingTasks: number;
    queueSizes: Record<string, number>;
    availableWorkers: number;
  } {
    const queueSizes = {
      critical: this.queues.critical.length,
      high: this.queues.high.length,
      normal: this.queues.normal.length,
      low: this.queues.low.length
    };
    
    const totalTasks = Object.values(queueSizes).reduce((sum, size) => sum + size, 0);
    
    return {
      totalTasks,
      processingTasks: this.processing.size,
      queueSizes,
      availableWorkers: this.maxConcurrentTasks - this.currentTasks
    };
  }

  clear(): void {
    Object.values(this.queues).forEach(queue => queue.length = 0);
    this.processing.clear();
    this.currentTasks = 0;
  }
}

// Analytics-specific task queue
export class AnalyticsTaskQueue extends TaskQueue<any> {
  private async executeTask(task: WorkerTask<any>): Promise<any> {
    const startTime = performance.now();
    
    try {
      // Handle different types of analytics tasks
      switch (task.payload.type) {
        case 'data-analysis':
          return await this.processDataAnalysis(task.payload.data);
        case 'chart-generation':
          return await this.processChartGeneration(task.payload.config);
        case 'export-report':
          return await this.processReportExport(task.payload.format);
        default:
          throw new Error(`Unknown task type: ${task.payload.type}`);
      }
    } finally {
      const duration = performance.now() - startTime;
      console.log(`Analytics task ${task.id} took ${duration.toFixed(2)}ms`);
    }
  }

  private async processDataAnalysis(data: any): Promise<any> {
    // Simulate heavy data processing
    const startTime = performance.now();
    
    // Process in chunks to avoid blocking
    const chunkSize = 1000;
    const chunks = Math.ceil(data.length / chunkSize);
    let processed = 0;
    
    for (let i = 0; i < chunks; i++) {
      const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
      // Process chunk...
      processed += chunk.length;
      
      // Yield control every chunk to prevent blocking
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    return {
      processedRows: processed,
      duration: performance.now() - startTime,
      analysis: 'completed'
    };
  }

  private async processChartGeneration(config: any): Promise<any> {
    // Simulate chart processing
    await new Promise(resolve => setTimeout(resolve, 300));
    return { chartUrl: 'generated-chart.png', config };
  }

  private async processReportExport(format: string): Promise<any> {
    // Simulate report generation
    const delay = format === 'pdf' ? 2000 : 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    return { exportUrl: `report.${format}`, format };
  }
}

// Global analytics task queue instance
export const analyticsTaskQueue = new AnalyticsTaskQueue(2); // Limit to 2 concurrent analytics tasks
