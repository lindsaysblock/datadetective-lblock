export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  samples: any[];
}

export interface ParsedData {
  columns: DataColumn[];
  rows: Record<string, any>[];
  summary: {
    totalRows: number;
    totalColumns: number;
    possibleUserIdColumns: string[];
    possibleEventColumns: string[];
    possibleTimestampColumns: string[];
  };
}

import { parseUnstructuredData } from './unstructuredDataParser';

export const parseFile = async (file: File): Promise<ParsedData> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'csv':
      return await parseCSV(file);
    case 'json':
      return await parseJSON(file);
    case 'txt':
      return await parseTextFile(file);
    default:
      // Try to parse as text for unknown extensions
      return await parseTextFile(file);
  }
};

export const parseRawText = (text: string): ParsedData => {
  const result = parseUnstructuredData(text);
  
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to parse data');
  }

  // Convert unstructured result to ParsedData format
  const headers = result.data.length > 0 ? Object.keys(result.data[0]) : [];
  return analyzeData(headers, result.data);
};

const parseCSV = async (file: File): Promise<ParsedData> => {
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('File is empty');
  }
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const dataRows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: Record<string, any> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
  
  return analyzeData(headers, dataRows);
};

const parseJSON = async (file: File): Promise<ParsedData> => {
  const text = await file.text();
  const data = JSON.parse(text);
  
  if (!Array.isArray(data)) {
    throw new Error('JSON file must contain an array of objects');
  }
  
  if (data.length === 0) {
    throw new Error('JSON array is empty');
  }
  
  const headers = Object.keys(data[0]);
  return analyzeData(headers, data);
};

const parseTextFile = async (file: File): Promise<ParsedData> => {
  const text = await file.text();
  return parseRawText(text);
};

const analyzeData = (headers: string[], rows: Record<string, any>[]): ParsedData => {
  const columns: DataColumn[] = headers.map(header => {
    const samples = rows.slice(0, 5).map(row => row[header]);
    const type = inferColumnType(samples);
    
    return {
      name: header,
      type,
      samples: samples.filter(s => s !== null && s !== undefined && s !== '')
    };
  });
  
  // Identify potential user behavior columns
  const possibleUserIdColumns = headers.filter(h => 
    /user|customer|client|account|member/i.test(h) || 
    /id|uid|uuid/i.test(h)
  );
  
  const possibleEventColumns = headers.filter(h => 
    /event|action|activity|behavior|click|view|visit/i.test(h)
  );
  
  const possibleTimestampColumns = headers.filter(h => 
    /time|date|timestamp|created|updated|occurred/i.test(h)
  );
  
  return {
    columns,
    rows,
    summary: {
      totalRows: rows.length,
      totalColumns: headers.length,
      possibleUserIdColumns,
      possibleEventColumns,
      possibleTimestampColumns
    }
  };
};

const inferColumnType = (samples: any[]): 'string' | 'number' | 'date' | 'boolean' => {
  if (samples.length === 0) return 'string';
  
  // Check if all samples are numbers
  if (samples.every(s => !isNaN(Number(s)) && s !== '')) {
    return 'number';
  }
  
  // Check if all samples are dates
  if (samples.every(s => !isNaN(Date.parse(s)))) {
    return 'date';
  }
  
  // Check if all samples are booleans
  if (samples.every(s => s === 'true' || s === 'false' || s === true || s === false)) {
    return 'boolean';
  }
  
  return 'string';
};

export const generateDataInsights = (data: ParsedData): string[] => {
  const insights: string[] = [];
  
  if (data.summary.possibleUserIdColumns.length > 0) {
    insights.push(`🆔 Found potential user ID columns: ${data.summary.possibleUserIdColumns.join(', ')}`);
  }
  
  if (data.summary.possibleEventColumns.length > 0) {
    insights.push(`📊 Found potential event/activity columns: ${data.summary.possibleEventColumns.join(', ')}`);
  }
  
  if (data.summary.possibleTimestampColumns.length > 0) {
    insights.push(`⏰ Found potential timestamp columns: ${data.summary.possibleTimestampColumns.join(', ')}`);
  }
  
  const numericColumns = data.columns.filter(c => c.type === 'number').length;
  if (numericColumns > 0) {
    insights.push(`🔢 Found ${numericColumns} numeric columns for analysis`);
  }
  
  insights.push(`📈 Dataset contains ${data.summary.totalRows} rows and ${data.summary.totalColumns} columns`);
  
  return insights;
};
