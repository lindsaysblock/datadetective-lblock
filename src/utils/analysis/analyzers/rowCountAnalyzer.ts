
import { ParsedData } from '../../dataParser';
import { AnalysisResult } from '../types';

export class RowCountAnalyzer {
  private data: ParsedData;
  private rows: Record<string, any>[];

  constructor(data: ParsedData) {
    this.data = data;
    this.rows = data.rows || [];
    console.log('RowCountAnalyzer initialized with:', {
      totalRows: this.rows.length,
      columns: data.columns?.length || 0,
      sampleRow: this.rows[0]
    });
  }

  analyze(): AnalysisResult[] {
    const results: AnalysisResult[] = [];

    // Basic row count - this should always work
    results.push({
      id: 'total-rows',
      title: 'Total Rows',
      description: 'Total number of rows in the dataset',
      value: this.rows.length,
      insight: `Dataset contains ${this.rows.length.toLocaleString()} total rows`,
      confidence: 'high'
    });

    // Column count
    results.push({
      id: 'total-columns',
      title: 'Total Columns',
      description: 'Total number of columns in the dataset',
      value: this.data.columns?.length || 0,
      insight: `Dataset has ${this.data.columns?.length || 0} columns`,
      confidence: 'high'
    });

    // File size if available
    if (this.data.fileSize) {
      const fileSizeMB = (this.data.fileSize / (1024 * 1024)).toFixed(2);
      results.push({
        id: 'file-size',
        title: 'File Size',
        description: 'Size of the uploaded file',
        value: this.data.fileSize,
        insight: `File size is ${fileSizeMB} MB`,
        confidence: 'high'
      });
    }

    // Data completeness analysis
    if (this.rows.length > 0 && this.data.columns) {
      const totalCells = this.rows.length * this.data.columns.length;
      let emptyCells = 0;

      this.rows.forEach(row => {
        this.data.columns!.forEach(col => {
          const value = row[col.name];
          if (value === null || value === undefined || value === '') {
            emptyCells++;
          }
        });
      });

      const completenessRate = ((totalCells - emptyCells) / totalCells * 100).toFixed(1);
      results.push({
        id: 'data-completeness',
        title: 'Data Completeness',
        description: 'Percentage of non-empty cells in the dataset',
        value: parseFloat(completenessRate),
        insight: `${completenessRate}% of data cells contain values (${emptyCells.toLocaleString()} empty cells out of ${totalCells.toLocaleString()})`,
        confidence: 'high'
      });
    }

    // Try to identify key columns that might exist
    if (this.data.columns && this.rows.length > 0) {
      // Check for session_ids
      const sessionIdColumn = this.data.columns.find(col => 
        col.name.toLowerCase().includes('session') && col.name.toLowerCase().includes('id')
      );
      if (sessionIdColumn) {
        const sessionIds = new Set(this.rows.map(row => row[sessionIdColumn.name]).filter(Boolean));
        results.push({
          id: 'unique-sessions',
          title: 'Unique Sessions',
          description: `Number of unique values in ${sessionIdColumn.name}`,
          value: sessionIds.size,
          insight: `${sessionIds.size.toLocaleString()} unique sessions identified`,
          confidence: 'high'
        });
      }

      // Check for user_ids
      const userIdColumn = this.data.columns.find(col => 
        col.name.toLowerCase().includes('user') && col.name.toLowerCase().includes('id')
      );
      if (userIdColumn) {
        const userIds = new Set(this.rows.map(row => row[userIdColumn.name]).filter(id => id && id !== 'unknown'));
        results.push({
          id: 'unique-users',
          title: 'Unique Users',
          description: `Number of unique values in ${userIdColumn.name}`,
          value: userIds.size,
          insight: `${userIds.size.toLocaleString()} unique users identified`,
          confidence: 'high'
        });
      }

      // Check for action/event columns
      const actionColumn = this.data.columns.find(col => 
        ['action', 'event', 'event_name', 'activity'].includes(col.name.toLowerCase())
      );
      if (actionColumn) {
        const actions = this.rows.map(row => row[actionColumn.name]).filter(Boolean);
        const uniqueActions = new Set(actions);
        results.push({
          id: 'unique-actions',
          title: 'Unique Actions/Events',
          description: `Number of different action types in ${actionColumn.name}`,
          value: uniqueActions.size,
          insight: `${uniqueActions.size} different action types: ${Array.from(uniqueActions).slice(0, 5).join(', ')}${uniqueActions.size > 5 ? '...' : ''}`,
          confidence: 'high'
        });

        // Count specific actions if they exist
        const purchaseRows = actions.filter(action => 
          action && action.toString().toLowerCase().includes('purchase')
        );
        if (purchaseRows.length > 0) {
          results.push({
            id: 'purchase-count',
            title: 'Purchase Events',
            description: 'Total number of purchase actions',
            value: purchaseRows.length,
            insight: `${purchaseRows.length.toLocaleString()} purchase events recorded`,
            confidence: 'high'
          });
        }
      }
    }

    console.log('RowCountAnalyzer results:', results);
    return results;
  }
}
