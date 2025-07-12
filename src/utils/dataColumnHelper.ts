
import { DataColumn } from './dataParser';

export const createDataColumn = (
  name: string, 
  type: 'string' | 'number' | 'date' | 'boolean', 
  samples: any[] = []
): DataColumn => ({
  name,
  type,
  samples: samples.length > 0 ? samples : getDefaultSamples(type)
});

const getDefaultSamples = (type: 'string' | 'number' | 'date' | 'boolean'): any[] => {
  switch (type) {
    case 'string':
      return ['sample_value_1', 'sample_value_2', 'sample_value_3'];
    case 'number':
      return [1, 2, 3, 4, 5];
    case 'date':
      return ['2024-01-01T00:00:00.000Z', '2024-01-02T00:00:00.000Z'];
    case 'boolean':
      return [true, false];
    default:
      return [];
  }
};

export const createDataColumns = (columnDefs: Array<{
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  samples?: any[];
}>): DataColumn[] => {
  return columnDefs.map(def => createDataColumn(def.name, def.type, def.samples));
};
