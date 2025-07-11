
import { DataAnalysisEngine } from '../analysis/dataAnalysisEngine';
import { ParsedData } from '../dataParser';
import { AnalysisResult } from '../analysis/types';

interface ScheduledJob {
  id: string;
  name: string;
  schedule: string; // cron-like format
  dataSource: () => Promise<ParsedData>;
  analysisConfig: any;
  lastRun?: Date;
  nextRun?: Date;
  enabled: boolean;
  results?: AnalysisResult[];
  notifications?: {
    email?: string[];
    webhook?: string;
  };
}

interface ScheduleConfig {
  timezone: string;
  maxConcurrentJobs: number;
  retryAttempts: number;
  notificationSettings: {
    onSuccess: boolean;
    onFailure: boolean;
  };
}

export class AnalyticsScheduler {
  private jobs = new Map<string, ScheduledJob>();
  private runningJobs = new Set<string>();
  private schedulerTimer: NodeJS.Timeout | null = null;
  private config: ScheduleConfig;

  constructor(config: Partial<ScheduleConfig> = {}) {
    this.config = {
      timezone: 'UTC',
      maxConcurrentJobs: 3,
      retryAttempts: 3,
      notificationSettings: {
        onSuccess: true,
        onFailure: true
      },
      ...config
    };

    this.startScheduler();
  }

  scheduleAnalysis(job: Omit<ScheduledJob, 'id'>): string {
    const id = this.generateJobId();
    const scheduledJob: ScheduledJob = {
      ...job,
      id,
      nextRun: this.calculateNextRun(job.schedule)
    };

    this.jobs.set(id, scheduledJob);
    console.log(`Scheduled analytics job: ${job.name} (${id})`);
    
    return id;
  }

  updateJob(id: string, updates: Partial<ScheduledJob>): boolean {
    const job = this.jobs.get(id);
    if (!job) return false;

    const updatedJob = { ...job, ...updates };
    if (updates.schedule) {
      updatedJob.nextRun = this.calculateNextRun(updates.schedule);
    }

    this.jobs.set(id, updatedJob);
    return true;
  }

  deleteJob(id: string): boolean {
    if (this.runningJobs.has(id)) {
      console.warn(`Cannot delete running job: ${id}`);
      return false;
    }

    return this.jobs.delete(id);
  }

  getJob(id: string): ScheduledJob | undefined {
    return this.jobs.get(id);
  }

  getAllJobs(): ScheduledJob[] {
    return Array.from(this.jobs.values());
  }

  async runJobNow(id: string): Promise<AnalysisResult[]> {
    const job = this.jobs.get(id);
    if (!job) {
      throw new Error(`Job not found: ${id}`);
    }

    return this.executeJob(job);
  }

  pauseJob(id: string): boolean {
    const job = this.jobs.get(id);
    if (!job) return false;

    job.enabled = false;
    this.jobs.set(id, job);
    return true;
  }

  resumeJob(id: string): boolean {
    const job = this.jobs.get(id);
    if (!job) return false;

    job.enabled = true;
    job.nextRun = this.calculateNextRun(job.schedule);
    this.jobs.set(id, job);
    return true;
  }

  private startScheduler(): void {
    this.schedulerTimer = setInterval(() => {
      this.checkAndRunJobs();
    }, 60000); // Check every minute
  }

  private async checkAndRunJobs(): Promise<void> {
    const now = new Date();
    const readyJobs = Array.from(this.jobs.values()).filter(job => 
      job.enabled &&
      job.nextRun &&
      job.nextRun <= now &&
      !this.runningJobs.has(job.id) &&
      this.runningJobs.size < this.config.maxConcurrentJobs
    );

    for (const job of readyJobs) {
      this.executeJobWithRetry(job);
    }
  }

  private async executeJobWithRetry(job: ScheduledJob, attempt = 1): Promise<void> {
    try {
      await this.executeJob(job);
      job.lastRun = new Date();
      job.nextRun = this.calculateNextRun(job.schedule);
      this.jobs.set(job.id, job);
      
      if (this.config.notificationSettings.onSuccess) {
        await this.sendNotification(job, 'success');
      }
    } catch (error) {
      console.error(`Job execution failed: ${job.name} (attempt ${attempt})`, error);
      
      if (attempt < this.config.retryAttempts) {
        setTimeout(() => {
          this.executeJobWithRetry(job, attempt + 1);
        }, Math.pow(2, attempt) * 1000); // Exponential backoff
      } else {
        if (this.config.notificationSettings.onFailure) {
          await this.sendNotification(job, 'failure', error);
        }
      }
    }
  }

  private async executeJob(job: ScheduledJob): Promise<AnalysisResult[]> {
    this.runningJobs.add(job.id);
    
    try {
      console.log(`Executing scheduled job: ${job.name}`);
      
      const data = await job.dataSource();
      const engine = new DataAnalysisEngine(data, job.analysisConfig);
      const results = engine.runCompleteAnalysis();
      
      job.results = results;
      this.jobs.set(job.id, job);
      
      return results;
    } finally {
      this.runningJobs.delete(job.id);
    }
  }

  private calculateNextRun(schedule: string): Date {
    // Simplified cron parser - in real implementation, use a proper cron library
    const now = new Date();
    
    switch (schedule) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      default:
        // Default to hourly if schedule format is unknown
        return new Date(now.getTime() + 60 * 60 * 1000);
    }
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendNotification(job: ScheduledJob, type: 'success' | 'failure', error?: any): Promise<void> {
    const message = type === 'success' 
      ? `Analytics job "${job.name}" completed successfully`
      : `Analytics job "${job.name}" failed: ${error?.message || 'Unknown error'}`;

    console.log(`Notification: ${message}`);

    // In real implementation, send actual notifications
    if (job.notifications?.webhook) {
      try {
        await fetch(job.notifications.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: job.id,
            jobName: job.name,
            type,
            message,
            timestamp: new Date().toISOString(),
            results: type === 'success' ? job.results : undefined
          })
        });
      } catch (webhookError) {
        console.error('Webhook notification failed:', webhookError);
      }
    }
  }

  getSchedulerStats(): {
    totalJobs: number;
    enabledJobs: number;
    runningJobs: number;
    nextRun?: Date;
  } {
    const enabledJobs = Array.from(this.jobs.values()).filter(job => job.enabled);
    const nextRuns = enabledJobs
      .map(job => job.nextRun)
      .filter(date => date)
      .sort((a, b) => a!.getTime() - b!.getTime());

    return {
      totalJobs: this.jobs.size,
      enabledJobs: enabledJobs.length,
      runningJobs: this.runningJobs.size,
      nextRun: nextRuns[0]
    };
  }

  stop(): void {
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    this.jobs.clear();
    this.runningJobs.clear();
  }
}
