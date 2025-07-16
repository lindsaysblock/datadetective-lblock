/**
 * Data validation helper utilities for ensuring data integrity across the analysis pipeline
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateAnalysisData = (parsedData: any[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!parsedData || !Array.isArray(parsedData)) {
    errors.push('Parsed data must be an array');
    return { isValid: false, errors, warnings };
  }

  if (parsedData.length === 0) {
    errors.push('No data files provided');
    return { isValid: false, errors, warnings };
  }

  for (let i = 0; i < parsedData.length; i++) {
    const data = parsedData[i];
    const filePrefix = `File ${i + 1} (${data?.name || 'unknown'})`;

    // Check basic structure
    if (!data) {
      errors.push(`${filePrefix}: Data is null or undefined`);
      continue;
    }

    // Check row count
    if (!data.rowCount && !data.rows) {
      errors.push(`${filePrefix}: No row count specified`);
    } else if ((data.rowCount || data.rows) <= 0) {
      errors.push(`${filePrefix}: Empty dataset (${data.rowCount || data.rows} rows)`);
    }

    // Check column information
    if (!data.columnInfo) {
      errors.push(`${filePrefix}: Missing column information`);
    } else if (!Array.isArray(data.columnInfo)) {
      errors.push(`${filePrefix}: Column info must be an array`);
    } else if (data.columnInfo.length === 0) {
      errors.push(`${filePrefix}: No columns defined`);
    } else {
      // Validate each column
      data.columnInfo.forEach((col: any, colIndex: number) => {
        if (typeof col === 'string') {
          warnings.push(`${filePrefix}: Column ${colIndex} is a string, expected object with name/type`);
        } else if (typeof col === 'object') {
          if (!col.name) {
            errors.push(`${filePrefix}: Column ${colIndex} missing name`);
          }
          if (!col.type) {
            warnings.push(`${filePrefix}: Column ${colIndex} (${col.name}) missing type, defaulting to string`);
          }
        } else {
          errors.push(`${filePrefix}: Column ${colIndex} has invalid format`);
        }
      });
    }

    // Check data array
    if (!data.data || !Array.isArray(data.data)) {
      errors.push(`${filePrefix}: Missing or invalid data array`);
    } else if (data.data.length === 0) {
      warnings.push(`${filePrefix}: Data array is empty`);
    }

    // Check for reasonable data size
    const rowCount = data.rowCount || data.rows || 0;
    if (rowCount > 1000000) {
      warnings.push(`${filePrefix}: Large dataset (${rowCount.toLocaleString()} rows) may impact performance`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const sanitizeDataForAnalysis = (parsedData: any[]): any[] => {
  if (!parsedData || !Array.isArray(parsedData)) {
    return [];
  }

  return parsedData.map(data => {
    if (!data) return null;

    // Ensure columnInfo is properly formatted
    let columnInfo = data.columnInfo || [];
    if (Array.isArray(columnInfo)) {
      columnInfo = columnInfo.map((col: any) => {
        if (typeof col === 'string') {
          return { name: col, type: 'string', samples: [] };
        } else if (typeof col === 'object' && col.name) {
          return {
            name: col.name,
            type: col.type || 'string',
            samples: col.samples || []
          };
        } else {
          return { name: String(col), type: 'string', samples: [] };
        }
      });
    }

    // Ensure basic required fields
    return {
      ...data,
      rowCount: data.rowCount || data.rows || 0,
      rows: data.rows || data.rowCount || 0,
      columns: data.columns || columnInfo.length || 0,
      columnInfo,
      data: data.data || [],
      summary: data.summary || {
        totalRows: data.rowCount || data.rows || 0,
        totalColumns: columnInfo.length || 0,
        possibleUserIdColumns: [],
        possibleEventColumns: [],
        possibleTimestampColumns: []
      }
    };
  }).filter(Boolean);
};

export const validateStepProgression = (step: number, formData: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  switch (step) {
    case 1:
      if (!formData.researchQuestion?.trim()) {
        errors.push('Research question is required');
      }
      break;
    
    case 2:
      if (!formData.researchQuestion?.trim()) {
        errors.push('Research question is required');
      }
      if (!formData.files || formData.files.length === 0) {
        errors.push('At least one data file must be uploaded');
      }
      break;
    
    case 3:
      if (!formData.researchQuestion?.trim()) {
        errors.push('Research question is required');
      }
      if (!formData.parsedData || formData.parsedData.length === 0) {
        errors.push('Data must be processed before proceeding');
      }
      break;
    
    case 4:
      if (!formData.projectName?.trim()) {
        errors.push('Project name is required');
      }
      if (!formData.researchQuestion?.trim()) {
        errors.push('Research question is required');
      }
      
      const validation = validateAnalysisData(formData.parsedData);
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};