
import { DataAnalysisContext } from '@/types/data';
import { ParsedData } from '@/utils/dataParser';

export class RealDataAnalyzer {
  async generateInsights(context: DataAnalysisContext, data: ParsedData): Promise<string[]> {
    const insights: string[] = [];
    
    try {
      const actualRows = data.rows?.length || 0;
      const actualColumns = data.columns?.length || 0;
      
      console.log('🔍 Generating REAL insights for actual data:', { 
        actualRows, 
        actualColumns,
        columnNames: data.columns?.map(col => col.name).slice(0, 5) || []
      });
      
      if (actualRows === 0) {
        insights.push('No data rows were found - please check your file format');
        return insights;
      }

      // Generate insights based on ACTUAL data content
      insights.push(`Dataset Analysis: Your data contains ${actualRows.toLocaleString()} records across ${actualColumns} fields, providing substantial information for analysis.`);
      
      // Analyze actual column types and content
      const columnAnalysis = this.analyzeActualColumns(data);
      
      if (columnAnalysis.numericalColumns.length > 0) {
        insights.push(`Quantitative Analysis Available: Found ${columnAnalysis.numericalColumns.length} numerical columns (${columnAnalysis.numericalColumns.slice(0, 3).join(', ')}) suitable for statistical analysis.`);
        
        // Calculate real statistics for numerical columns
        columnAnalysis.numericalColumns.slice(0, 3).forEach(colName => {
          const stats = this.calculateRealStatistics(data.rows, colName);
          if (stats) {
            insights.push(`${colName} Statistics: Average value is ${stats.avg.toFixed(2)}, ranging from ${stats.min} to ${stats.max}. Standard deviation: ${stats.stdDev.toFixed(2)}`);
          }
        });
      }
      
      if (columnAnalysis.textColumns.length > 0) {
        insights.push(`Categorical Analysis Ready: ${columnAnalysis.textColumns.length} text-based columns available for segmentation and categorical analysis.`);
        
        // Analyze actual categorical distributions
        columnAnalysis.textColumns.slice(0, 2).forEach(colName => {
          const distribution = this.analyzeCategoricalDistribution(data.rows, colName);
          if (distribution.uniqueCount > 1) {
            insights.push(`${colName} Distribution: ${distribution.uniqueCount} unique categories found. Most common: "${distribution.topCategory}" (${distribution.topCount} occurrences)`);
          }
        });
      }
      
      if (columnAnalysis.dateColumns.length > 0) {
        insights.push(`Temporal Analysis Possible: ${columnAnalysis.dateColumns.length} date/time columns enable trend analysis over time periods.`);
        
        // Analyze time ranges
        columnAnalysis.dateColumns.forEach(colName => {
          const timeRange = this.analyzeTimeRange(data.rows, colName);
          if (timeRange) {
            insights.push(`${colName} Time Range: Data spans from ${timeRange.earliest} to ${timeRange.latest} (${timeRange.daySpan} days)`);
          }
        });
      }
      
      // Research question specific insights based on actual data
      this.addResearchSpecificInsights(context, insights, data, columnAnalysis);
      
      // Data quality insights
      const completeness = this.calculateDataCompleteness(data);
      if (completeness < 95) {
        insights.push(`Data Quality Note: ${completeness.toFixed(1)}% completeness - some fields contain missing values that may affect analysis accuracy.`);
      } else {
        insights.push(`Data Quality Excellent: ${completeness.toFixed(1)}% completeness with minimal missing values ensures reliable analysis.`);
      }
      
      // Pattern detection
      const patterns = this.detectDataPatterns(data);
      if (patterns.length > 0) {
        insights.push(`Data Patterns Detected: ${patterns.join(', ')}`);
      }
      
    } catch (error) {
      console.warn('Error generating real insights:', error);
      insights.push('Analysis completed with basic data structure assessment');
    }
    
    console.log('💡 Generated real insights:', insights.length, 'insights');
    return insights;
  }

  private analyzeActualColumns(data: ParsedData) {
    const numericalColumns: string[] = [];
    const textColumns: string[] = [];
    const dateColumns: string[] = [];
    
    data.columns.forEach(col => {
      const sampleValues = data.rows.slice(0, 20).map(row => row[col.name]).filter(val => val != null && val !== '');
      
      if (sampleValues.length > 0) {
        const numericCount = sampleValues.filter(val => {
          const num = Number(val);
          return !isNaN(num) && isFinite(num);
        }).length;
        
        const dateCount = sampleValues.filter(val => {
          const dateVal = new Date(val);
          return !isNaN(dateVal.getTime()) && dateVal.getFullYear() > 1900;
        }).length;
        
        const numericRatio = numericCount / sampleValues.length;
        const dateRatio = dateCount / sampleValues.length;
        
        if (numericRatio > 0.7) {
          numericalColumns.push(col.name);
        } else if (dateRatio > 0.7) {
          dateColumns.push(col.name);
        } else {
          textColumns.push(col.name);
        }
      }
    });

    return { numericalColumns, textColumns, dateColumns };
  }

  private calculateRealStatistics(rows: any[], columnName: string) {
    const values = rows.map(row => Number(row[columnName])).filter(val => !isNaN(val) && isFinite(val));
    
    if (values.length === 0) return null;
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { avg, stdDev, min, max, count: values.length };
  }

  private analyzeCategoricalDistribution(rows: any[], columnName: string) {
    const values = rows.map(row => row[columnName]).filter(val => val != null && val !== '');
    const distribution = new Map<string, number>();
    
    values.forEach(val => {
      const key = String(val);
      distribution.set(key, (distribution.get(key) || 0) + 1);
    });
    
    const entries = Array.from(distribution.entries()).sort((a, b) => b[1] - a[1]);
    
    return {
      uniqueCount: distribution.size,
      topCategory: entries[0]?.[0] || '',
      topCount: entries[0]?.[1] || 0,
      totalCount: values.length
    };
  }

  private analyzeTimeRange(rows: any[], columnName: string) {
    const dates = rows.map(row => new Date(row[columnName])).filter(date => !isNaN(date.getTime()));
    
    if (dates.length === 0) return null;
    
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));
    const daySpan = Math.ceil((latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      earliest: earliest.toDateString(),
      latest: latest.toDateString(),
      daySpan
    };
  }

  private addResearchSpecificInsights(context: DataAnalysisContext, insights: string[], data: ParsedData, columnTypes: any) {
    const questionLower = context.researchQuestion.toLowerCase();
    
    if (questionLower.includes('trend') || questionLower.includes('time')) {
      if (columnTypes.dateColumns.length > 0) {
        insights.push(`Trend Analysis Ready: Time-based analysis can be performed using ${columnTypes.dateColumns.join(', ')} to identify patterns over time.`);
      } else {
        insights.push('Trend Analysis Limited: No clear date/time columns detected - consider adding temporal data for trend analysis.');
      }
    }
    
    if (questionLower.includes('correlation') && columnTypes.numericalColumns.length >= 2) {
      insights.push(`Correlation Analysis Available: ${columnTypes.numericalColumns.length} numerical variables enable correlation and relationship analysis.`);
    }
    
    if (questionLower.includes('segment') || questionLower.includes('group')) {
      if (columnTypes.textColumns.length > 0) {
        insights.push(`Segmentation Analysis Ready: ${columnTypes.textColumns.length} categorical columns available for customer/user segmentation.`);
      }
    }
    
    if (questionLower.includes('performance') || questionLower.includes('metric')) {
      if (columnTypes.numericalColumns.length > 0) {
        insights.push(`Performance Metrics Available: ${columnTypes.numericalColumns.length} numerical metrics can be analyzed for performance insights.`);
      }
    }
  }

  private detectDataPatterns(data: ParsedData): string[] {
    const patterns: string[] = [];
    
    // Check for time series patterns
    const timeColumns = data.columns.filter(col => /time|date|timestamp/i.test(col.name));
    if (timeColumns.length > 0) {
      patterns.push('Time series data structure detected');
    }
    
    // Check for user behavior patterns
    const userColumns = data.columns.filter(col => /user|customer|client/i.test(col.name));
    const eventColumns = data.columns.filter(col => /event|action|activity/i.test(col.name));
    if (userColumns.length > 0 && eventColumns.length > 0) {
      patterns.push('User behavior tracking structure identified');
    }
    
    // Check for transaction patterns
    const valueColumns = data.columns.filter(col => /price|cost|value|amount|revenue/i.test(col.name));
    if (valueColumns.length > 0) {
      patterns.push('Financial/transaction data patterns found');
    }
    
    return patterns;
  }

  generateRecommendations(insights: string[], validation: any, data: ParsedData): string[] {
    const recommendations: string[] = [];
    
    // Data-driven recommendations based on actual content
    const columnAnalysis = this.analyzeActualColumns(data);
    
    if (columnAnalysis.numericalColumns.length >= 2) {
      recommendations.push(`Explore statistical relationships between ${columnAnalysis.numericalColumns.slice(0, 3).join(', ')} for deeper quantitative insights.`);
    }
    
    if (columnAnalysis.dateColumns.length > 0 && columnAnalysis.numericalColumns.length > 0) {
      recommendations.push(`Create time-based visualizations to identify trends and seasonal patterns in your data.`);
    }
    
    if (columnAnalysis.textColumns.length > 0) {
      recommendations.push(`Perform segmentation analysis using categorical variables like ${columnAnalysis.textColumns.slice(0, 2).join(', ')}.`);
    }
    
    // Data quality recommendations
    const completeness = this.calculateDataCompleteness(data);
    if (completeness < 90) {
      recommendations.push('Address missing data values to improve analysis accuracy and reliability.');
    }
    
    // Analysis depth recommendations
    if (data.rows.length > 1000) {
      recommendations.push('Consider sampling strategies for large dataset analysis to optimize processing time.');
    }
    
    if (data.rows.length < 100) {
      recommendations.push('Consider collecting more data points to increase statistical significance of findings.');
    }
    
    // Export and visualization recommendations
    recommendations.push('Export detailed findings and create visualizations to communicate insights effectively.');
    recommendations.push('Consider setting up automated reporting for ongoing data monitoring.');
    
    return recommendations;
  }

  private calculateDataCompleteness(data: ParsedData): number {
    if (data.rows.length === 0 || data.columns.length === 0) return 0;
    
    const totalCells = data.rows.length * data.columns.length;
    let filledCells = 0;
    
    data.rows.forEach(row => {
      data.columns.forEach(col => {
        const value = row[col.name];
        if (value !== null && value !== undefined && value !== '') {
          filledCells++;
        }
      });
    });
    
    return (filledCells / totalCells) * 100;
  }
}
