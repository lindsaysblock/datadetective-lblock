
import { ParsedData } from '../../dataParser';
import { AnalysisResult } from '../types';

interface DataQualityMetrics {
  completenessRate: number;
  emptyFieldsCount: number;
  totalFieldsCount: number;
}

export class RowCountAnalyzer {
  private readonly data: ParsedData;
  private readonly rows: Record<string, unknown>[];
  private readonly enableLogging: boolean;

  constructor(data: ParsedData, enableLogging = true) {
    this.data = data;
    this.rows = data.rows || [];
    this.enableLogging = enableLogging;
    
    if (this.enableLogging) {
      console.log('RowCountAnalyzer initialized with:', {
        totalRows: this.rows.length,
        columns: data.columns?.length || 0,
        sampleRow: this.rows[0]
      });
    }
  }

  analyze(): AnalysisResult[] {
    const results: AnalysisResult[] = [];

    // Core metrics that should always be available
    results.push(...this.analyzeBasicMetrics());
    
    // Data quality analysis
    results.push(...this.analyzeDataQuality());
    
    // Column-specific analysis
    results.push(...this.analyzeKeyColumns());

    if (this.enableLogging) {
      console.log('RowCountAnalyzer results:', results.length, 'insights generated');
    }

    return results;
  }

  private analyzeBasicMetrics(): AnalysisResult[] {
    const results: AnalysisResult[] = [];

    // Total rows - always available
    results.push({
      id: 'total-rows',
      title: 'Total Rows',
      description: 'Total number of rows in the dataset',
      value: this.rows.length,
      insight: `Dataset contains ${this.rows.length.toLocaleString()} total rows`,
      confidence: 'high'
    });

    // Column count
    const columnCount = this.data.columns?.length || 0;
    results.push({
      id: 'total-columns',
      title: 'Total Columns',
      description: 'Total number of columns in the dataset',
      value: columnCount,
      insight: `Dataset has ${columnCount} columns`,
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

    return results;
  }

  private analyzeDataQuality(): AnalysisResult[] {
    const results: AnalysisResult[] = [];

    if (this.rows.length === 0 || !this.data.columns) {
      return results;
    }

    const qualityMetrics = this.calculateDataQualityMetrics();
    
    results.push({
      id: 'data-completeness',
      title: 'Data Completeness',
      description: 'Percentage of non-empty cells in the dataset',
      value: parseFloat(qualityMetrics.completenessRate.toFixed(1)),
      insight: `${qualityMetrics.completenessRate.toFixed(1)}% of data cells contain values (${qualityMetrics.emptyFieldsCount.toLocaleString()} empty cells out of ${qualityMetrics.totalFieldsCount.toLocaleString()})`,
      confidence: 'high'
    });

    return results;
  }

  private analyzeKeyColumns(): AnalysisResult[] {
    const results: AnalysisResult[] = [];

    if (!this.data.columns || this.rows.length === 0) {
      return results;
    }

    // Session ID analysis
    const sessionIdColumn = this.findColumnByPattern(['session', 'id'], ['session_id', 'sessionId']);
    if (sessionIdColumn) {
      const uniqueSessions = this.countUniqueValues(sessionIdColumn.name);
      results.push({
        id: 'unique-sessions',
        title: 'Unique Sessions',
        description: `Number of unique values in ${sessionIdColumn.name}`,
        value: uniqueSessions,
        insight: `${uniqueSessions.toLocaleString()} unique sessions identified`,
        confidence: 'high'
      });
    }

    // User ID analysis
    const userIdColumn = this.findColumnByPattern(['user', 'id'], ['user_id', 'userId']);
    if (userIdColumn) {
      const uniqueUsers = this.countUniqueNonUnknownValues(userIdColumn.name);
      results.push({
        id: 'unique-users',
        title: 'Unique Users',
        description: `Number of unique values in ${userIdColumn.name}`,
        value: uniqueUsers,
        insight: `${uniqueUsers.toLocaleString()} unique users identified`,
        confidence: 'high'
      });
    }

    // Action/Event analysis
    const actionColumn = this.findActionColumn();
    if (actionColumn) {
      const actionAnalysis = this.analyzeActionColumn(actionColumn.name);
      results.push(...actionAnalysis);
    }

    return results;
  }

  private calculateDataQualityMetrics(): DataQualityMetrics {
    const totalFieldsCount = this.rows.length * (this.data.columns?.length || 0);
    let emptyFieldsCount = 0;

    this.rows.forEach(row => {
      this.data.columns?.forEach(col => {
        const value = row[col.name];
        if (this.isEmptyValue(value)) {
          emptyFieldsCount++;
        }
      });
    });

    const completenessRate = totalFieldsCount > 0 
      ? ((totalFieldsCount - emptyFieldsCount) / totalFieldsCount * 100) 
      : 0;

    return {
      completenessRate,
      emptyFieldsCount,
      totalFieldsCount
    };
  }

  private findColumnByPattern(keywords: string[], exactMatches: string[] = []) {
    return this.data.columns?.find(col => {
      const lowerName = col.name.toLowerCase();
      return exactMatches.includes(lowerName) || 
             keywords.every(keyword => lowerName.includes(keyword));
    });
  }

  private findActionColumn() {
    const actionColumnNames = ['action', 'event', 'event_name', 'activity', 'event_type'];
    return this.data.columns?.find(col => 
      actionColumnNames.includes(col.name.toLowerCase())
    );
  }

  private countUniqueValues(columnName: string): number {
    const uniqueValues = new Set(
      this.rows
        .map(row => row[columnName])
        .filter(value => !this.isEmptyValue(value))
    );
    return uniqueValues.size;
  }

  private countUniqueNonUnknownValues(columnName: string): number {
    const uniqueValues = new Set(
      this.rows
        .map(row => row[columnName])
        .filter(value => !this.isEmptyValue(value) && value !== 'unknown')
    );
    return uniqueValues.size;
  }

  private analyzeActionColumn(columnName: string): AnalysisResult[] {
    const results: AnalysisResult[] = [];
    const actions = this.rows
      .map(row => row[columnName])
      .filter(action => !this.isEmptyValue(action));
    
    const uniqueActions = new Set(actions);
    
    results.push({
      id: 'unique-actions',
      title: 'Unique Actions/Events',
      description: `Number of different action types in ${columnName}`,
      value: uniqueActions.size,
      insight: `${uniqueActions.size} different action types: ${Array.from(uniqueActions).slice(0, 5).join(', ')}${uniqueActions.size > 5 ? '...' : ''}`,
      confidence: 'high'
    });

    // Purchase event analysis
    const purchaseEvents = actions.filter(action => 
      action && String(action).toLowerCase().includes('purchase')
    );
    
    if (purchaseEvents.length > 0) {
      results.push({
        id: 'purchase-count',
        title: 'Purchase Events',
        description: 'Total number of purchase actions',
        value: purchaseEvents.length,
        insight: `${purchaseEvents.length.toLocaleString()} purchase events recorded`,
        confidence: 'high'
      });
    }

    return results;
  }

  private isEmptyValue(value: unknown): boolean {
    return value === null || value === undefined || value === '' || value === 'null';
  }
}
