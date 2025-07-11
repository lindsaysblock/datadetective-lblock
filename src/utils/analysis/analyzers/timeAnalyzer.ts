
import { ParsedData } from '../../dataParser';
import { AnalysisResult } from '../types';

export class TimeAnalyzer {
  private rows: Record<string, any>[];

  constructor(data: ParsedData) {
    this.rows = data.rows;
  }

  analyze(): AnalysisResult[] {
    const results: AnalysisResult[] = [];

    // Purchases by date
    const purchasesByDate = this.rows
      .filter(row => row.action === 'purchase' && row.timestamp)
      .reduce((acc, row) => {
        const date = new Date(row.timestamp).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const dateData = Object.entries(purchasesByDate)
      .map(([date, count]) => ({ name: date, value: count }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    results.push({
      id: 'purchases-by-date',
      title: 'Daily Purchase Trends',
      description: 'Number of purchases per day',
      value: purchasesByDate,
      chartType: 'line',
      chartData: dateData,
      insight: `Peak purchase day: ${dateData.reduce((max, curr) => curr.value > max.value ? curr : max, dateData[0])?.name}`,
      confidence: 'high'
    });

    // Average time spent by hour
    const timeByHour = this.rows
      .filter(row => row.timestamp && row.time_spent_sec)
      .reduce((acc, row) => {
        const hour = new Date(row.timestamp).getHours();
        if (!acc[hour]) acc[hour] = { total: 0, count: 0 };
        acc[hour].total += Number(row.time_spent_sec);
        acc[hour].count += 1;
        return acc;
      }, {} as Record<number, { total: number; count: number }>);

    const hourData = Object.entries(timeByHour)
      .map(([hour, data]) => ({
        name: `${hour}:00`,
        value: Math.round(data.total / data.count)
      }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));

    const peakHour = hourData.reduce((max, curr) => curr.value > max.value ? curr : max, hourData[0]);

    results.push({
      id: 'time-by-hour',
      title: 'Engagement by Hour',
      description: 'Average time spent per hour of day',
      value: timeByHour,
      chartType: 'bar',
      chartData: hourData,
      insight: `Peak engagement at ${peakHour?.name} with ${peakHour?.value} seconds average`,
      confidence: 'high'
    });

    return results;
  }
}
