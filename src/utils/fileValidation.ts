/**
 * File Validation Utilities
 * Handles file type validation, size checks, and security validation
 * Refactored for consistency and maintainability
 */

import { FILE_SIZES } from '@/constants/ui';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileType?: 'csv' | 'json' | 'txt' | 'xlsx' | 'unknown';
}

export const SUPPORTED_FILE_EXTENSIONS = ['csv', 'json', 'txt', 'xlsx', 'xls'];

export const SUPPORTED_MIME_TYPES = [
  'text/csv',
  'application/json',
  'text/json',
  'text/plain',
  'text/txt',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/octet-stream',
  '',  // Empty MIME type
];

/**
 * Validates a file and determines its type based on extension and MIME type
 * Uses extension-first validation for maximum compatibility
 */
export const validateFile = (file: File): FileValidationResult => {
  if (!file) {
    return {
      isValid: false,
      error: 'File is required'
    };
  }

  if (!file.name) {
    return {
      isValid: false,
      error: 'File name is missing'
    };
  }

  // Get file extension (primary method)
  const extension = file.name?.split('.').pop()?.toLowerCase();
  
  if (!extension) {
    return {
      isValid: false,
      error: 'File must have an extension'
    };
  }

  // Validate extension
  if (!SUPPORTED_FILE_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: `File type .${extension} is not supported. Supported types: ${SUPPORTED_FILE_EXTENSIONS.join(', ')}`
    };
  }

  // Determine file type based on extension (most reliable)
  let fileType: 'csv' | 'json' | 'txt' | 'xlsx' | 'unknown' = 'unknown';
  
  switch (extension) {
    case 'csv':
      fileType = 'csv';
      break;
    case 'json':
      fileType = 'json';
      break;
    case 'txt':
      fileType = 'txt';
      break;
    case 'xlsx':
    case 'xls':
      fileType = 'xlsx';
      break;
    default:
      fileType = 'unknown';
  }

  // File size check (100MB limit)
  const maxSizeBytes = FILE_SIZES.MAX_FILE_SIZE;
  if (file.size > maxSizeBytes) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size (${fileSizeMB}MB) exceeds limit of ${FILE_SIZES.MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  return {
    isValid: true,
    fileType
  };
};

/**
 * Validates multiple files
 */
export const validateFiles = (files: File[]): { validFiles: File[]; errors: string[] } => {
  const validFiles: File[] = [];
  const errors: string[] = [];

  files.forEach((file, index) => {
    const validation = validateFile(file);
    if (validation.isValid) {
      validFiles.push(file);
    } else {
      errors.push(`File ${index + 1} (${file?.name || 'unknown'}): ${validation.error}`);
    }
  });

  return { validFiles, errors };
};

/**
 * Creates proper MIME type accept strings for file inputs
 */
export const getAcceptString = (): string => {
  return '.csv,.json,.txt,.xlsx,.xls';
};

/**
 * Creates proper dropzone accept configuration
 */
export const getDropzoneAccept = () => {
  return {
    'text/csv': ['.csv'],
    'application/json': ['.json'],
    'text/json': ['.json'],
    'text/plain': ['.txt'],
    'text/txt': ['.txt'],
    'application/vnd.ms-excel': ['.csv', '.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/octet-stream': ['.csv', '.json', '.txt'],
  };
};

/**
 * Determines if file content looks like CSV based on extension and content analysis
 */
export const isCSVLikeContent = (file: File, content?: string): boolean => {
  const extension = file.name?.split('.').pop()?.toLowerCase();
  
  // If it's a .csv file, it's CSV
  if (extension === 'csv') {
    return true;
  }
  
  // If it's a .txt file, check if content looks like CSV
  if (extension === 'txt' && content) {
    const firstLine = content.split('\n')[0] || '';
    return firstLine.includes(',') && firstLine.split(',').length > 1;
  }
  
  return false;
};

export default {
  validateFile,
  validateFiles,
  getAcceptString,
  getDropzoneAccept,
  isCSVLikeContent,
  SUPPORTED_FILE_EXTENSIONS,
  SUPPORTED_MIME_TYPES
};