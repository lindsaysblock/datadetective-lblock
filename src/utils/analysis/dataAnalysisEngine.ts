
import { ParsedData } from '../dataParser';

export interface AnalysisResult {
  id: string;
  title: string;
  description: string;
  value: any;
  chartType?: 'bar' | 'line' | 'pie' | 'table';
  chartData?: any[];
  insight: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface AnalysisQuestion {
  id: string;
  category: string;
  question: string;
  analyzer: (data: ParsedData) => AnalysisResult;
}

export class DataAnalysisEngine {
  private data: ParsedData;
  private rows: Record<string, any>[];

  constructor(data: ParsedData) {
    this.data = data;
    this.rows = data.rows;
  }

  // Row & Key Counts Analysis
  analyzeRowCounts(): AnalysisResult[] {
    const results: AnalysisResult[] = [];

    // Total event rows
    results.push({
      id: 'total-rows',
      title: 'Total Event Rows',
      description: 'Total number of events in the dataset',
      value: this.rows.length,
      insight: `Dataset contains ${this.rows.length} total events`,
      confidence: 'high'
    });

    // Unique session_ids
    const sessionIds = new Set(this.rows.map(row => row.session_id).filter(Boolean));
    results.push({
      id: 'unique-sessions',
      title: 'Unique Sessions',
      description: 'Number of unique session identifiers',
      value: sessionIds.size,
      insight: `${sessionIds.size} unique sessions tracked`,
      confidence: 'high'
    });

    // Unique user_ids (logged-in users)
    const userIds = new Set(this.rows.map(row => row.user_id).filter(id => id && id !== 'unknown'));
    results.push({
      id: 'unique-users',
      title: 'Unique Logged-in Users',
      description: 'Number of unique authenticated users',
      value: userIds.size,
      insight: `${userIds.size} unique logged-in users identified`,
      confidence: 'high'
    });

    // Purchase rows
    const purchaseRows = this.rows.filter(row => row.action === 'purchase');
    results.push({
      id: 'purchase-count',
      title: 'Purchase Events',
      description: 'Total number of purchase actions',
      value: purchaseRows.length,
      insight: `${purchaseRows.length} purchase events recorded`,
      confidence: 'high'
    });

    // NULL order_id in purchases
    const nullOrderIds = purchaseRows.filter(row => !row.order_id);
    results.push({
      id: 'null-order-ids',
      title: 'Purchases with NULL Order ID',
      description: 'Purchase events missing order identifiers',
      value: nullOrderIds.length,
      insight: `${nullOrderIds.length} purchases lack order IDs - ${((nullOrderIds.length / purchaseRows.length) * 100).toFixed(1)}% of purchases`,
      confidence: 'high'
    });

    // Zero value purchases
    const zeroValuePurchases = purchaseRows.filter(row => Number(row.total_order_value) === 0);
    results.push({
      id: 'zero-value-purchases',
      title: 'Zero Value Purchases',
      description: 'Purchase events with $0 total value',
      value: zeroValuePurchases.length,
      insight: `${zeroValuePurchases.length} purchases have $0 value - potential data quality issue`,
      confidence: 'high'
    });

    return results;
  }

  // Action Breakdown Analysis
  analyzeActionBreakdown(): AnalysisResult[] {
    const results: AnalysisResult[] = [];
    
    // Action type distribution
    const actionCounts = this.rows.reduce((acc, row) => {
      const action = row.action || 'unknown';
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const actionData = Object.entries(actionCounts).map(([action, count]) => ({
      name: action,
      value: count,
      percentage: ((count / this.rows.length) * 100).toFixed(1)
    }));

    results.push({
      id: 'action-breakdown',
      title: 'Action Type Distribution',
      description: 'Breakdown of user actions by type',
      value: actionCounts,
      chartType: 'pie',
      chartData: actionData,
      insight: `Most common action: ${actionData[0]?.name} (${actionData[0]?.percentage}%)`,
      confidence: 'high'
    });

    // Logged-in vs unknown users
    const loggedInCount = this.rows.filter(row => row.user_id && row.user_id !== 'unknown').length;
    const unknownCount = this.rows.length - loggedInCount;
    
    results.push({
      id: 'user-authentication',
      title: 'User Authentication Status',
      description: 'Logged-in vs anonymous user events',
      value: { loggedIn: loggedInCount, unknown: unknownCount },
      chartType: 'pie',
      chartData: [
        { name: 'Logged-in', value: loggedInCount, percentage: ((loggedInCount / this.rows.length) * 100).toFixed(1) },
        { name: 'Anonymous', value: unknownCount, percentage: ((unknownCount / this.rows.length) * 100).toFixed(1) }
      ],
      insight: `${((loggedInCount / this.rows.length) * 100).toFixed(1)}% of events from authenticated users`,
      confidence: 'high'
    });

    return results;
  }

  // Time-Based Trends Analysis
  analyzeTimeTrends(): AnalysisResult[] {
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

  // Product Analysis
  analyzeProducts(): AnalysisResult[] {
    const results: AnalysisResult[] = [];

    // Top products by views
    const viewCounts = this.rows
      .filter(row => row.action === 'view' && row.product_name)
      .reduce((acc, row) => {
        acc[row.product_name] = (acc[row.product_name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topViews = Object.entries(viewCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([product, views]) => ({ name: product, value: views }));

    results.push({
      id: 'top-viewed-products',
      title: 'Top 5 Most Viewed Products',
      description: 'Products with highest view counts',
      value: viewCounts,
      chartType: 'bar',
      chartData: topViews,
      insight: `Most viewed: ${topViews[0]?.name} with ${topViews[0]?.value} views`,
      confidence: 'high'
    });

    // Top products by purchases
    const purchaseCounts = this.rows
      .filter(row => row.action === 'purchase' && row.product_name)
      .reduce((acc, row) => {
        acc[row.product_name] = (acc[row.product_name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topPurchases = Object.entries(purchaseCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([product, purchases]) => ({ name: product, value: purchases }));

    results.push({
      id: 'top-purchased-products',
      title: 'Top 5 Most Purchased Products',
      description: 'Products with highest purchase counts',
      value: purchaseCounts,
      chartType: 'bar',
      chartData: topPurchases,
      insight: `Most purchased: ${topPurchases[0]?.name} with ${topPurchases[0]?.value} purchases`,
      confidence: 'high'
    });

    // Top products by profit
    const profitByProduct = this.rows
      .filter(row => row.action === 'purchase' && row.product_name && row.total_order_value && row.cost && row.quantity)
      .reduce((acc, row) => {
        const profit = Number(row.total_order_value) - (Number(row.cost) * Number(row.quantity));
        acc[row.product_name] = (acc[row.product_name] || 0) + profit;
        return acc;
      }, {} as Record<string, number>);

    const topProfits = Object.entries(profitByProduct)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([product, profit]) => ({ name: product, value: Math.round(profit) }));

    results.push({
      id: 'top-profit-products',
      title: 'Top 5 Most Profitable Products',
      description: 'Products generating highest total profit',
      value: profitByProduct,
      chartType: 'bar',
      chartData: topProfits,
      insight: `Most profitable: ${topProfits[0]?.name} with $${topProfits[0]?.value} profit`,
      confidence: 'high'
    });

    return results;
  }

  // Run all analyses
  runCompleteAnalysis(): AnalysisResult[] {
    const allResults: AnalysisResult[] = [];
    
    try {
      allResults.push(...this.analyzeRowCounts());
      allResults.push(...this.analyzeActionBreakdown());
      allResults.push(...this.analyzeTimeTrends());
      allResults.push(...this.analyzeProducts());
    } catch (error) {
      console.error('Analysis error:', error);
      allResults.push({
        id: 'analysis-error',
        title: 'Analysis Error',
        description: 'Error occurred during analysis',
        value: error,
        insight: 'Some analyses could not be completed due to data format issues',
        confidence: 'low'
      });
    }

    return allResults;
  }
}
