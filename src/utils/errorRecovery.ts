/**
 * Error recovery utilities for handling common issues in the analysis pipeline
 */

export interface RecoveryResult {
  success: boolean;
  data?: any;
  error?: string;
  suggestedAction?: string;
}

export const recoverFromDataError = (parsedData: any[]): RecoveryResult => {
  if (!parsedData || !Array.isArray(parsedData)) {
    return {
      success: false,
      error: 'Data is not in array format',
      suggestedAction: 'Please re-upload your files'
    };
  }

  if (parsedData.length === 0) {
    return {
      success: false,
      error: 'No data files found',
      suggestedAction: 'Please upload at least one data file'
    };
  }

  // Try to fix data structure issues
  const recoveredData = parsedData.map(data => {
    if (!data) {
      return null;
    }

    let recovered = { ...data };

    // Fix missing or invalid columnInfo
    if (!recovered.columnInfo || !Array.isArray(recovered.columnInfo)) {
      if (recovered.columns && Array.isArray(recovered.columns)) {
        recovered.columnInfo = recovered.columns.map((col: any) => 
          typeof col === 'string' 
            ? { name: col, type: 'string', samples: [] }
            : { name: col.name || 'unknown', type: col.type || 'string', samples: col.samples || [] }
        );
      } else {
        // Try to infer from data
        const sampleRow = recovered.data?.[0] || {};
        recovered.columnInfo = Object.keys(sampleRow).map(key => ({
          name: key,
          type: 'string',
          samples: []
        }));
      }
    }

    // Fix missing row counts
    if (!recovered.rowCount && !recovered.rows) {
      if (recovered.data && Array.isArray(recovered.data)) {
        recovered.rowCount = recovered.data.length;
        recovered.rows = recovered.data.length;
      }
    }

    // Ensure basic structure
    recovered.rowCount = recovered.rowCount || recovered.rows || 0;
    recovered.rows = recovered.rows || recovered.rowCount || 0;
    recovered.columns = recovered.columns || recovered.columnInfo?.length || 0;

    return recovered;
  }).filter(Boolean);

  const hasValidData = recoveredData.some(data => 
    data && 
    (data.rowCount > 0 || data.rows > 0) && 
    data.columnInfo && 
    data.columnInfo.length > 0
  );

  if (!hasValidData) {
    return {
      success: false,
      error: 'Could not recover valid data structure',
      suggestedAction: 'Please check your file format and try uploading again'
    };
  }

  return {
    success: true,
    data: recoveredData,
    suggestedAction: 'Data structure recovered successfully'
  };
};

export const recoverFromNavigationError = (step: number, formData: any): RecoveryResult => {
  const missingFields: string[] = [];

  switch (step) {
    case 2:
      if (!formData.researchQuestion?.trim()) {
        missingFields.push('research question');
      }
      break;
    
    case 3:
      if (!formData.researchQuestion?.trim()) {
        missingFields.push('research question');
      }
      if (!formData.files || formData.files.length === 0) {
        missingFields.push('data files');
      }
      break;
    
    case 4:
      if (!formData.researchQuestion?.trim()) {
        missingFields.push('research question');
      }
      if (!formData.parsedData || formData.parsedData.length === 0) {
        missingFields.push('processed data');
      }
      break;
  }

  if (missingFields.length > 0) {
    return {
      success: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
      suggestedAction: `Please go back and complete: ${missingFields.join(', ')}`
    };
  }

  return {
    success: true,
    suggestedAction: 'Navigation validation passed'
  };
};

export const tryAutoRecovery = (error: Error, context: any): RecoveryResult => {
  const errorMessage = error.message.toLowerCase();

  // Handle common React errors
  if (errorMessage.includes('objects are not valid as a react child')) {
    return {
      success: false,
      error: 'Data rendering error detected',
      suggestedAction: 'Data contains objects that cannot be displayed. Please check your file format.'
    };
  }

  // Handle file processing errors
  if (errorMessage.includes('file') && errorMessage.includes('invalid')) {
    return {
      success: false,
      error: 'File format error',
      suggestedAction: 'Please ensure your file is in CSV, JSON, or TXT format'
    };
  }

  // Handle analysis errors
  if (errorMessage.includes('analysis') || errorMessage.includes('process')) {
    return {
      success: false,
      error: 'Analysis processing error',
      suggestedAction: 'Please try again with a smaller dataset or different file format'
    };
  }

  return {
    success: false,
    error: error.message,
    suggestedAction: 'Please try refreshing the page and starting over'
  };
};