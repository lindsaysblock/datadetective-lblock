
// Task Queue Management System
export interface Task {
  id: string;
  payload: any;
  priority: 'high' | 'normal' | 'low';
  retries: number;
  maxRetries: number;
  createdAt: Date;
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  result?: any;
  error?: Error;
  executionTime: number;
}

export class TaskQueue<T = any> {
  private tasks: Map<string, Task> = new Map();
  private processing: Set<string> = new Set();
  private maxConcurrent: number = 5;
  private processingCount: number = 0;

  constructor(maxConcurrent: number = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullTask: Task = {
      ...task,
      id: taskId,
      createdAt: new Date()
    };
    
    this.tasks.set(taskId, fullTask);
    this.processNext();
    return taskId;
  }

  private async processNext(): Promise<void> {
    if (this.processingCount >= this.maxConcurrent) {
      return;
    }

    const nextTask = this.getNextTask();
    if (!nextTask) {
      return;
    }

    this.processingCount++;
    this.processing.add(nextTask.id);

    try {
      await this.executeTask(nextTask);
    } catch (error) {
      console.error('Task execution failed:', error);
    } finally {
      this.processing.delete(nextTask.id);
      this.tasks.delete(nextTask.id);
      this.processingCount--;
      
      // Process next task if available
      if (this.tasks.size > 0) {
        this.processNext();
      }
    }
  }

  private getNextTask(): Task | null {
    const availableTasks = Array.from(this.tasks.values())
      .filter(task => !this.processing.has(task.id))
      .sort((a, b) => {
        // Sort by priority and creation time
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });

    return availableTasks[0] || null;
  }

  protected async executeTask(task: Task): Promise<TaskResult> {
    const startTime = Date.now();
    
    try {
      // Default task execution - subclasses can override
      const result = await this.handleTask(task);
      
      return {
        taskId: task.id,
        success: true,
        result,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        error: error as Error,
        executionTime: Date.now() - startTime
      };
    }
  }

  protected async handleTask(task: Task): Promise<any> {
    // Default implementation - subclasses should override
    console.log('Processing task:', task.id);
    return { processed: true };
  }

  getQueueStatus() {
    return {
      total: this.tasks.size,
      processing: this.processing.size,
      waiting: this.tasks.size - this.processing.size
    };
  }
}

// Specialized Analytics Task Queue
export class AnalyticsTaskQueue extends TaskQueue {
  protected async handleTask(task: Task): Promise<any> {
    const { type, data, analysisType } = task.payload;
    
    switch (type) {
      case 'data-analysis':
        return await this.processAnalysisTask(data, analysisType);
      case 'performance-monitoring':
        return await this.processPerformanceTask(data);
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  private async processAnalysisTask(data: any, analysisType: string): Promise<any> {
    // Simulate analysis processing
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      analysisType,
      processed: true,
      timestamp: new Date().toISOString(),
      dataSize: data?.rows?.length || 0
    };
  }

  private async processPerformanceTask(data: any): Promise<any> {
    // Simulate performance monitoring
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return {
      performanceMetrics: {
        processingTime: Math.random() * 100,
        memoryUsage: Math.random() * 1000,
        cpuUsage: Math.random() * 100
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Global instance
export const analyticsTaskQueue = new AnalyticsTaskQueue(3);

// Load Balancer for distributing work
export class LoadBalancer {
  private queues: Map<string, TaskQueue> = new Map();
  private roundRobinIndex: number = 0;

  constructor() {
    // Initialize default queues
    this.queues.set('analytics', new AnalyticsTaskQueue(3));
    this.queues.set('general', new TaskQueue(5));
  }

  async distributeTask(task: Omit<Task, 'id' | 'createdAt'>, queueName: string = 'general'): Promise<string> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    return await queue.addTask(task);
  }

  getSystemStatus() {
    const status: Record<string, any> = {};
    
    this.queues.forEach((queue, name) => {
      status[name] = queue.getQueueStatus();
    });

    return status;
  }
}

export const globalLoadBalancer = new LoadBalancer();
