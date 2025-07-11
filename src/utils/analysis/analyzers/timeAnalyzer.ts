
import { ParsedData } from '../../dataParser';
import { AnalysisResult } from '../types';

interface TimeSeriesData {
  name: string;
  value: number;
}

interface HourlyEngagementData {
  hour: number;
  totalTime: number;
  eventCount: number;
  averageTime: number;
}

export class TimeAnalyzer {
  private readonly rows: Record<string, unknown>[];
  private readonly enableLogging: boolean;

  constructor(data: ParsedData, enableLogging = true) {
    this.rows = data.rows || [];
    this.enableLogging = enableLogging;
  }

  analyze(): AnalysisResult[] {
    if (this.rows.length === 0) {
      return this.createEmptyDataResults();
    }

    const results: AnalysisResult[] = [];
    
    try {
      // Purchase trends by date
      const purchaseTrends = this.analyzePurchasesByDate();
      if (purchaseTrends) {
        results.push(purchaseTrends);
      }

      // Engagement by hour
      const hourlyEngagement = this.analyzeEngagementByHour();
      if (hourlyEngagement) {
        results.push(hourlyEngagement);
      }

    } catch (error) {
      if (this.enableLogging) {
        console.error('TimeAnalyzer error:', error);
      }
      results.push(this.createErrorResult(error));
    }

    return results;
  }

  private analyzePurchasesByDate(): AnalysisResult | null {
    const purchasesByDate = this.calculatePurchasesByDate();
    
    if (Object.keys(purchasesByDate).length === 0) {
      return null;
    }

    const dateData = this.formatDateData(purchasesByDate);
    const peakDay = this.findPeakPurchaseDay(dateData);

    return {
      id: 'purchases-by-date',
      title: 'Daily Purchase Trends',
      description: 'Number of purchases per day',
      value: purchasesByDate,
      chartType: 'line',
      chartData: dateData,
      insight: peakDay 
        ? `Peak purchase day: ${peakDay.name} with ${peakDay.value} purchases`
        : 'Purchase trends analysis completed',
      confidence: 'high'
    };
  }

  private analyzeEngagementByHour(): AnalysisResult | null {
    const hourlyData = this.calculateHourlyEngagement();
    
    if (hourlyData.length === 0) {
      return null;
    }

    const chartData = this.formatHourlyData(hourlyData);
    const peakHour = this.findPeakEngagementHour(chartData);

    return {
      id: 'time-by-hour',
      title: 'Engagement by Hour',
      description: 'Average time spent per hour of day',
      value: hourlyData,
      chartType: 'bar',
      chartData,
      insight: peakHour 
        ? `Peak engagement at ${peakHour.name} with ${peakHour.value} seconds average`
        : 'Hourly engagement analysis completed',
      confidence: 'high'
    };
  }

  private calculatePurchasesByDate(): Record<string, number> {
    const purchasesByDate: Record<string, number> = {};
    
    this.rows
      .filter(row => this.isPurchaseEvent(row) && this.hasValidTimestamp(row))
      .forEach(row => {
        const timestamp = this.extractTimestamp(row);
        if (timestamp) {
          const date = new Date(timestamp).toDateString();
          purchasesByDate[date] = (purchasesByDate[date] || 0) + 1;
        }
      });

    return purchasesByDate;
  }

  private calculateHourlyEngagement(): HourlyEngagementData[] {
    const hourlyEngagement: Record<number, HourlyEngagementData> = {};
    
    this.rows
      .filter(row => this.hasValidTimestamp(row) && this.hasTimeSpent(row))
      .forEach(row => {
        const timestamp = this.extractTimestamp(row);
        const timeSpent = this.extractTimeSpent(row);
        
        if (timestamp && timeSpent !== null) {
          const hour = new Date(timestamp).getHours();
          
          if (!hourlyEngagement[hour]) {
            hourlyEngagement[hour] = {
              hour,
              totalTime: 0,
              eventCount: 0,
              averageTime: 0
            };
          }
          
          hourlyEngagement[hour].totalTime += timeSpent;
          hourlyEngagement[hour].eventCount += 1;
          hourlyEngagement[hour].averageTime = Math.round(
            hourlyEngagement[hour].totalTime / hourlyEngagement[hour].eventCount
          );
        }
      });

    return Object.values(hourlyEngagement).sort((a, b) => a.hour - b.hour);
  }

  private formatDateData(purchasesByDate: Record<string, number>): TimeSeriesData[] {
    return Object.entries(purchasesByDate)
      .map(([date, count]) => ({ name: date, value: count }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }

  private formatHourlyData(hourlyData: HourlyEngagementData[]): TimeSeriesData[] {
    return hourlyData.map(data => ({
      name: `${data.hour.toString().padStart(2, '0')}:00`,
      value: data.averageTime
    }));
  }

  private findPeakPurchaseDay(dateData: TimeSeriesData[]): TimeSeriesData | null {
    return dateData.length > 0 
      ? dateData.reduce((max, curr) => curr.value > max.value ? curr : max)
      : null;
  }

  private findPeakEngagementHour(hourData: TimeSeriesData[]): TimeSeriesData | null {
    return hourData.length > 0 
      ? hourData.reduce((max, curr) => curr.value > max.value ? curr : max)
      : null;
  }

  private isPurchaseEvent(row: Record<string, unknown>): boolean {
    const action = this.extractActionValue(row);
    return action?.toLowerCase().includes('purchase') || false;
  }

  private hasValidTimestamp(row: Record<string, unknown>): boolean {
    const timestamp = this.extractTimestamp(row);
    return timestamp !== null && !isNaN(new Date(timestamp).getTime());
  }

  private hasTimeSpent(row: Record<string, unknown>): boolean {
    const timeSpent = this.extractTimeSpent(row);
    return timeSpent !== null && !isNaN(timeSpent);
  }

  private extractTimestamp(row: Record<string, unknown>): string | null {
    const timestampFields = ['timestamp', 'created_at', 'date', 'time', 'event_time'];
    
    for (const field of timestampFields) {
      const value = row[field];
      if (value && typeof value === 'string') {
        return value;
      }
    }
    
    return null;
  }

  private extractTimeSpent(row: Record<string, unknown>): number | null {
    const timeFields = ['time_spent_sec', 'duration', 'session_duration', 'time_spent'];
    
    for (const field of timeFields) {
      const value = row[field];
      if (value !== null && value !== undefined) {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          return numValue;
        }
      }
    }
    
    return null;
  }

  private extractActionValue(row: Record<string, unknown>): string | null {
    const actionFields = ['action', 'event', 'event_name', 'activity'];
    
    for (const field of actionFields) {
      const value = row[field];
      if (value && typeof value === 'string') {
        return value;
      }
    }
    
    return null;
  }

  private createEmptyDataResults(): AnalysisResult[] {
    return [{
      id: 'time-no-data',
      title: 'No Time Data',
      description: 'No time-based data available for analysis',
      value: 0,
      insight: 'No timestamp data available for time analysis',
      confidence: 'low'
    }];
  }

  private createErrorResult(error: unknown): AnalysisResult {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      id: 'time-analysis-error',
      title: 'Time Analysis Error',
      description: 'Error occurred during time analysis',
      value: 0,
      insight: `Time analysis failed: ${errorMessage}`,
      confidence: 'low'
    };
  }
}
