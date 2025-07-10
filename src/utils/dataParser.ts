
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
import { parseCSV } from './parsers/csvParser';
import { parseJSON } from './parsers/jsonParser';
import { analyzeData } from './parsers/dataAnalyzer';
import { generateDataInsights } from './parsers/insightsGenerator';

export const parseFile = async (file: File): Promise<ParsedData> => {
  console.log(`Starting to parse file: ${file.name}, size: ${file.size} bytes`);
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  try {
    let result: { headers: string[]; rows: Record<string, any>[] };
    
    switch (extension) {
      case 'csv':
        result = await parseCSV(file);
        break;
      case 'json':
        result = await parseJSON(file);
        break;
      case 'txt':
        result = await parseTextFile(file);
        break;
      default:
        console.log(`Unknown extension ${extension}, trying to parse as text`);
        result = await parseTextFile(file);
        break;
    }
    
    return analyzeData(result.headers, result.rows);
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
    
    const headers = result.data.length > 0 ? Object.keys(result.data[0]) : [];
    return analyzeData(headers, result.data);
  } catch (error) {
    console.error('Error in parseRawText:', error);
    throw error;
  }
};

const parseTextFile = async (file: File): Promise<{ headers: string[]; rows: Record<string, any>[] }> => {
  console.log('Parsing text file');
  
  const text = await file.text();
  const parsedData = parseRawText(text);
  
  return {
    headers: parsedData.columns.map(col => col.name),
    rows: parsedData.rows
  };
};

export { generateDataInsights };
