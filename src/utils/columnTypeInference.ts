/**
 * Column Type Inference Utilities
 * Automatically detects data types for columns
 */

import type { DataColumn } from './dataParser';

export const inferColumnTypes = (
  columns: DataColumn[], 
  data: Record<string, any>[]
): DataColumn[] => {
  return columns.map(column => ({
    ...column,
    type: inferColumnType(column.name, data.map(row => row[column.name]))
  }));
};

const inferColumnType = (columnName: string, values: any[]): 'string' | 'number' | 'date' | 'boolean' => {
  const nonEmptyValues = values.filter(val => 
    val !== null && val !== undefined && val !== ''
  );
  
  if (nonEmptyValues.length === 0) {
    return 'string';
  }
  
  // Check for boolean
  const booleanCount = nonEmptyValues.filter(val => 
    typeof val === 'boolean' || 
    (typeof val === 'string' && /^(true|false|yes|no|1|0)$/i.test(val.trim()))
  ).length;
  
  if (booleanCount / nonEmptyValues.length > 0.8) {
    return 'boolean';
  }
  
  // Check for numbers
  const numberCount = nonEmptyValues.filter(val => {
    if (typeof val === 'number') return true;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      return !isNaN(Number(trimmed)) && trimmed !== '';
    }
    return false;
  }).length;
  
  if (numberCount / nonEmptyValues.length > 0.8) {
    return 'number';
  }
  
  // Check for dates
  const dateCount = nonEmptyValues.filter(val => {
    if (val instanceof Date) return true;
    if (typeof val === 'string') {
      const parsed = Date.parse(val);
      return !isNaN(parsed);
    }
    return false;
  }).length;
  
  if (dateCount / nonEmptyValues.length > 0.8 || 
      /time|date|created|updated|timestamp/i.test(columnName)) {
    return 'date';
  }
  
  return 'string';
};