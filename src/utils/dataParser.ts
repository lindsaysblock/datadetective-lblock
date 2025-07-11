
export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  samples?: any[];
}

export interface ParsedData {
  columns: DataColumn[];
  rows: Record<string, any>[];
  rowCount: number;
  fileSize: number;
  summary?: {
    totalRows: number;
    totalColumns: number;
    possibleUserIdColumns?: string[];
    possibleEventColumns?: string[];
    possibleTimestampColumns?: string[];
  };
}

export class DataParser {
  static parseCSV(csvContent: string): ParsedData {
    // Simple CSV parsing implementation
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      return { 
        columns: [], 
        rows: [], 
        rowCount: 0, 
        fileSize: 0,
        summary: {
          totalRows: 0,
          totalColumns: 0
        }
      };
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const columns: DataColumn[] = headers.map(header => ({
      name: header,
      type: 'string' // Default type, could be enhanced with type detection
    }));

    const rows = lines.slice(1).map(line => {
      const values = line.split(',');
      const row: Record<string, any> = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || '';
      });
      return row;
    });

    return {
      columns,
      rows,
      rowCount: rows.length,
      fileSize: csvContent.length,
      summary: {
        totalRows: rows.length,
        totalColumns: headers.length
      }
    };
  }
}

// Export functions that other files are trying to import
export const parseFile = async (file: File): Promise<ParsedData> => {
  const text = await file.text();
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExtension === 'csv') {
    return DataParser.parseCSV(text);
  } else if (fileExtension === 'json') {
    const data = JSON.parse(text);
    const array = Array.isArray(data) ? data : [data];
    const headers = array.length > 0 ? Object.keys(array[0]) : [];
    
    return {
      columns: headers.map(header => ({ name: header, type: 'string' })),
      rows: array,
      rowCount: array.length,
      fileSize: file.size,
      summary: {
        totalRows: array.length,
        totalColumns: headers.length
      }
    };
  }
  
  throw new Error('Unsupported file type');
};

export const parseRawText = (text: string): ParsedData => {
  return DataParser.parseCSV(text);
};

export const generateDataInsights = (data: ParsedData): string[] => {
  const insights: string[] = [];
  
  if (data.summary) {
    insights.push(`Dataset contains ${data.summary.totalRows} rows and ${data.summary.totalColumns} columns`);
    
    if (data.summary.possibleUserIdColumns && data.summary.possibleUserIdColumns.length > 0) {
      insights.push(`Potential user ID columns: ${data.summary.possibleUserIdColumns.join(', ')}`);
    }
    
    if (data.summary.possibleEventColumns && data.summary.possibleEventColumns.length > 0) {
      insights.push(`Potential event columns: ${data.summary.possibleEventColumns.join(', ')}`);
    }
  }
  
  return insights;
};
