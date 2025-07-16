
/**
 * Data Column Helper
 * Utility functions for creating and managing data columns
 */

import { DataColumn } from './dataParser';

/** Data column helper constants */
const COLUMN_CONSTANTS = {
  DEFAULT_SAMPLES: {
    string: ['sample_value_1', 'sample_value_2', 'sample_value_3'],
    number: [1, 2, 3, 4, 5],
    date: ['2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z'],
    boolean: [true, false]
  }
} as const;

/**
 * Creates a data column with specified parameters
 * Provides default samples if none are provided
 */
export const createDataColumn = (
  name: string, 
  type: 'string' | 'number' | 'date' | 'boolean', 
  samples: any[] = []
): DataColumn => ({
  name,
  type,
  samples: samples.length > 0 ? samples : getDefaultSamples(type)
});

/**
 * Gets default samples for a given data type
 */
const getDefaultSamples = (type: 'string' | 'number' | 'date' | 'boolean'): any[] => {
  return COLUMN_CONSTANTS.DEFAULT_SAMPLES[type] || [];
};

/**
 * Creates multiple data columns from column definitions
 * Batch creation utility for data column setup
 */
export const createDataColumns = (columnDefs: Array<{
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  samples?: any[];
}>): DataColumn[] => {
  return columnDefs.map(def => createDataColumn(def.name, def.type, def.samples));
};
