
/**
 * Data Analyzer Utility
 * Provides statistical analysis and insights for parsed data
 * Refactored for consistency and maintainability
 */

import { DataColumn, ParsedData } from '../dataParser';

export const analyzeData = (headers: string[], rows: Record<string, any>[]): ParsedData => {
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
      samples: samples.slice(0, 5)
    };
  });
  
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
    rowCount: rows.length,
    fileSize: 0, // Will be set by the parser
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
  
  const booleanSamples = samples.filter(s => 
    s === 'true' || s === 'false' || s === true || s === false ||
    s === 'yes' || s === 'no' || s === 'y' || s === 'n' ||
    s === '1' || s === '0'
  );
  
  if (booleanSamples.length === samples.length) {
    return 'boolean';
  }
  
  const numericSamples = samples.filter(s => {
    const num = Number(s);
    return !isNaN(num) && isFinite(num) && s !== '' && s !== null;
  });
  
  if (numericSamples.length === samples.length) {
    return 'number';
  }
  
  const dateSamples = samples.filter(s => {
    if (typeof s !== 'string') return false;
    
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}/,
      /^\d{2}\/\d{2}\/\d{4}/,
      /^\d{2}-\d{2}-\d{4}/,
      /^\d{4}\/\d{2}\/\d{2}/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    ];
    
    const hasDatePattern = datePatterns.some(pattern => pattern.test(s));
    const parsedDate = new Date(s);
    
    return hasDatePattern && !isNaN(parsedDate.getTime());
  });
  
  if (dateSamples.length === samples.length) {
    return 'date';
  }
  
  return 'string';
};
