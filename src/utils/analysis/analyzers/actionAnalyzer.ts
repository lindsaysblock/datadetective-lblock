
import { ParsedData } from '../../dataParser';
import { AnalysisResult } from '../types';

export class ActionAnalyzer {
  private rows: Record<string, any>[];

  constructor(data: ParsedData) {
    this.rows = data.rows;
  }

  analyze(): AnalysisResult[] {
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
}
