
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
  console.log(`Starting to parse file: ${file.name}, size: ${file.size} bytes`);
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  try {
    switch (extension) {
      case 'csv':
        return await parseCSV(file);
      case 'json':
        return await parseJSON(file);
      case 'txt':
        return await parseTextFile(file);
      default:
        console.log(`Unknown extension ${extension}, trying to parse as text`);
        return await parseTextFile(file);
    }
  } catch (error) {
    console.error(`Error parsing file ${file.name}:`, error);
    throw new Error(`Failed to parse ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const parseRawText = (text: string): ParsedData => {
  console.log('Parsing raw text data, length:', text.length);
  
  if (!text || text.trim().length === 0) {
    throw new Error('Text data is empty');
  }

  try {
    const result = parseUnstructuredData(text);
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to parse data');
    }

    console.log('Successfully parsed unstructured data:', result.data.length, 'rows');
    
    // Convert unstructured result to ParsedData format
    const headers = result.data.length > 0 ? Object.keys(result.data[0]) : [];
    return analyzeData(headers, result.data);
  } catch (error) {
    console.error('Error in parseRawText:', error);
    throw error;
  }
};

const parseCSV = async (file: File): Promise<ParsedData> => {
  console.log('Parsing CSV file');
  
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }
  
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header and one data row');
  }
  
  // More robust CSV parsing
  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result.map(field => field.replace(/^"|"$/g, ''));
  };
  
  const headers = parseCSVLine(lines[0]);
  console.log('CSV headers:', headers);
  
  const dataRows = lines.slice(1).map((line, index) => {
    try {
      const values = parseCSVLine(line);
      const row: Record<string, any> = {};
      
      headers.forEach((header, headerIndex) => {
        row[header] = values[headerIndex] || '';
      });
      
      return row;
    } catch (error) {
      console.warn(`Error parsing CSV line ${index + 2}:`, error);
      return null;
    }
  }).filter(row => row !== null);
  
  console.log(`Parsed ${dataRows.length} CSV rows`);
  return analyzeData(headers, dataRows as Record<string, any>[]);
};

const parseJSON = async (file: File): Promise<ParsedData> => {
  console.log('Parsing JSON file');
  
  const text = await file.text();
  
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
  
  // Handle different JSON structures
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error('JSON array is empty');
    }
    console.log(`JSON contains ${data.length} items`);
  } else if (typeof data === 'object' && data !== null) {
    // Convert single object to array
    data = [data];
    console.log('Converted single JSON object to array');
  } else {
    throw new Error('JSON must contain an object or array of objects');
  }
  
  // Ensure all items are objects
  const validData = data.filter(item => typeof item === 'object' && item !== null);
  if (validData.length === 0) {
    throw new Error('No valid objects found in JSON data');
  }
  
  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  validData.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key));
  });
  
  const headers = Array.from(allKeys);
  console.log('JSON headers:', headers);
  
  return analyzeData(headers, validData);
};

const parseTextFile = async (file: File): Promise<ParsedData> => {
  console.log('Parsing text file');
  
  const text = await file.text();
  return parseRawText(text);
};

const analyzeData = (headers: string[], rows: Record<string, any>[]): ParsedData => {
  console.log(`Analyzing data: ${headers.length} columns, ${rows.length} rows`);
  
  if (headers.length === 0) {
    throw new Error('No columns found in data');
  }
  
  if (rows.length === 0) {
    throw new Error('No data rows found');
  }
  
  const columns: DataColumn[] = headers.map(header => {
    const samples = rows.slice(0, Math.min(10, rows.length))
      .map(row => row[header])
      .filter(value => value !== null && value !== undefined && value !== '');
    
    const type = inferColumnType(samples);
    
    return {
      name: header,
      type,
      samples: samples.slice(0, 5) // Limit samples for performance
    };
  });
  
  // Enhanced pattern detection
  const possibleUserIdColumns = headers.filter(h => {
    const lowerHeader = h.toLowerCase();
    return /user|customer|client|account|member|person/i.test(lowerHeader) || 
           /^(id|uid|uuid|user_id|customer_id)$/i.test(lowerHeader) ||
           /_id$/.test(lowerHeader);
  });
  
  const possibleEventColumns = headers.filter(h => {
    const lowerHeader = h.toLowerCase();
    return /event|action|activity|behavior|click|view|visit|session|page|interaction/i.test(lowerHeader);
  });
  
  const possibleTimestampColumns = headers.filter(h => {
    const lowerHeader = h.toLowerCase();
    return /time|date|timestamp|created|updated|occurred|when|at$/i.test(lowerHeader) ||
           columns.find(col => col.name === h)?.type === 'date';
  });
  
  console.log('Analysis complete:', {
    totalRows: rows.length,
    totalColumns: headers.length,
    possibleUserIdColumns,
    possibleEventColumns,
    possibleTimestampColumns
  });
  
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
  
  // Check for boolean values first
  const booleanSamples = samples.filter(s => 
    s === 'true' || s === 'false' || s === true || s === false ||
    s === 'yes' || s === 'no' || s === 'y' || s === 'n' ||
    s === '1' || s === '0'
  );
  
  if (booleanSamples.length === samples.length) {
    return 'boolean';
  }
  
  // Check for numeric values
  const numericSamples = samples.filter(s => {
    const num = Number(s);
    return !isNaN(num) && isFinite(num) && s !== '' && s !== null;
  });
  
  if (numericSamples.length === samples.length) {
    return 'number';
  }
  
  // Check for date values
  const dateSamples = samples.filter(s => {
    if (typeof s !== 'string') return false;
    
    // Common date patterns
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY
      /^\d{2}-\d{2}-\d{4}/, // MM-DD-YYYY
      /^\d{4}\/\d{2}\/\d{2}/, // YYYY/MM/DD
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO datetime
    ];
    
    const hasDatePattern = datePatterns.some(pattern => pattern.test(s));
    const parsedDate = new Date(s);
    
    return hasDatePattern && !isNaN(parsedDate.getTime());
  });
  
  if (dateSamples.length === samples.length) {
    return 'date';
  }
  
  // Default to string
  return 'string';
};

export const generateDataInsights = (data: ParsedData): string[] => {
  console.log('Generating data insights');
  
  const insights: string[] = [];
  
  // Data structure insights
  if (data.summary.possibleUserIdColumns.length > 0) {
    insights.push(`🆔 Found ${data.summary.possibleUserIdColumns.length} potential user ID column(s): ${data.summary.possibleUserIdColumns.join(', ')}`);
  }
  
  if (data.summary.possibleEventColumns.length > 0) {
    insights.push(`📊 Found ${data.summary.possibleEventColumns.length} potential event/activity column(s): ${data.summary.possibleEventColumns.join(', ')}`);
  }
  
  if (data.summary.possibleTimestampColumns.length > 0) {
    insights.push(`⏰ Found ${data.summary.possibleTimestampColumns.length} potential timestamp column(s): ${data.summary.possibleTimestampColumns.join(', ')}`);
  }
  
  // Data type insights
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
  
  // Data quality insights
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
