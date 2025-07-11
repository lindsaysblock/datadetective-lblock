
import { ParsedData } from '../../dataParser';
import { AnalysisResult } from '../types';

export class RowCountAnalyzer {
  private data: ParsedData;
  private rows: Record<string, any>[];

  constructor(data: ParsedData) {
    this.data = data;
    this.rows = data.rows;
  }

  analyze(): AnalysisResult[] {
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
}
