
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const simulateFileUpload = async (filename: string, content: string, type: string = 'text/csv'): Promise<File> => {
  await delay(100); // Simulate network delay
  return new File([content], filename, { type });
};

export const simulateNetworkError = (): Promise<never> => {
  return Promise.reject(new Error('Simulated network error'));
};

export const simulateTimeout = (ms: number = 5000): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), ms);
  });
};

export const simulateDatabaseConnection = async (connectionString: string): Promise<boolean> => {
  await delay(200);
  
  if (!connectionString || connectionString.length < 10) {
    throw new Error('Invalid connection string');
  }
  
  if (connectionString.includes('timeout')) {
    throw new Error('Database connection timeout');
  }
  
  return true;
};

export const simulateAPICall = async (endpoint: string, data?: any): Promise<any> => {
  await delay(150);
  
  if (endpoint.includes('error')) {
    throw new Error('API call failed');
  }
  
  return {
    success: true,
    data: data || { message: 'API call successful' },
    timestamp: new Date().toISOString()
  };
};

export const measurePerformance = async <T>(operation: () => Promise<T>): Promise<{ result: T; duration: number; memoryUsed: number }> => {
  const startTime = performance.now();
  const startMemory = getMemoryUsage();
  
  const result = await operation();
  
  const endTime = performance.now();
  const endMemory = getMemoryUsage();
  
  return {
    result,
    duration: endTime - startTime,
    memoryUsed: endMemory - startMemory
  };
};

export const getMemoryUsage = (): number => {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
  }
  return 0;
};

export const generateRandomData = (rows: number, columns: string[]): Record<string, any>[] => {
  const data = [];
  
  for (let i = 0; i < rows; i++) {
    const row: Record<string, any> = {};
    
    columns.forEach((column, index) => {
      if (column.toLowerCase().includes('id')) {
        row[column] = i + 1;
      } else if (column.toLowerCase().includes('name')) {
        row[column] = `Item_${i + 1}`;
      } else if (column.toLowerCase().includes('date') || column.toLowerCase().includes('time')) {
        row[column] = new Date(2024, 0, 1 + (i % 365)).toISOString();
      } else if (column.toLowerCase().includes('price') || column.toLowerCase().includes('value')) {
        row[column] = Math.round(Math.random() * 1000 * 100) / 100;
      } else if (column.toLowerCase().includes('active') || column.toLowerCase().includes('enabled')) {
        row[column] = Math.random() > 0.5;
      } else {
        row[column] = `Value_${index}_${i}`;
      }
    });
    
    data.push(row);
  }
  
  return data;
};

export const validateDataStructure = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data) {
    errors.push('Data is null or undefined');
    return { isValid: false, errors };
  }
  
  if (!data.columns || !Array.isArray(data.columns)) {
    errors.push('Columns is not a valid array');
  }
  
  if (!data.rows || !Array.isArray(data.rows)) {
    errors.push('Rows is not a valid array');
  }
  
  if (typeof data.rowCount !== 'number' || data.rowCount < 0) {
    errors.push('Invalid rowCount');
  }
  
  if (typeof data.fileSize !== 'number' || data.fileSize < 0) {
    errors.push('Invalid fileSize');
  }
  
  if (!data.summary || typeof data.summary !== 'object') {
    errors.push('Invalid summary object');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
