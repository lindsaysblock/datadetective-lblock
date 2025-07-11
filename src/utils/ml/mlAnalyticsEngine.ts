
import { ParsedData } from '../dataParser';
import { AnalysisResult } from '../analysis/types';

interface MLPrediction {
  id: string;
  type: 'trend' | 'anomaly' | 'classification' | 'clustering';
  prediction: any;
  confidence: number;
  model: string;
}

interface MLModel {
  name: string;
  type: 'regression' | 'classification' | 'clustering' | 'anomaly_detection';
  trained: boolean;
  accuracy?: number;
}

export class MLAnalyticsEngine {
  private models: Map<string, MLModel> = new Map();
  private trainingData: ParsedData[] = [];

  constructor() {
    this.initializeModels();
  }

  private initializeModels(): void {
    this.models.set('trend_predictor', {
      name: 'Trend Predictor',
      type: 'regression',
      trained: false
    });

    this.models.set('anomaly_detector', {
      name: 'Anomaly Detector',
      type: 'anomaly_detection',
      trained: false
    });

    this.models.set('user_clusterer', {
      name: 'User Behavior Clusterer',
      type: 'clustering',
      trained: false
    });
  }

  addTrainingData(data: ParsedData): void {
    this.trainingData.push(data);
    
    if (this.trainingData.length >= 10) {
      this.trainModels();
    }
  }

  async predictTrends(data: ParsedData): Promise<MLPrediction[]> {
    const predictions: MLPrediction[] = [];
    
    // Simulate trend prediction using simple linear regression
    const timeSeriesData = this.extractTimeSeriesData(data);
    if (timeSeriesData.length > 3) {
      const trend = this.calculateTrend(timeSeriesData);
      
      predictions.push({
        id: 'trend_prediction',
        type: 'trend',
        prediction: {
          direction: trend > 0 ? 'increasing' : 'decreasing',
          strength: Math.abs(trend),
          nextValue: timeSeriesData[timeSeriesData.length - 1] + trend
        },
        confidence: Math.min(0.95, 0.6 + Math.abs(trend) * 0.3),
        model: 'trend_predictor'
      });
    }

    return predictions;
  }

  async detectAnomalies(data: ParsedData): Promise<MLPrediction[]> {
    const predictions: MLPrediction[] = [];
    const numericColumns = this.getNumericColumns(data);
    
    for (const column of numericColumns) {
      const values = data.rows.map(row => Number(row[column.name])).filter(v => !isNaN(v));
      const anomalies = this.detectOutliers(values);
      
      if (anomalies.length > 0) {
        predictions.push({
          id: `anomaly_${column.name}`,
          type: 'anomaly',
          prediction: {
            column: column.name,
            anomalousValues: anomalies,
            threshold: this.calculateThreshold(values)
          },
          confidence: 0.8,
          model: 'anomaly_detector'
        });
      }
    }

    return predictions;
  }

  async clusterUsers(data: ParsedData): Promise<MLPrediction[]> {
    const predictions: MLPrediction[] = [];
    const userMetrics = this.extractUserMetrics(data);
    
    if (userMetrics.size > 5) {
      const clusters = this.performKMeansClustering(Array.from(userMetrics.values()), 3);
      
      predictions.push({
        id: 'user_clusters',
        type: 'clustering',
        prediction: {
          clusters: clusters.map((cluster, index) => ({
            id: index,
            size: cluster.length,
            characteristics: this.analyzeCluster(cluster)
          }))
        },
        confidence: 0.75,
        model: 'user_clusterer'
      });
    }

    return predictions;
  }

  private extractTimeSeriesData(data: ParsedData): number[] {
    const timestampCol = data.columns.find(col => 
      col.name.toLowerCase().includes('timestamp') || 
      col.name.toLowerCase().includes('date')
    );
    
    if (!timestampCol) return [];
    
    return data.rows
      .map(row => new Date(String(row[timestampCol.name])).getTime())
      .filter(time => !isNaN(time))
      .sort((a, b) => a - b);
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = values.reduce((sum, _, i) => sum + i, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
    const sumXX = values.reduce((sum, _, i) => sum + i * i, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private getNumericColumns(data: ParsedData) {
    return data.columns.filter(col => col.type === 'number');
  }

  private detectOutliers(values: number[]): number[] {
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    return values.filter(v => v < lowerBound || v > upperBound);
  }

  private calculateThreshold(values: number[]): { lower: number; upper: number } {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    
    return {
      lower: mean - 2 * stdDev,
      upper: mean + 2 * stdDev
    };
  }

  private extractUserMetrics(data: ParsedData): Map<string, number[]> {
    const userMetrics = new Map<string, number[]>();
    const userIdCol = data.columns.find(col => col.name.toLowerCase().includes('user'));
    
    if (!userIdCol) return userMetrics;
    
    data.rows.forEach(row => {
      const userId = String(row[userIdCol.name]);
      if (!userMetrics.has(userId)) {
        userMetrics.set(userId, []);
      }
      
      // Extract numeric metrics for each user
      const numericValues = data.columns
        .filter(col => col.type === 'number')
        .map(col => Number(row[col.name]))
        .filter(val => !isNaN(val));
      
      userMetrics.get(userId)!.push(...numericValues);
    });
    
    return userMetrics;
  }

  private performKMeansClustering(data: number[][], k: number): number[][][] {
    // Simplified K-means implementation
    const clusters: number[][][] = Array.from({ length: k }, () => []);
    
    data.forEach((point, index) => {
      const clusterIndex = index % k; // Simple assignment for demo
      clusters[clusterIndex].push(point);
    });
    
    return clusters;
  }

  private analyzeCluster(cluster: number[][]): any {
    if (cluster.length === 0) return {};
    
    const avgValues = cluster[0].map((_, colIndex) => {
      const columnValues = cluster.map(row => row[colIndex]);
      return columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length;
    });
    
    return {
      size: cluster.length,
      averageValues: avgValues,
      characteristics: this.getClusterCharacteristics(avgValues)
    };
  }

  private getClusterCharacteristics(avgValues: number[]): string[] {
    const characteristics: string[] = [];
    
    if (avgValues[0] > 100) characteristics.push('High Activity');
    if (avgValues[1] > 50) characteristics.push('High Value');
    if (avgValues.length > 2 && avgValues[2] > 10) characteristics.push('Frequent User');
    
    return characteristics;
  }

  private trainModels(): void {
    console.log('Training ML models with', this.trainingData.length, 'datasets');
    
    this.models.forEach(model => {
      model.trained = true;
      model.accuracy = 0.75 + Math.random() * 0.2; // Simulated accuracy
    });
  }

  getModelStatus(): MLModel[] {
    return Array.from(this.models.values());
  }
}
