
export interface UnstructuredDataResult {
  success: boolean;
  data?: any[];
  error?: string;
  detectedFormat?: 'csv' | 'json' | 'tsv' | 'delimited' | 'key-value' | 'list';
}

export const parseUnstructuredData = (rawText: string): UnstructuredDataResult => {
  if (!rawText.trim()) {
    return { success: false, error: 'No data provided' };
  }

  // Try different parsing strategies
  const strategies = [
    () => parseAsJSON(rawText),
    () => parseAsCSV(rawText),
    () => parseAsTSV(rawText),
    () => parseAsDelimited(rawText),
    () => parseAsKeyValue(rawText),
    () => parseAsList(rawText)
  ];

  for (const strategy of strategies) {
    const result = strategy();
    if (result.success) {
      return result;
    }
  }

  return { success: false, error: 'Unable to parse data. Please check the format and try again.' };
};

const parseAsJSON = (text: string): UnstructuredDataResult => {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return { success: true, data: parsed, detectedFormat: 'json' };
    } else if (typeof parsed === 'object') {
      return { success: true, data: [parsed], detectedFormat: 'json' };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
};

const parseAsCSV = (text: string): UnstructuredDataResult => {
  try {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return { success: false };

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    return { success: true, data, detectedFormat: 'csv' };
  } catch {
    return { success: false };
  }
};

const parseAsTSV = (text: string): UnstructuredDataResult => {
  try {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return { success: false };

    const headers = lines[0].split('\t').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const values = line.split('\t').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    return { success: true, data, detectedFormat: 'tsv' };
  } catch {
    return { success: false };
  }
};

const parseAsDelimited = (text: string): UnstructuredDataResult => {
  try {
    // Try common delimiters
    const delimiters = ['|', ';', ':', '\t'];
    
    for (const delimiter of delimiters) {
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length < 2) continue;

      const firstLine = lines[0];
      if (firstLine.includes(delimiter)) {
        const headers = firstLine.split(delimiter).map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(delimiter).map(v => v.trim());
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });

        return { success: true, data, detectedFormat: 'delimited' };
      }
    }

    return { success: false };
  } catch {
    return { success: false };
  }
};

const parseAsKeyValue = (text: string): UnstructuredDataResult => {
  try {
    const lines = text.split('\n').filter(line => line.trim());
    const data: any[] = [];
    let currentRecord: any = {};

    for (const line of lines) {
      if (line.includes(':') || line.includes('=')) {
        const separator = line.includes(':') ? ':' : '=';
        const [key, ...valueParts] = line.split(separator);
        const value = valueParts.join(separator).trim();
        
        if (key.trim()) {
          currentRecord[key.trim()] = value;
        }
      } else if (line.trim() === '' && Object.keys(currentRecord).length > 0) {
        data.push(currentRecord);
        currentRecord = {};
      }
    }

    if (Object.keys(currentRecord).length > 0) {
      data.push(currentRecord);
    }

    return data.length > 0 ? { success: true, data, detectedFormat: 'key-value' } : { success: false };
  } catch {
    return { success: false };
  }
};

const parseAsList = (text: string): UnstructuredDataResult => {
  try {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { success: false };

    const data = lines.map((line, index) => ({
      id: index + 1,
      value: line.trim()
    }));

    return { success: true, data, detectedFormat: 'list' };
  } catch {
    return { success: false };
  }
};
