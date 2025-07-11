
export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  samples: any[];
}

export interface ParsedData {
  columns: DataColumn[];
  rows: Record<string, any>[];
  rowCount: number;
  fileSize: number;
  summary: {
    totalRows: number;
    totalColumns: number;
    possibleUserIdColumns?: string[];
    possibleEventColumns?: string[];
    possibleTimestampColumns?: string[];
  };
}

import { parseCSV } from './parsers/csvParser';
import { parseJSON } from './parsers/jsonParser';

export const parseFile = async (file: File): Promise<ParsedData> => {
  console.log('🔍 Starting file parsing:', {
    name: file.name,
    size: file.size,
    type: file.type
  });
  
  if (!file || file.size === 0) {
    throw new Error('File is empty or invalid');
  }
  
  if (file.size > 100 * 1024 * 1024) { // 100MB limit
    throw new Error('File size exceeds 100MB limit');
  }
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  let parsedData: ParsedData;
  
  try {
    switch (extension) {
      case 'csv':
        parsedData = await parseCSV(file);
        break;
      case 'json':
        parsedData = await parseJSON(file);
        break;
      case 'txt':
        // Try to parse as CSV first, then as JSON
        try {
          parsedData = await parseCSV(file);
        } catch {
          parsedData = await parseJSON(file);
        }
        break;
      default:
        throw new Error(`Unsupported file type: ${extension}. Please upload CSV, JSON, or TXT files.`);
    }
    
    // Validate parsed data
    if (!parsedData.rows || parsedData.rows.length === 0) {
      throw new Error('No data rows found in file');
    }
    
    if (!parsedData.columns || parsedData.columns.length === 0) {
      throw new Error('No columns found in file');
    }
    
    // Set file size
    parsedData.fileSize = file.size;
    
    console.log('✅ File parsing completed:', {
      fileName: file.name,
      rows: parsedData.rowCount,
      columns: parsedData.columns.length,
      fileSize: parsedData.fileSize
    });
    
    return parsedData;
  } catch (error) {
    console.error('❌ File parsing failed:', error);
    throw error instanceof Error ? error : new Error('Unknown parsing error');
  }
};

export const parseRawText = async (text: string, format: 'csv' | 'json' = 'csv'): Promise<ParsedData> => {
  console.log('🔍 Parsing raw text data:', { format, length: text.length });
  
  try {
    let parsedData: ParsedData;
    
    if (format === 'csv') {
      const file = new File([text], 'data.csv', { type: 'text/csv' });
      parsedData = await parseCSV(file);
    } else {
      const file = new File([text], 'data.json', { type: 'application/json' });
      parsedData = await parseJSON(file);
    }
    
    console.log('✅ Raw text parsing completed:', {
      rows: parsedData.rowCount,
      columns: parsedData.columns.length
    });
    
    return parsedData;
  } catch (error) {
    console.error('❌ Raw text parsing failed:', error);
    throw error instanceof Error ? error : new Error('Raw text parsing error');
  }
};

export class DataParser {
  static async parseCSV(text: string): Promise<ParsedData> {
    return parseRawText(text, 'csv');
  }
  
  static async parseJSON(text: string): Promise<ParsedData> {
    return parseRawText(text, 'json');
  }
}

export const generateDataInsights = (data: ParsedData): string[] => {
  const insights: string[] = [];
  
  try {
    // Basic insights
    insights.push(`Dataset contains ${data.rowCount.toLocaleString()} rows and ${data.columns.length} columns`);
    
    // Column type analysis
    const columnTypes = data.columns.reduce((acc, col) => {
      acc[col.type] = (acc[col.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(columnTypes).forEach(([type, count]) => {
      insights.push(`Found ${count} ${type} column${count > 1 ? 's' : ''}`);
    });
    
    // Data quality insights
    const sampleSize = Math.min(100, data.rows.length);
    const completeness = data.columns.map(col => {
      const nonEmptyCount = data.rows.slice(0, sampleSize)
        .filter(row => row[col.name] !== null && row[col.name] !== undefined && row[col.name] !== '')
        .length;
      return (nonEmptyCount / sampleSize) * 100;
    });
    
    const avgCompleteness = completeness.reduce((sum, val) => sum + val, 0) / completeness.length;
    insights.push(`Data completeness: ${avgCompleteness.toFixed(1)}%`);
    
    // Specific insights based on data structure
    if (data.summary.possibleUserIdColumns && data.summary.possibleUserIdColumns.length > 0) {
      insights.push(`Potential user identification columns detected: ${data.summary.possibleUserIdColumns.join(', ')}`);
    }
    
    if (data.summary.possibleTimestampColumns && data.summary.possibleTimestampColumns.length > 0) {
      insights.push(`Time-based columns found: ${data.summary.possibleTimestampColumns.join(', ')}`);
    }
    
    console.log('✅ Generated insights:', insights.length);
    return insights;
  } catch (error) {
    console.error('❌ Failed to generate insights:', error);
    return ['Data analysis insights could not be generated'];
  }
};
