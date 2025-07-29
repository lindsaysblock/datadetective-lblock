/**
 * XLSX Parser Module
 * Handles Excel file parsing using xlsx library
 */

import * as XLSX from 'xlsx';
import type { ParsedData, DataColumn } from '../dataParser';
import { inferColumnTypes } from '../columnTypeInference';

export const parseXLSX = async (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Get the first worksheet
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          throw new Error('No worksheets found in Excel file');
        }
        
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          blankrows: false
        }) as any[][];
        
        if (jsonData.length === 0) {
          throw new Error('No data found in Excel file');
        }
        
        // Extract headers from first row
        const headers = jsonData[0].map(String);
        const dataRows = jsonData.slice(1);
        
        if (dataRows.length === 0) {
          throw new Error('No data rows found in Excel file');
        }
        
        // Convert to record format
        const data: Record<string, any>[] = dataRows.map(row => {
          const record: Record<string, any> = {};
          headers.forEach((header, index) => {
            record[header] = row[index] ?? '';
          });
          return record;
        });
        
        const columns: DataColumn[] = headers.map(name => ({
          name,
          type: 'string', // Will be inferred below
          samples: data.slice(0, 5).map(row => row[name])
        }));

        // Infer column types
        const typedColumns = inferColumnTypes(columns, data);

        const parsedData: ParsedData = {
          columns: typedColumns,
          rows: data,
          rowCount: data.length,
          fileSize: file.size,
          summary: {
            totalRows: data.length,
            totalColumns: headers.length,
            possibleUserIdColumns: headers.filter(name => 
              /id|user|customer|account/i.test(name)
            ),
            possibleEventColumns: headers.filter(name =>
              /event|action|type|category/i.test(name)
            ),
            possibleTimestampColumns: headers.filter(name =>
              /time|date|created|updated|timestamp/i.test(name)
            )
          }
        };

        resolve(parsedData);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('XLSX parsing failed'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};