
import { ParsedData } from '../dataParser';

export const generateDataInsights = (data: ParsedData): string[] => {
  console.log('Generating data insights');
  
  const insights: string[] = [];
  
  if (data.summary.possibleUserIdColumns.length > 0) {
    insights.push(`🆔 Found ${data.summary.possibleUserIdColumns.length} potential user ID column(s): ${data.summary.possibleUserIdColumns.join(', ')}`);
  }
  
  if (data.summary.possibleEventColumns.length > 0) {
    insights.push(`📊 Found ${data.summary.possibleEventColumns.length} potential event/activity column(s): ${data.summary.possibleEventColumns.join(', ')}`);
  }
  
  if (data.summary.possibleTimestampColumns.length > 0) {
    insights.push(`⏰ Found ${data.summary.possibleTimestampColumns.length} potential timestamp column(s): ${data.summary.possibleTimestampColumns.join(', ')}`);
  }
  
  const columnsByType = data.columns.reduce((acc, col) => {
    acc[col.type] = (acc[col.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  if (columnsByType.number > 0) {
    insights.push(`🔢 Found ${columnsByType.number} numeric column(s) suitable for statistical analysis`);
  }
  
  if (columnsByType.date > 0) {
    insights.push(`📅 Found ${columnsByType.date} date column(s) suitable for time series analysis`);
  }
  
  const dataQuality = assessDataQuality(data);
  insights.push(`📈 Dataset contains ${data.summary.totalRows} rows and ${data.summary.totalColumns} columns`);
  
  if (dataQuality.completeness < 80) {
    insights.push(`⚠️ Data completeness is ${dataQuality.completeness}% - consider cleaning missing values`);
  }
  
  if (data.summary.totalRows >= 1000) {
    insights.push(`✅ Large dataset detected - good statistical power for analysis`);
  } else if (data.summary.totalRows < 30) {
    insights.push(`⚠️ Small sample size - results may have limited statistical significance`);
  }
  
  console.log(`Generated ${insights.length} insights`);
  return insights;
};

const assessDataQuality = (data: ParsedData) => {
  let totalCells = data.summary.totalRows * data.summary.totalColumns;
  let filledCells = 0;
  
  data.rows.forEach(row => {
    data.columns.forEach(col => {
      const value = row[col.name];
      if (value !== null && value !== undefined && value !== '') {
        filledCells++;
      }
    });
  });
  
  const completeness = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;
  
  return {
    completeness,
    totalCells,
    filledCells
  };
};
