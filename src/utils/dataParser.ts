
export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
}

export interface ParsedData {
  columns: DataColumn[];
  rows: Record<string, any>[];
  rowCount: number;
  fileSize: number;
}

export class DataParser {
  static parseCSV(csvContent: string): ParsedData {
    // Simple CSV parsing implementation
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      return { columns: [], rows: [], rowCount: 0, fileSize: 0 };
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
      fileSize: csvContent.length
    };
  }
}
