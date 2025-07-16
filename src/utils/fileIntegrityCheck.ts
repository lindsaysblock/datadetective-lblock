/**
 * File corruption detection utilities
 * Enhanced validation to catch corrupted files early
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
  fileType?: 'csv' | 'json' | 'txt' | 'xlsx';
  corruption?: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    details: string;
  };
}

/**
 * Enhanced file validation with corruption detection
 */
export const validateFileIntegrity = async (file: File): Promise<FileValidationResult> => {
  const result: FileValidationResult = {
    isValid: true,
    warnings: []
  };

  try {
    // Basic validation
    if (!file || file.size === 0) {
      return { isValid: false, error: 'File is empty or corrupted' };
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return { isValid: false, error: 'File too large (max 50MB)' };
    }

    // Read file content for analysis
    const content = await readFileContent(file);
    
    // Detect file type
    const fileType = detectFileType(file, content);
    result.fileType = fileType;

    // Check for corruption based on file type
    const corruptionCheck = await checkFileCorruption(file, content, fileType);
    if (corruptionCheck.isCorrupted) {
      result.corruption = corruptionCheck.corruption;
      if (corruptionCheck.corruption.severity === 'high') {
        return { 
          isValid: false, 
          error: `File appears to be corrupted: ${corruptionCheck.corruption.details}`
        };
      } else {
        result.warnings?.push(corruptionCheck.corruption.details);
      }
    }

    // Content validation
    const contentValidation = validateFileContent(content, fileType);
    if (!contentValidation.isValid) {
      return { isValid: false, error: contentValidation.error || 'Content validation failed' };
    }

    if (contentValidation.warnings) {
      result.warnings?.push(...contentValidation.warnings);
    }

    return result;

  } catch (error) {
    return { 
      isValid: false, 
      error: `Failed to validate file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Read file content safely
 */
const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsText(file, 'utf-8');
  });
};

/**
 * Detect file type from extension and content
 */
const detectFileType = (file: File, content: string): 'csv' | 'json' | 'txt' | 'xlsx' => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'json' || (content.trim().startsWith('{') || content.trim().startsWith('['))) {
    return 'json';
  }
  
  if (extension === 'xlsx' || extension === 'xls') {
    return 'xlsx';
  }
  
  if (extension === 'csv' || content.includes(',')) {
    return 'csv';
  }
  
  return 'txt';
};

/**
 * Check for file corruption based on type
 */
const checkFileCorruption = async (file: File, content: string, fileType: string) => {
  const result = {
    isCorrupted: false,
    corruption: {
      type: '',
      severity: 'low' as 'low' | 'medium' | 'high',
      details: ''
    }
  };

  // Check for common corruption indicators
  if (content.length === 0) {
    result.isCorrupted = true;
    result.corruption = {
      type: 'empty',
      severity: 'high',
      details: 'File appears to be empty'
    };
    return result;
  }

  // Check for binary data in text files
  if (fileType !== 'xlsx' && containsBinaryData(content)) {
    result.isCorrupted = true;
    result.corruption = {
      type: 'binary_in_text',
      severity: 'high',
      details: 'File contains binary data and may be corrupted'
    };
    return result;
  }

  // File type specific checks
  switch (fileType) {
    case 'csv':
      return checkCSVCorruption(content);
    case 'json':
      return checkJSONCorruption(content);
    default:
      return result;
  }
};

/**
 * Check if content contains binary data
 */
const containsBinaryData = (content: string): boolean => {
  // Check for null bytes and other control characters
  const controlChars = /[\x00-\x08\x0E-\x1F\x7F]/g;
  const matches = content.match(controlChars);
  return matches ? matches.length > content.length * 0.01 : false; // More than 1% control chars
};

/**
 * Check CSV file for corruption
 */
const checkCSVCorruption = (content: string) => {
  const result = {
    isCorrupted: false,
    corruption: {
      type: '',
      severity: 'low' as const,
      details: ''
    }
  };

  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length < 2) {
    result.isCorrupted = true;
    result.corruption = {
      type: 'insufficient_data',
      severity: 'medium',
      details: 'CSV file has fewer than 2 lines of data'
    };
    return result;
  }

  // Check header consistency
  const headerCols = lines[0].split(',').length;
  let inconsistentRows = 0;
  
  for (let i = 1; i < Math.min(lines.length, 10); i++) {
    const cols = lines[i].split(',').length;
    if (Math.abs(cols - headerCols) > headerCols * 0.2) { // More than 20% difference
      inconsistentRows++;
    }
  }

  if (inconsistentRows > 3) {
    result.isCorrupted = true;
    result.corruption = {
      type: 'inconsistent_structure',
      severity: 'medium',
      details: 'CSV has inconsistent column structure - may be corrupted'
    };
  }

  return result;
};

/**
 * Check JSON file for corruption
 */
const checkJSONCorruption = (content: string) => {
  const result = {
    isCorrupted: false,
    corruption: {
      type: '',
      severity: 'low' as const,
      details: ''
    }
  };

  try {
    JSON.parse(content);
  } catch (error) {
    result.isCorrupted = true;
    result.corruption = {
      type: 'invalid_json',
      severity: 'high',
      details: 'JSON file is malformed and cannot be parsed'
    };
  }

  return result;
};

/**
 * Validate file content structure
 */
const validateFileContent = (content: string, fileType: string) => {
  const result = {
    isValid: true,
    warnings: [] as string[]
  };

  // Check minimum content requirements
  if (content.trim().length < 10) {
    return { isValid: false, error: 'File content is too short to be valid data' };
  }

  // Check for suspicious patterns
  if (content.includes('404 Not Found') || content.includes('<html>')) {
    return { isValid: false, error: 'File appears to contain HTML/error content instead of data' };
  }

  // File type specific validation
  switch (fileType) {
    case 'csv':
      return validateCSVContent(content);
    case 'json':
      return validateJSONContent(content);
    default:
      return result;
  }
};

/**
 * Validate CSV content structure
 */
const validateCSVContent = (content: string) => {
  const result = { isValid: true, warnings: [] as string[] };
  
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    return { isValid: false, error: 'CSV file is empty' };
  }

  // Check for headers
  const firstLine = lines[0];
  if (!firstLine.includes(',')) {
    result.warnings.push('CSV may not have proper comma separation');
  }

  // Check data rows
  if (lines.length < 2) {
    result.warnings.push('CSV has no data rows, only headers');
  }

  return result;
};

/**
 * Validate JSON content structure
 */
const validateJSONContent = (content: string) => {
  const result = { isValid: true, warnings: [] as string[] };
  
  try {
    const parsed = JSON.parse(content);
    
    if (!Array.isArray(parsed) && typeof parsed !== 'object') {
      result.warnings.push('JSON contains primitive data instead of structured data');
    }
    
    if (Array.isArray(parsed) && parsed.length === 0) {
      result.warnings.push('JSON array is empty');
    }
    
  } catch (error) {
    return { isValid: false, error: 'Invalid JSON format' };
  }
  
  return result;
};