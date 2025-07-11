
import { StatisticalMetrics, CategoricalMetrics, TemporalMetrics } from '@/utils/analysis/types';

export class StatisticalAnalyzer {
  static calculateNumericalStatistics(rows: any[], columnName: string): StatisticalMetrics | null {
    const values = rows
      .map(row => Number(row[columnName]))
      .filter(val => !isNaN(val) && isFinite(val));

    if (values.length === 0) return null;

    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    return {
      average,
      minimum,
      maximum,
      standardDeviation,
      count: values.length
    };
  }

  static analyzeCategoricalDistribution(rows: any[], columnName: string): CategoricalMetrics | null {
    const values = rows
      .map(row => row[columnName])
      .filter(val => val !== null && val !== undefined && val !== '');

    if (values.length === 0) return null;

    const distribution = new Map<string, number>();
    values.forEach(val => {
      const key = String(val);
      distribution.set(key, (distribution.get(key) || 0) + 1);
    });

    const entries = Array.from(distribution.entries()).sort((a, b) => b[1] - a[1]);
    const topEntry = entries[0];

    return {
      uniqueCategories: distribution.size,
      totalRecords: values.length,
      topCategory: topEntry?.[0] || '',
      topCategoryCount: topEntry?.[1] || 0,
      diversity: distribution.size / values.length
    };
  }

  static analyzeTemporalDistribution(rows: any[], columnName: string): TemporalMetrics | null {
    const dates = rows
      .map(row => new Date(row[columnName]))
      .filter(date => !isNaN(date.getTime()));

    if (dates.length === 0) return null;

    const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));
    const daySpan = Math.ceil((latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24));

    return {
      timeSpan: `${daySpan} days`,
      earliestDate: earliest.toISOString().split('T')[0],
      latestDate: latest.toISOString().split('T')[0],
      validDateCount: dates.length
    };
  }

  static calculateCorrelation(rows: any[], col1: string, col2: string): number | null {
    const pairs = rows
      .map(row => [Number(row[col1]), Number(row[col2])])
      .filter(([a, b]) => !isNaN(a) && !isNaN(b) && isFinite(a) && isFinite(b));

    if (pairs.length < 5) return null;

    const n = pairs.length;
    const sumX = pairs.reduce((sum, [x]) => sum + x, 0);
    const sumY = pairs.reduce((sum, [, y]) => sum + y, 0);
    const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumX2 = pairs.reduce((sum, [x]) => sum + x * x, 0);
    const sumY2 = pairs.reduce((sum, [, y]) => sum + y * y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }
}
