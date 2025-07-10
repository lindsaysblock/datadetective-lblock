
import { DataColumn, ParsedData } from '../dataParser';

export const parseCSV = async (file: File): Promise<ParsedData> => {
  console.log('Parsing CSV file');
  
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }
  
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header and one data row');
  }
  
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
  return { headers, rows: dataRows as Record<string, any>[] };
};
